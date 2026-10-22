import { useState } from "react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Memahami Konsep <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Onboarding & RBAC
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Panduan lengkap tentang <strong>Structured Member Onboarding</strong> dan{" "}
          <strong>Role-Based Access Control (RBAC)</strong> — dua pilar penting dalam
          manajemen platform digital modern.
        </p>
      </div>
    </section>
  );
}

function OnboardingSection() {
  const steps = [
    {
      icon: "📋",
      title: "Registrasi & Verifikasi",
      description:
        "Anggota baru mendaftar dan memverifikasi identitas mereka melalui email, OTP, atau dokumen identitas.",
    },
    {
      icon: "📚",
      title: "Orientasi & Tutorial",
      description:
        "Memberikan panduan interaktif, video tutorial, atau walkthrough yang memperkenalkan fitur-fitur platform.",
    },
    {
      icon: "🎯",
      title: "Penetapan Tujuan",
      description:
        "Membantu anggota menetapkan tujuan awal mereka agar pengalaman terasa personal dan relevan.",
    },
    {
      icon: "👥",
      title: "Integrasi Komunitas",
      description:
        "Menghubungkan anggota baru dengan mentor, tim, atau grup yang sesuai dengan minat dan peran mereka.",
    },
    {
      icon: "📊",
      title: "Evaluasi & Feedback",
      description:
        "Mengumpulkan umpan balik di tahap awal untuk meningkatkan proses onboarding secara berkelanjutan.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="onboarding">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            KONSEP 1
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Structured Member Onboarding
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Proses terstruktur untuk memperkenalkan, mengorientasikan, dan mengintegrasikan
            anggota baru ke dalam sebuah platform, organisasi, atau komunitas secara sistematis
            dan bertahap.
          </p>
        </div>

        {/* Definition Box */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 mb-14">
          <h3 className="text-xl font-bold text-indigo-900 mb-3">💡 Definisi</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            <strong>Structured Member Onboarding</strong> adalah pendekatan sistematis yang
            menggunakan serangkaian langkah terencana untuk memastikan anggota baru dapat
            beradaptasi dengan cepat, memahami nilai platform, dan mulai berkontribusi secara
            produktif dalam waktu sesingkat mungkin. Proses ini mengurangi tingkat churn
            (keberhentian) dan meningkatkan engagement jangka panjang.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{step.icon}</span>
                <span className="text-sm font-bold text-indigo-500">
                  TAHAP {index + 1}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-14 bg-slate-900 rounded-2xl p-8 md:p-10 text-white">
          <h3 className="text-2xl font-bold mb-6">🎯 Manfaat Utama</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Mengurangi waktu adaptasi anggota baru hingga 50%",
              "Meningkatkan retensi dan engagement jangka panjang",
              "Memberikan pengalaman pertama (first impression) yang positif",
              "Memudahkan skalabilitas saat jumlah anggota bertambah",
              "Mengurangi beban tim support dengan self-service onboarding",
              "Memastikan konsistensi pengalaman di seluruh anggota",
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RBACSection() {
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    {
      name: "Admin",
      icon: "👑",
      color: "from-red-500 to-orange-500",
      permissions: [
        "Mengelola semua pengguna",
        "Mengatur konfigurasi sistem",
        "Mengakses semua data",
        "Menghapus konten & akun",
        "Melihat audit log",
        "Mengelola billing & langganan",
      ],
    },
    {
      name: "Manager",
      icon: "📁",
      color: "from-blue-500 to-cyan-500",
      permissions: [
        "Mengelola anggota tim",
        "Membuat & mengedit konten",
        "Melihat analitik tim",
        "Menyetujui permintaan akses",
        "Mengatur jadwal & tugas",
      ],
    },
    {
      name: "Editor",
      icon: "✏️",
      color: "from-purple-500 to-pink-500",
      permissions: [
        "Membuat konten baru",
        "Mengedit konten milik sendiri",
        "Mengunggah media",
        "Melihat konten publik",
      ],
    },
    {
      name: "Viewer",
      icon: "👁️",
      color: "from-green-500 to-emerald-500",
      permissions: [
        "Melihat konten publik",
        "Mengunduh file yang diizinkan",
        "Melihat profil sendiri",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50" id="rbac">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            KONSEP 2
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Role-Based Access Control (RBAC)
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Model keamanan yang mengatur akses sistem berdasarkan peran (role) yang dimiliki
            pengguna dalam organisasi, bukan berdasarkan identitas individual.
          </p>
        </div>

        {/* Definition Box */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8 mb-14">
          <h3 className="text-xl font-bold text-purple-900 mb-3">💡 Definisi</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            <strong>Role-Based Access Control (RBAC)</strong> adalah metode pengaturan akses
            di mana izin (permissions) diberikan kepada <em>peran</em>, bukan langsung kepada
            individu. Setiap pengguna kemudian ditugaskan ke satu atau lebih peran, dan mereka
            mewarisi semua izin dari peran tersebut. Pendekatan ini menyederhanakan manajemen
            akses, terutama dalam organisasi besar.
          </p>
          <div className="mt-4 p-4 bg-white/60 rounded-lg">
            <p className="text-gray-700 font-mono text-sm">
              <strong>Rumus:</strong> Pengguna → Peran → Izin
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Contoh: Budi → Editor → (buat_konten, edit_konten_sendiri, upload_media)
            </p>
          </div>
        </div>

        {/* Interactive Role Demo */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎮 Demo Interaktif: Klik Peran untuk Melihat Izin
          </h3>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {roles.map((role, index) => (
              <button
                key={index}
                onClick={() => setActiveRole(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  activeRole === index
                    ? "border-purple-500 bg-white shadow-lg scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{role.icon}</span>
                <p className="font-bold text-gray-900 mt-2">{role.name}</p>
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{roles[activeRole].icon}</span>
              <h4 className="text-2xl font-bold text-gray-900">
                Peran: {roles[activeRole].name}
              </h4>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {roles[activeRole].permissions.map((perm, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-gray-700">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RBAC Components */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">Users (Pengguna)</h4>
            <p className="text-gray-600 text-sm">
              Individu yang menggunakan sistem. Setiap pengguna diberikan satu atau lebih
              peran.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎭</span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">Roles (Peran)</h4>
            <p className="text-gray-600 text-sm">
              Kumpulan izin yang mendefinisikan apa yang bisa dilakukan. Contoh: Admin,
              Editor, Viewer.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-2">Permissions (Izin)</h4>
            <p className="text-gray-600 text-sm">
              Aksi spesifik yang diizinkan, seperti "baca", "tulis", "hapus", atau "admin".
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 md:p-10 text-white">
          <h3 className="text-2xl font-bold mb-6">🎯 Manfaat Utama RBAC</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Penugasan izin yang efisien — cukup ubah peran, bukan setiap pengguna",
              "Prinsip least privilege — setiap pengguna hanya mendapat akses minimum yang dibutuhkan",
              "Kepatuhan regulasi (compliance) lebih mudah diaudit",
              "Mengurangi risiko kesalahan konfigurasi akses",
              "Skalabel untuk organisasi dengan ratusan hingga ribuan pengguna",
              "Memudahkan rotasi tugas — cukup pindahkan pengguna ke peran baru",
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hubungan Keduanya
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Structured Onboarding dan RBAC saling melengkapi dalam membangun platform yang
            aman dan user-friendly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">
              📋 Structured Onboarding
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Fokus pada <strong>pengalaman pengguna</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Menjawab: "Bagaimana cara memulai?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Mengoptimalkan <strong>first-time experience</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Meningkatkan <strong>retensi & engagement</strong>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-purple-900 mb-4">🔐 RBAC</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                Fokus pada <strong>keamanan & kontrol akses</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                Menjawab: "Apa yang boleh dilakukan?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                Mengoptimalkan <strong>manajemen izin</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                Meningkatkan <strong>kepatuhan & auditabilitas</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* How they work together */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            🤝 Bagaimana Mereka Bekerja Bersama?
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="bg-white border border-indigo-200 rounded-xl p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">1. Anggota baru mendaftar</p>
              <p className="font-bold text-indigo-700">Onboarding dimulai</p>
            </div>
            <span className="text-2xl text-gray-400">→</span>
            <div className="bg-white border border-purple-200 rounded-xl p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">2. Peran ditetapkan</p>
              <p className="font-bold text-purple-700">RBAC diterapkan</p>
            </div>
            <span className="text-2xl text-gray-400">→</span>
            <div className="bg-white border border-green-200 rounded-xl p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">3. Akses disesuaikan</p>
              <p className="font-bold text-green-700">Pengalaman personal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm">
          Panduan edukatif tentang Structured Member Onboarding & Role-Based Access Control
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Dibuat untuk tujuan pembelajaran • 2026
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <HeroSection />
      <OnboardingSection />
      <RBACSection />
      <ComparisonSection />
      <Footer />
    </div>
  );
}
