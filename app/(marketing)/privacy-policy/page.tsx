import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi DukiTools',
  description: 'Kebijakan privasi DukiTools — bagaimana kami menangani dan melindungi data Anda.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Kebijakan Privasi' }]} />
      <h1 className="text-3xl font-bold text-slate-900">Kebijakan Privasi</h1>
      <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
        <p><strong>Terakhir diperbarui:</strong> 1 Januari 2025</p>
        <p>
          DukiTools berkomitmen untuk melindungi privasi Anda. Karena platform kami tidak memiliki sistem login atau registrasi, kami hanya mengumpulkan data minimal yang diperlukan untuk menjalankan layanan.
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">Data yang Kami Kumpulkan</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>File yang Anda unggah:</strong> File hanya diproses sementara di server dan otomatis dihapus dalam waktu maksimal 15 menit. Kami tidak menyimpan, membaca, atau membagikan konten file Anda.</li>
          <li><strong>Data analitik anonim:</strong> Kami mengumpulkan data agregat seperti halaman mana yang dikunjungi dan tool mana yang digunakan, tanpa mengaitkannya ke identitas pribadi Anda.</li>
        </ul>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">Bagaimana Kami Memproses File</h2>
        <p>
          Semua file yang diunggah ke DukiTools diproses dengan mekanisme stateless:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>File diterima dan disimpan sementara di memori atau disk temp.</li>
          <li>File diproses sesuai fungsi tool yang dipilih.</li>
          <li>Hasil tersedia untuk diunduh selama 15 menit.</li>
          <li>File asli dan hasil otomatis dihapus setelah TTL habis atau setelah unduhan, mana yang lebih dulu.</li>
        </ol>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">Cookie</h2>
        <p>
          DukiTools tidak menggunakan cookie tracking. Kami hanya menggunakan cookie teknis yang diperlukan untuk fungsi dasar situs (jika ada).
        </p>
        <h2 className="text-xl font-semibold text-slate-800 mt-8">Kontak</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui halaman <a href="/contact" className="text-indigo-600 hover:underline">Kontak</a>.
        </p>
      </div>
    </div>
  );
}
