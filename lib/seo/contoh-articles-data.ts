import type { PageSeoKey } from '@/lib/seo-config'

import type { RelatedPageLink } from '@/components/seo/related-pages'

export const CONTOH_ARTICLE_KEYS = [
  'contohLamaranFreshGrad',
  'contohLamaranPengalaman',
  'contohLamaranViaEmail',
  'contohLamaranTulisTangan',
  'contohLamaranTanpaPengalaman',
  'contohResignBaikBaik',
  'contohResignViaEmail',
  'contohResignMendadak',
  'contohIzinTidakMasukKuliah',
  'contohIzinSakitKerja',
  'contohIzinDispensasiMahasiswa',
  'contohPermohonanBeasiswa',
  'contohPermohonanKeringananCicilan',
  'contohPermohonanKeringananUkt',
  'contohPengaduanPln',
  'contohPengaduanBpjs',
  'contohPengaduanBank',
] as const satisfies readonly PageSeoKey[]

export type ContohArticleSeoKey = (typeof CONTOH_ARTICLE_KEYS)[number]

export interface ContohArticleContent {
  seoKey: ContohArticleSeoKey
  h1: string
  intro: string[]
  exampleBlocks: { title: string; pre: string }[]
  tipsTitle: string
  tips: string[]
  faq: { q: string; a: string }[]
  howToSteps: { name: string; text: string }[]
  breadcrumbs: { name: string; path: string }[]
  related: RelatedPageLink[]
  ctaTop: { title: string; description: string; ctaText: string; ctaUrl: string }
  ctaBottom: { title: string; description: string; ctaText: string; ctaUrl: string; variant?: 'default' | 'dark' }
}

const defaultHowTo = (topic: string) => [
  { name: 'Buka generator Suratin', text: 'Pilih jenis surat yang sesuai di halaman Buat Surat.' },
  { name: 'Isi data singkat', text: 'Lengkapi kolom identitas dan konteks surat dengan jujur dan rapi.' },
  { name: 'Tinjau hasil', text: 'Baca ulang surat yang dihasilkan, sesuaikan detail bila perlu.' },
  { name: 'Unduh PDF', text: 'Gunakan tombol unduh untuk menyimpan versi resmi.' },
]

function crumbs(entries: { label: string; path: string }[]): { name: string; path: string }[] {
  return entries.map((e) => ({ name: e.label, path: e.path }))
}

