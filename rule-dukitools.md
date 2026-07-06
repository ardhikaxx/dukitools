# RULE-DUKITOOLS.md
## Blueprint Arsitektur Sistem — DukiTools
### "All Your Online Tools in One Place"

**Versi:** 1.0
**Tipe Proyek:** Web Platform — Multi-Tool Utility Suite
**Status:** Architecture Blueprint (Tahap sebelum `design-dukitools.md`)

---

## 1. RINGKASAN ARSITEKTUR

| Aspek | Keputusan Arsitektur |
|---|---|
| Framework Utama | Next.js 14+ (App Router) |
| UI Library | React 18+ |
| Styling | Tailwind CSS (utility-first, tanpa custom CSS berlebihan) |
| Ikon | Lucide React |
| Autentikasi | **Tidak ada** — seluruh sistem bersifat *no-login, no-registration* |
| State Management | Local component state + custom hooks (tanpa Redux/global store berat) |
| Notifikasi | Toast system kustom (single source of truth untuk semua feedback) |
| Processing Model | Hybrid — **Client-side** untuk tool ringan, **Server-side/API** untuk tool berat |
| Penyimpanan File | **Stateless** — tidak ada penyimpanan permanen, auto-delete dengan TTL |
| Backend Pemrosesan File | Next.js Route Handlers + microservice terpisah untuk tugas berat (opsional) |
| SEO | Metadata dinamis per tool, JSON-LD, sitemap otomatis dari registry |
| Skalabilitas | Tool Registry Pattern — menambah tool baru tidak mengubah struktur inti |

**Filosofi inti:** DukiTools dibangun di atas satu prinsip arsitektural tunggal — **Tool Registry sebagai single source of truth**. Setiap tool baru (dari 20 hingga 500 tools) hanya perlu ditambahkan sebagai entri konfigurasi + satu file logika, tanpa menyentuh layout, navigasi, SEO generator, atau sitemap. Ini adalah keputusan arsitektur paling penting dalam dokumen ini dan menjadi dasar dari seluruh bagian selanjutnya.

---

## 2. TECH STACK & JUSTIFIKASI

| Teknologi | Peran | Alasan Pemilihan |
|---|---|---|
| **Next.js (App Router)** | Framework inti | Server Components untuk konten statis (judul, deskripsi, FAQ) → SEO maksimal; Client Components hanya untuk area interaktif (upload/input/hasil) → bundle size minimal per halaman |
| **React** | UI Library | Component reusability tinggi, ekosistem matang untuk komponen interaktif (drag-drop upload, real-time filter) |
| **Tailwind CSS** | Styling | Utility-first mempercepat development ratusan halaman tool tanpa file CSS terpisah yang membengkak |
| **Lucide React** | Icon set | Tree-shakable, ringan, konsisten secara visual di seluruh tool |
| **TypeScript** | Type safety | Registry tool & kategori memerlukan tipe data yang konsisten agar aman saat proyek berskala besar |
| **Zustand (ringan)** | Toast store global | Dipilih dibanding Context API murni karena re-render lebih efisien untuk notifikasi yang sering muncul |
| **Web Workers (opsional)** | Proses berat di browser | Untuk tool client-side yang butuh komputasi besar (misal kompresi gambar besar) agar UI tidak freeze |
| **Sharp / pdf-lib / LibreOffice headless** | Backend processing | Library pemrosesan file di sisi server untuk PDF, Office, dan gambar |
| **BullMQ + Redis (opsional, skala besar)** | Job queue | Untuk tool berat (Remove Background AI, konversi Office) agar tidak membebani request-response langsung |

> **Catatan penting:** Next.js App Router dipilih bukan hanya karena performa, tetapi karena kemampuannya memisahkan **konten statis SEO** (Server Component) dari **interaksi tool** (Client Component) di halaman yang sama — ini krusial karena setiap satu dari ratusan halaman tool harus tetap SEO-friendly meski sebagian besar kontennya interaktif.

---

## 3. STRUKTUR FOLDER PROYEK

