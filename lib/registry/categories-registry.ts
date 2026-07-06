import { CategoryConfig } from '@/types/category';

export const categoriesRegistry: CategoryConfig[] = [
  { slug: 'pdf', name: 'PDF Tools', description: 'Kelola dokumen PDF dengan mudah — merge, split, compress, konversi, dan edit PDF.', icon: 'FileText', colorClass: 'bg-red-50 text-red-600', accentHex: '#dc2626' },
  { slug: 'image', name: 'Image Tools', description: 'Edit, kompres, konversi, dan optimalkan gambar secara instan.', icon: 'Image', colorClass: 'bg-blue-50 text-blue-600', accentHex: '#2563eb' },
  { slug: 'text', name: 'Text Tools', description: 'Olah teks secara real-time — hitung kata, konversi huruf, dan banyak lagi.', icon: 'Type', colorClass: 'bg-green-50 text-green-600', accentHex: '#16a34a' },
  { slug: 'developer', name: 'Developer Tools', description: 'Utilitas harian untuk developer — formatter, encoder, generator, dan validator.', icon: 'Code2', colorClass: 'bg-purple-50 text-purple-600', accentHex: '#9333ea' },
  { slug: 'office', name: 'Office Tools', description: 'Konversi dokumen perkantoran antar format dengan cepat.', icon: 'FileSpreadsheet', colorClass: 'bg-orange-50 text-orange-600', accentHex: '#ea580c' },
  { slug: 'calculator', name: 'Calculator', description: 'Kalkulator untuk berbagai kebutuhan — BMI, persentase, konversi unit, dan lainnya.', icon: 'Calculator', colorClass: 'bg-teal-50 text-teal-600', accentHex: '#0d9488' },
  { slug: 'color', name: 'Color Tools', description: 'Palet warna, gradient, konversi warna, dan alat bantu desain lainnya.', icon: 'Palette', colorClass: 'bg-pink-50 text-pink-600', accentHex: '#db2777' },
  { slug: 'qr', name: 'QR Tools', description: 'Buat dan pindai QR Code & Barcode untuk berbagai keperluan.', icon: 'QrCode', colorClass: 'bg-indigo-50 text-indigo-600', accentHex: '#4f46e5' },
  { slug: 'security', name: 'Security Tools', description: 'Password, hash, enkripsi, dan alat keamanan digital lainnya.', icon: 'ShieldCheck', colorClass: 'bg-slate-50 text-slate-600', accentHex: '#475569' },
];
