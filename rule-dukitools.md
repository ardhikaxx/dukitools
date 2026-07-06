# RULE-DUKITOOLS.md
## Blueprint Arsitektur Sistem — DukiTools
### "All Your Online Tools in One Place"

**Versi:** 2.0 (Lengkap & Detail)
**Tipe Proyek:** Web Platform — Multi-Tool Utility Suite (No-Login, Multi-Category)
**Status:** Architecture Blueprint — Tahap sebelum `design-dukitools.md`

---

## DAFTAR ISI

1. Ringkasan Arsitektur
2. Tech Stack & Justifikasi Lengkap
3. Struktur Folder Proyek (Detail)
4. Struktur Routing & URL Pattern
5. Tool Registry Pattern (Inti Skalabilitas)
6. Sistem Layout Global (Implementasi Lengkap)
7. Arsitektur Homepage (Implementasi Lengkap)
8. Template Universal Halaman Tool (Implementasi Lengkap)
9. State Machine Universal & Error Taxonomy
10. Strategi Pemrosesan: Client-Side vs Server-Side
11. Validasi File Upload (Implementasi Lengkap)
12. Sistem Toast Notification (Implementasi Lengkap)
13. Arsitektur Backend Pemrosesan File
14. Keamanan & Privasi — Stateless File Handling
15. SEO & Metadata Strategy
16. Performance Optimization Strategy
17. Reusable Component Library (Spesifikasi Props Lengkap)
18. Halaman Statis Tambahan
19. Accessibility (A11y) Guidelines
20. Analytics & Monitoring
21. Testing Strategy
22. Tabel Registry Lengkap — Seluruh Kategori & Tools
23. Environment Variables & Konfigurasi
24. Deployment & CI/CD
25. Roadmap Pengembangan Bertahap
26. Langkah Selanjutnya

---

## 1. RINGKASAN ARSITEKTUR

| Aspek | Keputusan Arsitektur | Alasan Singkat |
|---|---|---|
| Framework Utama | Next.js 14+ (App Router) | Server Components untuk SEO, Client Components untuk interaktivitas |
| UI Library | React 18+ | Reusability komponen tinggi untuk ratusan halaman tool |
| Styling | Tailwind CSS | Utility-first, tanpa file CSS terpisah yang membengkak |
| Bahasa | TypeScript (strict mode) | Registry tool memerlukan konsistensi tipe data di skala besar |
| Ikon | Lucide React | Tree-shakable, ringan, konsisten |
| Autentikasi | **Tidak ada** | Filosofi utama: no-login, no-registration, langsung pakai |
| State Management | Local state + custom hooks + Zustand (khusus toast) | Tidak butuh Redux; state tool bersifat lokal per halaman |
| Notifikasi | Toast kustom (satu-satunya mekanisme feedback) | Konsistensi UX di seluruh tool |
| Model Pemrosesan | Hybrid: Client-side (tool ringan) + Server-side/API (tool berat) | Efisiensi biaya server & kecepatan respons |
| Penyimpanan File | Stateless, temp storage dengan TTL, auto-delete | Privasi pengguna & tidak ada biaya storage jangka panjang |
| Backend | Next.js Route Handlers (Tier 1) + microservice opsional (Tier 2) | Skalabilitas terpisah untuk proses berat (AI, LibreOffice) |
| SEO | Metadata dinamis dari registry, JSON-LD, sitemap otomatis | Setiap dari ratusan halaman tool tetap terindeks optimal |
| Skalabilitas | Tool Registry Pattern | Menambah tool baru tidak mengubah struktur/komponen inti |
| Caching | ISR (Incremental Static Regeneration) untuk halaman kategori & tool | Konten statis tool jarang berubah → cache di edge |

**Filosofi inti (diulang & ditegaskan):** DukiTools dibangun di atas **satu prinsip arsitektural tunggal** — *Tool Registry sebagai single source of truth*. Setiap tool baru, dari yang ke-1 hingga yang ke-500, hanya memerlukan (a) satu entri objek konfigurasi di registry, dan (b) satu file komponen logika proses. Tidak ada file layout, navigasi, sitemap generator, atau SEO generator yang perlu disentuh ulang. Prinsip ini menjadi acuan setiap keputusan desain di seluruh dokumen ini.

---

## 2. TECH STACK & JUSTIFIKASI LENGKAP

### 2.1 Tabel Stack Inti

| Layer | Teknologi | Versi Minimum | Peran |
|---|---|---|---|
| Framework | Next.js | 14.x (App Router) | Routing, SSR/SSG/ISR, Route Handlers, Image Optimization |
| UI | React | 18.x | Komponen interaktif |
| Bahasa | TypeScript | 5.x | Type safety registry & komponen |
| Styling | Tailwind CSS | 3.x | Utility styling |
| Ikon | lucide-react | latest | Icon set konsisten & tree-shakable |
| State ringan | zustand | 4.x | Toast store global |
| Validasi | zod | 3.x | Skema validasi input & response API |
| PDF (server) | pdf-lib, pdf-poppler | latest | Merge, split, compress, rotate, protect PDF |
| PDF (client, opsional) | pdf.js | latest | Preview halaman PDF di browser sebelum upload |
| Image (server) | sharp | latest | Compress, resize, convert format gambar |
| Office (server) | LibreOffice headless (via child_process) atau layanan konversi eksternal | — | Konversi Word/Excel/PowerPoint ↔ PDF |
| QR/Barcode (client) | qrcode, jsbarcode | latest | Generate QR & barcode di browser |
| Hashing (client) | Web Crypto API (`crypto.subtle`) | native | SHA-256, tanpa dependency eksternal |
| Encryption (client) | Web Crypto API (AES-GCM) | native | Enkripsi/dekripsi teks di browser |
| Job Queue (opsional) | BullMQ + Redis | latest | Antrian proses berat skala besar |
| Rate limiting | Middleware kustom + Redis/Upstash | — | Mencegah abuse endpoint upload |

### 2.2 Mengapa Next.js App Router (bukan Pages Router atau SPA biasa)

1. **Server Components sebagai default** — judul tool, deskripsi, manfaat, dan FAQ dirender di server tanpa mengirim JavaScript tambahan ke client, sehingga *Time to First Byte* dan *First Contentful Paint* tetap cepat meski halaman punya konten SEO yang panjang.
2. **Client Components terisolasi** — hanya area kerja (upload/input/hasil) yang menjadi Client Component, sehingga bundle JS per halaman tetap kecil.
3. **Route Handlers built-in** — tidak perlu server Express terpisah untuk API sederhana; cukup `app/api/**/route.ts`.
4. **Image Optimization otomatis** — ilustrasi kategori & ikon besar otomatis dikonversi ke WebP/AVIF dan di-lazy-load.
5. **Metadata API & generateMetadata()** — memungkinkan SEO dinamis per tool langsung dari registry tanpa duplikasi kode.
6. **ISR (Incremental Static Regeneration)** — halaman kategori & tool (yang kontennya jarang berubah) dapat di-cache sebagai halaman statis namun tetap dapat di-*revalidate* berkala, kombinasi kecepatan situs statis dengan fleksibilitas update konten.

### 2.3 Contoh `package.json` (Ringkasan Dependency)