```
dukitools/
├── app/
│   ├── (marketing)/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-of-service/page.tsx
│   │   └── disclaimer/page.tsx
│   │
│   ├── (tools)/
│   │   ├── pdf/
│   │   │   ├── page.tsx                    # Halaman kategori PDF Tools
│   │   │   ├── merge-pdf/page.tsx
│   │   │   ├── split-pdf/page.tsx
│   │   │   ├── compress-pdf/page.tsx
│   │   │   ├── rotate-pdf/page.tsx
│   │   │   ├── unlock-pdf/page.tsx
│   │   │   ├── protect-pdf/page.tsx
│   │   │   ├── pdf-to-word/page.tsx
│   │   │   ├── word-to-pdf/page.tsx
│   │   │   └── ... (setiap tool = 1 folder)
│   │   ├── image/
│   │   │   ├── page.tsx
│   │   │   ├── compress-image/page.tsx
│   │   │   ├── resize-image/page.tsx
│   │   │   ├── crop-image/page.tsx
│   │   │   ├── remove-background/page.tsx
│   │   │   ├── convert-image/page.tsx
│   │   │   └── ...
│   │   ├── text/
│   │   ├── developer/
│   │   ├── office/
│   │   ├── calculator/
│   │   ├── color/
│   │   ├── qr/
│   │   └── security/
│   │
│   ├── api/
│   │   ├── pdf/
│   │   │   ├── merge/route.ts
│   │   │   ├── split/route.ts
│   │   │   ├── compress/route.ts
│   │   │   └── pdf-to-word/route.ts
│   │   ├── image/
│   │   │   ├── compress/route.ts
│   │   │   ├── remove-bg/route.ts
│   │   │   └── convert/route.ts
│   │   ├── office/
│   │   │   └── convert/route.ts
│   │   └── cleanup/route.ts               # Endpoint cron pembersihan file temp
│   │
│   ├── layout.tsx                          # Root layout (Navbar + Footer + ToastProvider)
│   ├── page.tsx                             # Homepage
│   ├── sitemap.ts                           # Auto-generate dari tools-registry.ts
│   ├── robots.ts
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── ResultCard.tsx
│   │
│   ├── toast/
│   │   ├── ToastProvider.tsx
│   │   ├── Toast.tsx
│   │   └── toastStore.ts
│   │
│   ├── tools/
│   │   ├── ToolLayout.tsx                  # Template universal semua halaman tool
│   │   ├── ToolCard.tsx
│   │   ├── ToolHeader.tsx
│   │   ├── ToolFAQ.tsx
│   │   ├── ToolActions.tsx                 # Download / Copy / Reset
│   │   └── CategoryGrid.tsx
│   │
│   └── home/
│       ├── HeroSection.tsx
│       ├── PopularTools.tsx
│       ├── NewTools.tsx
│       └── CategoryCards.tsx
│
├── lib/
│   ├── registry/
│   │   ├── tools-registry.ts               # SUMBER KEBENARAN UTAMA seluruh tool
│   │   └── categories-registry.ts
│   ├── validators/
│   │   ├── file-validator.ts
│   │   └── input-validator.ts
│   ├── processors/
│   │   ├── client/                         # Logika proses di browser
│   │   │   ├── json-formatter.ts
│   │   │   ├── base64.ts
│   │   │   ├── password-generator.ts
│   │   │   └── ...
│   │   └── server/                         # Wrapper panggilan ke API
│   │       ├── pdf-service.ts
│   │       ├── image-service.ts
│   │       └── office-service.ts
│   └── utils/
│       ├── formatBytes.ts
│       ├── cn.ts
│       ├── debounce.ts
│       └── generateMetadata.ts
│
├── hooks/
│   ├── useToolState.ts                     # State machine generik semua tool
│   ├── useFileUpload.ts
│   ├── useDebounce.ts
│   └── useToolSearch.ts
│
├── types/
│   ├── tool.ts
│   ├── category.ts
│   └── toast.ts
│
├── public/
│   └── icons/
│
├── next.config.js
├── tailwind.config.ts
└── package.json
```

**Alasan struktur ini:** Folder `(tools)` menggunakan *route group* Next.js sehingga tidak memengaruhi URL, tetapi mengelompokkan seluruh tool secara fisik agar navigasi kode tetap mudah walau jumlah tool mencapai ratusan. Setiap kategori = 1 folder, setiap tool = 1 sub-folder dengan `page.tsx` sendiri, sehingga tim (atau AI assistant) dapat mengembangkan satu tool tanpa risiko merusak tool lain.

---

## 4. STRUKTUR ROUTING & URL PATTERN

| Jenis Halaman | Pattern URL | Contoh |
|---|---|---|
| Homepage | `/` | `dukitools.com/` |
| Halaman Kategori | `/{category}` | `/pdf`, `/image`, `/developer` |
| Halaman Tool | `/{category}/{tool-slug}` | `/pdf/merge-pdf`, `/image/compress-image`, `/developer/json-formatter` |
| Halaman Statis | `/{page-slug}` | `/about`, `/privacy-policy`, `/contact` |

**Aturan penulisan slug:**
- Selalu huruf kecil (lowercase)
- Pemisah kata menggunakan tanda hubung (`-`), bukan underscore
- Slug bersifat deskriptif dan mengandung keyword pencarian (`compress-pdf`, bukan `tool1` atau `cp`)
- Slug **tidak boleh diubah** setelah publish (untuk menjaga SEO ranking), jika tool di-rename, gunakan redirect permanen (301) di `next.config.js`

---

## 5. TOOL REGISTRY PATTERN (Inti Skalabilitas)

Ini adalah **jantung arsitektur DukiTools**. Seluruh halaman kategori, homepage, search, breadcrumb, sitemap, dan metadata SEO **tidak ditulis manual satu per satu**, melainkan di-*generate* dari satu file registry terpusat.

### 5.1 Tipe Data

```typescript
// types/tool.ts
export type ProcessingType = 'client' | 'server';

export type CategorySlug =
  | 'pdf' | 'image' | 'text' | 'developer'
  | 'office' | 'calculator' | 'color' | 'qr' | 'security';

export interface ToolConfig {
  slug: string;                    // "merge-pdf"
  name: string;                    // "Merge PDF"
  category: CategorySlug;          // "pdf"
  shortDescription: string;        // untuk card di homepage
  description: string;             // untuk hero area halaman tool
  benefits: string[];              // daftar manfaat, tampil di halaman tool
  icon: string;                    // nama ikon Lucide, misal "FileText"
  processingType: ProcessingType;
  acceptedFileTypes?: string[];    // [".pdf"], [".jpg", ".png", ".webp"]
  maxFileSizeMB?: number;
  maxFiles?: number;
  isPopular?: boolean;
  isNew?: boolean;
  faq: { question: string; answer: string }[];
  keywords: string[];              // untuk SEO & search index
}
```

```typescript
// types/category.ts
export interface CategoryConfig {
  slug: CategorySlug;
  name: string;                    // "PDF Tools"
  description: string;
  icon: string;
  colorClass: string;              // kelas Tailwind, misal "bg-red-50 text-red-600"
}
```

### 5.2 Contoh Isi Registry

