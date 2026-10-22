# Blueprint Web App MTB Trip — Onboarding & RBAC
Stack: cPanel shared hosting + MySQL + PHP (tanpa SSH) · Frontend: React/Vite (build lokal, upload `dist/`)
Prinsip UI: **100% mobile-first**, kartu digital tidak didesain untuk desktop. Bahasa default: **English**, switch ke Indonesian.

---

## 1. Aktor & Role (RBAC)

| Role | Cara masuk sistem | Akses utama |
|---|---|---|
| `lead` (onboarding) | Register sendiri di web (memilih trip) | Kartu digital read-only: progress, history, negosiasi, waiver, upload bukti bayar, tambah anggota group |
| `user` (member aktif) | Naik status setelah admin verifikasi pembayaran | Sama dengan lead + daftar trip tersedia, special events, promo, QR absensi pribadi |
| `group_leader` | Otomatis: pendaftar pertama sebuah group booking | Semua hak `user` + tambah/edit anggota group (nama, WA, email), bertanggung jawab atas waiver & pembayaran grup |
| `bike_guard` (trip guide) | **Didaftarkan oleh admin** (tidak self-register) | Kartu digital khusus: assignments, history, financial statement per trip, absensi lapangan (scan QR) |
| `ops_admin` | Dibuatkan akun awal | Pipeline leads/negosiasi, update status, assign bike guard, verifikasi pembayaran, logistik per trip, monitor semua aktivitas |
| `super_admin` (opsional, bisa digabung dulu) | Dibuatkan akun awal | Kelola role/user, audit log penuh, pengaturan harga/promo |

Permission matrix disimpan sebagai data (`roles`, `permissions`, `role_permissions`), dicek di **middleware PHP** pada setiap endpoint. Filter di frontend hanya untuk UX.

---

## 2. Alur Utama (Happy Path)

```
[Lead] Pilih trip di katalog publik (tanpa login)
   → Isi form: nama, WhatsApp, email
   → Sistem: buat row leads + group_booking (status: pending)
     user tsb otomatis = group_leader
   → Kirim EMAIL berisi link kartu digital: /c/{token}
   → Notifikasi ke ops_admin (email/WA dashboard)

[Admin Ops] Hubungi lead via telepon/WA (offline)
   → Catat hasil nego di admin panel → muncul di timeline kartu digital lead
     (penawaran: harga, service, catatan) — status: negotiating

[Lead] Di kartu digital:
   → Setujui Waiver Document (e-sign: ketik nama + checkbox, simpan hash+timestamp+IP)
   → Transfer manual ke rekening yang ditampilkan
   → Upload bukti pembayaran (jpg/png/pdf, disimpan DI LUAR public_html)
   → status: awaiting_verification

[Admin Ops] Verifikasi bukti transfer
   → status lead → user; group_booking → confirmed
   → Assign bike_guard(s) ke trip
   → Semua anggota group dapat email link kartu digital masing-masing

[Bike Guard] Menerima assignment di kartu digitalnya
   → Hari-H di meeting point: scan QR tiap peserta → attendance tercatat
   → Setelah trip selesai: status assignment → completed
   → Financial statement bertambah (fee per trip)

[Selamanya] Token kartu digital tetap valid → dipakai untuk trip-trip berikutnya.
```

Status enum `group_booking`: `pending → negotiating → agreed → waiver_signed → payment_uploaded → verified → assigned → in_progress → completed → archived` (+ `cancelled/expired`).

---

## 3. Skema Database MySQL (inti MVP)