```json
{
  "name": "dukitools",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^4.5.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.383.0",
    "pdf-lib": "^1.17.1",
    "sharp": "^0.33.0",
    "qrcode": "^1.5.3",
    "jsbarcode": "^3.11.6",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

---

## 3. STRUKTUR FOLDER PROYEK (DETAIL)

```
dukitools/
├── app/
│   ├── (marketing)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── ContactForm.tsx           # Client Component (form)
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-of-service/page.tsx
│   │   └── disclaimer/page.tsx
│   │
│   ├── (tools)/
│   │   ├── pdf/
│   │   │   ├── page.tsx                  # Halaman kategori PDF Tools
│   │   │   ├── merge-pdf/
│   │   │   │   ├── page.tsx              # Server Component (metadata, SEO)
│   │   │   │   └── MergePdfWorkspace.tsx # Client Component (logika interaktif)
│   │   │   ├── split-pdf/
│   │   │   ├── compress-pdf/
│   │   │   ├── rotate-pdf/
│   │   │   ├── unlock-pdf/
│   │   │   ├── protect-pdf/
│   │   │   ├── pdf-to-word/
│   │   │   ├── word-to-pdf/
│   │   │   ├── pdf-to-jpg/
│   │   │   ├── jpg-to-pdf/
│   │   │   ├── pdf-to-excel/
│   │   │   ├── excel-to-pdf/
│   │   │   ├── organize-pdf/
│   │   │   ├── watermark-pdf/
│   │   │   └── pdf-to-text/
│   │   ├── image/
│   │   │   ├── page.tsx
│   │   │   ├── compress-image/
│   │   │   ├── resize-image/
│   │   │   ├── crop-image/
│   │   │   ├── remove-background/
│   │   │   ├── convert-image/
│   │   │   ├── rotate-image/
│   │   │   ├── flip-image/
│   │   │   ├── watermark-image/
│   │   │   └── image-to-base64/
│   │   ├── text/
│   │   │   ├── page.tsx
│   │   │   ├── word-counter/
│   │   │   ├── case-converter/
│   │   │   ├── text-to-slug/
│   │   │   ├── remove-duplicate-lines/
│   │   │   ├── text-diff-checker/
│   │   │   └── lorem-ipsum-generator/
│   │   ├── developer/
│   │   │   ├── page.tsx
│   │   │   ├── json-formatter/
│   │   │   ├── json-to-csv/
│   │   │   ├── base64-encoder-decoder/
│   │   │   ├── jwt-decoder/
│   │   │   ├── uuid-generator/
│   │   │   ├── sql-formatter/
│   │   │   ├── html-formatter/
│   │   │   ├── css-minifier/
│   │   │   ├── regex-tester/
│   │   │   ├── hash-generator/
│   │   │   ├── url-encoder-decoder/
│   │   │   └── cron-expression-generator/
│   │   ├── office/
│   │   │   ├── page.tsx
│   │   │   ├── excel-to-csv/
│   │   │   ├── csv-to-excel/
│   │   │   ├── word-to-pdf/
│   │   │   └── powerpoint-to-pdf/
│   │   ├── calculator/
│   │   │   ├── page.tsx
│   │   │   ├── percentage-calculator/
│   │   │   ├── bmi-calculator/
│   │   │   ├── age-calculator/
│   │   │   ├── loan-calculator/
│   │   │   ├── currency-converter/
│   │   │   └── unit-converter/
│   │   ├── color/
│   │   │   ├── page.tsx
│   │   │   ├── hex-to-rgb/
│   │   │   ├── color-palette-generator/
│   │   │   ├── gradient-generator/
│   │   │   └── contrast-checker/
│   │   ├── qr/
│   │   │   ├── page.tsx
│   │   │   ├── qr-code-generator/
│   │   │   ├── barcode-generator/
│   │   │   └── qr-code-scanner/
│   │   └── security/
│   │       ├── page.tsx
│   │       ├── password-generator/
│   │       ├── password-strength-checker/
│   │       ├── hash-generator/
│   │       └── text-encryptor/
│   │
│   ├── api/
│   │   ├── pdf/
│   │   │   ├── merge/route.ts
│   │   │   ├── split/route.ts
│   │   │   ├── compress/route.ts
│   │   │   ├── rotate/route.ts
│   │   │   ├── protect/route.ts
│   │   │   ├── unlock/route.ts
│   │   │   └── convert/route.ts          # generic PDF<->Word/Excel/PPT
│   │   ├── image/
│   │   │   ├── compress/route.ts
│   │   │   ├── resize/route.ts
│   │   │   ├── remove-bg/route.ts
│   │   │   └── convert/route.ts
│   │   ├── office/
│   │   │   └── convert/route.ts
│   │   ├── contact/route.ts               # Form kontak → kirim email
│   │   ├── jobs/
│   │   │   └── [jobId]/status/route.ts    # Cek status job queue (opsional)
│   │   └── cleanup/route.ts               # Dipanggil scheduler eksternal (cron)
│   │
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                             # Homepage
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx                  # OG image dinamis (opsional)
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── NavbarCategoryDropdown.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   ├── FileListPreview.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ResultCard.tsx
│   │   └── Badge.tsx
│   │
│   ├── toast/
│   │   ├── ToastProvider.tsx
│   │   ├── ToastViewport.tsx
│   │   ├── Toast.tsx
│   │   └── toastStore.ts
│   │
│   ├── tools/
│   │   ├── ToolLayout.tsx
│   │   ├── ToolCard.tsx
│   │   ├── ToolHeader.tsx
│   │   ├── ToolBenefits.tsx
│   │   ├── ToolFAQ.tsx
│   │   ├── ToolActions.tsx
│   │   ├── RelatedTools.tsx
│   │   └── CategoryGrid.tsx
│   │
│   └── home/
│       ├── HeroSection.tsx
│       ├── PopularTools.tsx
│       ├── NewTools.tsx
│       ├── CategoryCards.tsx
│       └── ValueProposition.tsx
│
├── lib/
│   ├── registry/
│   │   ├── tools-registry.ts
│   │   ├── categories-registry.ts
│   │   └── registry-helpers.ts             # getToolBySlug, getRelatedTools, dst
│   ├── validators/
│   │   ├── file-validator.ts
│   │   ├── file-validator-server.ts        # cek magic bytes
│   │   └── input-schemas.ts                # skema zod untuk tiap API
│   ├── processors/
│   │   ├── client/
│   │   │   ├── json-formatter.ts
│   │   │   ├── base64.ts
│   │   │   ├── password-generator.ts
│   │   │   ├── hash-generator.ts
│   │   │   ├── qr-generator.ts
│   │   │   └── unit-converter.ts
│   │   └── server/
│   │       ├── pdf-service.ts
│   │       ├── image-service.ts
│   │       └── office-service.ts
│   ├── security/
│   │   ├── rate-limiter.ts
│   │   ├── temp-file-manager.ts            # simpan & auto-hapus file sementara
│   │   └── magic-bytes.ts
│   └── utils/
│       ├── formatBytes.ts
│       ├── cn.ts
│       ├── debounce.ts
│       └── generateMetadata.ts
│
├── hooks/
│   ├── useToolState.ts
│   ├── useFileUpload.ts
│   ├── useDebounce.ts
│   ├── useToolSearch.ts
│   └── useCopyToClipboard.ts
│
├── types/
│   ├── tool.ts
│   ├── category.ts
│   ├── toast.ts
│   └── api.ts
│
├── middleware.ts                             # Rate limiting + security headers
├── public/
│   ├── icons/
│   └── og/
├── next.config.js
├── tailwind.config.ts
├── vitest.config.ts
└── package.json
```

**Catatan tambahan:** Setiap folder tool memiliki dua file: `page.tsx` (Server Component untuk SEO) dan `[NamaTool]Workspace.tsx` (Client Component untuk interaksi). Konsistensi penamaan ini memudahkan siapa pun (termasuk AI coding assistant) untuk membangun tool baru hanya dengan menyalin dua file dari tool sejenis dan mengganti logika proses di dalamnya.

---

## 4. STRUKTUR ROUTING & URL PATTERN

| Jenis Halaman | Pattern URL | Contoh |
|---|---|---|
| Homepage | `/` | `dukitools.com/` |
| Halaman Kategori | `/{category}` | `/pdf`, `/image`, `/developer` |
| Halaman Tool | `/{category}/{tool-slug}` | `/pdf/merge-pdf`, `/developer/json-formatter` |
| Halaman Statis | `/{page-slug}` | `/about`, `/privacy-policy` |
| API Endpoint | `/api/{category}/{action}` | `/api/pdf/merge`, `/api/image/remove-bg` |

### 4.1 Aturan Penulisan Slug

- Selalu huruf kecil, pemisah tanda hubung (`-`)
- Deskriptif dan mengandung keyword pencarian (`compress-pdf`, bukan `tool-1`)
- **Tidak boleh diubah setelah publish** — jika tool di-rename, gunakan redirect 301 permanen

### 4.2 Redirect Permanen (jika slug berubah)

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/pdf/gabung-pdf',
        destination: '/pdf/merge-pdf',
        permanent: true, // 301
      },
    ];
  },
};
```

### 4.3 Struktur URL API — Konsisten per Kategori

| Kategori | Endpoint | Method | Deskripsi |
|---|---|---|---|
| PDF | `/api/pdf/merge` | POST | Gabung beberapa file PDF |
| PDF | `/api/pdf/split` | POST | Pisah PDF per halaman/rentang |
| PDF | `/api/pdf/compress` | POST | Kompresi ukuran PDF |
| PDF | `/api/pdf/convert` | POST | Konversi PDF↔Word/Excel/PPT (body: `targetFormat`) |
| Image | `/api/image/compress` | POST | Kompresi gambar |
| Image | `/api/image/remove-bg` | POST | Hapus background (delegasi ke microservice AI) |
| Image | `/api/image/convert` | POST | Konversi format gambar |
| Office | `/api/office/convert` | POST | Konversi dokumen office |
| Sistem | `/api/cleanup` | POST (internal, dilindungi token) | Hapus file temp yang expired |

---

## 5. TOOL REGISTRY PATTERN (INTI SKALABILITAS)

### 5.1 Tipe Data Lengkap

```typescript
// types/tool.ts
export type ProcessingType = 'client' | 'server';

export type CategorySlug =
  | 'pdf' | 'image' | 'text' | 'developer'
  | 'office' | 'calculator' | 'color' | 'qr' | 'security';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;      // untuk ToolCard & meta description
  description: string;           // paragraf lengkap di ToolHeader
  benefits: string[];
  howItWorks: string[];          // langkah-langkah, untuk konten SEO
  icon: string;                  // nama komponen Lucide
  processingType: ProcessingType;
  acceptedFileTypes?: string[];  // ekstensi, contoh: ['.pdf']
  acceptedMimeTypes?: string[];  // untuk validasi tambahan
  maxFileSizeMB?: number;
  maxFiles?: number;
  isPopular?: boolean;
  isNew?: boolean;
  faq: FaqItem[];
  keywords: string[];
  relatedToolSlugs?: string[];   // override manual, jika tidak diisi, ambil otomatis dari kategori sama
}
```

```typescript
// types/category.ts
import { CategorySlug } from './tool';

export interface CategoryConfig {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  accentHex: string;             // untuk penggunaan di luar Tailwind (misal SVG, JSON-LD)
}
```

### 5.2 Registry Helper Functions (Krusial untuk Skalabilitas)

```typescript
// lib/registry/registry-helpers.ts
import { toolsRegistry } from './tools-registry';
import { categoriesRegistry } from './categories-registry';
import { ToolConfig, CategorySlug } from '@/types/tool';

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategorySlug): ToolConfig[] {
  return toolsRegistry.filter((t) => t.category === category);
}

export function getPopularTools(limit = 8): ToolConfig[] {
  return toolsRegistry.filter((t) => t.isPopular).slice(0, limit);
}

export function getNewTools(limit = 8): ToolConfig[] {
  return toolsRegistry.filter((t) => t.isNew).slice(0, limit);
}

export function getCategoryBySlug(slug: CategorySlug) {
  return categoriesRegistry.find((c) => c.slug === slug);
}

export function getRelatedTools(tool: ToolConfig, limit = 4): ToolConfig[] {
  if (tool.relatedToolSlugs?.length) {
    return tool.relatedToolSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is ToolConfig => Boolean(t));
  }
  return toolsRegistry
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, limit);
}

export function searchTools(query: string, limit = 8): ToolConfig[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return toolsRegistry
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)) ||
        t.shortDescription.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

export function getToolCountByCategory(category: CategorySlug): number {
  return toolsRegistry.filter((t) => t.category === category).length;
}
```