```typescript
// lib/registry/tools-registry.ts
import { ToolConfig } from '@/types/tool';

export const toolsRegistry: ToolConfig[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    shortDescription: 'Gabungkan beberapa file PDF menjadi satu file.',
    description: 'Merge PDF memungkinkan Anda menggabungkan beberapa dokumen PDF menjadi satu file secara instan tanpa perlu login.',
    benefits: [
      'Proses cepat tanpa instalasi software',
      'File otomatis terhapus setelah diproses',
      'Mendukung penggabungan hingga 20 file sekaligus',
    ],
    icon: 'FilesIcon',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    maxFileSizeMB: 25,
    maxFiles: 20,
    isPopular: true,
    faq: [
      { question: 'Apakah file saya disimpan di server?', answer: 'Tidak. File otomatis dihapus setelah proses selesai.' },
    ],
    keywords: ['merge pdf', 'gabung pdf', 'combine pdf'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'developer',
    shortDescription: 'Rapikan dan validasi format JSON secara instan.',
    description: 'JSON Formatter membantu Anda memformat, memvalidasi, dan membaca struktur JSON secara real-time langsung di browser.',
    benefits: ['Proses instan tanpa upload ke server', 'Mendeteksi error sintaks JSON', 'Mendukung minify & beautify'],
    icon: 'Braces',
    processingType: 'client',
    isPopular: true,
    faq: [],
    keywords: ['json formatter', 'json beautify', 'json validator'],
  },
  // ... ratusan entri tool lainnya mengikuti pola yang sama
];
```

```typescript
// lib/registry/categories-registry.ts
import { CategoryConfig } from '@/types/category';

export const categoriesRegistry: CategoryConfig[] = [
  { slug: 'pdf', name: 'PDF Tools', description: 'Kelola dokumen PDF dengan mudah.', icon: 'FileText', colorClass: 'bg-red-50 text-red-600' },
  { slug: 'image', name: 'Image Tools', description: 'Edit dan konversi gambar secara instan.', icon: 'Image', colorClass: 'bg-blue-50 text-blue-600' },
  { slug: 'text', name: 'Text Tools', description: 'Olah teks secara real-time.', icon: 'Type', colorClass: 'bg-green-50 text-green-600' },
  { slug: 'developer', name: 'Developer Tools', description: 'Utilitas harian untuk developer.', icon: 'Code2', colorClass: 'bg-purple-50 text-purple-600' },
  { slug: 'office', name: 'Office Tools', description: 'Konversi dokumen perkantoran.', icon: 'FileSpreadsheet', colorClass: 'bg-orange-50 text-orange-600' },
  { slug: 'calculator', name: 'Calculator', description: 'Kalkulator untuk berbagai kebutuhan.', icon: 'Calculator', colorClass: 'bg-teal-50 text-teal-600' },
  { slug: 'color', name: 'Color Tools', description: 'Palet warna, gradient, dan konversi warna.', icon: 'Palette', colorClass: 'bg-pink-50 text-pink-600' },
  { slug: 'qr', name: 'QR Tools', description: 'Buat dan pindai QR Code & Barcode.', icon: 'QrCode', colorClass: 'bg-indigo-50 text-indigo-600' },
  { slug: 'security', name: 'Security Tools', description: 'Password, hash, dan enkripsi.', icon: 'ShieldCheck', colorClass: 'bg-slate-50 text-slate-600' },
];
```

### 5.3 Dampak Arsitektural dari Registry Pattern

Karena seluruh data terpusat di dua file ini:

- **Homepage** → render `CategoryCards` dari `categoriesRegistry`, render `PopularTools` dari `toolsRegistry.filter(t => t.isPopular)`
- **Halaman kategori** (`/pdf`) → render seluruh tool dengan `category === 'pdf'`
- **Search bar global** → filter `toolsRegistry` berdasarkan `name` + `keywords` secara real-time di client
- **Sitemap** (`sitemap.ts`) → generate URL otomatis dari seluruh entri registry, tidak perlu ditulis manual
- **Metadata SEO** → `generateMetadata()` di setiap `page.tsx` tool cukup memanggil `getToolBySlug(slug)` dari registry

**Menambah tool baru = menambah 1 objek di registry + 1 file komponen logic.** Tidak ada file lain yang perlu disentuh.

---

## 6. SISTEM LAYOUT GLOBAL

Layout tunggal diterapkan di `app/layout.tsx` dan berlaku pada seluruh halaman:

```
┌─────────────────────────────────────────┐
│  Navbar (sticky, selalu terlihat)        │
├─────────────────────────────────────────┤
│  [Hanya di Homepage] Hero Section        │
│  [Hanya di Homepage] Search Bar Global   │
├─────────────────────────────────────────┤
│  Konten Utama (bervariasi per halaman)   │
├─────────────────────────────────────────┤
│  FAQ Section (khusus halaman tool)       │
├─────────────────────────────────────────┤
│  Footer                                  │
└─────────────────────────────────────────┘
```

### 6.1 Navbar
- Posisi `sticky top-0 z-50`, dengan efek `backdrop-blur` + shadow tipis saat scroll
- Berisi: Logo, Search icon/box ringkas, Menu kategori (dropdown), tautan cepat ke tool populer
- Di mobile: berubah menjadi hamburger menu dengan drawer kategori

### 6.2 Footer
- Kolom "Tentang DukiTools" (deskripsi singkat + tagline)
- Kolom "Kategori Tools" (tautan ke seluruh halaman kategori)
- Kolom "Perusahaan" (About, Contact)
- Kolom "Legal" (Privacy Policy, Terms of Service, Disclaimer)
- Baris bawah: copyright & tahun berjalan (`{new Date().getFullYear()}`)

---

## 7. ARSITEKTUR HOMEPAGE

Homepage (`app/page.tsx`) adalah **Server Component** murni untuk bagian statis, dengan satu **Client Component** kecil (`SearchBar`) untuk interaktivitas.