```sql
users            (id, name, email UNIQUE NULL, phone_wa, role ENUM('lead','user','group_leader','bike_guard','ops_admin','super_admin'),
                  status ENUM('onboarding','active','suspended'), created_at, updated_at)
cards            (id, user_id FK, token CHAR(64) UNIQUE, created_at)          -- 1 user 1 token permanen
trips            (id, title_en, title_id, desc_en, desc_id, date_start, date_end, location,
                  price_base, capacity, difficulty, status ENUM('draft','open','closed','done'))
group_bookings   (id, trip_id FK, leader_id FK users, status ENUM(...di atas),
                  quoted_price, notes_admin, created_at, updated_at)
booking_members  (id, booking_id FK, name, phone_wa, email, card_token CHAR(64) NULL,
                  user_id FK NULL, qr_secret CHAR(32))                        -- jadi user saat diverifikasi
waivers          (id, booking_id FK, member_id NULL, signed_name, doc_version, sha256, ip, signed_at)
payments         (id, booking_id FK, amount, method ENUM('bank_transfer'), proof_path, uploaded_at,
                  verified_by FK users, verified_at, status ENUM('uploaded','verified','rejected'))
assignments      (id, trip_id FK, bike_guard_id FK users, fee_amount,
                  status ENUM('assigned','completed','paid'), completed_at)
guard_payments   (id, assignment_id FK, amount, paid_at, note)                -- financial statement bike guard
attendance       (id, trip_id FK, booking_member_id FK, scanned_by FK users, scanned_at,
                  point ENUM('meeting_point','finish'), source ENUM('qr','manual'))
logistics        (id, trip_id FK, category ENUM('transport','vehicle','meals','equipment','other'),
                  detail TEXT, cost, vendor, status)
negotiation_log  (id, booking_id FK, actor_id, channel ENUM('phone','wa','app'), summary, proposed_price, created_at)
audit_logs       (id, actor_id, action, entity, entity_id, meta JSON, ip, created_at)
content_items    (id, type ENUM('promo','event','announcement'), title_en, title_id, body_en, body_id, image, active_from, active_to)
settings         (key, value)                                                  -- bank account, waiver text version, dsb
```

Catatan teknis shared hosting:
- Engine InnoDB, charset `utf8mb4`.
- File bukti transfer & waiver PDF: simpan di `/home/USERNAME/uploads/...` (di luar `public_html`), serve lewat PHP download handler + audit log akses.
- Tidak ada RLS → **semua query difilter by token/role di middleware PHP**.

---

## 4. Autentikasi Kartu Digital (magic link permanen)

- Setiap orang (lead, anggota group, bike guard, admin) punya `card_token` (random 64 hex, dibuat saat row dibuat).
- URL: `https://domain.com/c/{token}` → SPA memanggil `GET /api/card?token=...`.
- Server memvalidasi token → session cookie `HttpOnly` (`CARDSESS`) berisi user id + role, TTL mis. 30 hari, refresh otomatis saat dibuka.
- Link "valid selamanya" = token tidak pernah berubah; keamanan tambahan: opsi "logout from this device" dan rate-limit per token.
- Admin panel login terpisah: email + password (argon2id via PHP), karena admin/bike guard butuh akses multi-entitas.

---

## 5. Backend PHP (Slim 4, composer di laptop → upload `vendor/`)

Struktur folder deploy:

```
/home/USERNAME/
  config.php                     ← secret DB, JWT/app key, path uploads (DI LUAR public_html)
  api/                           ← subdomain api.domain.com (docroot → api/public)
    public/index.php             ← bootstrap Slim + routes
    src/
      Middleware/AuthCard.php    ← validasi token kartu → req->card_user
      Middleware/RequireRole.php → requireRole('ops_admin') dst
      Routes/                    catalog.php, bookings.php, card.php, admin.php, guards.php
      Repositories/              (PDO, prepared statements saja)
  public_html/                   ← isi dist/ dari build Vite lokal
    .htaccess                    ← rewrite SPA
    assets/ ...
```

Endpoint kunci MVP:

| Method | Path | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/trips` | publik | Katalog trip (bahasa sesuai header) |
| POST | `/api/bookings` | publik | Form lead → buat booking + card + kirim email |
| POST | `/api/bookings/{id}/members` | card leader | Tambah anggota (nama, WA, email) |
| GET | `/api/card` | card token | Payload kartu digital (progress, history, penawaran, trip saya, konten promo) |
| POST | `/api/waivers` | card | Persetujuan waiver digital |
| POST | `/api/payments/proof` | card leader | Upload bukti transfer (multipart) |
| GET/POST | `/api/admin/negotiations` | ops_admin | Catat hasil nego → sync ke kartu |
| POST | `/api/admin/payments/{id}/verify` | ops_admin | Verifikasi → status user |
| POST | `/api/admin/assignments` | ops_admin | Assign bike guard ke trip |
| POST | `/api/guard/checkin` | bike_guard | Scan QR peserta (verify qr_secret) |
| GET | `/api/guard/statement` | bike_guard | Financial statement |
| ANY | `/api/*` sisanya | sesuai role | CRUD trips, logistics, content, audit viewer |

Semua mutasi penting → tulis `audit_logs`.

---

## 6. Frontend (React/Vite, mobile-only layout)

Halaman (route):
1. `/` — Landing bilingual: hero + katalog trip (mobile feed, bottom CTA sticky "Book this trip").
2. `/book/{tripId}` — Form lead: nama, WA, email → success screen "Cek email Anda untuk kartu digital".
3. `/c/:token` — **Kartu digital** (core app, semua role memakai template sama dengan section berbeda):
   - Header: foto/avatar, nama, role badge, status pipeline stepper (Onboarding → Deal → Waiver → Payment → Confirmed).
   - Tab/Bottom-nav: `Progress` (timeline negosiasi & status), `My Trips` (QR code saya, jadwal), `Discover` (trip tersedia, events, promo), `Me` (history, settings bahasa).
   - Aksi kontekstual per status: tanda tangan waiver, upload bukti bayar, tambah anggota group.
4. `/admin` — Panel ops (boleh responsif tablet/desktop, tapi tetap usable di HP): pipeline board per status, form nego, verifikasi payment (preview gambar), assign guard, logistik trip, monitor aktivitas.
5. `/guard` — bagian khusus bike guard di kartu digital: list assignment, tombol **Scan QR** (pakai `html5-qrcode` atau kamera + `zxing-js`), checklist peserta, statement.

Komponen teknis:
- i18n: `i18next` + deteksi browser, default `en`, toggle EN/ID tersimpan di localStorage & profil user. Konten dinamis (trip, promo) punya kolom `_en/_id` di DB.
- QR peserta: render QR client-side dari `booking_member.qr_secret`; scanner guard mengirim `{secret, trip_id}` ke API → server cocokkan.
- Offline check-in (antisipasi sinyal buruk di pegunungan): queue scan di IndexedDB/localStorage → auto-sync saat online.
- Build lokal: `npm run build` → upload `dist/` via File Manager/FileZilla.

---

## 7. Non-fungsional

- HTTPS via AutoSSL cPanel; cookie `Secure` + `HttpOnly`; CSRF token untuk POST.
- Rate limiting sederhana per IP/token (tabel `rate_limits` atau file cache).
- Backup: cron cPanel `mysqldump` harian ke folder non-public.
- Email: SMTP hosting atau Brevo free tier (API curl dari PHP).
- Upload proof: max 2 MB, whitelist jpg/png/pdf, resize server-side jika GD tersedia.
- Audit trail semua aksi admin & guard.

---

## 8. Tahapan Eksekusi (milestone)

1. **M1 – Fondasi**: skema SQL (phpMyAdmin), proyek Slim + middleware auth card + RBAC, seed admin.
2. **M2 – Katalog & Lead**: halaman publik bilingual, form booking → email magic link.
3. **M3 – Kartu digital v1**: pipeline stepper, timeline nego (admin mencatat → user melihat).
4. **M4 – Closing**: waiver e-sign, upload bukti bayar, verifikasi admin, naik status user, tambah anggota group + QR.
5. **M5 – Operasional trip**: assign bike guard, scan QR check-in (+offline queue), logistik.
6. **M6 – Pasca trip**: financial statement guard, history, Discover (promo/events), monitor admin penuh.

Setiap milestone = satu rilis kecil: build → upload → tes di HP asli.