**Dampak arsitektural:** Semua komponen (homepage, halaman kategori, search bar, breadcrumb, related tools, sitemap) **hanya boleh mengambil data melalui fungsi-fungsi di atas**, bukan meng-import `toolsRegistry` mentah dan memfilter manual di banyak tempat. Ini mencegah duplikasi logika filter yang tersebar dan sulit dirawat saat jumlah tool membesar.

### 5.3 Contoh Entri Registry (Representatif per Tipe Pemrosesan)

```typescript
// lib/registry/tools-registry.ts
import { ToolConfig } from '@/types/tool';

export const toolsRegistry: ToolConfig[] = [
  // ── Contoh tool SERVER-SIDE (upload file) ──
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    shortDescription: 'Gabungkan beberapa file PDF menjadi satu file secara instan.',
    description:
      'Merge PDF membantu Anda menyatukan beberapa dokumen PDF menjadi satu file tanpa perlu instalasi software maupun login.',
    benefits: [
      'Proses cepat langsung di browser',
      'Mendukung hingga 20 file sekaligus',
      'File otomatis terhapus dari server setelah diproses',
    ],
    howItWorks: [
      'Unggah dua atau lebih file PDF yang ingin digabungkan',
      'Atur urutan file sesuai kebutuhan',
      'Klik tombol "Gabungkan PDF"',
      'Unduh hasil gabungan dalam satu file PDF',
    ],
    icon: 'Files',
    processingType: 'server',
    acceptedFileTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxFileSizeMB: 25,
    maxFiles: 20,
    isPopular: true,
    faq: [
      { question: 'Apakah file saya disimpan di server?', answer: 'Tidak. File otomatis dihapus setelah proses selesai atau setelah 15 menit.' },
      { question: 'Berapa jumlah maksimal file yang dapat digabung?', answer: 'Hingga 20 file PDF dalam satu proses.' },
    ],
    keywords: ['merge pdf', 'gabung pdf', 'combine pdf', 'satukan pdf'],
  },

  // ── Contoh tool CLIENT-SIDE (real-time, tanpa upload) ──
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'developer',
    shortDescription: 'Rapikan, validasi, dan minify format JSON secara instan.',
    description:
      'JSON Formatter membantu Anda memformat dan memvalidasi struktur JSON secara real-time langsung di browser tanpa mengirim data ke server.',
    benefits: [
      'Proses instan tanpa perlu upload data',
      'Mendeteksi error sintaks JSON dengan jelas',
      'Mendukung mode Beautify dan Minify',
    ],
    howItWorks: [
      'Tempel (paste) kode JSON Anda ke kolom input',
      'Sistem otomatis memformat dan memvalidasi',
      'Salin hasil dengan tombol Copy',
    ],
    icon: 'Braces',
    processingType: 'client',
    isPopular: true,
    faq: [
      { question: 'Apakah data JSON saya dikirim ke server?', answer: 'Tidak, seluruh proses berjalan langsung di browser Anda.' },
    ],
    keywords: ['json formatter', 'json beautify', 'json validator', 'format json'],
  },

  // ... (lanjutan seluruh tool mengikuti pola yang sama — lihat §22 untuk daftar lengkap)
];
```

---

## 6. SISTEM LAYOUT GLOBAL (IMPLEMENTASI LENGKAP)

### 6.1 Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/components/toast/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dukitools.com'),
  title: { default: 'DukiTools — All Your Online Tools in One Place', template: '%s | DukiTools' },
  description: 'Kumpulan online tools gratis: PDF, Image, Developer, Office, Calculator, Color, QR, dan Security Tools. Tanpa login, langsung pakai.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
```

### 6.2 Navbar (Sticky, dengan Search Ringkas & Dropdown Kategori)

```tsx
// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { categoriesRegistry } from '@/lib/registry/categories-registry';
import NavbarCategoryDropdown from './NavbarCategoryDropdown';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          DukiTools
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavbarCategoryDropdown categories={categoriesRegistry} />
          <Link href="/#popular-tools" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Tools Populer
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#search"
            aria-label="Cari tools"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <Search size={20} />
          </Link>
        </div>

        <button
          className="p-2 md:hidden"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && <MobileMenu categories={categoriesRegistry} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
```

### 6.3 Footer

```tsx
// components/layout/Footer.tsx
import Link from 'next/link';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-bold text-indigo-600">DukiTools</p>
          <p className="mt-2 text-sm text-slate-500">
            All Your Online Tools in One Place. Gratis, cepat, tanpa login.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Kategori</p>
          <ul className="space-y-2 text-sm text-slate-500">
            {categoriesRegistry.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-indigo-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Perusahaan</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-indigo-600">Tentang Kami</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-600">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Legal</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/privacy-policy" className="hover:text-indigo-600">Kebijakan Privasi</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-indigo-600">Syarat Penggunaan</Link></li>
            <li><Link href="/disclaimer" className="hover:text-indigo-600">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {year} DukiTools. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
```

### 6.4 Breadcrumb (dengan JSON-LD terintegrasi)

```tsx
// components/layout/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `https://dukitools.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-slate-500">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-indigo-600">{item.label}</Link>
            ) : (
              <span className="text-slate-800">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight size={14} />}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
```

---

## 7. ARSITEKTUR HOMEPAGE (IMPLEMENTASI LENGKAP)

```tsx
// app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import PopularTools from '@/components/home/PopularTools';
import NewTools from '@/components/home/NewTools';
import ValueProposition from '@/components/home/ValueProposition';
import { getPopularTools, getNewTools } from '@/lib/registry/registry-helpers';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function HomePage() {
  const popularTools = getPopularTools(8);
  const newTools = getNewTools(6);

  return (
    <>
      <HeroSection />
      <CategoryCards categories={categoriesRegistry} />
      <PopularTools tools={popularTools} />
      {newTools.length > 0 && <NewTools tools={newTools} />}
      <ValueProposition />
    </>
  );
}
```

### 7.1 Hero Section dengan Search Bar Real-Time

```tsx
// components/home/HeroSection.tsx
'use client';

import { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { useToolSearch } from '@/hooks/useToolSearch';
import Link from 'next/link';

export default function HeroSection() {
  const { query, setQuery, results } = useToolSearch();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section id="search" className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
        All Your Online Tools <span className="text-indigo-600">in One Place</span>
      </h1>
      <p className="mt-4 text-lg text-slate-500">
        Gratis, tanpa login, tanpa registrasi. Langsung pakai.
      </p>

      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Cari tools, misal: compress pdf, json formatter..."
          className="w-full rounded-full border border-slate-200 py-4 pl-12 pr-4 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          aria-label="Cari tools"
          aria-expanded={focused && results.length > 0}
          role="combobox"
        />

        {focused && results.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full rounded-xl border border-slate-100 bg-white py-2 text-left shadow-lg">
            {results.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.category}/${tool.slug}`}
                  className="flex flex-col px-4 py-2 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{tool.name}</span>
                  <span className="text-xs text-slate-400">{tool.shortDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
```

### 7.2 Hook Search (dengan Debounce)

```typescript
// hooks/useToolSearch.ts
import { useState, useMemo } from 'react';
import { searchTools } from '@/lib/registry/registry-helpers';
import { useDebounce } from './useDebounce';

export function useToolSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => searchTools(debouncedQuery, 8), [debouncedQuery]);

  return { query, setQuery, results };
}
```

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
```

### 7.3 Category Cards

```tsx
// components/home/CategoryCards.tsx
import Link from 'next/link';
import { CategoryConfig } from '@/types/category';
import { getToolCountByCategory } from '@/lib/registry/registry-helpers';
import * as Icons from 'lucide-react';

export default function CategoryCards({ categories }: { categories: CategoryConfig[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Jelajahi Kategori</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = (Icons as any)[cat.icon] ?? Icons.Box;
          const count = getToolCountByCategory(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className={`mb-3 inline-flex rounded-xl p-3 ${cat.colorClass}`}>
                <Icon size={22} />
              </div>
              <p className="font-semibold text-slate-800 group-hover:text-indigo-600">{cat.name}</p>
              <p className="text-xs text-slate-400">{count} tools</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

---

## 8. TEMPLATE UNIVERSAL HALAMAN TOOL (IMPLEMENTASI LENGKAP)

### 8.1 ToolLayout — Wrapper Universal

```tsx
// components/tools/ToolLayout.tsx
import { ToolConfig } from '@/types/tool';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolHeader from './ToolHeader';
import ToolFAQ from './ToolFAQ';
import RelatedTools from './RelatedTools';
import { getCategoryBySlug, getRelatedTools } from '@/lib/registry/registry-helpers';

export default function ToolLayout({ tool, children }: { tool: ToolConfig; children: React.ReactNode }) {
  const category = getCategoryBySlug(tool.category);
  const related = getRelatedTools(tool);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name ?? tool.category, href: `/${tool.category}` },
          { label: tool.name },
        ]}
      />

      <ToolHeader tool={tool} />

      {/* Area kerja interaktif — Client Component diteruskan sebagai children */}
      <div className="mt-8 rounded-2xl border border-slate-100 p-6 shadow-sm">{children}</div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Cara Kerja {tool.name}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-600">
          {tool.howItWorks.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </section>

      {tool.faq.length > 0 && <ToolFAQ faq={tool.faq} />}

      {related.length > 0 && <RelatedTools tools={related} />}
    </div>
  );
}
```

### 8.2 ToolHeader

```tsx
// components/tools/ToolHeader.tsx
import { ToolConfig } from '@/types/tool';
import { CheckCircle2 } from 'lucide-react';

export default function ToolHeader({ tool }: { tool: ToolConfig }) {
  return (
    <header>
      <h1 className="text-3xl font-bold text-slate-900">{tool.name}</h1>
      <p className="mt-2 text-slate-600">{tool.description}</p>
      <ul className="mt-4 space-y-1.5">
        {tool.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            {b}
          </li>
        ))}
      </ul>
    </header>
  );
}
```

### 8.3 Halaman Tool — Contoh Server Component (`page.tsx`)

```tsx
// app/(tools)/pdf/merge-pdf/page.tsx
import { getToolBySlug } from '@/lib/registry/registry-helpers';
import { generateToolMetadata } from '@/lib/utils/generateMetadata';
import ToolLayout from '@/components/tools/ToolLayout';
import MergePdfWorkspace from './MergePdfWorkspace';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('merge-pdf');

export const metadata = tool ? generateToolMetadata(tool) : {};
export const revalidate = 3600; // ISR: revalidate tiap 1 jam

export default function MergePdfPage() {
  if (!tool) return notFound();
  return (
    <ToolLayout tool={tool}>
      <MergePdfWorkspace tool={tool} />
    </ToolLayout>
  );
}
```

### 8.4 Workspace — Contoh Client Component Lengkap (Multi-File Upload + Reorder)

```tsx
// app/(tools)/pdf/merge-pdf/MergePdfWorkspace.tsx
'use client';

import { useState } from 'react';
import { ToolConfig } from '@/types/tool';
import { useToolState } from '@/hooks/useToolState';
import { useToast } from '@/components/toast/toastStore';
import FileUpload from '@/components/ui/FileUpload';
import FileListPreview from '@/components/ui/FileListPreview';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ResultCard from '@/components/ui/ResultCard';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { validateFile } from '@/lib/validators/file-validator';

interface MergeResult {
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
}

export default function MergePdfWorkspace({ tool }: { tool: ToolConfig }) {
  const { state, setProcessing, setSuccess, setError, reset } = useToolState<File[], MergeResult>();
  const [files, setFiles] = useState<File[]>([]);
  const toast = useToast();

  function handleFilesAdded(newFiles: File[]) {
    const combined = [...files, ...newFiles];
    if (combined.length > (tool.maxFiles ?? 20)) {
      toast.warning(`Maksimal ${tool.maxFiles} file untuk tool ini.`);
      return;
    }
    for (const f of newFiles) {
      const validation = validateFile(f, {
        allowedExtensions: tool.acceptedFileTypes ?? [],
        allowedTypes: tool.acceptedMimeTypes ?? [],
        maxSizeBytes: (tool.maxFileSizeMB ?? 25) * 1024 * 1024,
      });
      if (!validation.valid) {
        toast.error(validation.error!);
        return;
      }
    }
    setFiles(combined);
  }

  function handleRemoveFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleReorder(newOrder: File[]) {
    setFiles(newOrder);
  }

  async function handleMerge() {
    if (files.length < 2) {
      toast.warning('Pilih minimal 2 file PDF untuk digabungkan.');
      return;
    }

    setProcessing();
    toast.info('File sedang digabungkan...');

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/pdf/merge', { method: 'POST', body: formData });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error ?? 'Gagal menggabungkan file.');
      }

      const data: MergeResult = await res.json();
      setSuccess(data);
      toast.success('File berhasil digabungkan!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
      toast.error(message);
    }
  }

  function handleReset() {
    setFiles([]);
    reset();
  }

  if (state.status === 'processing') {
    return <LoadingSpinner label="Menggabungkan file PDF..." />;
  }

  if (state.status === 'success' && state.result) {
    return (
      <ResultCard
        title="PDF Berhasil Digabungkan"
        downloadUrl={state.result.downloadUrl}
        fileName={state.result.fileName}
        sizeInfo={`Ukuran hasil: ${(state.result.sizeBytes / 1024 / 1024).toFixed(2)} MB`}
        onReset={handleReset}
      />
    );
  }

  if (state.status === 'error') {
    return <ErrorState message={state.errorMessage ?? 'Terjadi kesalahan.'} onRetry={handleReset} />;
  }

  return (
    <div className="space-y-4">
      <FileUpload
        onFilesSelected={handleFilesAdded}
        accept={tool.acceptedFileTypes?.join(',')}
        multiple
        label="Seret & letakkan file PDF di sini, atau klik untuk memilih"
      />
      {files.length > 0 && (
        <>
          <FileListPreview files={files} onRemove={handleRemoveFile} onReorder={handleReorder} />
          <Button onClick={handleMerge} variant="primary" fullWidth>
            Gabungkan {files.length} File PDF
          </Button>
        </>
      )}
    </div>
  );
}
```

**Poin arsitektural:** Pola ini — `page.tsx` (Server, SEO) + `[Nama]Workspace.tsx` (Client, interaktif), memakai `useToolState`, `validateFile`, dan komponen UI generik yang sama — **diulang identik** di seluruh dari ratusan tool. Perbedaan antar tool murni terletak pada: field-field di registry, isi `FormData` yang dikirim, dan endpoint API yang dipanggil.

---

## 9. STATE MACHINE UNIVERSAL & ERROR TAXONOMY

### 9.1 Hook `useToolState`

```typescript
// hooks/useToolState.ts
import { useState, useCallback } from 'react';

export type ToolStatus = 'idle' | 'processing' | 'success' | 'error';

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

  const setInput = useCallback((input: TInput) => setState((s) => ({ ...s, input })), []);
  const setProcessing = useCallback(() => setState((s) => ({ ...s, status: 'processing', errorMessage: null, progress: 0 })), []);
  const setProgress = useCallback((progress: number) => setState((s) => ({ ...s, progress })), []);
  const setSuccess = useCallback((result: TResult) => setState((s) => ({ ...s, status: 'success', result, progress: 100 })), []);
  const setError = useCallback((errorMessage: string) => setState((s) => ({ ...s, status: 'error', errorMessage })), []);
  const reset = useCallback(() => setState({ input: null, result: null, status: 'idle', errorMessage: null, progress: 0 }), []);

  return { state, setInput, setProcessing, setProgress, setSuccess, setError, reset };
}
```

### 9.2 Error Taxonomy — Pemetaan Error ke Pesan Toast

Konsistensi pesan error di seluruh tool sangat penting agar pengguna tidak bingung. Berikut klasifikasi error yang wajib ditangani setiap tool server-side:

| Kode Error Internal | Situasi | Pesan Toast (id-ID) | Tipe Toast |
|---|---|---|---|
| `FILE_EMPTY` | File berukuran 0 byte | "File kosong tidak dapat diproses." | warning |
| `FILE_TOO_LARGE` | Ukuran melebihi `maxFileSizeMB` | "Ukuran file melebihi batas maksimum {X}MB." | error |
| `INVALID_FILE_TYPE` | Ekstensi/MIME tidak sesuai | "Format file tidak didukung. Gunakan format: {daftar}." | error |
| `TOO_MANY_FILES` | Melebihi `maxFiles` | "Maksimal {X} file untuk tool ini." | warning |
| `NO_INPUT` | Belum ada file/teks dipilih | "Silakan pilih file atau masukkan teks terlebih dahulu." | warning |
| `CORRUPT_FILE` | File terdeteksi rusak saat parsing | "File rusak atau tidak dapat dibaca." | error |
| `SERVER_BUSY` | Timeout / server overload | "Server sedang sibuk. Silakan coba beberapa saat lagi." | error |
| `NETWORK_ERROR` | Fetch gagal / koneksi putus | "Koneksi terputus. Periksa jaringan Anda dan coba lagi." | error |
| `PROCESSING_FAILED` | Error umum di tahap pemrosesan | "Terjadi kesalahan saat memproses file. Coba lagi." | error |
| `RATE_LIMITED` | Melebihi batas request | "Terlalu banyak permintaan. Silakan tunggu sebentar." | warning |
| `SUCCESS` | Proses berhasil | "{Aksi} berhasil dilakukan!" | success |

### 9.3 Utility Pemetaan Error (Frontend)

```typescript
// lib/utils/errorMessages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  FILE_EMPTY: 'File kosong tidak dapat diproses.',
  FILE_TOO_LARGE: 'Ukuran file melebihi batas maksimum yang diizinkan.',
  INVALID_FILE_TYPE: 'Format file tidak didukung.',
  TOO_MANY_FILES: 'Jumlah file melebihi batas maksimum.',
  CORRUPT_FILE: 'File rusak atau tidak dapat dibaca.',
  SERVER_BUSY: 'Server sedang sibuk. Silakan coba beberapa saat lagi.',
  NETWORK_ERROR: 'Koneksi terputus. Periksa jaringan Anda.',
  PROCESSING_FAILED: 'Terjadi kesalahan saat memproses file.',
  RATE_LIMITED: 'Terlalu banyak permintaan. Silakan tunggu sebentar.',
};

export function resolveErrorMessage(code?: string, fallback = 'Terjadi kesalahan tidak terduga.'): string {
  if (!code) return fallback;
  return ERROR_MESSAGES[code] ?? fallback;
}
```

Backend selalu mengembalikan body error dalam format `{ code: string, error: string }` sehingga frontend dapat konsisten memetakan ke pesan yang sudah terstandardisasi, meski pesan `error` dari backend berubah.

---

## 10. STRATEGI PEMROSESAN: CLIENT-SIDE VS SERVER-SIDE

### 10.1 Kriteria Penentuan

| Kriteria | Client-Side | Server-Side |
|---|---|---|
| Ukuran komputasi | Ringan (< 1 detik di device rata-rata) | Berat / butuh library native |
| Ketergantungan library | Tersedia native di browser (Web Crypto, Canvas) | Butuh library khusus (LibreOffice, model ML) |
| Ukuran data | Teks / file kecil | File besar (PDF, gambar resolusi tinggi) |
| Privasi ekstra | Tidak perlu keluar dari browser sama sekali | Perlu, tapi tetap stateless & auto-delete |
| Contoh | JSON Formatter, Hash Generator, Calculator | Merge PDF, Remove Background, Convert Office |

### 10.2 Web Worker untuk Komputasi Client-Side Berat

Beberapa tool client-side tetap dapat membebani UI thread jika data besar (misal menghitung hash file 50MB). Solusinya menggunakan Web Worker:

```typescript
// lib/processors/client/hash-worker.ts
self.onmessage = async (e: MessageEvent<{ fileBuffer: ArrayBuffer }>) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', e.data.fileBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  (self as any).postMessage({ hash: hashHex });
};
```

```typescript
// Pemanggilan dari komponen client
const worker = new Worker(new URL('@/lib/processors/client/hash-worker.ts', import.meta.url));
worker.postMessage({ fileBuffer: await file.arrayBuffer() });
worker.onmessage = (e) => setHash(e.data.hash);
```

---

## 11. VALIDASI FILE UPLOAD (IMPLEMENTASI LENGKAP)

### 11.1 Tabel Aturan Validasi per Kategori

| Kategori | Format Diterima | Ukuran Maks | Jumlah File Maks |
|---|---|---|---|
| PDF Tools | `.pdf` | 25 MB | 20 (Merge), 1 (lainnya) |
| Office | `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` | 20 MB | 1 |
| Image Tools | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic` | 15 MB | 1–10 |
| QR/Security/Calculator | Tidak ada upload (input teks) | — | — |

### 11.2 Validator Frontend

```typescript
// lib/validators/file-validator.ts
export interface FileValidationRule {
  allowedTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
  minSizeBytes?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

export function validateFile(file: File, rule: FileValidationRule): ValidationResult {
  if (!file || file.size === (rule.minSizeBytes ?? 0)) {
    return { valid: false, error: 'File kosong atau tidak valid.', code: 'FILE_EMPTY' };
  }
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  if (rule.allowedExtensions.length && !rule.allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Format file tidak didukung. Gunakan format: ${rule.allowedExtensions.join(', ')}`,
      code: 'INVALID_FILE_TYPE',
    };
  }
  if (file.size > rule.maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum ${Math.round(rule.maxSizeBytes / 1024 / 1024)}MB.`,
      code: 'FILE_TOO_LARGE',
    };
  }
  return { valid: true };
}
```

### 11.3 Validator Backend (Magic Bytes — Anti-Bypass)

```typescript
// lib/security/magic-bytes.ts
// Signature byte pertama file, tidak bergantung pada ekstensi nama file
const SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46],          // %PDF
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  zip_based: [0x50, 0x4b, 0x03, 0x04],    // docx/xlsx/pptx (berbasis ZIP)
};

export function detectFileSignature(buffer: Buffer): string | null {
  for (const [type, signature] of Object.entries(SIGNATURES)) {
    if (signature.every((byte, i) => buffer[i] === byte)) return type;
  }
  return null;
}
```

```typescript
// lib/validators/file-validator-server.ts
import { detectFileSignature } from '@/lib/security/magic-bytes';

export function validateFileServerSide(
  buffer: Buffer,
  expectedType: string,
  maxSizeBytes: number
): { valid: boolean; error?: string; code?: string } {
  if (buffer.length === 0) return { valid: false, error: 'File kosong.', code: 'FILE_EMPTY' };
  if (buffer.length > maxSizeBytes) return { valid: false, error: 'Ukuran file melebihi batas.', code: 'FILE_TOO_LARGE' };

  const detected = detectFileSignature(buffer);
  if (detected !== expectedType) {
    return { valid: false, error: 'Isi file tidak sesuai dengan format yang diharapkan.', code: 'INVALID_FILE_TYPE' };
  }
  return { valid: true };
}
```

### 11.4 Komponen `FileUpload` (Drag & Drop Lengkap)

```tsx
// components/ui/FileUpload.tsx
'use client';

import { useRef, useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export default function FileUpload({ onFilesSelected, accept, multiple = false, label }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFilesSelected(files);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFilesSelected(files);
    e.target.value = ''; // reset agar file yang sama bisa dipilih ulang
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition',
        dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
      )}
    >
      <UploadCloud className="mb-3 text-indigo-500" size={36} />
      <p className="font-medium text-slate-700">{label ?? 'Seret & letakkan file di sini, atau klik untuk memilih'}</p>
      <p className="mt-1 text-xs text-slate-400">{accept ? `Format: ${accept}` : ''}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
```

---

## 12. SISTEM TOAST NOTIFICATION (IMPLEMENTASI LENGKAP)

### 12.1 Spesifikasi Visual

| Tipe | Ikon | Warna | Kapan Digunakan |
|---|---|---|---|
| Success | `CheckCircle2` | Hijau `#16a34a` | Konversi berhasil, disalin ke clipboard, download siap |
| Error | `XCircle` | Merah `#dc2626` | Gagal proses, format tidak didukung, file rusak, koneksi putus |
| Warning | `AlertTriangle` | Kuning `#ca8a04` | Input/file belum dipilih, melebihi batas jumlah file |
| Info | `Info` | Biru `#2563eb` | Proses sedang berjalan |

**Perilaku umum:** posisi pojok kanan atas, durasi default 4 detik, dapat ditutup manual, maksimum 3 toast tampil bersamaan (FIFO), animasi slide-in + fade.

### 12.2 Store Zustand

```typescript
// components/toast/toastStore.ts
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastStoreState {
  toasts: ToastItem[];
  push: (type: ToastType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  push: (type, message, duration = DEFAULT_DURATION) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, type, message, duration }].slice(-MAX_TOASTS) }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

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

### 12.3 Komponen Visual Toast (dengan ARIA untuk Accessibility)

```tsx
// components/toast/Toast.tsx
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastItem, useToastStore } from './toastStore';
import { cn } from '@/lib/utils/cn';

const CONFIG = {
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50 text-red-700' },
  warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-700' },
  info: { icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-700' },
};

export default function Toast({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon: Icon, className } = CONFIG[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-80 items-start gap-3 rounded-xl border p-3 shadow-md animate-in slide-in-from-right-4 fade-in',
        className
      )}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button onClick={() => dismiss(toast.id)} aria-label="Tutup notifikasi" className="opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
```

```tsx
// components/toast/ToastViewport.tsx
'use client';

import { useToastStore } from './toastStore';
import Toast from './Toast';

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed right-4 top-4 z-100 flex flex-col gap-2">
      {toasts.map((t) => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
```

```tsx
// components/toast/ToastProvider.tsx
import ToastViewport from './ToastViewport';

export default function ToastProvider() {
  return <ToastViewport />;
}
```

---

## 13. ARSITEKTUR BACKEND PEMROSESAN FILE

### 13.1 Dua Tingkat Backend

```
┌────────────────────────────┐
│  Next.js Route Handlers     │  Tier 1 — proses ringan-menengah
│  (app/api/**/route.ts)      │  (Compress PDF kecil, Convert Image standar)
└─────────────┬───────────────┘
              │ delegasi jika proses berat
              ▼
┌────────────────────────────┐
│  Microservice Terpisah       │  Tier 2 — proses berat
│  (Node/Express atau          │  (Remove Background AI, LibreOffice headless,
│   Python FastAPI)             │   OCR, upscaling)
└────────────────────────────┘
```

### 13.2 Contoh Route Handler — Merge PDF

```typescript
// app/api/pdf/merge/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { validateFileServerSide } from '@/lib/validators/file-validator-server';
import { saveTempFile } from '@/lib/security/temp-file-manager';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req);
  if (!rl.allowed) {
    return NextResponse.json({ code: 'RATE_LIMITED', error: 'Terlalu banyak permintaan.' }, { status: 429 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (files.length < 2) {
    return NextResponse.json({ code: 'NO_INPUT', error: 'Minimal 2 file diperlukan.' }, { status: 400 });
  }
  if (files.length > 20) {
    return NextResponse.json({ code: 'TOO_MANY_FILES', error: 'Maksimal 20 file.' }, { status: 400 });
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const validation = validateFileServerSide(buffer, 'pdf', 25 * 1024 * 1024);
      if (!validation.valid) {
        return NextResponse.json({ code: validation.code, error: validation.error }, { status: 400 });
      }
      const srcDoc = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();
    const { downloadUrl, fileName } = await saveTempFile(Buffer.from(mergedBytes), 'merged.pdf', 'application/pdf');

    return NextResponse.json({ downloadUrl, fileName, sizeBytes: mergedBytes.length });
  } catch (err) {
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal menggabungkan file PDF.' }, { status: 500 });
  }
}
```

### 13.3 Contoh Route Handler — Compress Image (sharp)

```typescript
// app/api/image/compress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { validateFileServerSide } from '@/lib/validators/file-validator-server';
import { saveTempFile } from '@/lib/security/temp-file-manager';

export const runtime = 'nodejs';
export const maxDuration = 20;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const quality = Number(formData.get('quality') ?? 75);

  if (!file) {
    return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const validation = validateFileServerSide(buffer, 'jpg', 15 * 1024 * 1024);
  if (!validation.valid && detectImageTypeFallback(buffer) === null) {
    return NextResponse.json({ code: validation.code, error: validation.error }, { status: 400 });
  }

  try {
    const compressed = await sharp(buffer).jpeg({ quality }).toBuffer();
    const { downloadUrl, fileName } = await saveTempFile(compressed, 'compressed.jpg', 'image/jpeg');

    return NextResponse.json({
      downloadUrl,
      fileName,
      sizeBefore: buffer.length,
      sizeAfter: compressed.length,
      savingsPercent: Math.round((1 - compressed.length / buffer.length) * 100),
    });
  } catch {
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengompresi gambar.' }, { status: 500 });
  }
}

function detectImageTypeFallback(buffer: Buffer) {
  // Placeholder helper — pemeriksaan signature tambahan untuk PNG/WebP
  return null;
}
```

### 13.4 Contoh Route Handler — Remove Background (Delegasi ke Microservice AI)

```typescript
// app/api/image/remove-bg/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveTempFile } from '@/lib/security/temp-file-manager';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ code: 'NO_INPUT', error: 'File tidak ditemukan.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Delegasi ke microservice Python (model ML rembg/U2Net)
    const upstream = await fetch(`${process.env.PROCESSING_SERVICE_URL}/remove-background`, {
      method: 'POST',
      headers: { 'x-api-key': process.env.PROCESSING_SERVICE_API_KEY ?? '' },
      body: buffer,
    });

    if (!upstream.ok) {
      return NextResponse.json({ code: 'SERVER_BUSY', error: 'Layanan sedang sibuk, coba lagi.' }, { status: 503 });
    }

    const resultBuffer = Buffer.from(await upstream.arrayBuffer());
    const { downloadUrl, fileName } = await saveTempFile(resultBuffer, 'no-background.png', 'image/png');

    return NextResponse.json({ downloadUrl, fileName, sizeBytes: resultBuffer.length });
  } catch {
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal menghapus background.' }, { status: 500 });
  }
}
```

### 13.5 Pola Job Queue (Opsional — untuk Skala Besar)

Ketika traffic tool berat (misal Remove Background) meningkat tajam, pola sinkron di atas digantikan pola asinkron:

1. `POST /api/image/remove-bg` → simpan file sementara → masukkan job ke BullMQ → kembalikan `{ jobId }`
2. Frontend polling `GET /api/jobs/{jobId}/status` setiap 1–2 detik
3. Worker terpisah mengambil job dari Redis → panggil microservice ML → simpan hasil → update status
4. Frontend menerima status `done` beserta `downloadUrl`

```typescript
// app/api/jobs/[jobId]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getJobStatus } from '@/lib/security/job-queue'; // implementasi BullMQ

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  const job = await getJobStatus(params.jobId);
  if (!job) return NextResponse.json({ code: 'NOT_FOUND', error: 'Job tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(job); // { status: 'queued' | 'processing' | 'done' | 'failed', downloadUrl? }
}
```

Struktur `lib/processors/server/*-service.ts` sengaja dipisah dari Route Handler agar migrasi ke job queue **tidak mengubah kontrak frontend** — hanya implementasi di baliknya yang berubah.

---

## 14. KEAMANAN & PRIVASI — STATELESS FILE HANDLING

### 14.1 Siklus Hidup File

```
Upload → Buffer di memory (file kecil) ATAU temp disk dengan nama UUID (file besar)
       → Proses
       → Hasil disimpan sementara + signed URL dengan TTL (default 15 menit)
       → Pengguna mengunduh
       → File dihapus otomatis (setelah unduh ATAU TTL habis, mana lebih dulu)
```

### 14.2 Temp File Manager

```typescript
// lib/security/temp-file-manager.ts
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? '/tmp/dukitools';
const TTL_MS = Number(process.env.TEMP_FILE_TTL_MINUTES ?? 15) * 60 * 1000;

interface TempFileRecord {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  createdAt: number;
}

const registry = new Map<string, TempFileRecord>(); // Untuk skala besar, ganti dengan Redis

export async function saveTempFile(buffer: Buffer, fileName: string, mimeType: string) {
  const id = crypto.randomUUID();
  const filePath = path.join(TEMP_DIR, id);
  await writeFile(filePath, buffer);

  registry.set(id, { id, filePath, fileName, mimeType, createdAt: Date.now() });

  // Jadwalkan hapus otomatis
  setTimeout(() => deleteTempFile(id), TTL_MS);

  return { downloadUrl: `/api/download/${id}`, fileName, id };
}

export async function deleteTempFile(id: string) {
  const record = registry.get(id);
  if (!record) return;
  try {
    await unlink(record.filePath);
  } catch {
    /* file mungkin sudah terhapus */
  }
  registry.delete(id);
}

export function getTempFile(id: string) {
  return registry.get(id);
}
```

### 14.3 Endpoint Cleanup (Dipanggil Scheduler Eksternal)

```typescript
// app/api/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';

const TEMP_DIR = process.env.TEMP_STORAGE_PATH ?? '/tmp/dukitools';
const TTL_MS = Number(process.env.TEMP_FILE_TTL_MINUTES ?? 15) * 60 * 1000;

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-cleanup-token');
  if (token !== process.env.CLEANUP_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const files = await readdir(TEMP_DIR);
  let deletedCount = 0;

  for (const file of files) {
    const filePath = path.join(TEMP_DIR, file);
    const stats = await stat(filePath);
    if (Date.now() - stats.mtimeMs > TTL_MS) {
      await unlink(filePath);
      deletedCount++;
    }
  }

  return NextResponse.json({ deletedCount });
}
```

> Endpoint ini dipanggil oleh scheduler eksternal (cron server, Vercel Cron, atau GitHub Actions scheduled workflow) setiap 10–15 menit sebagai lapisan pengaman kedua, selain `setTimeout` di §14.2 yang menangani penghapusan segera.

### 14.4 Rate Limiter Middleware

```typescript
// lib/security/rate-limiter.ts
import { NextRequest } from 'next/server';

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 20);

// Untuk single-instance deployment. Untuk multi-instance, ganti dengan Redis/Upstash.
const requestLog = new Map<string, number[]>();

export async function checkRateLimit(req: NextRequest): Promise<{ allowed: boolean }> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return { allowed: false };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return { allowed: true };
}
```

### 14.5 Security Headers via Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  return res;
}

export const config = {
  matcher: '/:path*',
};
```

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
    title: `${tool.name} — Gratis & Tanpa Login`,
    description: tool.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      url,
      siteName: 'DukiTools',
      type: 'website',
      images: [`/og/${tool.slug}.png`],
    },
    twitter: { card: 'summary_large_image', title: tool.name, description: tool.shortDescription },
    keywords: tool.keywords,
  };
}
```

### 15.2 Structured Data — SoftwareApplication + FAQPage

```tsx
// Disisipkan di ToolLayout atau page.tsx tool
function ToolJsonLd({ tool }: { tool: ToolConfig }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
        description: tool.shortDescription,
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
```

### 15.3 Sitemap & Robots Otomatis

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/lib/registry/tools-registry';
import { categoriesRegistry } from '@/lib/registry/categories-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dukitools.com';
  const toolUrls = toolsRegistry.map((t) => ({
    url: `${base}/${t.category}/${t.slug}`,
    changeFrequency: 'monthly' as const,
    priority: t.isPopular ? 0.9 : 0.6,
  }));
  const categoryUrls = categoriesRegistry.map((c) => ({
    url: `${base}/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [{ url: base, priority: 1.0, changeFrequency: 'daily' }, ...categoryUrls, ...toolUrls];
}
```

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://dukitools.com/sitemap.xml',
  };
}
```

