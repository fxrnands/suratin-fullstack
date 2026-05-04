/** Central SEO strings for Suratin (suratin.id). Override domain via NEXT_PUBLIC_SITE_URL. */

export function getSiteDomain(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://suratin.id').replace(/\/$/, '')
}

export const SITE_CONFIG = {
  name: 'Suratin',
  get domain() {
    return getSiteDomain()
  },
  description:
    'Buat surat resmi otomatis dengan AI dalam hitungan detik. Surat lamaran kerja, resign, izin, permohonan, dan pengaduan — profesional, download PDF.',
  get ogImageDefault() {
    const base = getSiteDomain()
    return `${base}/og?title=${encodeURIComponent('Suratin — Generator Surat Resmi AI')}&subtitle=${encodeURIComponent('Buat surat resmi dengan cepat')}`
  },
  twitterHandle: '@suratin_id',
  locale: 'id_ID',
} as const

export interface PageSeoEntry {
  title: string
  description: string
  keywords: string[]
  canonical: string
}

function page(path: string, entry: Omit<PageSeoEntry, 'canonical'>): PageSeoEntry {
  return { ...entry, canonical: `${getSiteDomain()}${path}` }
}

export const PAGE_SEO = {
  homepage: page('/', {
    title: 'Suratin — Buat Surat Resmi Otomatis dengan AI | Gratis',
    description:
      'Buat surat lamaran kerja, resign, izin, permohonan, dan pengaduan resmi dengan cepat. AI membantu format formal Indonesia, siap unduh PDF.',
    keywords: [
      'buat surat online gratis',
      'generator surat resmi indonesia',
      'surat otomatis AI',
      'aplikasi surat resmi',
    ],
  }),
  generatorHub: page('/buat-surat', {
    title: 'Generator Surat Resmi AI — Pilih Jenis Surat | Suratin',
    description:
      'Pilih jenis surat yang ingin kamu buat. Isi form singkat, AI membantu susun surat profesional, lalu unduh PDF.',
    keywords: ['generator surat resmi', 'buat surat online', 'surat AI indonesia'],
  }),
  generatorLamaran: page('/buat-surat/lamaran-kerja', {
    title: 'Buat Surat Lamaran Kerja Otomatis dengan AI | Suratin',
    description:
      'Generate surat lamaran kerja profesional. Isi nama, posisi, perusahaan — AI membantu susun surat. Unduh PDF.',
    keywords: [
      'buat surat lamaran kerja otomatis',
      'generator surat lamaran kerja',
      'surat lamaran kerja AI',
      'surat lamaran kerja online gratis',
    ],
  }),
  generatorResign: page('/buat-surat/resign', {
    title: 'Buat Surat Resign Profesional Otomatis | Suratin',
    description:
      'Resign dengan sopan dan profesional. AI membantu susun surat pengunduran diri. Unduh PDF.',
    keywords: ['buat surat resign online', 'generator surat pengunduran diri', 'surat resign profesional otomatis'],
  }),
  generatorIzin: page('/buat-surat/izin', {
    title: 'Buat Surat Izin Otomatis — Kuliah, Kerja, Sekolah | Suratin',
    description:
      'Buat surat izin tidak masuk kuliah, kerja, atau sekolah. Format resmi, unduh PDF.',
    keywords: ['buat surat izin online', 'surat izin tidak masuk kuliah otomatis', 'generator surat dispensasi'],
  }),
  generatorPermohonan: page('/buat-surat/permohonan', {
    title: 'Buat Surat Permohonan Otomatis — Beasiswa, Cicilan, dan lainnya | Suratin',
    description:
      'Susun surat permohonan beasiswa, keringanan cicilan, atau keperluan resmi lain. Unduh PDF.',
    keywords: [
      'buat surat permohonan online',
      'generator surat permohonan beasiswa',
      'surat permohonan keringanan cicilan otomatis',
    ],
  }),
  generatorPengaduan: page('/buat-surat/pengaduan', {
    title: 'Buat Surat Pengaduan Resmi ke PLN, BPJS, Bank | Suratin',
    description:
      'Susun surat pengaduan resmi yang jelas dan sopan. Cocok untuk PLN, BPJS, bank, atau instansi lain. Unduh PDF.',
    keywords: ['buat surat komplain online', 'surat pengaduan resmi otomatis', 'generator surat pengaduan'],
  }),
  contohHub: page('/contoh', {
    title: 'Contoh Surat Resmi Indonesia 2026 — Semua Jenis | Suratin',
    description:
      'Kumpulan contoh surat resmi Indonesia: lamaran kerja, resign, izin, permohonan, pengaduan — lalu buat versimu dengan AI.',
    keywords: ['contoh surat resmi indonesia', 'contoh surat 2026', 'kumpulan contoh surat'],
  }),
  contohLamaran: page('/contoh/lamaran-kerja', {
    title: 'Contoh Surat Lamaran Kerja 2026 — Template & Panduan | Suratin',
    description:
      'Contoh surat lamaran kerja yang rapi untuk HRD. Fresh graduate, berpengalaman, via email, dan lainnya. Buat versimu dengan AI.',
    keywords: ['contoh surat lamaran kerja', 'template surat lamaran kerja 2026', 'surat lamaran kerja yang baik dan benar'],
  }),
  contohLamaranFreshGrad: page('/contoh/lamaran-kerja/fresh-graduate', {
    title: 'Contoh Surat Lamaran Kerja Fresh Graduate 2026 + Generator AI | Suratin',
    description:
      'Contoh surat lamaran untuk fresh graduate: fokus pada pendidikan, organisasi, dan motivasi. Lanjut buat suratmu otomatis.',
    keywords: ['contoh surat lamaran kerja fresh graduate', 'surat lamaran fresh grad 2026', 'lamaran kerja baru lulus kuliah'],
  }),
  contohLamaranPengalaman: page('/contoh/lamaran-kerja/pengalaman-kerja', {
    title: 'Contoh Surat Lamaran Kerja dengan Pengalaman Kerja | Suratin',
    description:
      'Contoh lamaran yang menonjolkan pengalaman relevan dan pencapaian. Sesuaikan posisi dan perusahaan tujuan.',
    keywords: ['contoh surat lamaran berpengalaman', 'lamaran kerja staff berpengalaman', 'surat lamaran kerja profesional'],
  }),
  contohLamaranViaEmail: page('/contoh/lamaran-kerja/via-email', {
    title: 'Contoh Surat Lamaran Kerja via Email (Body Email) | Suratin',
    description:
      'Format singkat lamaran lewat email: subjek, pembuka, isi, penutup, dan lampiran. Hindari kesalahan umum.',
    keywords: ['contoh surat lamaran via email', 'body email lamaran kerja', 'lamaran kerja online email'],
  }),
  contohLamaranTulisTangan: page('/contoh/lamaran-kerja/tulis-tangan', {
    title: 'Contoh Surat Lamaran Kerja Tulis Tangan | Suratin',
    description:
      'Struktur surat lamaran tulis tangan yang tetap rapi: margin, paragraf, dan bagian wajib yang sering diminta HRD.',
    keywords: ['contoh surat lamaran tulis tangan', 'format lamaran kerja tulisan tangan'],
  }),
  contohLamaranTanpaPengalaman: page('/contoh/lamaran-kerja/tanpa-pengalaman', {
    title: 'Contoh Surat Lamaran Kerja Tanpa Pengalaman | Suratin',
    description:
      'Fokus pada soft skill, magang, proyek kuliah, dan semangat belajar bila belum punya pengalaman kerja formal.',
    keywords: ['contoh surat lamaran tanpa pengalaman', 'lamaran kerja belum pernah kerja'],
  }),
  contohResign: page('/contoh/resign', {
    title: 'Contoh Surat Resign yang Baik dan Benar 2026 | Suratin',
    description:
      'Contoh surat pengunduran diri profesional. Pilih nada yang sopan, cantumkan tanggal efektif, dan ucap terima kasih.',
    keywords: ['contoh surat resign', 'surat pengunduran diri yang baik dan benar', 'cara resign profesional'],
  }),
  contohResignBaikBaik: page('/contoh/resign/baik-baik', {
    title: 'Contoh Surat Resign Baik-Baik yang Profesional 2026 | Suratin',
    description:
      'Resign tanpa membakar jembatan: bahasa positif, jelas, dan singkat. Dilengkapi struktur standar surat resmi.',
    keywords: ['contoh surat resign baik baik', 'surat resign yang profesional', 'cara resign tidak merusak hubungan'],
  }),
  contohResignViaEmail: page('/contoh/resign/via-email', {
    title: 'Contoh Surat Resign via Email | Suratin',
    description:
      'Contoh email resign: subjek, salam, isi surat ringkas, dan lampiran PDF bila perlu. Tetap hormati notice period.',
    keywords: ['contoh surat resign via email', 'email resign kerja', 'surat resign pdf lampiran'],
  }),
  contohResignMendadak: page('/contoh/resign/mendadak', {
    title: 'Contoh Surat Resign Mendadak (Singkat & Sopan) | Suratin',
    description:
      'Jika keadaan memaksa resign cepat, gunakan bahasa tetap sopan dan jelaskan batas waktu yang realistis.',
    keywords: ['contoh surat resign mendadak', 'resign cepat sopan', 'surat resign singkat'],
  }),
  contohIzin: page('/contoh/izin', {
    title: 'Contoh Surat Izin Tidak Masuk Kuliah, Kerja & Sekolah 2026 | Suratin',
    description:
      'Contoh surat izin resmi: jelas perihal, rentang tanggal, dan pihak dituju. Sesuaikan dengan aturan institusimu.',
    keywords: ['contoh surat izin tidak masuk kuliah', 'surat izin sakit kerja', 'contoh surat dispensasi mahasiswa'],
  }),
  contohIzinTidakMasukKuliah: page('/contoh/izin/tidak-masuk-kuliah', {
    title: 'Contoh Surat Izin Tidak Masuk Kuliah | Suratin',
    description:
      'Format ke dosen/BAK: identitas, mata kuliah (opsional), tanggal tidak hadir, alasan singkat, dan permohonan dispensasi.',
    keywords: ['contoh surat izin tidak masuk kuliah', 'surat izin kuliah', 'izin tidak hadir perkuliahan'],
  }),
  contohIzinSakitKerja: page('/contoh/izin/sakit-kerja', {
    title: 'Contoh Surat Izin Sakit Kerja | Suratin',
    description:
      'Contoh izin tidak masuk kerja karena sakit: singkat, jujur, dan sertakan estimasi tanggal kembali bila bisa.',
    keywords: ['contoh surat izin sakit kerja', 'surat izin tidak masuk kerja', 'izin sakit ke HRD'],
  }),
  contohIzinDispensasiMahasiswa: page('/contoh/izin/dispensasi-mahasiswa', {
    title: 'Contoh Surat Dispensasi Mahasiswa | Suratin',
    description:
      'Permohonan dispensasi untuk ujian, kegiatan, atau administrasi kampus. Gunakan bahasa formal dan perihal jelas.',
    keywords: ['contoh surat dispensasi mahasiswa', 'surat dispensasi kuliah', 'dispensasi ujian'],
  }),
  contohPermohonan: page('/contoh/permohonan', {
    title: 'Contoh Surat Permohonan Beasiswa, Cicilan & Lainnya 2026 | Suratin',
    description:
      'Contoh surat permohonan yang sopan dan meyakinkan: tujuan, alasan, dan permohonan tertulis yang rapi.',
    keywords: [
      'contoh surat permohonan beasiswa',
      'surat permohonan keringanan cicilan',
      'cara membuat surat permohonan yang baik',
    ],
  }),
  contohPermohonanBeasiswa: page('/contoh/permohonan/beasiswa', {
    title: 'Contoh Surat Permohonan Beasiswa | Suratin',
    description:
      'Sampaikan kebutuhan ekonomi, prestasi, dan rencana studi dengan bahasa formal. Lampirkan bukti jika diminta.',
    keywords: ['contoh surat permohonan beasiswa', 'surat permohonan bantuan pendidikan'],
  }),
  contohPermohonanKeringananCicilan: page('/contoh/permohonan/keringanan-cicilan', {
    title: 'Contoh Surat Permohonan Keringanan Cicilan | Suratin',
    description:
      'Jelaskan situasi keuangan secara sopan, ajukan skema yang realistis, dan lampirkan bukti pendukung bila ada.',
    keywords: ['contoh surat permohonan keringanan cicilan', 'surat permohonan cicilan bank', 'keringanan angsuran'],
  }),
  contohPermohonanKeringananUkt: page('/contoh/permohonan/keringanan-ukt', {
    title: 'Contoh Surat Permohonan Keringanan UKT | Suratin',
    description:
      'Format ke universitas: identitas mahasiswa, semester, nominal, alasan, dan permohonan penjadwalan atau pengurangan.',
    keywords: ['contoh surat permohonan keringanan UKT', 'surat keringanan uang kuliah', 'permohonan cicilan UKT'],
  }),
  contohPengaduan: page('/contoh/pengaduan', {
    title: 'Contoh Surat Pengaduan ke PLN, BPJS & Bank 2026 | Suratin',
    description:
      'Contoh surat pengaduan resmi: uraikan fakta, lampirkan nomor referensi, dan sampaikan harapan penyelesaian.',
    keywords: ['contoh surat pengaduan', 'surat komplain resmi', 'format surat pengaduan konsumen'],
  }),
  contohPengaduanPln: page('/contoh/pengaduan/pln', {
    title: 'Contoh Surat Pengaduan ke PLN yang Jelas | Suratin',
    description:
      'Cantumkan ID pelanggan, periode tagihan atau gangguan, kronologi singkat, dan permintaan tindakan (koreksi/kunjungan).',
    keywords: ['contoh surat komplain ke PLN', 'surat pengaduan tagihan listrik', 'surat keberatan tagihan PLN'],
  }),
  contohPengaduanBpjs: page('/contoh/pengaduan/bpjs', {
    title: 'Contoh Surat Pengaduan ke BPJS Kesehatan | Suratin',
    description:
      'Tulis identitas peserta, nomor kartu, kronologi klaim/layanan, dan permohonan penjelasan atau perbaikan.',
    keywords: ['contoh surat pengaduan ke BPJS', 'surat komplain BPJS kesehatan', 'cara lapor ke BPJS resmi'],
  }),
  contohPengaduanBank: page('/contoh/pengaduan/bank', {
    title: 'Contoh Surat Pengaduan ke Bank | Suratin',
    description:
      'Sertakan nomor rekening/referensi transaksi, tanggal kejadian, dan tuntutan penyelesaian yang masuk akal.',
    keywords: ['contoh surat pengaduan ke bank', 'surat komplain bank', 'pengaduan layanan perbankan'],
  }),
} as const satisfies Record<string, PageSeoEntry>

export type PageSeoKey = keyof typeof PAGE_SEO
