import { useState, useEffect } from 'react';
import { CalendarDays, ArrowLeft, BookOpen, Info, ChevronRight } from 'lucide-react';

const subjects = [
  {
    id: 'ipa',
    icon: '🔬',
    title: 'IPA',
    topics: ['Getaran dan Gelombang', 'Cahaya dan Optik']
  },
  {
    id: 'ips',
    icon: '🌍',
    title: 'IPS',
    topics: ['Perdagangan Antarpulau', 'Perdagangan Internasional', 'Kerja Sama Ekonomi Antarnegara', 'Lembaga Keuangan']
  },
  {
    id: 'bahasa-indonesia',
    icon: '📚',
    title: 'Bahasa Indonesia',
    topics: ['Teks Pidato', 'Cerita Fiksi']
  },
  {
    id: 'pai',
    icon: '🕌',
    title: 'PAI',
    topics: ['Zakat (Fitrah & lainnya)', 'Toleransi', 'Soal-soal ASTS', 'Para Nabi dan Rasul', 'Mukjizat Para Nabi']
  },
  {
    id: 'matematika',
    icon: '🧮',
    title: 'Matematika',
    topics: ['PGL', 'SPLDV', 'PLDV']
  },
  {
    id: 'bahasa-inggris',
    icon: '🇬🇧',
    title: 'Bahasa Inggris',
    topics: ['Recount Text']
  },
  {
    id: 'bahasa-arab',
    icon: '🇸🇦',
    title: 'Bahasa Arab',
    topics: ['Jumlah Ismiyah', "Jumlah Fi'liyah", "Fi'il", 'Huruf Jar', 'Tata Nahwu Dasar', '50% soal dari ASTS']
  },
  {
    id: 'ppkn',
    icon: '🇮🇩',
    title: 'PPKn',
    topics: ['Kebudayaan Negaraku']
  }
];

export default function ASATStudyHub() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 font-sans p-6">
      <header className="text-center mb-12 border-b-2 border-gray-300 pb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent animate-pulse">
          ASAT Study Hub
        </h1>
        <p className="text-lg text-gray-600">Persiapan Ujian ASAT - Semua Bidang Studi</p>
        <div className="mt-4">
          <a href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Utama
          </a>
        </div>
      </header>

      <div className="bg-white rounded-md shadow p-6 mb-10">
        <h2 className="text-xl font-semibold text-center mb-4 flex justify-center items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Jadwal Ujian
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { day: 'Hari 1 - Selasa', subjects: 'Bahasa Indonesia & PAI' },
            { day: 'Hari 2 - Rabu', subjects: 'IPA & Bahasa Arab' },
            { day: 'Hari 3 - Kamis', subjects: 'Matematika & PPKn' },
            { day: 'Hari 4 - Jumat', subjects: 'Bahasa Inggris & IPS' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-4 rounded border-l-4 border-gray-800 hover:bg-gray-200 transition"
            >
              <div className="font-semibold text-gray-800">{item.day}</div>
              <div className="text-sm text-gray-600">{item.subjects}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 border-l-4 border-gray-800 p-4 rounded-md mb-10 shadow">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <Info className="w-5 h-5" /> Cara Menggunakan
        </h3>
        <p className="text-sm text-gray-700">
          Klik pada kartu mata pelajaran untuk melihat materi pembelajaran. Jadwal ujian ditampilkan di bagian atas dengan tanggal saat ini disorot.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2 mb-2">
        <BookOpen className="w-6 h-6" /> Pilih Mata Pelajaran
      </h2>
      <p className="text-center text-gray-600 mb-6">Klik pada kartu mata pelajaran di bawah untuk melihat materi pembelajaran</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition relative overflow-hidden"
            onClick={() => setSelectedSubject(subject)}
          >
            <div className="text-4xl mb-4">{subject.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.title}</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {subject.topics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              Klik untuk melihat <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-600 mt-16 border-t pt-6">
        Terima kasih telah menggunakan layanan ini. Ujian telah selesai! 🎉
      </div>

      {selectedSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
              onClick={() => setSelectedSubject(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">{selectedSubject.title}</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {selectedSubject.topics.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