**Susunan section:**

1. **Hero Section** — Judul besar "All Your Online Tools in One Place", sub-headline, dan search bar utama
2. **Search Bar Global (Real-time)** — filter instan tanpa reload, lihat detail di §7.1
3. **Category Cards Grid** — seluruh kategori dari `categoriesRegistry`, masing-masing menampilkan ikon, nama, jumlah tool di dalamnya
4. **Popular Tools** — tool dengan `isPopular: true`, ditampilkan sebagai `ToolCard`
5. **New Tools** — tool dengan `isNew: true`
6. **Value Proposition Section** — 3–4 poin keunggulan (tanpa login, gratis, cepat, aman) dalam bentuk ikon + teks singkat

### 7.1 Mekanisme Search Real-Time

```typescript
// hooks/useToolSearch.ts
import { useState, useMemo } from 'react';
import { toolsRegistry } from '@/lib/registry/tools-registry';

export function useToolSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return toolsRegistry.filter(tool =>
      tool.name.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 8); // batasi hasil agar dropdown tetap ringkas
  }, [query]);

  return { query, setQuery, results };
}
```

Pencarian dijalankan sepenuhnya di client menggunakan data registry yang sudah tersedia di bundle (tidak perlu API call), sehingga hasil muncul instan tanpa delay jaringan. Untuk skala ratusan tool, ini tetap ringan karena hanya operasi `filter()` pada array string.

**ToolCard wajib memuat:** ikon tool (konsisten ukuran/style), nama tool, deskripsi singkat 1 baris, dan tombol **"Open Tool"** yang mengarah ke halaman tool.

---

## 8. TEMPLATE UNIVERSAL HALAMAN TOOL

Setiap satu dari ratusan halaman tool menggunakan komponen `ToolLayout` yang sama, sehingga pengalaman pengguna identik di seluruh platform.

### 8.1 Struktur Halaman Tool

```
1. Breadcrumb (Home > Kategori > Nama Tool)
2. ToolHeader
   - Judul tool (H1, untuk SEO)
   - Deskripsi singkat
   - Daftar manfaat (bullet points)
3. Area Kerja Utama (Client Component)
   - Input/Upload Area
   - [State: idle] → tampilan upload/drop-zone
   - [State: processing] → LoadingSpinner + progress info
   - [State: success] → ResultCard + ToolActions (Download/Copy/Reset)
   - [State: error] → ErrorState + tombol coba lagi
4. Penjelasan "Cara Kerja Tool" (konten SEO, Server Component)
5. FAQ Section (dari registry.faq)
6. Related Tools (tool lain dalam kategori yang sama)
```

### 8.2 Contoh Implementasi (page.tsx tool "compress-pdf")

```tsx
// app/(tools)/pdf/compress-pdf/page.tsx
import { getToolBySlug } from '@/lib/registry/tools-registry';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import CompressPdfWorkspace from './CompressPdfWorkspace'; // Client Component

const tool = getToolBySlug('compress-pdf')!;

export const metadata = generateToolMetadata(tool);

export default function CompressPdfPage() {
  return (
    <ToolLayout tool={tool}>
      <CompressPdfWorkspace />
    </ToolLayout>
  );
}
```

```tsx
// app/(tools)/pdf/compress-pdf/CompressPdfWorkspace.tsx
'use client';

import { useToolState } from '@/hooks/useToolState';
import FileUpload from '@/components/ui/FileUpload';
import ResultCard from '@/components/ui/ResultCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/toast/toastStore';
import { validateFile } from '@/lib/validators/file-validator';

export default function CompressPdfWorkspace() {
  const { state, setInput, setProcessing, setSuccess, setError, reset } = useToolState<File, { url: string; sizeBefore: number; sizeAfter: number }>();
  const toast = useToast();

  async function handleFileSelected(file: File) {
    const validation = validateFile(file, { allowedExtensions: ['.pdf'], maxSizeBytes: 25 * 1024 * 1024, allowedTypes: ['application/pdf'] });
    if (!validation.valid) {
      toast.warning(validation.error!);
      return;
    }
    setInput(file);
    setProcessing();
    toast.info('File sedang diproses...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/pdf/compress', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Gagal mengompresi file');
      const data = await res.json();
      setSuccess(data);
      toast.success('File berhasil dikompresi!');
    } catch (err) {
      setError('Terjadi kesalahan saat memproses file. Coba lagi.');
      toast.error('Proses kompresi gagal. Silakan coba lagi.');
    }
  }

  if (state.status === 'idle') return <FileUpload onFileSelected={handleFileSelected} accept=".pdf" />;
  if (state.status === 'processing') return <LoadingSpinner label="Mengompresi file PDF..." />;
  if (state.status === 'success') return <ResultCard result={state.result} onReset={reset} />;
  if (state.status === 'error') return <ErrorStateBlock message={state.errorMessage} onRetry={reset} />;
}
```

**Poin arsitektural penting:** `page.tsx` tetap Server Component (baik untuk SEO — judul, deskripsi, FAQ dirender di server), sementara logika interaktif dipisah ke Client Component terpisah (`*Workspace.tsx`). Pola ini diulang identik di seluruh tool, sehingga developer baru (atau AI assistant) dapat membangun tool baru hanya dengan menyalin pola ini.

---

## 9. STATE MACHINE UNIVERSAL (`useToolState`)

Semua tool — apa pun jenisnya — menggunakan satu hook state generik yang sama, agar perilaku antar tool 100% konsisten.