Karena sitemap digenerate langsung dari registry, **penambahan tool baru otomatis muncul** tanpa update manual di file terpisah.

---

## 16. PERFORMANCE OPTIMIZATION STRATEGY

| Teknik | Penerapan |
|---|---|
| Server Components by default | Judul, deskripsi, FAQ dirender di server; hanya area kerja jadi Client Component |
| Dynamic import per tool | Library berat (`pdf-lib` untuk preview client, dsb) di-`import()` dinamis hanya di halaman terkait |
| `next/image` | Ilustrasi & ikon statis otomatis WebP/AVIF + lazy-load |
| `next/font` | Font self-hosted subset, tanpa render-blocking dari CDN eksternal |
| Code splitting otomatis | App Router membagi bundle per route secara default |
| Web Worker | Komputasi berat client-side (hash file besar, kompresi gambar besar) di luar UI thread |
| Debounce | Search bar & tool real-time (300ms) untuk mencegah re-render berlebihan |
| ISR (`revalidate`) | Halaman tool & kategori di-cache statis, direvalidasi berkala (misal 1 jam) |
| Suspense + Streaming | Related Tools & FAQ dapat di-stream terpisah dari area kerja utama |
| Prefetch | Next.js `<Link>` otomatis prefetch halaman tool populer saat terlihat di viewport |

