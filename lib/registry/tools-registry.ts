import { ToolConfig } from '@/types/tool';

export const toolsRegistry: ToolConfig[] = [
  // ========================
  // PDF TOOLS (server-side)
  // ========================
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    shortDescription: 'Gabungkan beberapa file PDF menjadi satu dokumen',
    description: 'Alat untuk menggabungkan dua atau lebih file PDF menjadi satu dokumen terpadu. Cocok untuk menggabungkan laporan, faktur, atau dokumen terpisah menjadi satu file yang rapi.',
    benefits: [
      'Menghemat waktu dengan menggabungkan banyak file sekaligus',
      'Menyusun dokumen dalam urutan yang Anda inginkan',
      'Tidak perlu install software tambahan'
    ],
    howItWorks: [
      'Unggah file-file PDF yang ingin digabungkan',
      'Atur urutan file sesuai kebutuhan',
      'Klik tombol "Merge" untuk memproses',
      'Unduh file PDF hasil gabungan'
    ],
    icon: 'Files',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 10,
    isPopular: true,
    faq: [
      { question: 'Berapa maksimal file yang bisa digabung?', answer: 'Anda dapat menggabungkan hingga 10 file PDF sekaligus dengan ukuran maksimal 50 MB per file.' },
      { question: 'Apakah kualitas PDF akan menurun?', answer: 'Tidak, kualitas PDF tetap terjaga karena kami memproses file tanpa kompresi tambahan.' }
    ],
    keywords: ['gabung pdf', 'merge pdf', 'kombinasi pdf', 'menyatukan pdf', 'pdf merger'],
    relatedToolSlugs: ['split-pdf', 'organize-pdf', 'compress-pdf']
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    shortDescription: 'Pisahkan file PDF menjadi beberapa halaman terpisah',
    description: 'Alat untuk memisahkan file PDF menjadi beberapa file berdasarkan halaman atau rentang halaman tertentu. Sangat berguna saat Anda hanya membutuhkan beberapa halaman dari dokumen besar.',
    benefits: [
      'Ekstrak halaman tertentu dengan mudah',
      'Bagi dokumen besar menjadi bagian-bagian kecil',
      'Proses cepat dan hasil akurat'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dipisahkan',
      'Pilih halaman atau rentang halaman yang diinginkan',
      'Klik tombol "Split" untuk memproses',
      'Unduh file-file PDF hasil pemisahan'
    ],
    icon: 'Scissors',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah saya memilih halaman tertentu?', answer: 'Ya, Anda dapat memilih halaman tertentu atau rentang halaman (misalnya 1-5, 7, 9-12) untuk diekstrak.' }
    ],
    keywords: ['pisah pdf', 'split pdf', 'ekstrak halaman pdf', 'memisahkan pdf', 'pdf splitter'],
    relatedToolSlugs: ['merge-pdf', 'organize-pdf']
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    shortDescription: 'Perkecil ukuran file PDF tanpa mengurangi kualitas',
    description: 'Kompres file PDF untuk mengurangi ukurannya sehingga lebih mudah dikirim melalui email atau diunggah ke website. Gunakan level kompresi yang dapat disesuaikan.',
    benefits: [
      'Ukuran file lebih kecil untuk pengiriman cepat',
      'Kualitas tetap terjaga dengan kompresi cerdas',
      'Menghemat ruang penyimpanan'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dikompres',
      'Pilih tingkat kompresi yang diinginkan',
      'Klik tombol "Compress" untuk memproses',
      'Unduh file PDF yang telah diperkecil'
    ],
    icon: 'Download',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    isPopular: true,
    faq: [
      { question: 'Apakah kompresi akan menurunkan kualitas?', answer: 'Kami menggunakan algoritma kompresi cerdas yang meminimalkan penurunan kualitas sambil memperkecil ukuran file secara signifikan.' },
      { question: 'Berapa besar ukuran yang bisa dikurangi?', answer: 'Rata-rata ukuran file dapat dikurangi hingga 60-80% tergantung konten dan tingkat kompresi yang dipilih.' }
    ],
    keywords: ['kompres pdf', 'compress pdf', 'perkecil pdf', 'kecilkan pdf', 'pdf compressor'],
    relatedToolSlugs: ['merge-pdf', 'pdf-to-jpg']
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    shortDescription: 'Putar halaman PDF sesuai orientasi yang diinginkan',
    description: 'Alat untuk memutar halaman dalam dokumen PDF. Perbaiki halaman yang terbalik atau miring dengan mudah, baik untuk satu halaman maupun seluruh dokumen.',
    benefits: [
      'Perbaiki orientasi halaman yang salah',
      'Putar halaman secara individual atau massal',
      'Proses instan tanpa perlu install software'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin diputar',
      'Pilih halaman yang akan diputar',
      'Tentukan arah putaran (90°, 180°, 270°)',
      'Unduh file PDF yang sudah diperbaiki'
    ],
    icon: 'RotateCw',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah memutar hanya satu halaman?', answer: 'Ya, Anda dapat memilih halaman tertentu untuk diputar sementara halaman lainnya tetap dalam orientasi asli.' }
    ],
    keywords: ['putar pdf', 'rotate pdf', 'memutar halaman pdf', 'orientasi pdf'],
    relatedToolSlugs: ['organize-pdf', 'merge-pdf']
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    shortDescription: 'Hapus proteksi password dari file PDF',
    description: 'Buka kunci file PDF yang dilindungi password agar dapat diedit, dicetak, atau disalin. Alat ini berguna saat Anda lupa password atau ingin memproses dokumen lebih lanjut.',
    benefits: [
      'Akses dokumen yang terkunci',
      'Hapus pembatasan editing dan pencetakan',
      'Proses cepat dan aman'
    ],
    howItWorks: [
      'Unggah file PDF yang terkunci',
      'Masukkan password PDF',
      'Klik tombol "Unlock" untuk memproses',
      'Unduh file PDF yang sudah terbuka'
    ],
    icon: 'Lock',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah data saya aman?', answer: 'Ya, semua file dihapus dari server kami dalam waktu 1 jam setelah pemrosesan untuk menjaga privasi Anda.' }
    ],
    keywords: ['buka pdf', 'unlock pdf', 'hapus password pdf', 'pdf tidak terkunci'],
    relatedToolSlugs: ['protect-pdf', 'compress-pdf']
  },
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'pdf',
    shortDescription: 'Lindungi file PDF dengan password keamanan',
    description: 'Tambahkan password ke file PDF Anda untuk mencegah akses tidak sah. Atur izin untuk membatasi pencetakan, penyalinan, atau pengeditan dokumen.',
    benefits: [
      'Amankan dokumen sensitif dengan password',
      'Kontrol akses terhadap dokumen penting',
      'Batasi izin cetak dan salin'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dilindungi',
      'Masukkan password yang diinginkan',
      'Atur izin akses jika diperlukan',
      'Unduh file PDF yang sudah diproteksi'
    ],
    icon: 'ShieldCheck',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah saya mengatur izin khusus?', answer: 'Ya, Anda dapat mengatur apakah pengguna lain boleh mencetak, menyalin, atau mengedit dokumen.' }
    ],
    keywords: ['proteksi pdf', 'kunci pdf', 'password pdf', 'amankan pdf', 'pdf security'],
    relatedToolSlugs: ['unlock-pdf', 'watermark-pdf']
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'pdf',
    shortDescription: 'Konversi file PDF ke format Word (DOCX)',
    description: 'Ubah dokumen PDF Anda menjadi file Microsoft Word yang dapat diedit. Mempertahankan format teks, tabel, dan tata letak semirip mungkin dengan dokumen asli.',
    benefits: [
      'Edit dokumen PDF di Microsoft Word',
      'Pertahankan format dan tata letak',
      'Hemat waktu mengetik ulang'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dikonversi',
      'Pilih format output DOCX',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file Word hasil konversi'
    ],
    icon: 'FileText',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah format tabel akan dipertahankan?', answer: 'Ya, kami berusaha mempertahankan format tabel, gambar, dan teks semirip mungkin dengan dokumen asli.' }
    ],
    keywords: ['pdf ke word', 'konversi pdf', 'pdf to word', 'ubah pdf ke word'],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-text']
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'pdf',
    shortDescription: 'Konversi file Word (DOCX) ke format PDF',
    description: 'Ubah dokumen Microsoft Word Anda menjadi file PDF untuk memudahkan berbagi dan memastikan tampilan konsisten di semua perangkat.',
    benefits: [
      'Dokumen tampil konsisten di perangkat apapun',
      'Ukuran file lebih kecil dari DOCX',
      'Mudah dibagikan dan dipublikasikan'
    ],
    howItWorks: [
      'Unggah file Word yang ingin dikonversi',
      'Pilih format output PDF',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file PDF hasil konversi'
    ],
    icon: 'FileText',
    processingType: 'server',
    acceptedFileTypes: ['.docx', '.doc'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah gambar dan tabel akan dipertahankan?', answer: 'Ya, semua elemen termasuk gambar, tabel, dan format teks akan dipertahankan dalam PDF.' }
    ],
    keywords: ['word ke pdf', 'konversi word', 'word to pdf', 'ubah docx ke pdf'],
    relatedToolSlugs: ['pdf-to-word', 'excel-to-pdf']
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    shortDescription: 'Konversi halaman PDF menjadi gambar JPG',
    description: 'Ubah setiap halaman file PDF Anda menjadi gambar JPG berkualitas tinggi. Berguna untuk membuat preview, thumbnail, atau menyimpan halaman sebagai gambar.',
    benefits: [
      'Konversi setiap halaman ke gambar terpisah',
      'Kualitas gambar tinggi',
      'Mudah untuk preview dan berbagi'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dikonversi',
      'Pilih resolusi gambar yang diinginkan',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file JPG hasil konversi'
    ],
    icon: 'Image',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah semua halaman akan dikonversi?', answer: 'Ya, setiap halaman PDF akan dikonversi menjadi file JPG terpisah yang dapat diunduh satu per satu atau sebagai ZIP.' }
    ],
    keywords: ['pdf ke jpg', 'pdf to jpg', 'pdf ke gambar', 'konversi pdf ke jpg'],
    relatedToolSlugs: ['jpg-to-pdf', 'compress-image']
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    shortDescription: 'Gabungkan gambar JPG menjadi satu file PDF',
    description: 'Ubah satu atau beberapa gambar JPG menjadi file PDF. Cocok untuk membuat dokumen dari hasil scan, foto, atau gambar lainnya.',
    benefits: [
      'Gabungkan banyak gambar jadi satu PDF',
      'Atur urutan gambar sesuai keinginan',
      'Hasil PDF berkualitas tinggi'
    ],
    howItWorks: [
      'Unggah file gambar JPG yang ingin digabung',
      'Atur urutan gambar',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file PDF hasil konversi'
    ],
    icon: 'Image',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png'],
    acceptedMimeTypes: ['image/jpeg', 'image/png'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    isPopular: true,
    faq: [
      { question: 'Berapa banyak gambar yang bisa digabung?', answer: 'Anda dapat menggabungkan hingga 20 gambar dalam satu file PDF.' },
      { question: 'Apakah format PNG juga didukung?', answer: 'Ya, selain JPG, format PNG juga didukung untuk dikonversi ke PDF.' }
    ],
    keywords: ['jpg ke pdf', 'gambar ke pdf', 'konversi jpg ke pdf', 'buat pdf dari gambar'],
    relatedToolSlugs: ['pdf-to-jpg', 'merge-pdf']
  },
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'pdf',
    shortDescription: 'Konversi file PDF ke spreadsheet Excel',
    description: 'Ekstrak data tabel dari file PDF ke format Excel yang dapat diedit. Sangat berguna untuk mengolah data laporan keuangan, faktur, dan dokumen tabular lainnya.',
    benefits: [
      'Ekstrak data tabel dari PDF',
      'Edit data di Microsoft Excel',
      'Hemat waktu entry data manual'
    ],
    howItWorks: [
      'Unggah file PDF yang berisi tabel',
      'Pilih format output XLSX',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file Excel hasil konversi'
    ],
    icon: 'FileSpreadsheet',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah tabel dengan format kompleks didukung?', answer: 'Ya, alat ini dapat menangani tabel dengan format kompleks termasuk merged cells dan multi-level header.' }
    ],
    keywords: ['pdf ke excel', 'pdf to excel', 'ekstrak tabel pdf', 'konversi pdf ke excel'],
    relatedToolSlugs: ['excel-to-pdf', 'pdf-to-word']
  },
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'pdf',
    shortDescription: 'Konversi spreadsheet Excel ke format PDF',
    description: 'Ubah file Excel (XLSX/XLS) menjadi dokumen PDF dengan tata letak yang rapi. Pertahankan tabel, grafik, dan formula yang sudah dikalkulasi.',
    benefits: [
      'Dokumen tampil profesional',
      'Pertahankan format tabel dan grafik',
      'Mudah dibagikan ke siapa pun'
    ],
    howItWorks: [
      'Unggah file Excel yang ingin dikonversi',
      'Pilih orientasi halaman (potrait/lanskap)',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file PDF hasil konversi'
    ],
    icon: 'FileSpreadsheet',
    processingType: 'server',
    acceptedFileTypes: ['.xlsx', '.xls'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah grafik akan dipertahankan?', answer: 'Ya, grafik dan diagram dari Excel akan dipertahankan dalam PDF dengan kualitas tinggi.' }
    ],
    keywords: ['excel ke pdf', 'konversi excel', 'excel to pdf', 'ubah xlsx ke pdf'],
    relatedToolSlugs: ['pdf-to-excel', 'word-to-pdf']
  },
  {
    slug: 'pdf-to-ppt',
    name: 'PDF to PowerPoint',
    category: 'office',
    shortDescription: 'Konversi file PDF ke presentasi PowerPoint (PPT/PPTX).',
    description: 'Ubah dokumen PDF Anda menjadi presentasi PowerPoint yang dapat diedit. Setiap halaman PDF akan menjadi slide terpisah dalam file PPT.',
    benefits: [
      'Konversi cepat tanpa instalasi software',
      'Setiap halaman PDF menjadi satu slide',
      'File otomatis terhapus setelah diproses',
    ],
    howItWorks: [
      'Unggah file PDF yang ingin dikonversi',
      'Pilih format output (PPT atau PPTX)',
      'Klik tombol "Konversi ke PowerPoint"',
      'Unduh file PowerPoint hasil konversi',
    ],
    icon: 'Presentation',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    isNew: true,
    faq: [
      { question: 'Apakah format PPTX didukung?', answer: 'Ya, hasil konversi dapat disimpan dalam format PPT maupun PPTX.' },
    ],
    keywords: ['pdf to ppt', 'pdf to powerpoint', 'konversi pdf ke ppt', 'pdf ke powerpoint'],
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    category: 'pdf',
    shortDescription: 'Atur ulang, hapus, atau duplikasi halaman PDF',
    description: 'Kelola halaman dalam dokumen PDF Anda — atur ulang urutan, hapus halaman yang tidak diperlukan, atau duplikasi halaman tertentu dengan mudah.',
    benefits: [
      'Atur ulang halaman dengan drag-and-drop',
      'Hapus halaman yang tidak diinginkan',
      'Duplikasi halaman dengan cepat'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin diatur',
      'Seret halaman untuk mengatur ulang urutan',
      'Hapus atau duplikasi halaman sesuai kebutuhan',
      'Unduh file PDF hasil pengaturan'
    ],
    icon: 'Layers',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah saya menghapus halaman tertentu?', answer: 'Ya, Anda dapat memilih halaman mana pun untuk dihapus atau diduplikasi dengan mudah.' }
    ],
    keywords: ['atur pdf', 'organize pdf', 'susun ulang pdf', 'kelola halaman pdf'],
    relatedToolSlugs: ['merge-pdf', 'split-pdf']
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'pdf',
    shortDescription: 'Tambahkan watermark teks atau gambar ke PDF',
    description: 'Lindungi dokumen PDF Anda dengan menambahkan watermark teks atau gambar. Atur posisi, transparansi, dan rotasi watermark sesuai kebutuhan.',
    benefits: [
      'Lindungi hak cipta dokumen',
      'Tambahkan logo perusahaan',
      'Kustomisasi tampilan watermark'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin diberi watermark',
      'Pilih jenis watermark (teks atau gambar)',
      'Atur posisi, ukuran, dan transparansi',
      'Unduh file PDF yang sudah diberi watermark'
    ],
    icon: 'Wand2',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah saya menggunakan gambar sebagai watermark?', answer: 'Ya, Anda dapat mengunggah gambar untuk digunakan sebagai watermark dengan pengaturan posisi dan transparansi.' }
    ],
    keywords: ['watermark pdf', 'tanda air pdf', 'cap pdf', 'lindungi pdf'],
    relatedToolSlugs: ['protect-pdf', 'compress-pdf']
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'pdf',
    shortDescription: 'Ekstrak teks dari file PDF',
    description: 'Ambil dan ekstrak konten teks dari file PDF untuk digunakan di aplikasi pengolah kata atau editor teks lainnya. Berguna untuk mengambil kutipan dan referensi.',
    benefits: [
      'Ekstrak teks dari PDF dengan mudah',
      'Hasil teks bersih dan rapi',
      'Mendukung berbagai jenis PDF'
    ],
    howItWorks: [
      'Unggah file PDF yang ingin diekstrak',
      'Pilih halaman yang akan diekstrak',
      'Klik tombol "Extract" untuk memproses',
      'Salin atau unduh teks hasil ekstraksi'
    ],
    icon: 'FileText',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah teks dari PDF hasil scan bisa diekstrak?', answer: 'Untuk PDF hasil scan, ekstraksi teks mungkin terbatas. Kami sarankan menggunakan alat OCR untuk hasil terbaik.' }
    ],
    keywords: ['pdf ke teks', 'ekstrak teks pdf', 'pdf to text', 'ambil teks dari pdf'],
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-excel']
  },

  // ========================
  // IMAGE TOOLS
  // ========================
  {
    slug: 'compress-image',
    name: 'Compress Image',
    category: 'image',
    shortDescription: 'Perkecil ukuran file gambar tanpa kehilangan kualitas',
    description: 'Kompres gambar JPG, PNG, dan WEBP untuk memperkecil ukuran file. Gunakan level kompresi yang dapat disesuaikan untuk menyeimbangkan kualitas dan ukuran.',
    benefits: [
      'Ukuran file lebih kecil untuk website',
      'Kecepatan loading website meningkat',
      'Kualitas gambar tetap terjaga'
    ],
    howItWorks: [
      'Unggah gambar yang ingin dikompres',
      'Pilih level kompresi yang diinginkan',
      'Klik tombol "Compress" untuk memproses',
      'Unduh gambar yang sudah dikompres'
    ],
    icon: 'Download',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 25,
    maxFiles: 10,
    isPopular: true,
    faq: [
      { question: 'Berapa besar pengurangan ukuran?', answer: 'Rata-rata ukuran gambar dapat dikurangi 40-80% tergantung jenis gambar dan level kompresi.' },
      { question: 'Format apa saja yang didukung?', answer: 'Kami mendukung kompresi untuk format JPG, PNG, dan WEBP.' }
    ],
    keywords: ['kompres gambar', 'compress image', 'perkecil gambar', 'optimasi gambar'],
    relatedToolSlugs: ['resize-image', 'convert-image']
  },
  {
    slug: 'resize-image',
    name: 'Resize Image',
    category: 'image',
    shortDescription: 'Ubah ukuran dimensi gambar sesuai kebutuhan',
    description: 'Atur ulang dimensi gambar dengan lebar dan tinggi yang diinginkan. Pertahankan aspek rasio atau atur secara manual untuk hasil yang presisi.',
    benefits: [
      'Sesuaikan ukuran untuk media sosial',
      'Optimalkan gambar untuk website',
      'Pertahankan kualitas saat resize'
    ],
    howItWorks: [
      'Unggah gambar yang akan diubah ukurannya',
      'Masukkan lebar dan tinggi yang diinginkan',
      'Atur opsi pertahankan aspek rasio',
      'Unduh gambar hasil resize'
    ],
    icon: 'Maximize',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 25,
    maxFiles: 5,
    faq: [
      { question: 'Apakah kualitas gambar akan menurun?', answer: 'Kualitas gambar tetap optimal saat diperkecil. Saat diperbesar, mungkin ada sedikit penurunan kualitas tergantung resolusi awal.' }
    ],
    keywords: ['ubah ukuran gambar', 'resize image', 'perbesar gambar', 'perkecil gambar'],
    relatedToolSlugs: ['compress-image', 'crop-image']
  },
  {
    slug: 'crop-image',
    name: 'Crop Image',
    category: 'image',
    shortDescription: 'Potong gambar sesuai area yang diinginkan',
    description: 'Potong gambar secara interaktif dengan memilih area yang ingin dipertahankan. Tersedia preset rasio untuk media sosial dan cetak foto.',
    benefits: [
      'Hapus area yang tidak diinginkan',
      'Sesuaikan komposisi gambar',
      'Preset rasio untuk Instagram, Twitter, dll'
    ],
    howItWorks: [
      'Unggah gambar yang akan dipotong',
      'Seret dan atur area potongan',
      'Pilih rasio atau atur manual',
      'Unduh gambar hasil potongan'
    ],
    icon: 'Crop',
    processingType: 'client',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    faq: [
      { question: 'Bisakah saya menggunakan preset rasio?', answer: 'Ya, tersedia preset untuk Instagram (1:1), Twitter (16:9), dan rasio populer lainnya.' }
    ],
    keywords: ['potong gambar', 'crop image', 'pangkas gambar', 'edit gambar'],
    relatedToolSlugs: ['resize-image', 'rotate-image']
  },
  {
    slug: 'remove-background',
    name: 'Remove Background',
    category: 'image',
    shortDescription: 'Hapus latar belakang gambar secara otomatis',
    description: 'Hapus background dari gambar secara otomatis menggunakan AI. Hasilkan foto dengan latar transparan untuk produk, profil, dan keperluan desain lainnya.',
    benefits: [
      'Hapus background instan dengan AI',
      'Hasil rapi dan presisi',
      'Cocok untuk foto produk dan profil'
    ],
    howItWorks: [
      'Unggah gambar yang akan dihapus background-nya',
      'AI akan memproses dan mendeteksi objek utama',
      'Background akan dihapus otomatis',
      'Unduh gambar dengan latar transparan'
    ],
    icon: 'Eye',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png'],
    acceptedMimeTypes: ['image/jpeg', 'image/png'],
    maxFileSizeMB: 25,
    maxFiles: 5,
    isPopular: true,
    faq: [
      { question: 'Apakah hasilnya selalu sempurna?', answer: 'AI kami bekerja sangat baik pada gambar dengan kontras tinggi antara subjek dan background. Hasil terbaik pada foto produk dan potret.' },
      { question: 'Format apa yang didukung untuk hasil?', answer: 'Hasil dapat diunduh dalam format PNG dengan latar transparan atau JPG dengan latar putih.' }
    ],
    keywords: ['hapus background', 'remove background', 'hapus latar gambar', 'transparan gambar'],
    relatedToolSlugs: ['compress-image', 'resize-image']
  },
  {
    slug: 'convert-image',
    name: 'Convert Image',
    category: 'image',
    shortDescription: 'Konversi gambar antar format populer',
    description: 'Ubah format gambar Anda antara JPG, PNG, WEBP, GIF, dan BMP. Pertahankan kualitas gambar dengan pengaturan konversi yang optimal.',
    benefits: [
      'Konversi ke format yang kompatibel',
      'Pertahankan kualitas gambar',
      'Dukung banyak format populer'
    ],
    howItWorks: [
      'Unggah gambar yang ingin dikonversi',
      'Pilih format output yang diinginkan',
      'Atur kualitas gambar jika perlu',
      'Unduh gambar hasil konversi'
    ],
    icon: 'Repeat',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
    maxFileSizeMB: 25,
    maxFiles: 5,
    faq: [
      { question: 'Format apa saja yang tersedia?', answer: 'Kami mendukung konversi antara JPG, PNG, WEBP, GIF, dan BMP.' }
    ],
    keywords: ['konversi gambar', 'convert image', 'ubah format gambar', 'jpg ke png'],
    relatedToolSlugs: ['compress-image', 'resize-image']
  },
  {
    slug: 'rotate-image',
    name: 'Rotate Image',
    category: 'image',
    shortDescription: 'Putar gambar ke orientasi yang diinginkan',
    description: 'Putar gambar secara presisi dengan sudut 90°, 180°, atau 270°. Perbaiki orientasi foto yang terbalik atau miring dengan mudah.',
    benefits: [
      'Perbaiki orientasi foto',
      'Putar dengan presisi',
      'Proses instan di browser'
    ],
    howItWorks: [
      'Unggah gambar yang akan diputar',
      'Pilih sudut putaran',
      'Lihat pratinjau hasil',
      'Unduh gambar yang sudah diputar'
    ],
    icon: 'RotateCw',
    processingType: 'client',
    maxFileSizeMB: 25,
    maxFiles: 1,
    faq: [
      { question: 'Apakah ada opsi mirror?', answer: 'Untuk mirror atau flip gambar, silakan gunakan alat Flip Image yang tersedia.' }
    ],
    keywords: ['putar gambar', 'rotate image', 'memutar foto', 'orientasi gambar'],
    relatedToolSlugs: ['flip-image', 'crop-image']
  },
  {
    slug: 'flip-image',
    name: 'Flip Image',
    category: 'image',
    shortDescription: 'Balik gambar secara horizontal atau vertikal',
    description: 'Balik (flip) gambar Anda secara horizontal (mirror) atau vertikal. Berguna untuk mengubah arah tampilan atau memperbaiki orientasi.',
    benefits: [
      'Mirror gambar secara horizontal',
      'Balik gambar secara vertikal',
      'Proses instan di browser'
    ],
    howItWorks: [
      'Unggah gambar yang akan di-flip',
      'Pilih arah flip (horizontal/vertikal)',
      'Lihat pratinjau hasil',
      'Unduh gambar hasil flip'
    ],
    icon: 'MoveHorizontal',
    processingType: 'client',
    maxFileSizeMB: 25,
    maxFiles: 1,
    faq: [
      { question: 'Apa perbedaan horizontal dan vertikal?', answer: 'Horizontal membalik seperti efek cermin, vertikal membalik gambar terbalik atas-bawah.' }
    ],
    keywords: ['flip gambar', 'balik gambar', 'mirror gambar', 'efek cermin'],
    relatedToolSlugs: ['rotate-image', 'crop-image']
  },
  {
    slug: 'watermark-image',
    name: 'Watermark Image',
    category: 'image',
    shortDescription: 'Tambahkan watermark teks atau logo ke gambar',
    description: 'Lindungi gambar Anda dengan menambahkan watermark teks atau logo. Atur posisi, ukuran, transparansi, dan rotasi watermark.',
    benefits: [
      'Lindungi hak cipta gambar',
      'Branding otomatis dengan logo',
      'Kustomisasi tampilan watermark'
    ],
    howItWorks: [
      'Unggah gambar yang akan diberi watermark',
      'Pilih jenis watermark (teks atau gambar)',
      'Atur posisi dan transparansi',
      'Unduh gambar dengan watermark'
    ],
    icon: 'Wand2',
    processingType: 'server',
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeMB: 25,
    maxFiles: 5,
    faq: [
      { question: 'Bisakah menggunakan logo sebagai watermark?', answer: 'Ya, Anda dapat mengunggah logo PNG untuk digunakan sebagai watermark dengan pengaturan posisi dan transparansi.' }
    ],
    keywords: ['watermark gambar', 'tanda air gambar', 'cap gambar', 'lindungi gambar'],
    relatedToolSlugs: ['compress-image', 'resize-image']
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    category: 'image',
    shortDescription: 'Konversi gambar ke format Base64',
    description: 'Ubah file gambar menjadi string Base64 yang dapat disematkan langsung di kode HTML, CSS, atau JavaScript. Berguna untuk optimasi website.',
    benefits: [
      'Sematkan gambar langsung di kode',
      'Kurangi request HTTP',
      'Cocok untuk ikon kecil dan sprite'
    ],
    howItWorks: [
      'Unggah gambar yang akan dikonversi',
      'Pilih format output Base64',
      'Klik tombol "Convert" untuk memproses',
      'Salin string Base64 hasil konversi'
    ],
    icon: 'Code2',
    processingType: 'client',
    maxFileSizeMB: 10,
    maxFiles: 1,
    faq: [
      { question: 'Kapan sebaiknya menggunakan Base64?', answer: 'Base64 cocok untuk gambar kecil seperti ikon atau logo kecil. Untuk gambar besar lebih baik tetap menggunakan URL file.' }
    ],
    keywords: ['gambar ke base64', 'image to base64', 'encode gambar', 'base64 image'],
    relatedToolSlugs: ['convert-image', 'compress-image']
  },

  // ========================
  // TEXT TOOLS (client)
  // ========================
  {
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    shortDescription: 'Hitung jumlah kata, karakter, dan kalimat dalam teks',
    description: 'Alat hitung kata dan statistik teks lengkap. Ketahui jumlah kata, karakter, kalimat, paragraf, dan estimasi waktu baca dari teks Anda secara real-time.',
    benefits: [
      'Statistik teks lengkap dan akurat',
      'Estimasi waktu baca yang berguna',
      'Update secara real-time saat mengetik'
    ],
    howItWorks: [
      'Tempel atau ketik teks di kolom yang disediakan',
      'Statistik akan muncul secara otomatis',
      'Lihat jumlah kata, karakter, dan lainnya',
      'Salin teks yang sudah dianalisis'
    ],
    icon: 'Type',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apakah spasi dihitung sebagai karakter?', answer: 'Ya, spasi dihitung sebagai karakter. Kami menampilkan jumlah karakter dengan dan tanpa spasi.' }
    ],
    keywords: ['hitung kata', 'word counter', 'jumlah kata', 'statistik teks', 'kalkulator kata'],
    relatedToolSlugs: ['character-counter', 'case-converter']
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text',
    shortDescription: 'Hitung jumlah karakter dalam teks dengan detail',
    description: 'Alat untuk menghitung karakter dalam teks dengan berbagai metrik termasuk karakter dengan spasi, tanpa spasi, dan jumlah digit.',
    benefits: [
      'Detail karakter yang lengkap',
      'Cocok untuk batas karakter media sosial',
      'Update otomatis dan cepat'
    ],
    howItWorks: [
      'Tempel atau ketik teks di kolom yang disediakan',
      'Jumlah karakter akan terhitung otomatis',
      'Lihat rincian karakter dengan/tanpa spasi',
      'Gunakan informasi untuk menyesuaikan teks'
    ],
    icon: 'TextCursorInput',
    processingType: 'client',
    faq: [
      { question: 'Apakah ini berguna untuk Twitter?', answer: 'Ya, sangat berguna untuk memastikan tweet Anda tidak melebihi batas karakter yang ditentukan.' }
    ],
    keywords: ['hitung karakter', 'character counter', 'jumlah karakter', 'batas karakter'],
    relatedToolSlugs: ['word-counter', 'case-converter']
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'text',
    shortDescription: 'Ubah huruf besar/kecil teks dengan berbagai mode',
    description: 'Konversi teks antar format huruf: uppercase, lowercase, title case, sentence case, dan alternating case. Ideal untuk merapikan judul dan heading.',
    benefits: [
      'Berbagai mode konversi tersedia',
      'Proses instan dan akurat',
      'Mudah merapikan format teks'
    ],
    howItWorks: [
      'Tempel teks yang akan dikonversi',
      'Pilih mode konversi yang diinginkan',
      'Hasil akan muncul secara otomatis',
      'Salin teks yang sudah dikonversi'
    ],
    icon: 'CaseSensitive',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa itu title case?', answer: 'Title case membuat huruf pertama setiap kata menjadi kapital, cocok untuk judul artikel atau heading.' }
    ],
    keywords: ['ubah huruf', 'case converter', 'capitalize', 'uppercase', 'lowercase'],
    relatedToolSlugs: ['word-counter', 'text-to-slug']
  },
  {
    slug: 'text-to-slug',
    name: 'Text to Slug',
    category: 'text',
    shortDescription: 'Konversi teks menjadi URL slug yang ramah SEO',
    description: 'Ubah teks biasa menjadi slug URL yang bersih dan ramah SEO. Berguna saat membuat URL posting blog atau halaman website.',
    benefits: [
      'Hasilkan slug URL yang SEO-friendly',
      'Hapus karakter spesial',
      'Proses cepat dan otomatis'
    ],
    howItWorks: [
      'Tempel teks yang akan dijadikan slug',
      'Slug akan dibuat otomatis',
      'Edit manual jika diperlukan',
      'Salin slug untuk digunakan'
    ],
    icon: 'Link',
    processingType: 'client',
    faq: [
      { question: 'Karakter apa yang dihapus?', answer: 'Semua karakter non-alfanumerik kecuali tanda hubung akan dihapus. Spasi diganti dengan tanda hubung.' }
    ],
    keywords: ['buat slug', 'text to slug', 'url slug', 'seo url', 'konversi teks ke slug'],
    relatedToolSlugs: ['case-converter', 'remove-duplicate-lines']
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'text',
    shortDescription: 'Hapus baris yang duplikat dari teks',
    description: 'Bersihkan teks dari baris-baris yang duplikat. Berguna saat mengolah data, daftar, atau output yang memiliki banyak pengulangan.',
    benefits: [
      'Hapus duplikat dengan cepat',
      'Hasil teks lebih bersih dan rapi',
      'Cocok untuk mengolah dataset'
    ],
    howItWorks: [
      'Tempel teks yang memiliki duplikat',
      'Centang opsi "ignore case" jika perlu',
      'Klik tombol "Remove Duplicates"',
      'Salin teks yang sudah bersih dari duplikat'
    ],
    icon: 'ListFilter',
    processingType: 'client',
    faq: [
      { question: 'Apakah urutan baris dipertahankan?', answer: 'Ya, urutan baris pertama yang muncul akan dipertahankan, duplikat berikutnya akan dihapus.' }
    ],
    keywords: ['hapus duplikat', 'remove duplicates', 'bersihkan teks', 'hapus baris ganda'],
    relatedToolSlugs: ['text-sorter', 'whitespace-remover']
  },
  {
    slug: 'text-diff-checker',
    name: 'Text Diff Checker',
    category: 'text',
    shortDescription: 'Bandingkan dua teks untuk melihat perbedaannya',
    description: 'Alat untuk membandingkan dua versi teks dan menampilkan perbedaan baris per baris. Berguna untuk melihat perubahan dalam dokumen atau kode.',
    benefits: [
      'Lihat perubahan antar versi teks',
      'Deteksi perbedaan dengan presisi',
      'Cocok untuk review dokumen'
    ],
    howItWorks: [
      'Tempel teks versi pertama di kolom kiri',
      'Tempel teks versi kedua di kolom kanan',
      'Perbedaan akan ditandai secara otomatis',
      'Analisis hasil perbandingan'
    ],
    icon: 'GitCompare',
    processingType: 'client',
    faq: [
      { question: 'Apakah bisa membandingkan file?', answer: 'Saat ini alat ini membandingkan teks yang ditempel, bukan file. Untuk file besar, salin kontennya ke kolom yang tersedia.' }
    ],
    keywords: ['bandingkan teks', 'diff checker', 'perbedaan teks', 'text comparison'],
    relatedToolSlugs: ['remove-duplicate-lines', 'word-counter']
  },
  {
    slug: 'text-reverser',
    name: 'Text Reverser',
    category: 'text',
    shortDescription: 'Balikkan urutan teks atau kata',
    description: 'Balikkan urutan karakter, kata, atau baris dalam teks. Berguna untuk membuat teka-teki, efek visual, atau keperluan unik lainnya.',
    benefits: [
      'Balik teks dengan berbagai mode',
      'Hasil instan dan akurat',
      'Mode reverse kata, karakter, atau baris'
    ],
    howItWorks: [
      'Tempel teks yang akan dibalik',
      'Pilih mode reverse (karakter/kata/baris)',
      'Hasil akan muncul secara otomatis',
      'Salin teks yang sudah dibalik'
    ],
    icon: 'ArrowLeftRight',
    processingType: 'client',
    faq: [
      { question: 'Apa perbedaan reverse karakter dan kata?', answer: 'Reverse karakter membalik semua huruf (misal "abc" jadi "cba"), reverse kata membalik urutan kata ("satu dua" jadi "dua satu").' }
    ],
    keywords: ['balik teks', 'text reverser', 'reverse text', 'membalik kata'],
    relatedToolSlugs: ['case-converter', 'whitespace-remover']
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'text',
    shortDescription: 'Hasilkan teks Lorem Ipsum untuk desain dan layout',
    description: 'Generator teks Lorem Ipsum untuk kebutuhan desain grafis, web development, dan percetakan. Atur jumlah paragraf, kata, atau kalimat.',
    benefits: [
      'Hasilkan placeholder teks dengan cepat',
      'Atur jumlah paragraf atau kata',
      'Cocok untuk mockup desain'
    ],
    howItWorks: [
      'Pilih jumlah paragraf atau kata yang diinginkan',
      'Atur opsi tambahan (awal dengan Lorem)',
      'Klik tombol "Generate"',
      'Salin teks Lorem Ipsum yang dihasilkan'
    ],
    icon: 'TextQuote',
    processingType: 'client',
    faq: [
      { question: 'Apa itu Lorem Ipsum?', answer: 'Lorem Ipsum adalah teks placeholder yang digunakan dalam industri percetakan dan desain untuk mengisi ruang sebelum konten final tersedia.' }
    ],
    keywords: ['lorem ipsum', 'generator teks', 'placeholder text', 'dummy text'],
    relatedToolSlugs: ['word-counter', 'case-converter']
  },
  {
    slug: 'whitespace-remover',
    name: 'Whitespace Remover',
    category: 'text',
    shortDescription: 'Hapus spasi berlebih dan whitespace dari teks',
    description: 'Bersihkan teks dari spasi berlebih, tab, dan baris kosong. Atur opsi penghapusan sesuai kebutuhan termasuk trim leading/trailing spaces.',
    benefits: [
      'Rapikan teks dengan cepat',
      'Hapus whitespace yang tidak perlu',
      'Hasil teks lebih ringkas'
    ],
    howItWorks: [
      'Tempel teks yang akan dibersihkan',
      'Pilih opsi penghapusan yang diinginkan',
      'Klik tombol "Remove Whitespace"',
      'Salin teks yang sudah bersih'
    ],
    icon: 'RemoveFormatting',
    processingType: 'client',
    faq: [
      { question: 'Apa perbedaan trim dan hapus semua spasi?', answer: 'Trim hanya menghapus spasi di awal dan akhir baris, sedangkan hapus semua spasi akan menghapus semua spasi termasuk di antara kata.' }
    ],
    keywords: ['hapus spasi', 'whitespace remover', 'bersihkan spasi', 'trim teks'],
    relatedToolSlugs: ['remove-duplicate-lines', 'text-sorter']
  },
  {
    slug: 'text-sorter',
    name: 'Text Sorter',
    category: 'text',
    shortDescription: 'Urutkan baris teks secara alfabetis',
    description: 'Urutkan daftar baris teks secara alfabetis ascending atau descending. Berguna untuk merapikan daftar nama, kata, atau data tekstual lainnya.',
    benefits: [
      'Urutkan data dengan cepat',
      'Dukungan ascending dan descending',
      'Cocok untuk merapikan daftar'
    ],
    howItWorks: [
      'Tempel teks yang akan diurutkan',
      'Pilih urutan (ascending/descending)',
      'Klik tombol "Sort"',
      'Salin teks yang sudah diurutkan'
    ],
    icon: 'ArrowUpDown',
    processingType: 'client',
    faq: [
      { question: 'Apakah case-sensitive?', answer: 'Ya, secara default pengurutan bersifat case-sensitive. Tersedia opsi untuk mengabaikan case.' }
    ],
    keywords: ['urutkan teks', 'text sorter', 'sortir teks', 'mengurutkan daftar'],
    relatedToolSlugs: ['remove-duplicate-lines', 'whitespace-remover']
  },

  // ========================
  // DEVELOPER TOOLS (client)
  // ========================
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'developer',
    shortDescription: 'Format dan validasi kode JSON',
    description: 'Format, validasi, dan beautify kode JSON dengan indentasi yang rapi. Dukung tree view untuk navigasi struktur data yang lebih mudah.',
    benefits: [
      'Kode JSON lebih rapi dan terbaca',
      'Validasi error sintaks JSON',
      'Tree view untuk eksplorasi data'
    ],
    howItWorks: [
      'Tempel kode JSON di kolom input',
      'JSON akan diformat secara otomatis',
      'Lihat error validasi jika ada',
      'Salin JSON yang sudah diformat'
    ],
    icon: 'Braces',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apakah bisa minify JSON?', answer: 'Ya, selain format, Anda juga bisa mengecilkan (minify) JSON untuk mengurangi ukuran file.' }
    ],
    keywords: ['json formatter', 'format json', 'beautify json', 'validasi json', 'json validator'],
    relatedToolSlugs: ['json-to-csv', 'xml-formatter', 'base64-encoder-decoder']
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    category: 'developer',
    shortDescription: 'Validasi format JSON dan deteksi error sintaks secara instan.',
    description: 'JSON Validator memeriksa kevalidan struktur JSON Anda, menampilkan lokasi error secara detail, dan membantu Anda memperbaiki kesalahan sintaks dengan cepat.',
    benefits: [
      'Deteksi error sintaks JSON secara real-time',
      'Menampilkan baris dan kolom lokasi error',
      'Proses instan tanpa upload ke server',
    ],
    howItWorks: [
      'Tempel (paste) kode JSON Anda',
      'Validasi berjalan otomatis secara real-time',
      'Error ditandai dengan lokasi baris dan kolom yang jelas',
    ],
    icon: 'FileCheck',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa perbedaan JSON Validator dengan JSON Formatter?', answer: 'JSON Validator fokus pada pemeriksaan error, sementara Formatter merapikan tampilan JSON.' },
    ],
    keywords: ['json validator', 'validasi json', 'cek json', 'json valid'],
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV',
    category: 'developer',
    shortDescription: 'Konversi data JSON ke format CSV',
    description: 'Ubah data JSON terstruktur menjadi file CSV yang dapat dibuka di spreadsheet. Dukung array objek dan nested JSON dengan pemetaan otomatis.',
    benefits: [
      'Konversi data JSON ke tabel',
      'Mudah diolah di Excel/Spreadsheet',
      'Dukung nested JSON'
    ],
    howItWorks: [
      'Tempel data JSON di kolom input',
      'Pilih opsi pemetaan kolom',
      'Klik tombol "Convert"',
      'Unduh atau salin hasil CSV'
    ],
    icon: 'FileSpreadsheet',
    processingType: 'client',
    faq: [
      { question: 'Apakah nested JSON didukung?', answer: 'Ya, nested JSON akan diflatten dengan nama field menggunakan notasi titik (dot notation).' }
    ],
    keywords: ['json ke csv', 'konversi json', 'json to csv', 'ubah json ke csv'],
    relatedToolSlugs: ['csv-to-json', 'json-formatter']
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON',
    category: 'developer',
    shortDescription: 'Konversi data CSV ke format JSON',
    description: 'Ubah file CSV atau data tabular menjadi JSON. Pilih delimiter, atur header, dan dapatkan output JSON yang siap digunakan di aplikasi.',
    benefits: [
      'Konversi tabel data ke JSON',
      'Dukung berbagai delimiter',
      'Siap pakai untuk API dan aplikasi'
    ],
    howItWorks: [
      'Tempel data CSV di kolom input',
      'Atur delimiter dan opsi header',
      'Klik tombol "Convert"',
      'Salin hasil JSON'
    ],
    icon: 'Braces',
    processingType: 'client',
    faq: [
      { question: 'Delimiter apa yang didukung?', answer: 'Kami mendukung koma, semicolon, tab, dan pipe sebagai delimiter.' }
    ],
    keywords: ['csv ke json', 'konversi csv', 'csv to json', 'ubah csv ke json'],
    relatedToolSlugs: ['json-to-csv', 'json-formatter']
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'developer',
    shortDescription: 'Encode dan decode string Base64',
    description: 'Encode teks ke format Base64 atau decode Base64 kembali ke teks asli. Dukung berbagai charset encoding untuk fleksibilitas maksimal.',
    benefits: [
      'Encode teks ke Base64 dengan cepat',
      'Decode Base64 kembali ke aslinya',
      'Dukung UTF-8 dan ASCII'
    ],
    howItWorks: [
      'Tempel teks atau string Base64',
      'Pilih arah encode atau decode',
      'Hasil akan muncul secara otomatis',
      'Salin hasil encode atau decode'
    ],
    icon: 'Code2',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa itu Base64?', answer: 'Base64 adalah skema encoding yang mengubah data biner menjadi format teks ASCII, sering digunakan untuk mengirim data melalui media yang mendukung teks.' }
    ],
    keywords: ['base64 encode', 'base64 decode', 'encoder decoder', 'base64 converter'],
    relatedToolSlugs: ['url-encoder-decoder', 'hash-generator', 'image-to-base64']
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'developer',
    shortDescription: 'Decode dan inspeksi token JWT',
    description: 'Decode token JWT untuk melihat header, payload, dan signature. Analisis klaim dan data yang terkandung dalam token autentikasi.',
    benefits: [
      'Inspeksi token JWT dengan mudah',
      'Lihat header dan payload detail',
      'Cocok untuk debugging autentikasi'
    ],
    howItWorks: [
      'Tempel token JWT di kolom input',
      'Header dan payload akan di-decode otomatis',
      'Lihat klaim dan data dalam token',
      'Analisis informasi token'
    ],
    icon: 'Key',
    processingType: 'client',
    faq: [
      { question: 'Apakah token diverifikasi?', answer: 'Alat ini hanya melakukan decode, bukan verifikasi signature. Untuk verifikasi, Anda perlu secret key.' }
    ],
    keywords: ['jwt decoder', 'decode jwt', 'token jwt', 'jwt inspector'],
    relatedToolSlugs: ['base64-encoder-decoder', 'hash-generator']
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer',
    shortDescription: 'Generate UUID/GUID unik secara instan',
    description: 'Hasilkan UUID (Universally Unique Identifier) versi 4 secara acak. Dukung format dengan dan tanpa tanda hubung, serta uppercase/lowercase.',
    benefits: [
      'Hasilkan UUID unik dengan cepat',
      'Berbagai format output',
      'Berguna untuk ID database dan API'
    ],
    howItWorks: [
      'Pilih jumlah UUID yang diinginkan',
      'Atur format output (dengan/tanpa strip)',
      'Klik tombol "Generate"',
      'Salin UUID yang dihasilkan'
    ],
    icon: 'Fingerprint',
    processingType: 'client',
    faq: [
      { question: 'Apakah UUID benar-benar unik?', answer: 'UUID versi 4 menggunakan angka acak dengan 122 bit entropi, sehingga kemungkinan duplikasi sangat kecil.' }
    ],
    keywords: ['uuid generator', 'generate uuid', 'buat uuid', 'guid generator'],
    relatedToolSlugs: ['hash-generator', 'password-generator']
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'developer',
    shortDescription: 'Format dan beautify kode SQL',
    description: 'Rapikan kueri SQL dengan indentasi dan pemisahan yang jelas. Dukung berbagai dialek SQL seperti MySQL, PostgreSQL, dan SQL Server.',
    benefits: [
      'Kode SQL lebih rapi dan mudah dibaca',
      'Dukung berbagai dialek SQL',
      'Debug kueri lebih mudah'
    ],
    howItWorks: [
      'Tempel kode SQL di kolom input',
      'Pilih dialek SQL yang digunakan',
      'Klik tombol "Format"',
      'Salin kode SQL yang sudah diformat'
    ],
    icon: 'Database',
    processingType: 'client',
    faq: [
      { question: 'Dialek SQL apa yang didukung?', answer: 'Kami mendukung MySQL, PostgreSQL, MariaDB, SQL Server, dan SQL standar.' }
    ],
    keywords: ['sql formatter', 'format sql', 'beautify sql', 'rapikan query sql'],
    relatedToolSlugs: ['json-formatter', 'html-formatter']
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    category: 'developer',
    shortDescription: 'Format dan beautify kode HTML',
    description: 'Rapikan kode HTML dengan indentasi hierarkis yang jelas. Dukung HTML5, komponen, dan template string.',
    benefits: [
      'Kode HTML lebih terstruktur',
      'Mudah mendeteksi tag yang tidak ditutup',
      'Cocok untuk debugging'
    ],
    howItWorks: [
      'Tempel kode HTML di kolom input',
      'Klik tombol "Format"',
      'Kode akan diformat dengan indentasi rapi',
      'Salin kode HTML yang sudah diformat'
    ],
    icon: 'Globe',
    processingType: 'client',
    faq: [
      { question: 'Apakah komentar HTML dipertahankan?', answer: 'Ya, komentar HTML akan tetap dipertahankan dalam hasil format.' }
    ],
    keywords: ['html formatter', 'format html', 'beautify html', 'rapikan html'],
    relatedToolSlugs: ['css-minifier', 'js-minifier', 'json-formatter']
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    category: 'developer',
    shortDescription: 'Perkecil ukuran file CSS dengan minifikasi',
    description: 'Minify kode CSS dengan menghapus spasi, komentar, dan karakter yang tidak perlu. Optimalkan stylesheet untuk performa website.',
    benefits: [
      'Ukuran CSS lebih kecil',
      'Kecepatan loading website meningkat',
      'Proses cepat dan akurat'
    ],
    howItWorks: [
      'Tempel kode CSS di kolom input',
      'Klik tombol "Minify"',
      'CSS akan diminifikasi secara otomatis',
      'Salin hasil CSS yang sudah diminify'
    ],
    icon: 'FileCode',
    processingType: 'client',
    faq: [
      { question: 'Berapa besar pengurangan ukuran?', answer: 'Rata-rata ukuran CSS dapat dikurangi 30-60% tergantung jumlah komentar dan whitespace.' }
    ],
    keywords: ['css minifier', 'minify css', 'kompres css', 'perkecil css'],
    relatedToolSlugs: ['js-minifier', 'html-formatter']
  },
  {
    slug: 'js-minifier',
    name: 'JS Minifier',
    category: 'developer',
    shortDescription: 'Perkecil ukuran file JavaScript dengan minifikasi',
    description: 'Minify kode JavaScript untuk mengurangi ukuran file. Hapus whitespace, komentar, dan optimalkan sintaks untuk produksi.',
    benefits: [
      'Ukuran JS lebih kecil untuk produksi',
      'Performa website lebih cepat',
      'Proses minifikasi yang aman'
    ],
    howItWorks: [
      'Tempel kode JavaScript di kolom input',
      'Klik tombol "Minify"',
      'JS akan diminifikasi secara otomatis',
      'Salin hasil JS yang sudah diminify'
    ],
    icon: 'FileCode',
    processingType: 'client',
    faq: [
      { question: 'Apakah ada risiko kode rusak?', answer: 'Minifier kami aman dan mempertahankan fungsionalitas kode. Namun, selalu test setelah minifikasi.' }
    ],
    keywords: ['js minifier', 'minify javascript', 'kompres js', 'perkecil javascript'],
    relatedToolSlugs: ['css-minifier', 'html-formatter']
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    category: 'developer',
    shortDescription: 'Format dan validasi kode XML',
    description: 'Rapikan kode XML dengan indentasi yang jelas. Validasi sintaks XML dan pastikan well-formed document.',
    benefits: [
      'Kode XML lebih rapi dan terbaca',
      'Validasi well-formed XML',
      'Mudah mendeteksi error'
    ],
    howItWorks: [
      'Tempel kode XML di kolom input',
      'Klik tombol "Format"',
      'XML akan diformat dengan indentasi rapi',
      'Salin kode XML yang sudah diformat'
    ],
    icon: 'Code2',
    processingType: 'client',
    faq: [
      { question: 'Apakah XML validator termasuk?', answer: 'Ya, alat ini juga memvalidasi apakah XML Anda well-formed dan memberi tahu jika ada error.' }
    ],
    keywords: ['xml formatter', 'format xml', 'beautify xml', 'validasi xml'],
    relatedToolSlugs: ['json-formatter', 'html-formatter']
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer',
    shortDescription: 'Generate hash dari teks dengan berbagai algoritma',
    description: 'Hasilkan hash dari teks menggunakan algoritma MD5, SHA-1, SHA-256, SHA-384, dan SHA-512. Cocok untuk verifikasi integritas data.',
    benefits: [
      'Hasilkan hash dengan berbagai algoritma',
      'Bandingkan hash untuk verifikasi',
      'Proses instan di browser'
    ],
    howItWorks: [
      'Tempel teks yang akan di-hash',
      'Pilih algoritma hash yang diinginkan',
      'Hash akan muncul secara otomatis',
      'Salin hash yang dihasilkan'
    ],
    icon: 'Hash',
    processingType: 'client',
    faq: [
      { question: 'Apa perbedaan MD5 dan SHA-256?', answer: 'SHA-256 lebih aman dan menghasilkan hash 256-bit, sedangkan MD5 hanya 128-bit dan sudah tidak direkomendasikan untuk keamanan.' }
    ],
    keywords: ['hash generator', 'generate hash', 'md5', 'sha256', 'sha512'],
    relatedToolSlugs: ['uuid-generator', 'password-generator', 'base64-encoder-decoder']
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    category: 'developer',
    shortDescription: 'Uji dan debug pola Regular Expression',
    description: 'Tulis dan uji pola regex secara real-time dengan highlighting matches. Dukung flags seperti global, case-insensitive, dan multiline.',
    benefits: [
      'Uji regex secara real-time',
      'Lihat match dan group capture',
      'Debug pola regex dengan mudah'
    ],
    howItWorks: [
      'Tulis pola regex di kolom pattern',
      'Masukkan teks yang akan diuji',
      'Lihat hasil matches secara real-time',
      'Sesuaikan pola hingga sesuai'
    ],
    icon: 'Search',
    processingType: 'client',
    faq: [
      { question: 'Engine regex apa yang digunakan?', answer: 'Kami menggunakan engine regex JavaScript (ECMAScript) yang kompatibel dengan sebagian besar implementasi modern.' }
    ],
    keywords: ['regex tester', 'uji regex', 'regular expression', 'pola regex'],
    relatedToolSlugs: ['json-formatter', 'base64-encoder-decoder']
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    category: 'developer',
    shortDescription: 'Encode dan decode URL dengan cepat',
    description: 'Encode URL agar aman ditransmisikan atau decode kembali ke bentuk asli. Tangani karakter spesial dan non-ASCII dengan benar.',
    benefits: [
      'Encode URL untuk web',
      'Decode URL yang terenkode',
      'Dukung UTF-8 dan ASCII'
    ],
    howItWorks: [
      'Tempel URL atau string di kolom input',
      'Pilih arah encode atau decode',
      'Hasil akan muncul secara otomatis',
      'Salin hasil encode atau decode'
    ],
    icon: 'Link',
    processingType: 'client',
    faq: [
      { question: 'Kapan perlu URL encode?', answer: 'URL encoding diperlukan saat URL mengandung karakter spesial seperti spasi, &, ?, atau karakter non-ASCII.' }
    ],
    keywords: ['url encoder', 'url decoder', 'encode url', 'decode url'],
    relatedToolSlugs: ['base64-encoder-decoder', 'text-to-slug']
  },
  {
    slug: 'markdown-previewer',
    name: 'Markdown Previewer',
    category: 'developer',
    shortDescription: 'Tulis dan preview Markdown secara real-time',
    description: 'Editor Markdown dengan preview real-time. Tulis konten Markdown dan lihat hasil rendering HTML secara langsung. Dukung GFM (GitHub Flavored Markdown).',
    benefits: [
      'Preview Markdown real-time',
      'Dukung GFM dan code highlighting',
      'Cocok untuk menulis dokumentasi'
    ],
    howItWorks: [
      'Tulis atau tempel konten Markdown',
      'Preview akan muncul secara real-time',
      'Gunakan toolbar untuk formatting cepat',
      'Salin hasil Markdown atau HTML'
    ],
    icon: 'FileText',
    processingType: 'client',
    faq: [
      { question: 'Format Markdown apa yang didukung?', answer: 'Kami mendukung GitHub Flavored Markdown termasuk tabel, code block, checklist, dan strikethrough.' }
    ],
    keywords: ['markdown preview', 'markdown editor', 'preview markdown', 'gfm'],
    relatedToolSlugs: ['html-formatter', 'json-formatter']
  },
  {
    slug: 'cron-expression-generator',
    name: 'Cron Expression Generator',
    category: 'developer',
    shortDescription: 'Generate dan visualisasi ekspresi Cron',
    description: 'Buat dan visualisasikan ekspresi cron untuk penjadwalan task. Pilih menit, jam, hari, bulan, dan hari dalam seminggu dengan antarmuka yang mudah.',
    benefits: [
      'Buat cron expression tanpa hafal sintaks',
      'Lihat visualisasi jadwal eksekusi',
      'Cocok untuk scheduling task'
    ],
    howItWorks: [
      'Pilih jadwal menggunakan form interaktif',
      'Cron expression akan dihasilkan otomatis',
      'Lihat preview jadwal eksekusi',
      'Salin cron expression untuk digunakan'
    ],
    icon: 'Clock',
    processingType: 'client',
    faq: [
      { question: 'Apa format cron yang digunakan?', answer: 'Kami menggunakan format cron standar 5-field: minute, hour, day of month, month, day of week.' }
    ],
    keywords: ['cron generator', 'cron expression', 'jadwal cron', 'scheduling'],
    relatedToolSlugs: ['uuid-generator', 'hash-generator']
  },

  // ========================
  // OFFICE TOOLS (server)
  // ========================
  {
    slug: 'excel-to-csv',
    name: 'Excel to CSV',
    category: 'office',
    shortDescription: 'Konversi file Excel ke format CSV',
    description: 'Ubah file Excel (XLSX/XLS) menjadi format CSV yang ringan dan kompatibel. Pertahankan data tabular untuk digunakan di berbagai aplikasi.',
    benefits: [
      'Konversi Excel ke CSV dengan cepat',
      'Ukuran file lebih ringan',
      'Kompatibel dengan banyak aplikasi'
    ],
    howItWorks: [
      'Unggah file Excel yang ingin dikonversi',
      'Pilih sheet yang akan dikonversi',
      'Atur delimiter CSV (koma/semicolon)',
      'Unduh file CSV hasil konversi'
    ],
    icon: 'FileSpreadsheet',
    processingType: 'server',
    acceptedFileTypes: ['.xlsx', '.xls'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    isPopular: true,
    faq: [
      { question: 'Bisakah memilih sheet tertentu?', answer: 'Ya, jika Excel memiliki banyak sheet, Anda dapat memilih sheet mana yang akan dikonversi ke CSV.' }
    ],
    keywords: ['excel ke csv', 'konversi excel', 'excel to csv', 'ubah xlsx ke csv'],
    relatedToolSlugs: ['csv-to-excel', 'pdf-to-excel']
  },
  {
    slug: 'csv-to-excel',
    name: 'CSV to Excel',
    category: 'office',
    shortDescription: 'Konversi file CSV ke format Excel',
    description: 'Ubah file CSV menjadi file Excel (XLSX) yang dapat diedit di Microsoft Excel atau spreadsheet lainnya. Atur delimiter dan tipe data kolom.',
    benefits: [
      'Buka file CSV di Excel dengan rapi',
      'Pisahkan data ke dalam sheet',
      'Format data lebih terstruktur'
    ],
    howItWorks: [
      'Unggah file CSV yang ingin dikonversi',
      'Pilih delimiter yang sesuai',
      'Atur tipe data kolom jika perlu',
      'Unduh file Excel hasil konversi'
    ],
    icon: 'FileSpreadsheet',
    processingType: 'server',
    acceptedFileTypes: ['.csv'],
    acceptedMimeTypes: ['text/csv', 'text/plain'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    faq: [
      { question: 'Delimiter apa yang didukung?', answer: 'Kami mendukung koma (,), semicolon (;), dan tab sebagai delimiter.' }
    ],
    keywords: ['csv ke excel', 'konversi csv', 'csv to excel', 'ubah csv ke xlsx'],
    relatedToolSlugs: ['excel-to-csv', 'excel-to-pdf']
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'office',
    shortDescription: 'Konversi dokumen Word ke PDF',
    description: 'Ubah file DOCX/DOC menjadi PDF dengan tata letak yang rapi. Pertahankan format, gambar, tabel, dan elemen dokumen lainnya.',
    benefits: [
      'Dokumen tampil konsisten di mana pun',
      'Pertahankan format asli',
      'Mudah dibagikan dan dipublikasikan'
    ],
    howItWorks: [
      'Unggah file Word yang akan dikonversi',
      'Pilih ukuran halaman jika perlu',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file PDF hasil konversi'
    ],
    icon: 'FileText',
    processingType: 'server',
    acceptedFileTypes: ['.docx', '.doc'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    maxFileSizeMB: 25,
    maxFiles: 1,
    faq: [
      { question: 'Apakah format tabel akan dipertahankan?', answer: 'Ya, tabel, gambar, dan format teks akan dipertahankan semirip mungkin dengan dokumen asli.' }
    ],
    keywords: ['word ke pdf', 'konversi docx', 'word to pdf', 'ubah word ke pdf'],
    relatedToolSlugs: ['powerpoint-to-pdf', 'excel-to-pdf']
  },
  {
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'office',
    shortDescription: 'Konversi presentasi PowerPoint ke PDF',
    description: 'Ubah file PPTX/PPT menjadi PDF dengan mempertahankan tata letak slide, gambar, dan animasi. Cocok untuk berbagi presentasi.',
    benefits: [
      'Bagikan presentasi tanpa perlu PowerPoint',
      'Ukuran file lebih kecil',
      'Tampilan slide konsisten'
    ],
    howItWorks: [
      'Unggah file PowerPoint yang akan dikonversi',
      'Pilih opsi layout (1/2/4 slide per halaman)',
      'Klik tombol "Convert" untuk memproses',
      'Unduh file PDF hasil konversi'
    ],
    icon: 'Presentation',
    processingType: 'server',
    acceptedFileTypes: ['.pptx', '.ppt'],
    acceptedMimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'],
    maxFileSizeMB: 50,
    maxFiles: 1,
    faq: [
      { question: 'Apakah animasi akan dipertahankan?', answer: 'Animasi dan transisi tidak dapat dipertahankan di PDF. Setiap slide akan ditampilkan sebagai halaman statis.' }
    ],
    keywords: ['powerpoint ke pdf', 'pptx ke pdf', 'konversi ppt', 'powerpoint to pdf'],
    relatedToolSlugs: ['word-to-pdf', 'excel-to-pdf']
  },

  // ========================
  // CALCULATOR (client)
  // ========================
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculator',
    shortDescription: 'Kalkulator persentase untuk berbagai kebutuhan',
    description: 'Hitung persentase dengan mudah — kalkulasi nilai persen, kenaikan/penurunan persentase, dan rasio. Cocok untuk keperluan belanja, keuangan, dan analisis data.',
    benefits: [
      'Hitung persentase dengan cepat',
      'Hitung kenaikan dan penurunan',
      'Cocok untuk keuangan sehari-hari'
    ],
    howItWorks: [
      'Pilih jenis kalkulasi persentase',
      'Masukkan nilai yang diperlukan',
      'Hasil akan muncul secara otomatis',
      'Salin hasil kalkulasi'
    ],
    icon: 'Percent',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa saja mode kalkulasi yang tersedia?', answer: 'Tersedia mode: hitung persen dari nilai, hitung kenaikan/penurunan persen, dan hitung rasio persentase.' }
    ],
    keywords: ['kalkulator persen', 'percentage calculator', 'hitung persentase', 'persen'],
    relatedToolSlugs: ['discount-calculator', 'tax-calculator']
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculator',
    shortDescription: 'Hitung Indeks Massa Tubuh (BMI) Anda',
    description: 'Kalkulator BMI (Body Mass Index) untuk menghitung indeks massa tubuh berdasarkan berat dan tinggi. Dapatkan kategori berat badan ideal dan saran kesehatan.',
    benefits: [
      'Ketahui kategori BMI Anda',
      'Hitung berat badan ideal',
      'Saran kesehatan berdasarkan BMI'
    ],
    howItWorks: [
      'Masukkan berat badan (kg)',
      'Masukkan tinggi badan (cm)',
      'BMI akan terhitung otomatis',
      'Lihat kategori dan saran kesehatan'
    ],
    icon: 'Weight',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa itu BMI normal?', answer: 'BMI normal berada di rentang 18.5 - 24.9. BMI di atas 25 tergolong kelebihan berat badan.' },
      { question: 'Apakah BMI akurat untuk semua orang?', answer: 'BMI adalah indikator umum dan mungkin kurang akurat untuk atlet dengan massa otot tinggi atau lansia.' }
    ],
    keywords: ['kalkulator bmi', 'hitung bmi', 'body mass index', 'berat badan ideal'],
    relatedToolSlugs: ['age-calculator', 'percentage-calculator']
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculator',
    shortDescription: 'Hitung usia berdasarkan tanggal lahir',
    description: 'Hitung usia Anda secara presisi dalam tahun, bulan, hari, jam, menit, dan detik. Cocok untuk menghitung ulang tahun atau masa kerja.',
    benefits: [
      'Hitung usia dengan detail lengkap',
      'Ketahui ulang tahun berikutnya',
      'Hitung selisih tanggal dengan presisi'
    ],
    howItWorks: [
      'Masukkan tanggal lahir Anda',
      'Atau pilih tanggal untuk perbandingan',
      'Usia akan terhitung otomatis',
      'Lihat detail usia dalam berbagai satuan'
    ],
    icon: 'Calendar',
    processingType: 'client',
    faq: [
      { question: 'Apakah bisa menghitung usia untuk tanggal di masa depan?', answer: 'Ya, Anda bisa memasukkan tanggal berapa pun untuk menghitung selisih usia.' }
    ],
    keywords: ['kalkulator usia', 'hitung umur', 'age calculator', 'usia'],
    relatedToolSlugs: ['date-difference-calculator', 'bmi-calculator']
  },
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    category: 'calculator',
    shortDescription: 'Hitung simulasi cicilan pinjaman',
    description: 'Kalkulator pinjaman untuk menghitung cicilan bulanan, total bunga, dan total pembayaran. Dukung perhitungan anuitas dan flat rate.',
    benefits: [
      'Simulasi cicilan pinjaman',
      'Bandingkan tenor dan bunga',
      'Rencanakan keuangan lebih baik'
    ],
    howItWorks: [
      'Masukkan jumlah pinjaman',
      'Masukkan suku bunga per tahun',
      'Pilih tenor pinjaman',
      'Lihat simulasi cicilan dan total bunga'
    ],
    icon: 'Landmark',
    processingType: 'client',
    faq: [
      { question: 'Apa perbedaan bunga flat dan anuitas?', answer: 'Bunga flat dihitung dari pokok awal, sedangkan anuitas dihitung dari sisa pokok sehingga cicilan menurun.' }
    ],
    keywords: ['kalkulator pinjaman', 'loan calculator', 'simulasi kredit', 'hitung cicilan'],
    relatedToolSlugs: ['percentage-calculator', 'tax-calculator']
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    category: 'calculator',
    shortDescription: 'Konversi mata uang secara real-time',
    description: 'Konversi nilai antar mata uang dunia dengan kurs terbaru. Dukung lebih dari 100 mata uang global untuk kebutuhan perjalanan dan bisnis.',
    benefits: [
      'Kurs mata uang terbaru',
      'Dukung 100+ mata uang dunia',
      'Cocok untuk perjalanan dan bisnis'
    ],
    howItWorks: [
      'Pilih mata uang asal',
      'Masukkan jumlah yang akan dikonversi',
      'Pilih mata uang tujuan',
      'Lihat hasil konversi secara instan'
    ],
    icon: 'DollarSign',
    processingType: 'client',
    faq: [
      { question: 'Apakah kurs selalu update?', answer: 'Kurs diperbarui secara berkala dari sumber data terpercaya, namun mungkin tidak real-time untuk transaksi langsung.' }
    ],
    keywords: ['konversi mata uang', 'currency converter', 'kurs', 'nilai tukar'],
    relatedToolSlugs: ['percentage-calculator', 'unit-converter']
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    category: 'calculator',
    shortDescription: 'Konversi satuan panjang, berat, suhu, dan lainnya',
    description: 'Konversi unit pengukuran antar sistem (metrik, imperial, dan lainnya). Dukung konversi panjang, berat, suhu, volume, luas, kecepatan, dan waktu.',
    benefits: [
      'Konversi berbagai jenis satuan',
      'Antarmuka mudah digunakan',
      'Hasil akurat dan cepat'
    ],
    howItWorks: [
      'Pilih kategori unit (panjang, berat, dll)',
      'Masukkan nilai yang akan dikonversi',
      'Pilih satuan asal dan tujuan',
      'Hasil konversi muncul otomatis'
    ],
    icon: 'Ruler',
    processingType: 'client',
    faq: [
      { question: 'Satuan apa saja yang didukung?', answer: 'Kami mendukung panjang, berat, suhu, volume, luas, kecepatan, waktu, dan tekanan.' }
    ],
    keywords: ['konversi satuan', 'unit converter', 'ubah satuan', 'konversi unit'],
    relatedToolSlugs: ['currency-converter', 'percentage-calculator']
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'calculator',
    shortDescription: 'Hitung harga setelah diskon dan jumlah hemat',
    description: 'Kalkulator diskon untuk menghitung harga akhir setelah diskon. Ketahui jumlah uang yang dihemat dan harga final setelah potongan.',
    benefits: [
      'Hitung harga setelah diskon',
      'Ketahui jumlah penghematan',
      'Cocok untuk belanja'
    ],
    howItWorks: [
      'Masukkan harga asli produk',
      'Masukkan persentase diskon',
      'Lihat harga setelah diskon',
      'Lihat total penghematan'
    ],
    icon: 'ShoppingBag',
    processingType: 'client',
    faq: [
      { question: 'Apakah bisa menghitung diskon bertingkat?', answer: 'Tidak untuk diskon bertingkat. Alat ini menghitung diskon tunggal, diskon ganda bisa dihitung manual dengan dua kali kalkulasi.' }
    ],
    keywords: ['kalkulator diskon', 'hitung diskon', 'diskon', 'harga setelah diskon'],
    relatedToolSlugs: ['percentage-calculator', 'tax-calculator']
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'calculator',
    shortDescription: 'Hitung IPK (GPA) berdasarkan nilai dan bobot SKS.',
    description: 'GPA Calculator membantu Anda menghitung Indeks Prestasi Kumulatif (IPK) dengan cepat dan akurat berdasarkan nilai mata kuliah dan bobot SKS masing-masing.',
    benefits: [
      'Perhitungan otomatis tanpa rumus manual',
      'Mendukung sistem penilaian Indonesia (A=4, B=3, C=2, D=1, E=0)',
      'Hasil langsung muncul saat Anda mengetik',
    ],
    howItWorks: [
      'Masukkan nama mata kuliah',
      'Pilih nilai (A/B/C/D/E) dan masukkan jumlah SKS',
      'Klik "Tambah" untuk menambahkan mata kuliah',
      'GPA otomatis dihitung dan ditampilkan',
    ],
    icon: 'GraduationCap',
    processingType: 'client',
    isNew: true,
    faq: [
      { question: 'Apa perbedaan GPA dan IPK?', answer: 'GPA (Grade Point Average) sama dengan IPK (Indeks Prestasi Kumulatif) di Indonesia.' },
    ],
    keywords: ['gpa calculator', 'ipk calculator', 'kalkulator ipk', 'hitung ipk', 'nilai kuliah'],
  },
  {
    slug: 'tax-calculator',
    name: 'Tax Calculator',
    category: 'calculator',
    shortDescription: 'Hitung pajak PPN dan PPh',
    description: 'Kalkulator pajak untuk menghitung PPN (Pajak Pertambahan Nilai) dan PPh (Pajak Penghasilan) dengan tarif yang berlaku di Indonesia.',
    benefits: [
      'Hitung PPN 11% dan 12%',
      'Hitung PPh dengan tarif progresif',
      'Cocok untuk bisnis dan pribadi'
    ],
    howItWorks: [
      'Pilih jenis pajak (PPN/PPh)',
      'Masukkan jumlah dasar pengenaan pajak',
      'Pilih tarif yang berlaku',
      'Lihat jumlah pajak yang harus dibayar'
    ],
    icon: 'Receipt',
    processingType: 'client',
    faq: [
      { question: 'Berapa tarif PPN saat ini?', answer: 'Tarif PPN di Indonesia adalah 11% dan akan naik menjadi 12% sesuai kebijakan pemerintah.' }
    ],
    keywords: ['kalkulator pajak', 'hitung ppn', 'hitung pph', 'tax calculator'],
    relatedToolSlugs: ['percentage-calculator', 'discount-calculator']
  },
  {
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'calculator',
    shortDescription: 'Hitung selisih antara dua tanggal',
    description: 'Hitung selisih hari, bulan, dan tahun antara dua tanggal. Berguna untuk menghitung masa kerja, usia proyek, atau tenggat waktu.',
    benefits: [
      'Hitung selisih tanggal dengan presisi',
      'Hasil dalam hari, bulan, dan tahun',
      'Cocok untuk perencanaan'
    ],
    howItWorks: [
      'Masukkan tanggal mulai',
      'Masukkan tanggal akhir',
      'Selisih akan terhitung otomatis',
      'Lihat hasil dalam berbagai satuan'
    ],
    icon: 'CalendarDays',
    processingType: 'client',
    faq: [
      { question: 'Apakah tanggal akhir dihitung?', answer: 'Ya, selisih dihitung inklusif termasuk tanggal akhir.' }
    ],
    keywords: ['selisih tanggal', 'date difference', 'beda tanggal', 'hitung hari'],
    relatedToolSlugs: ['age-calculator', 'percentage-calculator']
  },

  // ========================
  // COLOR TOOLS (client)
  // ========================
  {
    slug: 'hex-to-rgb',
    name: 'HEX to RGB',
    category: 'color',
    shortDescription: 'Konversi kode warna HEX ke RGB',
    description: 'Ubah kode warna HEX (hexadecimal) ke format RGB (Red, Green, Blue) dengan cepat. Dukung kode HEX 3-digit dan 6-digit.',
    benefits: [
      'Konversi HEX ke RGB instan',
      'Lihat preview warna',
      'Salin nilai RGB dengan satu klik'
    ],
    howItWorks: [
      'Masukkan kode warna HEX (contoh: #ff0000)',
      'Nilai RGB akan muncul otomatis',
      'Lihat preview warna yang dikonversi',
      'Salin nilai RGB untuk digunakan'
    ],
    icon: 'Palette',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Format HEX apa yang didukung?', answer: 'Kami mendukung format HEX 3-digit (#fff), 6-digit (#ffffff), dan dengan/tanpa tanda pagar.' }
    ],
    keywords: ['hex ke rgb', 'konversi hex', 'hex to rgb', 'kode warna'],
    relatedToolSlugs: ['rgb-to-hex', 'hsl-converter', 'color-palette-generator']
  },
  {
    slug: 'rgb-to-hex',
    name: 'RGB to HEX',
    category: 'color',
    shortDescription: 'Konversi warna RGB ke kode HEX',
    description: 'Ubah nilai warna RGB (Red, Green, Blue) ke kode HEX. Masukkan nilai RGB (0-255) dan dapatkan kode HEX yang sesuai.',
    benefits: [
      'Konversi RGB ke HEX cepat',
      'Preview warna real-time',
      'Salin kode HEX dengan mudah'
    ],
    howItWorks: [
      'Masukkan nilai R (0-255)',
      'Masukkan nilai G (0-255)',
      'Masukkan nilai B (0-255)',
      'Lihat kode HEX dan preview warna'
    ],
    icon: 'Palette',
    processingType: 'client',
    faq: [
      { question: 'Apakah nilai RGB harus antara 0-255?', answer: 'Ya, nilai RGB yang valid adalah 0-255 untuk masing-masing komponen warna.' }
    ],
    keywords: ['rgb ke hex', 'konversi rgb', 'rgb to hex', 'kode hex'],
    relatedToolSlugs: ['hex-to-rgb', 'hsl-converter']
  },
  {
    slug: 'color-palette-generator',
    name: 'Color Palette Generator',
    category: 'color',
    shortDescription: 'Hasilkan palet warna harmonis untuk desain',
    description: 'Buat palet warna yang harmonis berdasarkan warna dasar. Dukung skema monokromatik, komplementer, analog, triadik, dan tetradik.',
    benefits: [
      'Hasilkan palet warna profesional',
      'Berbagai skema warna tersedia',
      'Cocok untuk desain UI dan grafis'
    ],
    howItWorks: [
      'Pilih warna dasar',
      'Pilih skema warna (monokromatik, dll)',
      'Palet akan dihasilkan otomatis',
      'Salin kode warna dari palet'
    ],
    icon: 'Droplets',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apa itu skema warna komplementer?', answer: 'Skema komplementer menggunakan warna yang saling berlawanan di color wheel untuk menciptakan kontras yang kuat.' }
    ],
    keywords: ['palet warna', 'color palette', 'generator warna', 'skema warna'],
    relatedToolSlugs: ['gradient-generator', 'hex-to-rgb', 'contrast-checker']
  },
  {
    slug: 'gradient-generator',
    name: 'Gradient Generator',
    category: 'color',
    shortDescription: 'Buat gradient warna CSS kustom',
    description: 'Hasilkan gradient warna CSS linear dan radial dengan mudah. Atur arah, warna transisi, dan titik henti untuk efek gradasi yang unik.',
    benefits: [
      'Buat gradient CSS dengan visual',
      'Preview real-time',
      'Salin kode CSS langsung'
    ],
    howItWorks: [
      'Pilih dua atau lebih warna',
      'Atur arah gradient (linear/radial)',
      'Sesuaikan titik transisi',
      'Salin kode CSS gradient'
    ],
    icon: 'SwatchBook',
    processingType: 'client',
    faq: [
      { question: 'Apakah bisa membuat multi-color gradient?', answer: 'Ya, Anda dapat menambahkan lebih dari dua warna untuk gradient yang lebih kompleks.' }
    ],
    keywords: ['gradient generator', 'buat gradient', 'css gradient', 'gradasi warna'],
    relatedToolSlugs: ['color-palette-generator', 'hex-to-rgb']
  },
  {
    slug: 'contrast-checker',
    name: 'Contrast Checker',
    category: 'color',
    shortDescription: 'Cek kontras warna untuk aksesibilitas',
    description: 'Periksa rasio kontras antara dua warna untuk memastikan aksesibilitas sesuai standar WCAG. Cocok untuk desain website yang inklusif.',
    benefits: [
      'Pastikan aksesibilitas warna',
      'Cek standar WCAG AA dan AAA',
      'Rekomendasi perbaikan kontras'
    ],
    howItWorks: [
      'Masukkan warna teks (foreground)',
      'Masukkan warna latar (background)',
      'Rasio kontras akan terhitung otomatis',
      'Lihat status kelulusan WCAG'
    ],
    icon: 'Accessibility',
    processingType: 'client',
    faq: [
      { question: 'Apa itu WCAG?', answer: 'WCAG (Web Content Accessibility Guidelines) adalah standar aksesibilitas web yang menetapkan rasio kontras minimal untuk teks.' }
    ],
    keywords: ['cek kontras', 'contrast checker', 'aksesibilitas warna', 'wcag'],
    relatedToolSlugs: ['hex-to-rgb', 'color-palette-generator']
  },
  {
    slug: 'cmyk-converter',
    name: 'CMYK Converter',
    category: 'color',
    shortDescription: 'Konversi warna ke format CMYK untuk percetakan',
    description: 'Ubah warna RGB/HEX ke format CMYK (Cyan, Magenta, Yellow, Key/Black) yang digunakan dalam percetakan. Dapatkan nilai CMYK presisi.',
    benefits: [
      'Konversi warna untuk cetak',
      'Nilai CMYK presisi tinggi',
      'Cocok untuk desain percetakan'
    ],
    howItWorks: [
      'Masukkan warna dalam format HEX atau RGB',
      'Nilai CMYK akan terhitung otomatis',
      'Lihat preview warna hasil',
      'Salin nilai CMYK untuk digunakan'
    ],
    icon: 'Printer',
    processingType: 'client',
    faq: [
      { question: 'Mengapa CMYK penting?', answer: 'CMYK adalah model warna subtractif yang digunakan dalam percetakan, berbeda dengan RGB yang digunakan di layar.' }
    ],
    keywords: ['cmyk converter', 'konversi cmyk', 'rgb ke cmyk', 'warna cetak'],
    relatedToolSlugs: ['hex-to-rgb', 'hsl-converter']
  },
  {
    slug: 'hsl-converter',
    name: 'HSL Converter',
    category: 'color',
    shortDescription: 'Konversi warna ke format HSL',
    description: 'Konversi warna antara format HEX, RGB, dan HSL (Hue, Saturation, Lightness). HSL lebih intuitif untuk penyesuaian warna.',
    benefits: [
      'Konversi warna ke HSL',
      'Sesuaikan hue, saturation, lightness',
      'Preview warna real-time'
    ],
    howItWorks: [
      'Masukkan warna di format apapun (HEX/RGB)',
      'Nilai HSL akan muncul otomatis',
      'Sesuaikan slider HSL untuk eksplorasi',
      'Salin nilai warna hasil konversi'
    ],
    icon: 'Palette',
    processingType: 'client',
    faq: [
      { question: 'Apa kelebihan HSL dibanding RGB?', answer: 'HSL lebih intuitif untuk penyesuaian warna karena Anda bisa mengubah hue (corak), saturation (kejenuhan), dan lightness (kecerahan) secara terpisah.' }
    ],
    keywords: ['hsl converter', 'konversi hsl', 'rgb ke hsl', 'hex ke hsl'],
    relatedToolSlugs: ['hex-to-rgb', 'cmyk-converter', 'color-palette-generator']
  },

  // ========================
  // QR TOOLS (client)
  // ========================
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'qr',
    shortDescription: 'Buat QR Code kustom untuk tautan dan teks',
    description: 'Hasilkan QR Code untuk URL, teks, kontak, WiFi, dan lainnya. Kustomisasi warna, ukuran, dan tambahkan logo di tengah QR Code.',
    benefits: [
      'Buat QR Code instan',
      'Kustomisasi warna dan ukuran',
      'Tambahkan logo di tengah QR'
    ],
    howItWorks: [
      'Pilih tipe konten (URL, teks, dll)',
      'Masukkan data yang akan di-encode',
      'Kustomisasi tampilan QR Code',
      'Unduh QR Code dalam format PNG/SVG'
    ],
    icon: 'QrCode',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apakah QR Code bisa dipindai setelah di-download?', answer: 'Ya, QR Code yang dihasilkan dapat dipindai oleh aplikasi scanner QR mana pun.' },
      { question: 'Bisakah menambahkan logo?', answer: 'Ya, Anda dapat menambahkan logo di tengah QR Code dengan tingkat koreksi error yang lebih tinggi.' }
    ],
    keywords: ['buat qr code', 'qr generator', 'generate qr', 'qrcode'],
    relatedToolSlugs: ['barcode-generator', 'qr-code-with-logo', 'qr-code-scanner']
  },
  {
    slug: 'barcode-generator',
    name: 'Barcode Generator',
    category: 'qr',
    shortDescription: 'Generate berbagai jenis barcode',
    description: 'Hasilkan barcode untuk produk, inventaris, dan keperluan logistik. Dukung format Code 128, Code 39, EAN-13, UPC-A, dan lainnya.',
    benefits: [
      'Generate barcode instan',
      'Dukung berbagai format',
      'Cocok untuk produk dan inventaris'
    ],
    howItWorks: [
      'Pilih jenis barcode (Code 128, EAN-13, dll)',
      'Masukkan data yang akan di-encode',
      'Kustomisasi ukuran dan label',
      'Unduh barcode dalam format PNG/SVG'
    ],
    icon: 'Barcode',
    processingType: 'client',
    faq: [
      { question: 'Format barcode apa yang didukung?', answer: 'Kami mendukung Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, dan ITF-14.' }
    ],
    keywords: ['buat barcode', 'barcode generator', 'generate barcode', 'kode batang'],
    relatedToolSlugs: ['qr-code-generator', 'qr-code-scanner']
  },
  {
    slug: 'qr-code-scanner',
    name: 'QR Code Scanner',
    category: 'qr',
    shortDescription: 'Pindai QR Code menggunakan kamera atau file',
    description: 'Pindai dan decode QR Code menggunakan kamera perangkat atau unggah file gambar. Ekstrak informasi dari QR Code dengan cepat.',
    benefits: [
      'Pindai QR Code dari kamera',
      'Baca QR Code dari file gambar',
      'Hasil decode instan'
    ],
    howItWorks: [
      'Pilih sumber: kamera atau unggah gambar',
      'Arahkan kamera ke QR Code atau unggah file',
      'QR Code akan di-decode otomatis',
      'Lihat dan salin informasi hasil scan'
    ],
    icon: 'Scan',
    processingType: 'client',
    faq: [
      { question: 'Apakah perlu izin kamera?', answer: 'Ya, untuk menggunakan fitur scan kamera, browser akan meminta izin akses kamera.' }
    ],
    keywords: ['scan qr', 'qr scanner', 'pindai qr', 'baca qr code'],
    relatedToolSlugs: ['qr-code-generator', 'barcode-generator']
  },
  {
    slug: 'qr-code-with-logo',
    name: 'QR Code with Logo',
    category: 'qr',
    shortDescription: 'Buat QR Code dengan logo di tengah',
    description: 'Hasilkan QR Code kustom dengan logo perusahaan atau merek di tengahnya. Tingkat koreksi error tinggi memastikan QR tetap terbaca.',
    benefits: [
      'Branding QR Code dengan logo',
      'Tingkat keterbacaan tinggi',
      'Cocok untuk bisnis dan marketing'
    ],
    howItWorks: [
      'Masukkan data untuk QR Code',
      'Unggah logo yang akan ditempatkan',
      'Atur ukuran dan koreksi error',
      'Unduh QR Code dengan logo'
    ],
    icon: 'ImagePlus',
    processingType: 'client',
    faq: [
      { question: 'Apakah QR Code masih terbaca dengan logo?', answer: 'Ya, dengan tingkat koreksi error yang tinggi, QR Code tetap dapat dipindai meskipun ada logo di tengah.' }
    ],
    keywords: ['qr code logo', 'qr dengan logo', 'buat qr logo', 'custom qr'],
    relatedToolSlugs: ['qr-code-generator', 'barcode-generator']
  },

  // ========================
  // SECURITY TOOLS (client)
  // ========================
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'security',
    shortDescription: 'Hasilkan password kuat dan aman',
    description: 'Buat password acak yang kuat dan aman dengan berbagai opsi karakter. Atur panjang, sertakan huruf besar/kecil, angka, dan simbol.',
    benefits: [
      'Hasilkan password yang kuat',
      'Kustomisasi karakter yang digunakan',
      'Tingkat keamanan terukur'
    ],
    howItWorks: [
      'Atur panjang password yang diinginkan',
      'Centang jenis karakter yang disertakan',
      'Klik tombol "Generate"',
      'Salin password yang dihasilkan'
    ],
    icon: 'Key',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Berapa panjang password yang ideal?', answer: 'Password minimal 12 karakter dengan campuran huruf besar, kecil, angka, dan simbol sangat direkomendasikan.' },
      { question: 'Apakah password disimpan?', answer: 'Tidak, semua pemrosesan dilakukan di browser Anda. Password tidak pernah dikirim atau disimpan di server kami.' }
    ],
    keywords: ['buat password', 'password generator', 'generate password', 'kata sandi kuat'],
    relatedToolSlugs: ['password-strength-checker', 'uuid-generator', 'hash-generator']
  },
  {
    slug: 'password-strength-checker',
    name: 'Password Strength Checker',
    category: 'security',
    shortDescription: 'Periksa kekuatan password Anda',
    description: 'Analisis kekuatan password berdasarkan panjang, kompleksitas, dan pola. Dapatkan skor keamanan dan saran untuk memperkuat password.',
    benefits: [
      'Cek kekuatan password instan',
      'Saran perbaikan keamanan',
      'Deteksi password lemah'
    ],
    howItWorks: [
      'Masukkan password yang akan diperiksa',
      'Analisis akan muncul secara real-time',
      'Lihat skor dan level kekuatan',
      'Ikuti saran untuk memperkuat password'
    ],
    icon: 'ShieldCheck',
    processingType: 'client',
    faq: [
      { question: 'Apa kriteria password kuat?', answer: 'Password kuat memiliki minimal 12 karakter, kombinasi huruf besar/kecil, angka, dan simbol, serta tidak menggunakan kata umum.' }
    ],
    keywords: ['cek password', 'password strength', 'kekuatan kata sandi', 'uji password'],
    relatedToolSlugs: ['password-generator', 'text-encryptor']
  },
  {
    slug: 'hash-generator-security',
    name: 'Hash Generator (Security)',
    category: 'security',
    shortDescription: 'Hash teks dengan algoritma keamanan',
    description: 'Hasilkan hash dari teks sensitif menggunakan algoritma kriptografi. Cocok untuk menyimpan password dan verifikasi integritas data.',
    benefits: [
      'Hash teks untuk penyimpanan aman',
      'Dukung algoritma modern',
      'Verifikasi integritas data'
    ],
    howItWorks: [
      'Tempel teks yang akan di-hash',
      'Pilih algoritma (SHA-256, SHA-512, bcrypt)',
      'Hash akan dihasilkan otomatis',
      'Salin hash untuk digunakan'
    ],
    icon: 'Hash',
    processingType: 'client',
    faq: [
      { question: 'Apa perbedaan hash dan enkripsi?', answer: 'Hash bersifat satu arah (tidak bisa dikembalikan), sedangkan enkripsi bisa didekripsi dengan kunci. Hash cocok untuk penyimpanan password.' }
    ],
    keywords: ['hash keamanan', 'security hash', 'sha256', 'hash password'],
    relatedToolSlugs: ['password-generator', 'text-encryptor', 'password-strength-checker']
  },
  {
    slug: 'text-encryptor',
    name: 'Text Encryptor',
    category: 'security',
    shortDescription: 'Enkripsi dan dekripsi teks dengan password',
    description: 'Enkripsi teks sensitif menggunakan AES dengan password. Lindungi data pribadi Anda dan dekripsi saat diperlukan dengan password yang sama.',
    benefits: [
      'Enkripsi teks dengan AES',
      'Lindungi data sensitif',
      'Dekripsi dengan password'
    ],
    howItWorks: [
      'Masukkan teks yang akan dienkripsi',
      'Buat password enkripsi yang kuat',
      'Klik tombol "Encrypt"',
      'Simpan teks terenkripsi dan password'
    ],
    icon: 'Lock',
    processingType: 'client',
    faq: [
      { question: 'Apakah data saya aman?', answer: 'Ya, semua enkripsi dilakukan di browser Anda. Teks dan password tidak pernah dikirim ke server.' },
      { question: 'Bisakah saya mendekripsi teks?', answer: 'Ya, tempel teks terenkripsi dan masukkan password yang sama untuk mendekripsinya.' }
    ],
    keywords: ['enkripsi teks', 'encrypt text', 'dekripsi', 'aes encryption'],
    relatedToolSlugs: ['password-generator', 'hash-generator-security']
  },
  {
    slug: 'file-hash-checker',
    name: 'File Hash Checker',
    category: 'security',
    shortDescription: 'Verifikasi integritas file dengan hash',
    description: 'Hitung checksum file untuk verifikasi integritas. Bandingkan hash file Anda dengan hash yang disediakan untuk memastikan file tidak berubah.',
    benefits: [
      'Verifikasi integritas file',
      'Deteksi perubahan file',
      'Dukung MD5, SHA-1, SHA-256'
    ],
    howItWorks: [
      'Unggah file yang akan diperiksa',
      'Pilih algoritma hash',
      'Hash file akan dihitung otomatis',
      'Bandingkan dengan hash referensi'
    ],
    icon: 'FileSearch',
    processingType: 'client',
    acceptedFileTypes: ['.*'],
    maxFileSizeMB: 100,
    maxFiles: 1,
    faq: [
      { question: 'Apa itu file hash?', answer: 'File hash adalah sidik jari digital unik dari sebuah file. Jika file berubah, hash-nya akan berbeda.' }
    ],
    keywords: ['cek hash file', 'file hash', 'verifikasi file', 'checksum'],
    relatedToolSlugs: ['hash-generator-security', 'text-encryptor']
  },
];