```typescript
// hooks/useToolState.ts
import { useState, useCallback } from 'react';

export type ToolStatus = 'idle' | 'validating' | 'processing' | 'success' | 'error';

interface ToolStateShape<TInput, TResult> {
  input: TInput | null;
  result: TResult | null;
  status: ToolStatus;
  errorMessage: string | null;
  progress: number;
}

export function useToolState<TInput = unknown, TResult = unknown>() {
  const [state, setState] = useState<ToolStateShape<TInput, TResult>>({
    input: null,
    result: null,
    status: 'idle',
    errorMessage: null,
    progress: 0,
  });

  const setInput = useCallback((input: TInput) => setState(s => ({ ...s, input })), []);
  const setProcessing = useCallback(() => setState(s => ({ ...s, status: 'processing', errorMessage: null })), []);
  const setProgress = useCallback((progress: number) => setState(s => ({ ...s, progress })), []);
  const setSuccess = useCallback((result: TResult) => setState(s => ({ ...s, status: 'success', result, progress: 100 })), []);
  const setError = useCallback((errorMessage: string) => setState(s => ({ ...s, status: 'error', errorMessage })), []);
  const reset = useCallback(() => setState({ input: null, result: null, status: 'idle', errorMessage: null, progress: 0 }), []);

  return { state, setInput, setProcessing, setProgress, setSuccess, setError, reset };
}
```

Setiap tool minimal memiliki lima state ini: `input`, `result`, `status` (loading/error/success), dan `progress`. Tombol **Reset** selalu memanggil fungsi `reset()` yang sama sehingga perilaku "mulai ulang tanpa refresh halaman" konsisten di seluruh platform.

---

## 10. STRATEGI PEMROSESAN: CLIENT-SIDE vs SERVER-SIDE

Keputusan ini ditentukan **per tool** melalui field `processingType` di registry, dan menjadi salah satu keputusan arsitektur paling berdampak pada biaya server & kecepatan.

### 10.1 Tool Client-Side (Diproses 100% di Browser)

| Kategori | Contoh Tool | Library Browser |
|---|---|---|
| Developer | JSON Formatter, JSON Validator, Base64 Encoder/Decoder, JWT Decoder, UUID Generator, SQL Formatter, HTML/CSS/JS Formatter, XML Formatter, Regex Tester, Hash Generator (SHA256/MD5) | `crypto.subtle`, native JS |
| Text | Word Counter, Case Converter, Text Diff Checker, Lorem Ipsum Generator, Text Reverser, Slug Generator | Native JS |
| Calculator | Semua kalkulator (BMI, Percentage, Age, Unit Converter, dsb) | Native JS |
| Color | HEX↔RGB Converter, Gradient Generator, Palette Generator, Contrast Checker | Native JS / Canvas API |
| Security | Password Generator, Password Strength Checker, Hash Generator | `crypto.subtle` |
| QR | QR Code Generator (untuk teks/URL sederhana) | `qrcode` (client bundle kecil) |

**Karakteristik:** tidak ada request ke server sama sekali → respons instan, tidak membebani infrastruktur, cocok untuk komputasi ringan. Jika perlu, komputasi berat (misal generate ribuan hash) dijalankan di **Web Worker** agar UI thread tidak freeze.

### 10.2 Tool Server-Side (Memerlukan Backend API)

| Kategori | Contoh Tool | Library Server |
|---|---|---|
| PDF | Merge, Split, Compress, Rotate, Unlock, Protect, PDF↔Word, PDF↔Excel | `pdf-lib`, `pdf-poppler`, atau layanan konversi |
| Image | Remove Background, Compress (untuk file besar), Convert HEIC, Upscale AI | `sharp`, model ML (rembg/U2Net via microservice Python) |
| Office | Excel↔CSV, Word↔PDF, PowerPoint↔PDF | LibreOffice headless / `exceljs` |

**Karakteristik:** membutuhkan komputasi berat yang tidak realistis dijalankan di browser (terutama untuk file besar atau proses yang butuh library native seperti LibreOffice), sehingga diarahkan ke Route Handler Next.js atau microservice terpisah.

> **Catatan desain:** field `processingType` di registry secara otomatis menentukan komponen mana yang dirender — jika `client`, `ToolLayout` tidak menampilkan area upload dengan progress bar jaringan; jika `server`, otomatis ditambahkan indikator upload + estimasi waktu proses.

---

## 11. VALIDASI FILE UPLOAD

Validasi dilakukan **dua lapis**: di frontend (mencegah request sia-sia) dan di backend (mencegah bypass keamanan).

### 11.1 Aturan Validasi per Kategori

| Kategori Tool | Format Diterima | Ukuran Maksimum | Jumlah File Maksimum |
|---|---|---|---|
| PDF Tools | `.pdf` | 25 MB | 20 file (khusus Merge) |
| Word/Office | `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` | 20 MB | 1 file |
| Image Tools | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic` | 15 MB | 1–10 file (tergantung tool) |
| QR/Security | (tidak ada upload file, hanya input teks) | — | — |

### 11.2 Fungsi Validator

```typescript
// lib/validators/file-validator.ts
interface FileValidationRule {
  allowedTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
  minSizeBytes?: number;
}