export function buildContohArticles(): Record<ContohArticleSeoKey, ContohArticleContent> {
  return {
    contohLamaranFreshGrad: {
      seoKey: 'contohLamaranFreshGrad',
      h1: 'Contoh surat lamaran kerja fresh graduate yang rapi',
      intro: [
        'Fresh graduate sering bingung menonjolkan apa di lamaran karena belum punya pengalaman kerja panjang. Fokusmu adalah pendidikan, organisasi, proyek, dan motivasi belajar — ditulis dengan bahasa formal Indonesia.',
        'Contoh berikut memakai struktur surat lamaran umum: pembuka, perkenalan singkat, alasan memilih perusahaan, penutup, dan lampiran.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh badan surat (singkat)',
          pre: `Dengan hormat,\n\nPerkenalkan, saya [Nama Lengkap], lulusan [Program Studi] [Universitas] angkatan [Tahun]. Saya berminat melamar sebagai [Posisi] di [Nama Perusahaan] karena [1–2 kalimat alasan relevan].\n\nSelama kuliah, saya [organisasi/proyek/magang ringkas]. Saya yakin keterampilan [X, Y] dapat mendukung tim [Departemen].\n\nTerlampir CV dan transkrip. Atas perhatiannya, saya ucapkan terima kasih.\n\nHormat saya,\n\n[Nama Lengkap]`,
        },
      ],
      tipsTitle: 'Tips lamaran fresh graduate',
      tips: [
        'Sesuaikan perusahaan dan posisi — hindari template generik tanpa nama perusahaan.',
        'Tunjukkan relevansi jurusan dengan posisi yang dilamar.',
        'Gunakan bahasa positif; hindari klaim berlebihan.',
      ],
      faq: [
        {
          q: 'Apakah lamaran harus satu halaman?',
          a: 'Idealnya ringkas (satu halaman). HRD sering membaca cepat; gunakan poin kuat di paragraf awal.',
        },
        {
          q: 'Perlu menyebutkan IPK?',
          a: 'Boleh jika IPK membantu profilmu; jika tidak, fokus pada proyek dan soft skill.',
        },
      ],
      howToSteps: defaultHowTo('lamaran'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
        { label: 'Fresh graduate', path: '/contoh/lamaran-kerja/fresh-graduate' },
      ]),
      related: [
        { href: '/contoh/lamaran-kerja/pengalaman-kerja', label: 'Contoh lamaran berpengalaman' },
        { href: '/contoh/lamaran-kerja/via-email', label: 'Contoh lamaran via email' },
        { href: '/buat-surat/lamaran-kerja', label: 'Buat lamaran dengan AI' },
      ],
      ctaTop: {
        title: 'Buat surat lamaran versimu',
        description: 'Isi data singkat — Suratin membantu merapikan format surat resmi.',
        ctaText: 'Mulai buat lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
      },
      ctaBottom: {
        title: 'Siap kirim lamaran?',
        description: 'Unduh PDF dan sesuaikan detail sebelum dikirim ke HRD.',
        ctaText: 'Buka generator lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
        variant: 'dark',
      },
    },
    contohLamaranPengalaman: {
      seoKey: 'contohLamaranPengalaman',
      h1: 'Contoh surat lamaran kerja dengan pengalaman kerja',
      intro: [
        'Untuk kandidat berpengalaman, lamaran perlu menonjolkan pencapaian terukur dan relevansi dengan posisi baru.',
        'Gunakan bahasa formal, ringkas, dan arahkan pembaca pada poin nilai tambahmu bagi perusahaan.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh paragraf pengalaman',
          pre: `Pada posisi sebelumnya di [Perusahaan], saya bertanggung jawab atas [ruang lingkup]. Salah satu hasil yang relevan: [metrik/pencapaian]. Pengalaman ini mendukung lamaran saya sebagai [Posisi] di [Perusahaan Tujuan].`,
        },
      ],
      tipsTitle: 'Tips lamaran berpengalaman',
      tips: [
        'Cantumkan metrik (angka, persentase, skala tim) bila memungkinkan.',
        'Jelaskan alasan berpindah secara netral dan profesional.',
      ],
      faq: [
        {
          q: 'Apakah perlu menyebut gaji di lamaran?',
          a: 'Umumnya tidak di surat lamaran awal; diskusi gaji sering di tahap selanjutnya.',
        },
      ],
      howToSteps: defaultHowTo('lamaran'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
        { label: 'Pengalaman kerja', path: '/contoh/lamaran-kerja/pengalaman-kerja' },
      ]),
      related: [
        { href: '/contoh/lamaran-kerja/fresh-graduate', label: 'Contoh lamaran fresh graduate' },
        { href: '/buat-surat/lamaran-kerja', label: 'Generator lamaran' },
      ],
      ctaTop: {
        title: 'Buat lamaran dengan data pengalamanmu',
        description: 'Form Suratin membantu menyusun struktur surat formal.',
        ctaText: 'Buat lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
      },
      ctaBottom: {
        title: 'Rapikan lamaran sebelum kirim',
        description: 'Review hasil AI, lalu unduh PDF.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/lamaran-kerja',
        variant: 'dark',
      },
    },
    contohLamaranViaEmail: {
      seoKey: 'contohLamaranViaEmail',
      h1: 'Contoh surat lamaran kerja via email',
      intro: [
        'Lamaran via email membutuhkan subjek yang jelas, badan email ringkas, dan lampiran PDF rapi.',
        'Hindari mengirim hanya tautan tanpa konteks; lampirkan CV dan surat lamaran dalam format standar.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh subjek email',
          pre: `Lamaran Pekerjaan — [Posisi] — [Nama Lengkap]`,
        },
        {
          title: 'Contoh pembuka email',
          pre: `Yth. Tim Rekrutmen [Perusahaan],\n\nPerkenalkan, saya [Nama], berminat pada lowongan [Posisi]. Surat lamaran dan CV terlampir.\n\nHormat saya,\n[Nama]`,
        },
      ],
      tipsTitle: 'Tips email lamaran',
      tips: [
        'Gunakan format PDF untuk lampiran; nama file profesional.',
        'Kirim dari email yang sopan (hindari nickname aneh).',
      ],
      faq: [
        {
          q: 'Apakah body email harus panjang?',
          a: 'Cukup ringkas; detail ada di lampiran. Fokus pada perkenalan dan posisi yang dilamar.',
        },
      ],
      howToSteps: defaultHowTo('lamaran'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
        { label: 'Via email', path: '/contoh/lamaran-kerja/via-email' },
      ]),
      related: [
        { href: '/contoh/lamaran-kerja/tulis-tangan', label: 'Contoh lamaran tulis tangan' },
        { href: '/buat-surat/lamaran-kerja', label: 'Buat lamaran' },
      ],
      ctaTop: {
        title: 'Susun surat lamaran dulu, lalu tempel ke email',
        description: 'Gunakan generator untuk struktur surat resmi, lalu salin atau lampirkan PDF.',
        ctaText: 'Buat lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
      },
      ctaBottom: {
        title: 'Butuh PDF lamaran?',
        description: 'Generator Suratin membantu menyusun teks surat.',
        ctaText: 'Mulai sekarang',
        ctaUrl: '/buat-surat/lamaran-kerja',
        variant: 'dark',
      },
    },
    contohLamaranTulisTangan: {
      seoKey: 'contohLamaranTulisTangan',
      h1: 'Contoh surat lamaran kerja tulis tangan',
      intro: [
        'Tulis tangan tetap membutuhkan struktur yang sama: kop (opsional), tanggal, tujuan, salam, isi, penutup, dan tanda tangan.',
        'Gunakan kertas bersih, margin cukup, dan tulisan mudah dibaca.',
      ],
      exampleBlocks: [
        {
          title: 'Struktur minimal',
          pre: `[Kota], [Tanggal]\n\nKepada Yth.\n[HRD / Pimpinan]\n[Perusahaan]\ndi Tempat\n\nDengan hormat,\n\n[Isi lamaran ringkas]\n\nHormat saya,\n\n[Tanda tangan]\n[Nama terang]`,
        },
      ],
      tipsTitle: 'Tips tulis tangan',
      tips: ['Hindari coretan; jika salah banyak, ganti kertas.', 'Samakan format dengan persyaratan lowongan.'],
      faq: [{ q: 'Apakah wajib bermaterai?', a: 'Tergantung permintaan perusahaan; ikuti instruksi lowongan.' }],
      howToSteps: defaultHowTo('lamaran'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
        { label: 'Tulis tangan', path: '/contoh/lamaran-kerja/tulis-tangan' },
      ]),
      related: [
        { href: '/contoh/lamaran-kerja/via-email', label: 'Lamaran via email' },
        { href: '/buat-surat/lamaran-kerja', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Susun draf digital dulu',
        description: 'Lebih mudah mengoreksi di layar sebelum menulis ulang.',
        ctaText: 'Buat draf lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
      },
      ctaBottom: {
        title: 'Siap tulis tangan?',
        description: 'Gunakan teks dari generator sebagai acuan.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/lamaran-kerja',
        variant: 'dark',
      },
    },
    contohLamaranTanpaPengalaman: {
      seoKey: 'contohLamaranTanpaPengalaman',
      h1: 'Contoh surat lamaran kerja tanpa pengalaman',
      intro: [
        'Tanpa pengalaman formal, kamu bisa menonjolkan magang, organisasi, volunteer, proyek akademik, dan sikap belajar.',
        'Hindari permohonan yang terdengar putus asa; fokus pada kontribusi yang bisa kamu berikan.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh kalimat pengalaman informal',
          pre: `Meskipun belum memiliki pengalaman kerja penuh waktu, saya aktif di [organisasi/proyek] yang melatih keterampilan [X]. Saya antusias mempelajari proses di [Perusahaan] dan berkontribusi pada tim.`,
        },
      ],
      tipsTitle: 'Tips lamaran tanpa pengalaman',
      tips: ['Sebutkan soft skill spesifik (komunikasi, analisis, kolaborasi).', 'Tunjukkan rencana belajar di perusahaan.'],
      faq: [{ q: 'Apakah boleh jujur belum punya pengalaman?', a: 'Ya, dengan framing positif dan bukti aktivitas lain.' }],
      howToSteps: defaultHowTo('lamaran'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Lamaran kerja', path: '/contoh/lamaran-kerja' },
        { label: 'Tanpa pengalaman', path: '/contoh/lamaran-kerja/tanpa-pengalaman' },
      ]),
      related: [
        { href: '/contoh/lamaran-kerja/fresh-graduate', label: 'Fresh graduate' },
        { href: '/buat-surat/lamaran-kerja', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Bangun lamaran dari aktivitasmu',
        description: 'Isi form — AI membantu merapikan bahasa formal.',
        ctaText: 'Buat lamaran',
        ctaUrl: '/buat-surat/lamaran-kerja',
      },
      ctaBottom: {
        title: 'Mulai dari draf',
        description: 'Edit hasil generator agar sesuai pengalamanmu.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/lamaran-kerja',
        variant: 'dark',
      },
    },
    contohResignBaikBaik: {
      seoKey: 'contohResignBaikBaik',
      h1: 'Contoh surat resign baik-baik yang profesional',
      intro: [
        'Surat resign yang baik menjaga reputasi dan hubungan profesional. Gunakan bahasa positif, cantumkan tanggal efektif, dan ucapkan terima kasih.',
        'Hindari keluhan atau kritik; surat ini bisa disimpan arsip HRD.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh isi utama',
          pre: `Dengan ini saya mengajukan pengunduran diri dari jabatan [Posisi] di [Perusahaan], efektif per tanggal [Tanggal Terakhir Kerja].\n\nSaya berterima kasih atas kesempatan belajar dan berkontribusi. Saya berkomitmen menyelesaikan serah terima tugas selama masa transisi.\n\nHormat saya,\n[Nama]`,
        },
      ],
      tipsTitle: 'Tips resign sopan',
      tips: [
        'Sesuaikan notice period dengan kontrak.',
        'Tawarkan bantu transisi singkat bila memungkinkan.',
      ],
      faq: [
        {
          q: 'Apakah wajib menyebut alasan resign?',
          a: 'Tidak wajib detail; alasan netral seperti pengembangan karier sudah cukup sering dipakai.',
        },
      ],
      howToSteps: defaultHowTo('surat resign'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Resign', path: '/contoh/resign' },
        { label: 'Baik-baik', path: '/contoh/resign/baik-baik' },
      ]),
      related: [
        { href: '/contoh/resign/via-email', label: 'Resign via email' },
        { href: '/contoh/resign/mendadak', label: 'Resign mendadak' },
        { href: '/buat-surat/resign', label: 'Generator resign' },
      ],
      ctaTop: {
        title: 'Buat surat resign versimu',
        description: 'Isi data perusahaan dan tanggal efektif — teks surat dibantu AI.',
        ctaText: 'Buat surat resign',
        ctaUrl: '/buat-surat/resign',
      },
      ctaBottom: {
        title: 'Siap unduh PDF?',
        description: 'Tinjau ulang sebelum serahkan ke HRD atau atasan.',
        ctaText: 'Buka generator resign',
        ctaUrl: '/buat-surat/resign',
        variant: 'dark',
      },
    },
    contohResignViaEmail: {
      seoKey: 'contohResignViaEmail',
      h1: 'Contoh surat resign via email',
      intro: [
        'Email resign tetap harus sopan dan jelas. Lampirkan PDF surat resmi bila perusahaan meminta format formal.',
        'Subjek email sebaiknya menyebut kata kunci resign dan nama.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh subjek',
          pre: `Pengunduran Diri — [Nama] — [Posisi]`,
        },
      ],
      tipsTitle: 'Tips email resign',
      tips: ['Kirim ke alamat HRD/atasan sesuai prosedur.', 'Tetap singkat di body email; detail di lampiran.'],
      faq: [{ q: 'Apakah email saja cukup?', a: 'Tergantung kebijakan perusahaan; ikuti SOP internal jika ada.' }],
      howToSteps: defaultHowTo('surat resign'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Resign', path: '/contoh/resign' },
        { label: 'Via email', path: '/contoh/resign/via-email' },
      ]),
      related: [
        { href: '/contoh/resign/baik-baik', label: 'Resign baik-baik' },
        { href: '/buat-surat/resign', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Siapkan teks surat resign',
        description: 'Salin ke email atau lampirkan PDF.',
        ctaText: 'Buat surat resign',
        ctaUrl: '/buat-surat/resign',
      },
      ctaBottom: {
        title: 'Butuh PDF resign?',
        description: 'Generator membantu format surat resmi.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/resign',
        variant: 'dark',
      },
    },
    contohResignMendadak: {
      seoKey: 'contohResignMendadak',
      h1: 'Contoh surat resign mendadak (tetap sopan)',
      intro: [
        'Resign mendadak tetap membutuhkan bahasa profesional. Jelaskan batas waktu yang bisa kamu penuhi dan upayakan serah terima singkat.',
        'Hindari menyalahkan pihak lain di surat resmi.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh kalimat netral',
          pre: `Atas keadaan yang tidak dapat dihindari, saya perlu mengakhiri kontrak lebih awal dari jadwal ideal. Saya akan berusaha menyelesaikan pekerjaan mendesak hingga [tanggal].`,
        },
      ],
      tipsTitle: 'Tips resign mendadak',
      tips: ['Dokumentasikan alasan secara internal bila perlu, bukan di surat publik.', 'Koordinasikan dengan atasan langsung.'],
      faq: [{ q: 'Apakah risiko hukum?', a: 'Tergantung kontrak; konsultasi internal/HRD jika bingung.' }],
      howToSteps: defaultHowTo('surat resign'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Resign', path: '/contoh/resign' },
        { label: 'Mendadak', path: '/contoh/resign/mendadak' },
      ]),
      related: [
        { href: '/contoh/resign/baik-baik', label: 'Resign baik-baik' },
        { href: '/buat-surat/resign', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Susun surat resign cepat',
        description: 'Gunakan generator untuk merapikan bahasa formal.',
        ctaText: 'Buat surat',
        ctaUrl: '/buat-surat/resign',
      },
      ctaBottom: {
        title: 'Unduh dan sesuaikan',
        description: 'Pastikan tanggal efektif sesuai kebutuhanmu.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/resign',
        variant: 'dark',
      },
    },
    contohIzinTidakMasukKuliah: {
      seoKey: 'contohIzinTidakMasukKuliah',
      h1: 'Contoh surat izin tidak masuk kuliah',
      intro: [
        'Surat izin kuliah biasanya ditujukan ke dosen/BAK/wakil dekan. Cantumkan identitas, mata kuliah (bila perlu), tanggal, dan alasan singkat.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh badan surat',
          pre: `Dengan hormat,\n\nSaya [Nama], NIM [NIM], mahasiswa [Program] angkatan [X]. Dengan ini mengajukan izin tidak hadir pada perkuliahan [Mata Kuliah] tanggal [Tanggal] karena [alasan singkat].\n\nDemikian permohonan ini, atas perhatiannya saya ucapkan terima kasih.`,
        },
      ],
      tipsTitle: 'Tips izin kuliah',
      tips: ['Kirim sebelum batas waktu yang ditetapkan dosen/fakultas.', 'Lampirkan bukti jika diminta (misal surat dokter).'],
      faq: [{ q: 'Apakah email diterima?', a: 'Banyak kampus menerima email; pastikan format dan penerima benar.' }],
      howToSteps: defaultHowTo('surat izin'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Izin', path: '/contoh/izin' },
        { label: 'Tidak masuk kuliah', path: '/contoh/izin/tidak-masuk-kuliah' },
      ]),
      related: [
        { href: '/contoh/izin/dispensasi-mahasiswa', label: 'Dispensasi mahasiswa' },
        { href: '/buat-surat/izin', label: 'Generator izin' },
      ],
      ctaTop: {
        title: 'Buat surat izin',
        description: 'Isi tanggal dan alasan — format surat dibantu AI.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/izin',
      },
      ctaBottom: {
        title: 'Unduh PDF izin',
        description: 'Sesuaikan penerima surat dengan aturan kampus.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/izin',
        variant: 'dark',
      },
    },
    contohIzinSakitKerja: {
      seoKey: 'contohIzinSakitKerja',
      h1: 'Contoh surat izin sakit kerja',
      intro: [
        'Izin sakit ke HRD/atasan harus singkat: tanggal tidak masuk, estimasi kembali kerja, dan lampiran surat dokter bila diminta.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh isi',
          pre: `Dengan hormat,\n\nSaya [Nama], [Jabatan/Divisi], tidak dapat hadir bekerja pada tanggal [Tanggal] karena kondisi kesehatan. Rencana kembali bekerja pada [Tanggal].\n\nTerlampir surat keterangan dokter (jika ada).\n\nHormat saya,\n[Nama]`,
        },
      ],
      tipsTitle: 'Tips izin kerja',
      tips: ['Ikuti prosedur absensi perusahaan (telepon/WA/email).', 'Jangan bagikan diagnosis sensitif berlebihan jika tidak perlu.'],
      faq: [{ q: 'Apakah harus lengkap?', a: 'Ikuti kebijakan HRD; yang penting tanggal dan kontak terbaca jelas.' }],
      howToSteps: defaultHowTo('surat izin'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Izin', path: '/contoh/izin' },
        { label: 'Sakit kerja', path: '/contoh/izin/sakit-kerja' },
      ]),
      related: [
        { href: '/contoh/izin/tidak-masuk-kuliah', label: 'Izin kuliah' },
        { href: '/buat-surat/izin', label: 'Generator izin' },
      ],
      ctaTop: {
        title: 'Buat surat izin kerja',
        description: 'Generator Suratin mendukung rentang tanggal dan alasan singkat.',
        ctaText: 'Buat izin',
        ctaUrl: '/buat-surat/izin',
      },
      ctaBottom: {
        title: 'Siap unduh?',
        description: 'Periksa identitas penerima surat.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/izin',
        variant: 'dark',
      },
    },
    contohIzinDispensasiMahasiswa: {
      seoKey: 'contohIzinDispensasiMahasiswa',
      h1: 'Contoh surat dispensasi mahasiswa',
      intro: [
        'Dispensasi umumnya meminta perihal jelas: kegiatan yang bentrok, waktu ujian, atau kewajiban administrasi.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh permohonan',
          pre: `Saya mengajukan dispensasi untuk mengikuti [Ujian/Kegiatan] pada [Tanggal/Waktu] karena [alasan singkat].`,
        },
      ],
      tipsTitle: 'Tips dispensasi',
      tips: ['Lampirkan bukti undangan/jadwal bila ada.', 'Kirim ke bagian akademik sesuai aturan kampus.'],
      faq: [{ q: 'Apa beda izin dan dispensasi?', a: 'Istilah di kampus bisa berbeda; ikuti format yang diminta fakultas.' }],
      howToSteps: defaultHowTo('dispensasi'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Izin', path: '/contoh/izin' },
        { label: 'Dispensasi mahasiswa', path: '/contoh/izin/dispensasi-mahasiswa' },
      ]),
      related: [
        { href: '/contoh/izin/tidak-masuk-kuliah', label: 'Izin tidak masuk kuliah' },
        { href: '/buat-surat/izin', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Buat surat dispensasi',
        description: 'Gunakan generator untuk merapikan bahasa formal.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/izin',
      },
      ctaBottom: {
        title: 'Unduh PDF',
        description: 'Sesuaikan penerima dengan aturan kampus.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/izin',
        variant: 'dark',
      },
    },
    contohPermohonanBeasiswa: {
      seoKey: 'contohPermohonanBeasiswa',
      h1: 'Contoh surat permohonan beasiswa',
      intro: [
        'Surat permohonan beasiswa perlu menjelaskan latar belakang ekonomi/prestasi, rencana studi, dan manfaat yang kamu harapkan.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh paragraf inti',
          pre: `Saya bermohon dipertimbangkan sebagai penerima [nama beasiswa] untuk mendukung studi saya di [Program]. Saya melampirkan [daftar lampiran singkat].`,
        },
      ],
      tipsTitle: 'Tips permohonan beasiswa',
      tips: ['Gunakan bahasa sopan dan fakta.', 'Pastikan nama program dan instansi benar.'],
      faq: [{ q: 'Berapa panjang surat?', a: 'Ikuti panduan penyedia beasiswa; umumnya 1–2 halaman.' }],
      howToSteps: defaultHowTo('surat permohonan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Permohonan', path: '/contoh/permohonan' },
        { label: 'Beasiswa', path: '/contoh/permohonan/beasiswa' },
      ]),
      related: [
        { href: '/contoh/permohonan/keringanan-ukt', label: 'Keringanan UKT' },
        { href: '/buat-surat/permohonan', label: 'Generator permohonan' },
      ],
      ctaTop: {
        title: 'Buat surat permohonan',
        description: 'Isi tujuan instansi dan detail ajuan — AI membantu struktur surat.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/permohonan',
      },
      ctaBottom: {
        title: 'Rapikan bahasa formal',
        description: 'Review sebelum kirim ke kampus/yayasan.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/permohonan',
        variant: 'dark',
      },
    },
    contohPermohonanKeringananCicilan: {
      seoKey: 'contohPermohonanKeringananCicilan',
      h1: 'Contoh surat permohonan keringanan cicilan',
      intro: [
        'Ajukan keringanan dengan fakta keuangan ringkas, usulan skema cicilan, dan permohonan peninjauan resmi.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh kalimat permohonan',
          pre: `Berdasarkan kondisi keuangan saat ini, saya mohon pertimbangan untuk [penjadwalan ulang/pengurangan cicilan sementara] terkait fasilitas [produk].`,
        },
      ],
      tipsTitle: 'Tips permohonan cicilan',
      tips: ['Cantumkan nomor kontrak/rekening bila ada.', 'Ajukan solusi yang masuk akal.'],
      faq: [{ q: 'Perlu melampirkan bukti?', a: 'Seringkali iya; siapkan dokumen pendukung sesuai permintaan bank/lembaga.' }],
      howToSteps: defaultHowTo('surat permohonan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Permohonan', path: '/contoh/permohonan' },
        { label: 'Keringanan cicilan', path: '/contoh/permohonan/keringanan-cicilan' },
      ]),
      related: [
        { href: '/contoh/permohonan/keringanan-ukt', label: 'Keringanan UKT' },
        { href: '/buat-surat/permohonan', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Buat surat permohonan',
        description: 'Struktur surat resmi lebih cepat dengan generator.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/permohonan',
      },
      ctaBottom: {
        title: 'Unduh PDF',
        description: 'Sesuaikan identitas penerima (bank/lembaga).',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/permohonan',
        variant: 'dark',
      },
    },
    contohPermohonanKeringananUkt: {
      seoKey: 'contohPermohonanKeringananUkt',
      h1: 'Contoh surat permohonan keringanan UKT',
      intro: [
        'Permohonan UKT biasanya ditujukan ke bagian keuangan kampus/biro akademik. Sertakan identitas mahasiswa, semester, dan alasan yang dapat diverifikasi.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh permohonan',
          pre: `Saya [Nama], NIM [NIM], mengajukan permohonan keringanan UKT semester [X] karena [alasan singkat]. Saya melampirkan [bukti].`,
        },
      ],
      tipsTitle: 'Tips UKT',
      tips: ['Ikuti format resmi kampus.', 'Ajukan sebelum batas administrasi.'],
      faq: [{ q: 'Apakah perlu orang tua?', a: 'Tergantung aturan kampus; lampirkan surat kuasa jika diminta.' }],
      howToSteps: defaultHowTo('surat permohonan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Permohonan', path: '/contoh/permohonan' },
        { label: 'Keringanan UKT', path: '/contoh/permohonan/keringanan-ukt' },
      ]),
      related: [
        { href: '/contoh/permohonan/beasiswa', label: 'Permohonan beasiswa' },
        { href: '/buat-surat/permohonan', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Buat surat permohonan UKT',
        description: 'Generator membantu merapikan alur surat resmi.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/permohonan',
      },
      ctaBottom: {
        title: 'Siap unduh',
        description: 'Periksa nama instansi dan NIM.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/permohonan',
        variant: 'dark',
      },
    },
    contohPengaduanPln: {
      seoKey: 'contohPengaduanPln',
      h1: 'Contoh surat pengaduan ke PLN',
      intro: [
        'Cantumkan ID pelanggan, alamat, periode gangguan/tagihan, kronologi singkat, dan permintaan tindakan (koreksi/kunjungan).',
      ],
      exampleBlocks: [
        {
          title: 'Contoh struktur',
          pre: `Perihal: Pengaduan Tagihan/Listrik\n\nSaya pelanggan ID [xxx] mengalami [kronologi]. Mohon penjelasan dan tindakan perbaikan.`,
        },
      ],
      tipsTitle: 'Tips pengaduan PLN',
      tips: ['Sertakan bukti foto/tagihan bila relevan.', 'Tulis nomor referensi jika sudah ada interaksi sebelumnya.'],
      faq: [{ q: 'Bahasa harus keras?', a: 'Tetap sopan; fakta yang jelas lebih membantu penyelesaian.' }],
      howToSteps: defaultHowTo('surat pengaduan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Pengaduan', path: '/contoh/pengaduan' },
        { label: 'PLN', path: '/contoh/pengaduan/pln' },
      ]),
      related: [
        { href: '/contoh/pengaduan/bpjs', label: 'Pengaduan BPJS' },
        { href: '/buat-surat/pengaduan', label: 'Generator pengaduan' },
      ],
      ctaTop: {
        title: 'Buat surat pengaduan',
        description: 'Isi kronologi dan tuntutan penyelesaian — format surat dibantu AI.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/pengaduan',
      },
      ctaBottom: {
        title: 'Unduh PDF pengaduan',
        description: 'Sesuaikan identitas instansi sebelum dikirim.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/pengaduan',
        variant: 'dark',
      },
    },
    contohPengaduanBpjs: {
      seoKey: 'contohPengaduanBpjs',
      h1: 'Contoh surat pengaduan ke BPJS Kesehatan',
      intro: [
        'Sertakan nomor peserta, fasilitas kesehatan terkait, kronologi klaim/layanan, dan permintaan penjelasan tertulis.',
      ],
      exampleBlocks: [
        {
          title: 'Contoh isi',
          pre: `Saya [Nama], peserta BPJS Kesehatan nomor [NIK/kartu], mengajukan pengaduan terkait [peristiwa] pada [tanggal]. Mohon penjelasan dan tindakan sesuai ketentuan.`,
        },
      ],
      tipsTitle: 'Tips pengaduan BPJS',
      tips: ['Simpan nomor tiket layanan jika ada.', 'Tulis kronologi berurutan singkat.'],
      faq: [{ q: 'Perlu melampirkan rekam medis?', a: 'Hanya jika relevan dan kamu nyaman; ikuti prosedur privasi.' }],
      howToSteps: defaultHowTo('surat pengaduan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Pengaduan', path: '/contoh/pengaduan' },
        { label: 'BPJS', path: '/contoh/pengaduan/bpjs' },
      ]),
      related: [
        { href: '/contoh/pengaduan/pln', label: 'Pengaduan PLN' },
        { href: '/buat-surat/pengaduan', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Buat surat pengaduan BPJS',
        description: 'Struktur surat resmi lebih rapi dengan generator.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/pengaduan',
      },
      ctaBottom: {
        title: 'Unduh PDF',
        description: 'Tinjau ulang identitas dan nomor peserta.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/pengaduan',
        variant: 'dark',
      },
    },
    contohPengaduanBank: {
      seoKey: 'contohPengaduanBank',
      h1: 'Contoh surat pengaduan ke bank',
      intro: [
        'Cantumkan nomor rekening/referensi transaksi, tanggal kejadian, kronologi, dan permintaan penyelesaian (koreksi/pengembalian/komunikasi).',
      ],
      exampleBlocks: [
        {
          title: 'Contoh permintaan tindakan',
          pre: `Mohon investigasi transaksi [kode/ tanggal] dan konfirmasi tertulis hasil penyelesaian.`,
        },
      ],
      tipsTitle: 'Tips pengaduan bank',
      tips: ['Gunakan bahasa netral dan fakta.', 'Simpan bukti transaksi dan percakapan.'],
      faq: [{ q: 'Kirim ke mana?', a: 'Ikuti kanal resmi bank (email/cabang/form pengaduan konsumen).' }],
      howToSteps: defaultHowTo('surat pengaduan'),
      breadcrumbs: crumbs([
        { label: 'Beranda', path: '/' },
        { label: 'Contoh surat', path: '/contoh' },
        { label: 'Pengaduan', path: '/contoh/pengaduan' },
        { label: 'Bank', path: '/contoh/pengaduan/bank' },
      ]),
      related: [
        { href: '/contoh/pengaduan/pln', label: 'Pengaduan PLN' },
        { href: '/buat-surat/pengaduan', label: 'Generator' },
      ],
      ctaTop: {
        title: 'Buat surat pengaduan bank',
        description: 'Generator membantu menyusun kronologi dan permohonan tindakan.',
        ctaText: 'Mulai',
        ctaUrl: '/buat-surat/pengaduan',
      },
      ctaBottom: {
        title: 'Unduh PDF',
        description: 'Pastikan nomor referensi transaksi benar.',
        ctaText: 'Buka generator',
        ctaUrl: '/buat-surat/pengaduan',
        variant: 'dark',
      },
    },
  }
}

let contohArticlesCache: Record<ContohArticleSeoKey, ContohArticleContent> | null = null

export function getContohArticlesMap(): Record<ContohArticleSeoKey, ContohArticleContent> {
  if (!contohArticlesCache) {
    contohArticlesCache = buildContohArticles()
  }
  return contohArticlesCache
}

export function getContohArticle(key: ContohArticleSeoKey): ContohArticleContent {
  return getContohArticlesMap()[key]
}