---

## 17. REUSABLE COMPONENT LIBRARY (SPESIFIKASI PROPS LENGKAP)

| Komponen | Props Utama | Catatan |
|---|---|---|
| `Button` | `variant: 'primary'\|'secondary'\|'danger'\|'ghost'`, `loading?: boolean`, `fullWidth?: boolean`, `disabled?: boolean` | State loading bawaan menampilkan spinner kecil di dalam tombol |
| `Input` | `label?`, `error?`, `type`, standar HTML input props | Border merah otomatis saat `error` terisi |
| `FileUpload` | `onFilesSelected`, `accept?`, `multiple?`, `label?` | Drag & drop + klik, lihat §11.4 |
| `FileListPreview` | `files: File[]`, `onRemove(index)`, `onReorder?(files)` | Untuk tool multi-file seperti Merge PDF |
| `Card` | `children`, `className?` | Container dasar |
| `Modal` | `isOpen`, `onClose`, `title?`, `children` | Untuk konfirmasi aksi (misal reset saat ada hasil belum diunduh) |
| `LoadingSpinner` | `label?: string` | Label dinamis sesuai proses ("Mengompresi file...") |
| `ProgressBar` | `progress: number (0-100)` | Untuk upload besar dengan progress tracking |
| `EmptyState` | `message?`, `icon?` | Tampilan default sebelum ada input |
| `ErrorState` | `message`, `onRetry` | Tampilan gagal proses + tombol coba lagi |
| `ResultCard` | `title`, `downloadUrl?`, `fileName?`, `sizeInfo?`, `textResult?`, `onReset`, `onCopy?` | Fleksibel untuk hasil file maupun hasil teks |
| `SearchBox` | `value`, `onChange`, `results` | Digunakan di Navbar & Hero |
| `Breadcrumb` | `items: {label, href?}[]` | Otomatis sisipkan JSON-LD |
| `ToolLayout` | `tool: ToolConfig`, `children` | Wrapper universal semua halaman tool |