export function validateFile(file: File, rule: FileValidationRule): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: 'File kosong atau tidak valid.' };
  }
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!rule.allowedExtensions.includes(ext)) {
    return { valid: false, error: `Format file tidak didukung. Gunakan format: ${rule.allowedExtensions.join(', ')}` };
  }
  if (file.size > rule.maxSizeBytes) {
    return { valid: false, error: `Ukuran file melebihi batas maksimum ${Math.round(rule.maxSizeBytes / 1024 / 1024)}MB.` };
  }
  return { valid: true };
}
```

**Validasi backend (di Route Handler)** mengulang pemeriksaan yang sama menggunakan *magic bytes* (bukan hanya ekstensi nama file) agar tidak dapat dibypass dengan mengubah nama file secara manual, misal menggunakan library `file-type` untuk mendeteksi signature asli file.

---

## 12. SISTEM TOAST NOTIFICATION

Toast adalah **satu-satunya** mekanisme pemberitahuan di seluruh platform — tidak ada `alert()` bawaan browser sama sekali.

### 12.1 Spesifikasi Visual

| Tipe | Ikon (Lucide) | Warna | Kapan Digunakan |
|---|---|---|---|
| Success | `CheckCircle2` | Hijau (`#16a34a`) | File berhasil dikonversi, hasil disalin ke clipboard, QR berhasil dibuat, password digenerate, file berhasil diunduh |
| Error | `XCircle` | Merah (`#dc2626`) | Konversi gagal, server sibuk, format tidak didukung, file rusak, koneksi terputus, ukuran melebihi batas |
| Warning | `AlertTriangle` | Kuning (`#ca8a04`) | Belum memilih file, input belum lengkap, teks kosong |
| Info | `Info` | Biru (`#2563eb`) | Proses sedang berlangsung, file sedang dipersiapkan |

**Aturan perilaku umum:**
- Posisi: pojok kanan atas (`top-4 right-4`)
- Durasi otomatis: 3–5 detik (default 4000ms), dapat dikonfigurasi per pemanggilan
- Dapat ditutup manual (tombol × pada toast)
- Maksimum 3 toast tampil bersamaan (antrian FIFO — toast lama otomatis hilang jika toast baru muncul)
- Animasi masuk: slide-in dari kanan + fade; animasi keluar: fade-out + collapse halus

### 12.2 Implementasi Store

```typescript
// components/toast/toastStore.ts
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (type: ToastType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const MAX_TOASTS = 3;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (type, message, duration = 4000) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, type, message, duration }].slice(-MAX_TOASTS) }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

// Helper hook agar pemanggilan lebih ringkas di komponen tool
export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    success: (msg: string) => push('success', msg),
    error: (msg: string) => push('error', msg),
    warning: (msg: string) => push('warning', msg),
    info: (msg: string) => push('info', msg),
  };
}
```

---

## 13. ARSITEKTUR BACKEND UNTUK PEMROSESAN FILE

### 13.1 Dua Tingkat Backend

```
┌───────────────────────────┐
│   Next.js Route Handlers   │  ← Tier 1: proses ringan-menengah (Compress PDF kecil, Convert Image)
│   (app/api/**/route.ts)   │
└─────────────┬─────────────┘
              │ delegasi jika proses berat
              ▼
┌───────────────────────────┐
│  Microservice Terpisah     │  ← Tier 2: proses berat (Remove Background AI,
│  (Node/Express atau        │     konversi Office via LibreOffice headless,
│   Python FastAPI)          │     OCR, upscaling AI)
└───────────────────────────┘
```

**Alasan pemisahan dua tingkat:** Route Handler Next.js dijalankan di lingkungan serverless/edge yang memiliki batas waktu eksekusi dan memori terbatas — cocok untuk tugas ringan-menengah. Tugas yang butuh dependency berat (LibreOffice, model ML Python untuk Remove Background) dijalankan di service terpisah yang dapat di-scale independen dan tidak membebani proses request-response utama.

### 13.2 Contoh Route Handler (Tier 1)

```typescript
// app/api/pdf/compress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { compressPdfBuffer } from '@/lib/processors/server/pdf-service';
import { validateFileServerSide } from '@/lib/validators/file-validator';

export const runtime = 'nodejs';
export const maxDuration = 30; // detik

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const validation = validateFileServerSide(buffer, file.name, { allowedExtensions: ['.pdf'], maxSizeBytes: 25 * 1024 * 1024 });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const result = await compressPdfBuffer(buffer);
    // File hasil disimpan sementara dengan TTL, lihat §14
    return NextResponse.json({
      downloadUrl: result.tempUrl,
      sizeBefore: buffer.length,
      sizeAfter: result.compressedSize,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memproses file PDF.' }, { status: 500 });
  }
}
```

### 13.3 Untuk Proses Berat via Job Queue (Opsional, Skala Besar)

Jika traffic bertambah besar (misal tool "Remove Background" dipanggil ribuan kali/jam), pola sinkron di atas diganti dengan job queue:

1. Route Handler menerima file → simpan sementara → masukkan job ke **BullMQ (Redis)** → kembalikan `jobId`
2. Frontend polling `GET /api/jobs/{jobId}/status` setiap 1–2 detik, atau menggunakan WebSocket/SSE
3. Worker terpisah memproses job (memanggil microservice ML) → update status job → simpan hasil
4. Frontend menerima status `done` → menampilkan tombol download

Pola ini **tidak wajib di tahap awal**, namun struktur `lib/processors/server/` sudah dirancang agar migrasi ke job queue tidak memerlukan perubahan besar pada frontend — cukup mengganti implementasi di balik `image-service.ts`.

---

## 14. KEAMANAN & PRIVASI — STATELESS FILE HANDLING

Karena **tidak ada login**, seluruh model keamanan dibangun di atas prinsip *zero persistent storage*.

### 14.1 Siklus Hidup File

```
Upload → Simpan sementara (memory buffer / temp disk, bukan storage permanen)
       → Proses
       → Hasil disimpan sementara dengan signed URL + TTL (misal 15 menit)
       → Pengguna mengunduh hasil
       → File dihapus otomatis (setelah unduh ATAU setelah TTL habis, mana yang lebih dulu)
```

### 14.2 Mekanisme Auto-Delete

