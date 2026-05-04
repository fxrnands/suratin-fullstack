import type { LetterKind } from '@/components/letter-builder/types'

import { LETTER_HEADER_CITY_DEFAULT } from '@/lib/letter/indonesian-templates'

/** Panduan struktur surat Indonesia per jenis — dipakai di prompt Gemini agar konsisten dengan template statis. */
const KIND_BLUEPRINT: Record<LetterKind, string> = {
  lamaran: `
Jenis: SURAT LAMARAN KERJA (melamar pekerjaan).
Struktur isi yang diharapkan:
1. Kop tanggal kanan atas dalam satu string: "[Kota], [tanggal Indonesia panjang]" — gunakan kota yang masuk akal dari nama perusahaan atau default "${LETTER_HEADER_CITY_DEFAULT}" jika tidak terinferensi.
2. Blok alamat penerima (multi-baris dalam satu string atau beberapa elemen dipisah "") mengikuti pola:
   Kepada Yth.
   Bapak/Ibu Personalia atau Pimpinan
   [nama perusahaan dari draft]
   Di tempat
3. Satu baris "Perihal: Lamaran pekerjaan untuk posisi [posisi]" (boleh tambah baris "Lampiran: …" hanya jika masuk akal dari draft, jangan mengada-ngada).
4. Baris sendiri "Dengan hormat," lalu "" lalu "Saya yang bertanda tangan di bawah ini:" lalu "" lalu blok identitas (satu baris per label, hanya jika data tersedia di JSON draft):
   Nama: [draft.fullName]
   Tempat, Tanggal Lahir: [draft.lamaran.birthPlaceDate] — hanya jika tidak kosong
   Nomor Telepon: [draft.lamaran.phone] — hanya jika tidak kosong
   Email: [draft.lamaran.email] — hanya jika draft.lamaran.includeEmailInLetter true DAN email tidak kosong
5. Setelah blok identitas, "" lalu ISI UTAMA wajib minimal TIGA paragraf terpisah; gunakan elemen "" di antara paragraf agar jelas di layout/PDF:
   - Paragraf 1: maksud melamar (posisi & perusahaan dari draft).
   - Paragraf 2: pendidikan, pengalaman, kompetensi (draft.lamaran.education & draft.lamaran.skills), tanpa fakta baru.
   - Paragraf 3: penutup (harapan, ucapan hormat; boleh menyebut lamiran/CV dilampirkan bila wajar).
6. Lalu "" lalu satu kalimat penutup formal (mis. ucapan terima kasih atas perhatian) sebelum blok penandatanganan.
7. Penutup + "Hormat saya," + nama pemohon pada elemen terpisah.
Jangan menggabungkan seluruh isi surat menjadi satu paragraf panjang tunggal.
`,

  resign: `
Jenis: SURAT PENGUNDURAN DIRI (susunan mengikuti surat lamaran: kop, alamat, perihal, pembuka, blok identitas, isi paragraf terpisah, penutup, tanda tangan).
1. Kop tanggal kanan atas: "[Kota], [tanggal Indonesia panjang]" — kota dari konteks perusahaan atau default "${LETTER_HEADER_CITY_DEFAULT}".
2. Blok alamat penerima (multi-baris dalam satu string atau beberapa elemen dipisah ""):
   Kepada Yth.
   Bapak/Ibu Pimpinan
   [nama perusahaan dari draft.resign.company]
   Di tempat
3. Satu baris "Perihal: Pengunduran diri dari posisi [draft.resign.position]" (tanpa nama pemohon di baris Perihal).
4. Baris sendiri "Dengan hormat," lalu "" lalu "Saya yang bertanda tangan di bawah ini:" lalu "" lalu blok identitas (satu baris per label, wajib untuk surat ini):
   Nama: [draft.fullName]
   Jabatan: [draft.resign.position]
   Perusahaan: [draft.resign.company]
   Jangan menambahkan baris Email atau alamat surel — surat pengunduran diri tidak memuat email.
5. Setelah blok identitas, "" lalu isi utama dalam beberapa paragraf terpisah; WAJIB gunakan elemen "" antarparagraf:
   - Paragraf 1: pengunduran diri dan tanggal efektif (draft.resign.effectiveDate).
   - Jika draft.resign.reason tidak kosong: paragraf terpisah berisi alasan singkat dan sopan.
   - Paragraf komitmen transisi / penyerahan tugas.
   - Paragraf ucapan terima kasih.
6. Lalu "" lalu satu kalimat penutup formal sebelum blok penandatanganan.
7. "Hormat saya," dan nama pada elemen terpisah.
Jangan menggabungkan identitas dan isi utama dalam satu paragraf panjang; jangan menyalin email dari draft ke surat.
`,

  permohonan: `
Jenis: SURAT PERMOHONAN / PENGAJUAN UMUM.
Struktur:
1. Kop tanggal + blok Kepada Yth. → Bapak/Ibu Pimpinan → [institusi] → Di tempat.
2. Perihal: Permohonan [judul ringkas dari draft.permohonan.purpose].
3. "Dengan hormat," lalu "Yang bertanda tangan di bawah ini: [nama draft.fullName]."
4. Satu atau dua paragraf yang menjelaskan untuk apa permohonan diajukan — gunakan isi draft.permohonan.whatFor (boleh diperhalus redaksi, jangan menambah fakta baru).
5. Paragraf berikutnya berisi uraian detail dari draft.permohonan.details.
6. Penutup formal + Hormat saya + nama.
`,

  izin: `
Jenis: SURAT IZIN / DISPENSASI (ringkas, sopan, bukan surat argumentatif).
Data JSON (wajib dipakai tanpa menambah fakta baru):
- draft.fullName; draft.izin.employeeId (opsional, setelah identitas bila ada).
- draft.izin.recipientName (orang/jabatan yang dituju), draft.izin.institution (nama institusi).
- draft.izin.leaveType → jenis izin (sakit / keluarga / acara / administrasi / lainnya) dalam kalimat sopan.
- draft.izin.dateFrom, draft.izin.dateTo → rentang tanggal jelas dalam bahasa Indonesia di isi surat.
- draft.izin.reason (singkat, 1–2 kalimat).
- draft.izin.additionalDetails (opsional: acara, lokasi, medis ringan, dll.).
- draft.izin.hasAttachment + draft.izin.attachmentNote → kalimat lampiran singkat jika relevan.
- draft.tone: formal / persuasif (lembut) / tegas — tetap hormat.

Struktur isi:
1. Kop tanggal + blok alamat: Kepada Yth. + saluran (sekolah/universitas: Kepala Sekolah atau Kepala Bagian Akademik; lainnya: Bapak/Ibu Pimpinan) + baris draft.izin.recipientName + baris draft.izin.institution + Di tempat.
2. Perihal: izin + jenis + rentang tanggal.
3. Pembuka + identitas + izin (tanggal + jenis + alasan singkat).
4. Detail tambahan hanya jika draft.izin.additionalDetails tidak kosong.
5. Janji komunikasi/keterpaduan tugas ringkas.
6. Lampiran hanya jika hasAttachment.
7. Penutup singkat + Hormat saya + draft.fullName.
`,

  pengaduan: `
Jenis: SURAT PENGADUAN RESMI (struktur argumentatif: pembuka → kronologi → dampak → penegasan → tuntutan solusi → penutup).
Data JSON (wajib dipakai tanpa menambah fakta baru):
- draft.fullName, draft.pengaduan.contactPhone, draft.pengaduan.contactEmail (sertakan di identitas jika tidak kosong; email/telepon opsional tapi disarankan).
- draft.pengaduan.institution, draft.pengaduan.divisionOrBranch (jika ada: sertakan agar surat terarah ke unit/cabang).
- draft.pengaduan.problemCategory (label jenis masalah dalam bahasa surat).
- draft.pengaduan.issue = kronologi inti (waktu, peristiwa, pihak terlibat).
- draft.pengaduan.impact (jika tidak kosong: dampak ke pengadu).
- draft.pengaduan.transactionOrCustomerId, draft.pengaduan.incidentDate (jika ada: masukkan sebagai bukti/kredibilitas).
- draft.pengaduan.desiredOutcome + draft.pengaduan.desiredOutcomeOther (jika outcome "lainnya", gunakan teks other sebagai inti tuntutan) + draft.pengaduan.resolution (catatan tambahan harapan, opsional).
- draft.pengaduan.urgency: jika "mendesak" atau "sangat_mendesak", sesuaikan ketegasan nada tanpa melanggar sopan santun.
- draft.pengaduan.priorContact / draft.pengaduan.priorContactResponse: jika priorContact "ya", paragraf singkat tentang upaya kontak sebelumnya dan respon instansi (eskalasi).

Alur isi (gunakan "" antar blok logis):
1. Kop + blok alamat ke institusi (nama + divisi bila ada) + Di tempat.
2. Perihal menyebut pengaduan dan ringkas jenis masalah.
3. Pembuka formal + identitas pengadu + kontak bila ada.
4. Paragraf "Uraian kronologi" berisi draft.issue.
5. Jika draft.impact tidak kosong: paragraf "Dampak yang dialami".
6. Jika ada transactionOrCustomerId atau incidentDate: satu paragraf ringkas "Data pendukung" (tanpa mengada-ngada).
7. Paragraf penegasan relevansi dengan jenis masalah (problemCategory).
8. Paragraf "Harapan penyelesaian" yang actionable: gabungkan label outcome yang dipilih + desiredOutcomeOther (jika lainnya) + resolution tambahan; sertakan CTA jelas (mis. tenggat waktu hanya jika ada di draft).
9. Jika priorContact ya: paragraf eskalasi berdasarkan priorContactResponse.
10. Penutup profesional + Hormat saya + nama.

Tone: ikuti draft.tone (formal / tegas / persuasif) — hindari nada emosional berlebihan maupun surat yang terlalu lemah tanpa tuntutan.
`,
}

export function geminiLetterStructureInstructions(kind: LetterKind): string {
  return KIND_BLUEPRINT[kind].trim()
}