### 17.1 Contoh `ResultCard` (Fleksibel File & Teks)

```tsx
// components/ui/ResultCard.tsx
import { Download, Copy, RotateCcw, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { useToast } from '@/components/toast/toastStore';

interface ResultCardProps {
  title: string;
  downloadUrl?: string;
  fileName?: string;
  sizeInfo?: string;
  textResult?: string;
  onReset: () => void;
}

export default function ResultCard({ title, downloadUrl, fileName, sizeInfo, textResult, onReset }: ResultCardProps) {
  const toast = useToast();

  async function handleCopy() {
    if (!textResult) return;
    await navigator.clipboard.writeText(textResult);
    toast.success('Hasil berhasil disalin ke clipboard!');
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
      <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={32} />
      <p className="font-semibold text-slate-800">{title}</p>
      {sizeInfo && <p className="text-sm text-slate-500">{sizeInfo}</p>}

      {textResult && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-white p-4 text-left text-sm">{textResult}</pre>
      )}

      <div className="mt-4 flex justify-center gap-3">
        {downloadUrl && (
          <a href={downloadUrl} download={fileName}>
            <Button variant="primary"><Download size={16} className="mr-1.5" /> Download</Button>
          </a>
        )}
        {textResult && (
          <Button variant="secondary" onClick={handleCopy}><Copy size={16} className="mr-1.5" /> Copy</Button>
        )}
        <Button variant="ghost" onClick={onReset}><RotateCcw size={16} className="mr-1.5" /> Reset</Button>
      </div>
    </div>
  );
}
```

---

## 18. HALAMAN STATIS TAMBAHAN

| Halaman | Isi Utama |
|---|---|
| **About** | Cerita singkat DukiTools, misi "semua tools online tanpa hambatan login" |
| **Contact** | Form (nama, email, pesan) → `POST /api/contact` → kirim email via layanan pihak ketiga (Resend/SendGrid) |
| **Privacy Policy** | Penegasan file hanya diproses sementara, mekanisme auto-delete (rujuk §14), tidak ada tracking identitas pribadi |
| **Terms of Service** | Batasan fair use, larangan scraping/abuse otomatis, batasan tanggung jawab |
| **Disclaimer** | Hasil konversi bergantung kualitas file asli, tidak menjamin hasil sempurna 100% untuk semua jenis file |
| **404 Not Found** | Desain konsisten brand, search box, tautan ke kategori populer |

### 18.1 Contoh Form Contact (Client Component)

```tsx
// app/(marketing)/contact/ContactForm.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/toast/toastStore';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning('Mohon lengkapi seluruh field.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success('Pesan berhasil dikirim. Kami akan segera merespons.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Textarea label="Pesan" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <Button type="submit" variant="primary" loading={loading} fullWidth>Kirim Pesan</Button>
    </form>
  );
}
```

---

## 19. ACCESSIBILITY (A11Y) GUIDELINES

| Area | Aturan |
|---|---|
| Toast | `role="status"` + `aria-live="polite"` agar screen reader membaca notifikasi tanpa mengganggu fokus |
| FileUpload | Elemen dropzone memiliki `role="button"`, `tabIndex={0}`, dan handler `onKeyDown` (Enter/Space) agar dapat diakses via keyboard |
| Modal | Fokus otomatis terkunci di dalam modal (focus trap), `Esc` menutup modal, `aria-modal="true"` |
| Search bar | `role="combobox"` dengan `aria-expanded` sesuai status dropdown hasil |
| Kontras warna | Seluruh kombinasi teks-background toast & tombol memenuhi rasio kontras WCAG AA minimum (4.5:1) |
| Navigasi keyboard | Seluruh elemen interaktif (tombol, link, input) dapat dijangkau via `Tab` dengan `focus-visible` ring yang jelas |
| Label form | Setiap `Input`/`Textarea` memiliki `label` terhubung via `htmlFor`/`id`, tidak hanya placeholder |
| Alt text gambar | Ikon kategori & ilustrasi menggunakan `alt` deskriptif, ikon dekoratif menggunakan `aria-hidden="true"` |

---

## 20. ANALYTICS & MONITORING

| Kebutuhan | Pendekatan |
|---|---|
| Tool paling sering dipakai | Event tracking sederhana (`tool_used`, dengan properti `slug`, `category`, `processingType`) dikirim ke penyedia analitik privasi-ramah (misal Plausible/Umami) — **tanpa** menyimpan konten file yang diproses |
| Error rate per tool | Log error di backend (dengan `code` dari error taxonomy §9.2) dikumpulkan ke layanan logging (misal Sentry) untuk mendeteksi tool yang sering gagal |
| Performance monitoring | Web Vitals (LCP, FID/INP, CLS) dikirim otomatis via `useReportWebVitals` Next.js ke dashboard monitoring |
| Uptime microservice | Health check endpoint (`/api/health`) dipantau layanan uptime eksternal untuk microservice pemrosesan berat |
| Rate-limit hits | Dicatat untuk mendeteksi pola abuse dan menyesuaikan `RATE_LIMIT_PER_MINUTE` bila perlu |

**Prinsip privasi dalam analitik:** karena tidak ada login, analitik tidak boleh mengaitkan aktivitas ke identitas pengguna spesifik — cukup agregat anonim per sesi browser (tanpa cookie tracking cross-site).

---

## 21. TESTING STRATEGY

| Level | Fokus | Tools |
|---|---|---|
| Unit Test | Fungsi utilitas murni: `validateFile`, `formatBytes`, registry helpers (`getToolBySlug`, `searchTools`), processor client-side (JSON formatter, hash generator) | Vitest |
| Component Test | Perilaku komponen UI: `FileUpload` menerima drag-drop, `Toast` auto-dismiss, `useToolState` transisi status | @testing-library/react |
| Integration Test | Route Handler API: `POST /api/pdf/merge` dengan file valid/invalid, respons error taxonomy yang benar | Vitest + mock FormData |
| E2E Test (opsional) | Alur penuh dari homepage → search → buka tool → upload → hasil → download | Playwright |
| Visual Regression (opsional) | Snapshot komponen kunci (`ToolCard`, `ResultCard`, `Toast`) untuk mendeteksi perubahan visual tak sengaja | Chromatic/Storybook |

### 21.1 Contoh Unit Test Registry Helper

```typescript
// lib/registry/registry-helpers.test.ts
import { describe, it, expect } from 'vitest';
import { getToolBySlug, searchTools, getRelatedTools } from './registry-helpers';

describe('registry-helpers', () => {
  it('mengembalikan tool yang sesuai berdasarkan slug', () => {
    const tool = getToolBySlug('merge-pdf');
    expect(tool?.name).toBe('Merge PDF');
  });

  it('mengembalikan array kosong jika query pencarian kosong', () => {
    expect(searchTools('')).toEqual([]);
  });

  it('related tools tidak menyertakan tool itu sendiri', () => {
    const tool = getToolBySlug('merge-pdf')!;
    const related = getRelatedTools(tool);
    expect(related.every((t) => t.slug !== tool.slug)).toBe(true);
  });
});
```

---

## 22. TABEL REGISTRY LENGKAP — SELURUH KATEGORI & TOOLS

Tabel berikut menjadi acuan pengisian awal `tools-registry.ts`, mencakup slug, tipe pemrosesan, dan batasan file (jika relevan).

### 22.1 PDF Tools (`category: pdf`)

| Slug | Nama | Processing | Format Diterima | Maks Ukuran |
|---|---|---|---|---|
| `merge-pdf` | Merge PDF | server | `.pdf` (multi) | 25MB/file, 20 file |
| `split-pdf` | Split PDF | server | `.pdf` | 25MB |
| `compress-pdf` | Compress PDF | server | `.pdf` | 25MB |
| `rotate-pdf` | Rotate PDF | server | `.pdf` | 25MB |
| `unlock-pdf` | Unlock PDF | server | `.pdf` | 25MB |
| `protect-pdf` | Protect PDF | server | `.pdf` | 25MB |
| `pdf-to-word` | PDF to Word | server | `.pdf` | 25MB |
| `word-to-pdf` | Word to PDF | server | `.doc`, `.docx` | 20MB |
| `pdf-to-jpg` | PDF to JPG | server | `.pdf` | 25MB |
| `jpg-to-pdf` | JPG to PDF | server | `.jpg`, `.png` (multi) | 15MB/file |
| `pdf-to-excel` | PDF to Excel | server | `.pdf` | 25MB |
| `excel-to-pdf` | Excel to PDF | server | `.xls`, `.xlsx` | 20MB |
| `organize-pdf` | Organize PDF | server | `.pdf` | 25MB |
| `watermark-pdf` | Watermark PDF | server | `.pdf` | 25MB |
| `pdf-to-text` | PDF to Text | server | `.pdf` | 25MB |