- **File kecil** (< 5MB): diproses langsung di memory buffer, tidak pernah ditulis ke disk sama sekali
- **File besar**: ditulis ke folder temp dengan nama acak (UUID), dicatat waktu pembuatannya
- **Cron cleanup** (`app/api/cleanup/route.ts`, dipanggil oleh scheduler eksternal setiap 10–15 menit) menghapus seluruh file temp yang sudah melewati TTL
- Response API tidak pernah mengembalikan path file asli — selalu signed URL sementara yang otomatis invalid setelah TTL

### 14.3 Lapisan Keamanan Tambahan

| Lapisan | Implementasi |
|---|---|
| Transport | HTTPS wajib di seluruh endpoint (enforced via `next.config.js` headers + HSTS) |
| Validasi tipe file | Cek ekstensi **dan** magic bytes (bukan hanya `Content-Type` yang mudah dipalsukan) |
| Rate limiting | Middleware pembatas request per-IP (misal 20 request/menit per endpoint upload) untuk mencegah abuse |
| Batas ukuran | Validasi ukuran di level Next.js config (`bodyParser.sizeLimit`) selain validasi aplikasi |
| CORS | Dibatasi hanya ke domain DukiTools sendiri |
| Header keamanan | `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` diset di `next.config.js` |

---

## 15. SEO & METADATA STRATEGY

### 15.1 Generator Metadata Otomatis dari Registry

```typescript
// lib/utils/generateMetadata.ts
import { Metadata } from 'next';
import { ToolConfig } from '@/types/tool';

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const url = `https://dukitools.com/${tool.category}/${tool.slug}`;
  return {
    title: `${tool.name} — Gratis & Tanpa Login | DukiTools`,
    description: tool.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      url,
      siteName: 'DukiTools',
      type: 'website',
    },
    keywords: tool.keywords,
  };
}
```

### 15.2 Structured Data (JSON-LD)

Setiap halaman tool menyisipkan schema `SoftwareApplication` agar Google dapat menampilkan rich snippet:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
  }),
}} />
```

### 15.3 Sitemap Otomatis

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/lib/registry/tools-registry';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dukitools.com';
  const toolUrls = toolsRegistry.map(t => ({ url: `${base}/${t.category}/${t.slug}`, changeFrequency: 'monthly' as const, priority: t.isPopular ? 0.9 : 0.6 }));
  const categoryUrls = categoriesRegistry.map(c => ({ url: `${base}/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }));
  return [{ url: base, priority: 1.0 }, ...categoryUrls, ...toolUrls];
}
```

Karena sitemap digenerate langsung dari registry, penambahan tool baru **otomatis** muncul di sitemap tanpa perlu update manual.

---

## 16. PERFORMANCE OPTIMIZATION STRATEGY

| Teknik | Penerapan |
|---|---|
| **Server Components by default** | Judul, deskripsi, FAQ, breadcrumb dirender di server — hanya area kerja interaktif memuat JS client |
| **Dynamic import per tool** | Library berat khusus tool tertentu (misal `pdf-lib` untuk client-side PDF preview) di-`import()` secara dinamis hanya di halaman yang membutuhkan, bukan di bundle global |
| **next/image** | Seluruh ilustrasi & ikon statis menggunakan komponen `Image` bawaan untuk lazy-load & format otomatis (WebP/AVIF) |
| **next/font** | Font dimuat sebagai self-hosted subset, menghindari render-blocking dari Google Fonts CDN |
| **Code splitting otomatis** | App Router secara default membagi bundle per route — halaman `/pdf/merge-pdf` tidak memuat kode tool `/image/compress-image` |
| **Web Worker untuk komputasi berat client-side** | Misal generate hash untuk file besar, atau kompresi gambar besar di browser, dijalankan di worker thread agar UI tetap responsif |
| **Debounce pada search & real-time text tools** | Input pengguna di-debounce 150–300ms sebelum memproses ulang, mencegah re-render berlebihan |
| **Streaming/Suspense** | Bagian "Related Tools" & FAQ di halaman tool dapat di-*stream* terpisah agar area kerja utama (upload) tampil lebih cepat |

---

## 17. LIBRARY KOMPONEN UI REUSABLE

Seluruh komponen berikut bersifat generik dan digunakan lintas ratusan tool tanpa modifikasi:

| Komponen | Fungsi |
|---|---|
| `Button` | Varian primary/secondary/danger/ghost, dengan state loading bawaan |
| `Input` / `Textarea` | Field teks standar dengan validasi visual (border merah saat error) |
| `FileUpload` | Drag-and-drop + klik untuk memilih file, menampilkan preview nama & ukuran file |
| `Card` | Container dasar untuk `ToolCard`, `CategoryCard`, `ResultCard` |
| `Modal` | Untuk konfirmasi aksi (misal konfirmasi reset saat ada hasil yang belum diunduh) |
| `LoadingSpinner` | Indikator proses dengan label dinamis ("Mengompresi file...", "Menghasilkan QR Code...") |
| `EmptyState` | Tampilan saat belum ada input/hasil |
| `ErrorState` | Tampilan saat proses gagal, dengan tombol "Coba Lagi" |
| `ResultCard` | Menampilkan hasil proses + tombol aksi (Download/Copy/Reset) |
| `SearchBox` | Input pencarian dengan dropdown hasil real-time |
| `Breadcrumb` | Navigasi Home > Kategori > Tool, otomatis dari data registry |
| `ToolLayout` | Wrapper universal yang menyusun Header, Workspace, FAQ, Related Tools |

**Prinsip:** menambahkan tool baru **tidak pernah** memerlukan pembuatan komponen visual baru dari nol — hanya menyusun ulang komponen di atas dengan logika proses yang berbeda.

---

## 18. HALAMAN STATIS TAMBAHAN

| Halaman | Isi Utama |
|---|---|
| **About** | Cerita singkat DukiTools, misi "semua tools online dalam satu tempat tanpa hambatan login" |
| **Contact** | Form sederhana (nama, email, pesan) yang mengirim ke endpoint API internal atau layanan email pihak ketiga |
| **Privacy Policy** | Penegasan bahwa file pengguna **hanya diproses sementara** dan **tidak disimpan permanen**; jelaskan mekanisme auto-delete dari §14 |
| **Terms of Service** | Batasan penggunaan wajar (fair use), larangan penyalahgunaan (misal upload massal untuk scraping) |
| **Disclaimer** | Penegasan bahwa hasil konversi/kompresi bergantung pada kualitas file asli, DukiTools tidak menjamin hasil 100% sempurna untuk seluruh jenis file |
| **404 Not Found** | Desain konsisten dengan brand, menyediakan search box + tautan kembali ke kategori populer |

---

## 19. DAFTAR LENGKAP KATEGORI & CONTOH TOOLS

Tabel ini menjadi acuan awal pengisian `tools-registry.ts` (dapat terus bertambah tanpa mengubah struktur):

### PDF Tools (`processingType: server`)
Merge PDF · Split PDF · Compress PDF · Rotate PDF · Unlock PDF · Protect PDF · PDF to Word · Word to PDF · PDF to JPG · JPG to PDF · PDF to Excel · Excel to PDF · PDF to PowerPoint · PowerPoint to PDF · Delete PDF Pages · Extract PDF Pages · Organize PDF · Watermark PDF · PDF to Text

### Image Tools (`processingType: server` untuk yang berat, `client` untuk yang ringan)
Compress Image · Resize Image · Crop Image · Remove Background (server, AI) · Convert Image PNG/JPG/WebP/HEIC · Rotate Image (client) · Flip Image (client) · Watermark Image · Image to Base64 (client) · Photo Collage Maker

### Text Tools (`processingType: client`)
Word Counter · Character Counter · Case Converter · Text to Slug · Remove Duplicate Lines · Text Diff Checker · Text Reverser · Lorem Ipsum Generator · Whitespace Remover · Text Sorter

### Developer Tools (`processingType: client`)
JSON Formatter · JSON Validator · JSON to CSV · CSV to JSON · Base64 Encoder/Decoder · JWT Decoder · UUID Generator · SQL Formatter · HTML Formatter/Minifier · CSS Formatter/Minifier · JS Formatter/Minifier · XML Formatter · Hash Generator (MD5/SHA1/SHA256) · Regex Tester · URL Encoder/Decoder · Markdown Previewer · Cron Expression Generator

### Office Tools (`processingType: server`)
Excel to CSV · CSV to Excel · Excel to PDF · PDF to Excel · PowerPoint to PDF · PDF to PowerPoint · Word to PDF · PDF to Word · Merge Excel Sheets

### Calculator (`processingType: client`)
Percentage Calculator · BMI Calculator · Age Calculator · Loan/Mortgage Calculator · Currency Converter · Unit Converter · Discount Calculator · Tax Calculator (PPN) · Date Difference Calculator · GPA Calculator

### Color Tools (`processingType: client`)
HEX to RGB Converter · RGB to HEX Converter · Color Palette Generator · Gradient Generator · Color Contrast Checker · CMYK Converter · HSL Converter · Color Picker from Image

### QR Tools (`processingType: client` untuk generate, `client` juga untuk scan via kamera/upload)
QR Code Generator (Text/URL/WiFi/vCard) · Barcode Generator · QR Code Scanner · QR Code with Logo

### Security Tools (`processingType: client`)
Password Generator · Password Strength Checker · Hash Generator (SHA256/MD5) · Text Encryption/Decryption (AES, via `crypto.subtle`) · File Hash Checker · Two-Factor Secret Generator

---

## 20. ENVIRONMENT VARIABLES (Contoh)

```env
NEXT_PUBLIC_SITE_URL=https://dukitools.com
NEXT_PUBLIC_MAX_UPLOAD_MB=25
TEMP_FILE_TTL_MINUTES=15
TEMP_STORAGE_PATH=/tmp/dukitools
RATE_LIMIT_PER_MINUTE=20
# Jika menggunakan microservice terpisah untuk proses berat:
PROCESSING_SERVICE_URL=https://processing.dukitools.com
PROCESSING_SERVICE_API_KEY=xxxxx
```

---

## 21. CATATAN DEPLOYMENT

- **Frontend (Next.js):** direkomendasikan platform yang mendukung App Router secara native (Vercel atau self-hosted Node server dengan reverse proxy Nginx)
- **Microservice pemrosesan berat** (jika dipakai): container terpisah (Docker), scaling horizontal independen dari frontend
- **Temp storage:** jika deployment multi-instance, gunakan storage bersama (misal S3-compatible dengan lifecycle rule auto-delete) agar file temp konsisten diakses dari instance mana pun
- **Cron cleanup:** dijadwalkan via scheduler eksternal (misal cron job server, atau Vercel Cron jika hosting di Vercel)

---

## 22. LANGKAH SELANJUTNYA

Dokumen ini (`rule-dukitools.md`) menetapkan **arsitektur sistem, struktur data, dan alur teknis**. Langkah berikutnya adalah menyusun **`design-dukitools.md`** yang akan mencakup:

- Design system lengkap (palet warna, tipografi, spacing scale)
- Spesifikasi visual detail untuk setiap komponen UI (Button, Card, Toast, FileUpload, dll — states: default/hover/active/disabled)
- Layout responsif per breakpoint (mobile/tablet/desktop) untuk homepage & template halaman tool
- Ikonografi & sistem warna per kategori tool
- Wireframe/mockup halaman kunci: Homepage, Halaman Kategori, Halaman Tool (generic template)

---

**— Akhir dari rule-dukitools.md —**