### 22.2 Image Tools (`category: image`)

| Slug | Nama | Processing | Format Diterima | Maks Ukuran |
|---|---|---|---|---|
| `compress-image` | Compress Image | server | `.jpg`, `.png`, `.webp` | 15MB |
| `resize-image` | Resize Image | server | `.jpg`, `.png`, `.webp` | 15MB |
| `crop-image` | Crop Image | client (canvas) | `.jpg`, `.png` | 15MB |
| `remove-background` | Remove Background | server (AI) | `.jpg`, `.png` | 15MB |
| `convert-image` | Convert Image | server | `.jpg`, `.png`, `.webp`, `.heic` | 15MB |
| `rotate-image` | Rotate Image | client (canvas) | `.jpg`, `.png` | 15MB |
| `flip-image` | Flip Image | client (canvas) | `.jpg`, `.png` | 15MB |
| `watermark-image` | Watermark Image | server | `.jpg`, `.png` | 15MB |
| `image-to-base64` | Image to Base64 | client | `.jpg`, `.png` | 5MB |

### 22.3 Text Tools (`category: text`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `word-counter` | Word Counter |
| `character-counter` | Character Counter |
| `case-converter` | Case Converter |
| `text-to-slug` | Text to Slug |
| `remove-duplicate-lines` | Remove Duplicate Lines |
| `text-diff-checker` | Text Diff Checker |
| `text-reverser` | Text Reverser |
| `lorem-ipsum-generator` | Lorem Ipsum Generator |
| `whitespace-remover` | Whitespace Remover |
| `text-sorter` | Text Sorter |

### 22.4 Developer Tools (`category: developer`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `json-formatter` | JSON Formatter |
| `json-to-csv` | JSON to CSV |
| `csv-to-json` | CSV to JSON |
| `base64-encoder-decoder` | Base64 Encoder/Decoder |
| `jwt-decoder` | JWT Decoder |
| `uuid-generator` | UUID Generator |
| `sql-formatter` | SQL Formatter |
| `html-formatter` | HTML Formatter/Minifier |
| `css-minifier` | CSS Formatter/Minifier |
| `js-minifier` | JS Formatter/Minifier |
| `xml-formatter` | XML Formatter |
| `hash-generator` | Hash Generator (MD5/SHA1/SHA256) |
| `regex-tester` | Regex Tester |
| `url-encoder-decoder` | URL Encoder/Decoder |
| `markdown-previewer` | Markdown Previewer |
| `cron-expression-generator` | Cron Expression Generator |

### 22.5 Office Tools (`category: office`) — Server-Side

| Slug | Nama | Format Diterima | Maks Ukuran |
|---|---|---|---|
| `excel-to-csv` | Excel to CSV | `.xls`, `.xlsx` | 20MB |
| `csv-to-excel` | CSV to Excel | `.csv` | 10MB |
| `word-to-pdf` | Word to PDF | `.doc`, `.docx` | 20MB |
| `powerpoint-to-pdf` | PowerPoint to PDF | `.ppt`, `.pptx` | 20MB |

### 22.6 Calculator (`category: calculator`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `percentage-calculator` | Percentage Calculator |
| `bmi-calculator` | BMI Calculator |
| `age-calculator` | Age Calculator |
| `loan-calculator` | Loan/Mortgage Calculator |
| `currency-converter` | Currency Converter |
| `unit-converter` | Unit Converter |
| `discount-calculator` | Discount Calculator |
| `tax-calculator` | Tax Calculator (PPN) |
| `date-difference-calculator` | Date Difference Calculator |

### 22.7 Color Tools (`category: color`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `hex-to-rgb` | HEX to RGB Converter |
| `rgb-to-hex` | RGB to HEX Converter |
| `color-palette-generator` | Color Palette Generator |
| `gradient-generator` | Gradient Generator |
| `contrast-checker` | Color Contrast Checker |
| `cmyk-converter` | CMYK Converter |
| `hsl-converter` | HSL Converter |

### 22.8 QR Tools (`category: qr`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `qr-code-generator` | QR Code Generator (Text/URL/WiFi/vCard) |
| `barcode-generator` | Barcode Generator |
| `qr-code-scanner` | QR Code Scanner (via kamera/upload) |
| `qr-code-with-logo` | QR Code with Logo |

### 22.9 Security Tools (`category: security`) — Seluruhnya Client-Side

| Slug | Nama |
|---|---|
| `password-generator` | Password Generator |
| `password-strength-checker` | Password Strength Checker |
| `hash-generator-security` | Hash Generator (SHA256/MD5) |
| `text-encryptor` | Text Encryption/Decryption (AES-GCM) |
| `file-hash-checker` | File Hash Checker |

---

## 23. ENVIRONMENT VARIABLES & KONFIGURASI

```env
# Umum
NEXT_PUBLIC_SITE_URL=https://dukitools.com
NEXT_PUBLIC_MAX_UPLOAD_MB=25

# Temp storage & TTL
TEMP_STORAGE_PATH=/tmp/dukitools
TEMP_FILE_TTL_MINUTES=15
CLEANUP_SECRET_TOKEN=xxxxxxxxxxxxxxxx

# Rate limiting
RATE_LIMIT_PER_MINUTE=20

# Microservice pemrosesan berat (opsional)
PROCESSING_SERVICE_URL=https://processing.dukitools.com
PROCESSING_SERVICE_API_KEY=xxxxxxxxxxxxxxxx

# Job queue (opsional, skala besar)
REDIS_URL=redis://localhost:6379

# Kontak/email
EMAIL_PROVIDER_API_KEY=xxxxxxxxxxxxxxxx
CONTACT_RECEIVER_EMAIL=hello@dukitools.com

# Analytics (opsional)
NEXT_PUBLIC_ANALYTICS_ID=xxxxxxxxxxxxxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 24. DEPLOYMENT & CI/CD

### 24.1 Rekomendasi Infrastruktur

| Komponen | Rekomendasi |
|---|---|
| Frontend (Next.js) | Vercel (native App Router support, Edge Network) atau self-hosted Node + Nginx reverse proxy |
| Microservice AI (Remove Background, dsb) | Container Docker terpisah (Node/Express atau Python FastAPI), scaling horizontal independen |
| Temp storage multi-instance | Storage bersama (S3-compatible dengan lifecycle rule auto-delete) jika deployment lebih dari satu instance |
| Redis (jika pakai job queue/rate-limit terdistribusi) | Managed Redis (Upstash/Redis Cloud) |
| Cron cleanup | Vercel Cron / cron job server / scheduled GitHub Actions, memanggil `/api/cleanup` setiap 10–15 menit |

### 24.2 Contoh Pipeline CI/CD (GitHub Actions, Ringkas)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 24.3 Cron Cleanup via GitHub Actions (Alternatif Vercel Cron)

```yaml
# .github/workflows/cleanup.yml
name: Cleanup Temp Files
on:
  schedule:
    - cron: '*/15 * * * *'
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger cleanup endpoint
        run: |
          curl -X POST https://dukitools.com/api/cleanup \
            -H "x-cleanup-token: ${{ secrets.CLEANUP_SECRET_TOKEN }}"
```

---

## 25. ROADMAP PENGEMBANGAN BERTAHAP

### Fase 1 — MVP (Fondasi + Tool Populer)
- Setup Next.js + Tailwind + struktur registry
- Layout global (Navbar, Footer, Toast system)
- Homepage dengan search real-time
- 15–20 tool client-side (Developer Tools, Text Tools, Calculator, Color Tools, Security Tools ringan) — tercepat untuk diluncurkan karena tanpa backend kompleks
- 3–5 tool server-side paling dibutuhkan (Merge PDF, Compress PDF, Compress Image, Convert Image)
- Halaman statis (About, Privacy Policy, Terms, Disclaimer, Contact)
- SEO dasar (metadata, sitemap, robots)

### Fase 2 — Ekspansi Kategori
- Lengkapi seluruh PDF Tools & Image Tools
- Tambahkan Office Tools (butuh setup LibreOffice headless atau layanan konversi)
- QR Tools lengkap
- Rate limiting & temp file cleanup otomatis production-ready
- Analytics dasar (tool paling sering dipakai)

### Fase 3 — Skala & Optimalisasi
- Migrasi tool berat (Remove Background, dsb) ke job queue (BullMQ + Redis) jika traffic tinggi
- ISR tuning untuk seluruh halaman kategori/tool
- A/B testing copy homepage & CTA
- Monitoring penuh (Sentry, Web Vitals dashboard)
- Ekspansi hingga ratusan tool mengikuti Tool Registry Pattern tanpa mengubah struktur inti

---

## 26. LANGKAH SELANJUTNYA

Dokumen ini (`rule-dukitools.md`) menetapkan **arsitektur sistem, struktur data, implementasi teknis, keamanan, SEO, dan strategi pengujian secara menyeluruh**. Langkah berikutnya adalah menyusun **`design-dukitools.md`**, yang akan mencakup:

- Design system lengkap: palet warna final, skala tipografi, spacing scale, border-radius, shadow tokens
- Spesifikasi visual detail per komponen (state default/hover/active/disabled/loading) untuk seluruh komponen di §17
- Layout responsif per breakpoint (mobile/tablet/desktop) untuk Homepage, Halaman Kategori, dan Template Halaman Tool
- Sistem warna aksen per kategori (mapping `colorClass`/`accentHex` di §5.1)
- Wireframe/mockup halaman kunci beserta micro-interaction (animasi toast, hover card, transisi state tool)

---
