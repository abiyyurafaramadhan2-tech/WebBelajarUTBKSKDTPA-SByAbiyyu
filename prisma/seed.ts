// QuizGenius Seed — 500 questions per subtest
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { PrismaClient, DifficultyLevel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Category & Subtest Data ───────────────────────────────
const CATEGORIES = [
  {
    name: 'UTBK/SNBT',
    slug: 'utbk',
    description: 'Ujian Tulis Berbasis Komputer — Seleksi Nasional Berdasarkan Tes',
    iconEmoji: '🎓',
    color: '#6366f1',
    subtests: [
      { name:'Kemampuan Penalaran Umum',           slug:'kemampuan-penalaran-umum',           emoji:'🧩', time:30 },
      { name:'Pengetahuan & Pemahaman Umum',       slug:'pengetahuan-pemahaman-umum',         emoji:'📖', time:30 },
      { name:'Kemampuan Memahami Bacaan & Menulis',slug:'kemampuan-memahami-bacaan-menulis',   emoji:'✍️', time:30 },
      { name:'Pengetahuan Kuantitatif',            slug:'pengetahuan-kuantitatif',             emoji:'🔢', time:30 },
      { name:'Literasi dalam Bahasa Indonesia',    slug:'literasi-bahasa-indonesia',           emoji:'🇮🇩', time:45 },
      { name:'Literasi dalam Bahasa Inggris',      slug:'literasi-bahasa-inggris',             emoji:'🇬🇧', time:45 },
      { name:'Penalaran Matematika',               slug:'penalaran-matematika',                emoji:'📐', time:45 },
    ],
  },
  {
    name: 'SKD CPNS',
    slug: 'skd',
    description: 'Seleksi Kompetensi Dasar — Calon Pegawai Negeri Sipil',
    iconEmoji: '🏛️',
    color: '#f59e0b',
    subtests: [
      { name:'TWK — Tes Wawasan Kebangsaan',   slug:'twk', emoji:'🇮🇩', time:100 },
      { name:'TIU — Tes Intelegensia Umum',    slug:'tiu', emoji:'🧠',  time:100 },
      { name:'TKP — Tes Karakteristik Pribadi',slug:'tkp', emoji:'🤝',  time:100 },
    ],
  },
  {
    name: 'TPS / TPA',
    slug: 'tpa',
    description: 'Tes Potensi Skolastik / Tes Potensi Akademik',
    iconEmoji: '🧪',
    color: '#22c55e',
    subtests: [
      { name:'Verbal',  slug:'verbal',  emoji:'💬', time:30 },
      { name:'Numerik', slug:'numerik', emoji:'🔢', time:30 },
      { name:'Logika',  slug:'logika',  emoji:'🧩', time:30 },
      { name:'Spasial', slug:'spasial', emoji:'🔷', time:30 },
    ],
  },
];

// ── Question Generator ────────────────────────────────────
function generateQuestionsForSubtest(
  subtestId: string,
  subtestSlug: string,
  count: number = 500
) {
  const questions = [];

  // Difficulty distribution: 35% Easy, 45% Medium, 20% Hard
  const easyCount   = Math.floor(count * 0.35);
  const mediumCount = Math.floor(count * 0.45);
  const hardCount   = count - easyCount - mediumCount;

  function makeQuestion(
    i: number,
    difficulty: DifficultyLevel,
    diffWeight: number,
    discA: number,
    guesC: number
  ) {
    const opts = ['A','B','C','D'];
    const correct = opts[i % 4];
    return {
      subtestId,
      difficultyLevel:  difficulty,
      difficultyWeight: diffWeight,
      discriminationA:  discA,
      guessingC:        guesC,
      stem:             `[${subtestSlug.toUpperCase()}] Soal nomor ${i+1}: Pertanyaan untuk subtest ${subtestSlug} tingkat ${difficulty.toLowerCase()}. Pilih jawaban yang paling tepat berdasarkan informasi yang diberikan.`,
      optionA:          `Jawaban A untuk soal ${i+1}`,
      optionB:          `Jawaban B untuk soal ${i+1}`,
      optionC:          `Jawaban C untuk soal ${i+1}`,
      optionD:          `Jawaban D untuk soal ${i+1}`,
      correctOption:    correct,
      explanation:      `Pembahasan soal ${i+1}: Jawaban yang benar adalah ${correct} karena... [penjelasan lengkap akan ditambahkan oleh tim soal].`,
      topic:            `Topik ${Math.ceil((i+1) / 50)}`,
      isActive:         true,
    };
  }

  let idx = 0;

  for (let i = 0; i < easyCount; i++, idx++) {
    questions.push(makeQuestion(
      idx, 'EASY',
      -2 + (1.5 * i / easyCount),
      0.5 + (0.5 * i / easyCount),
      0.25
    ));
  }

  for (let i = 0; i < mediumCount; i++, idx++) {
    questions.push(makeQuestion(
      idx, 'MEDIUM',
      -0.5 + (1.0 * i / mediumCount),
      1.0 + (0.5 * i / mediumCount),
      0.25
    ));
  }

  for (let i = 0; i < hardCount; i++, idx++) {
    questions.push(makeQuestion(
      idx, 'HARD',
      0.5 + (2.5 * i / hardCount),
      1.5 + (1.0 * i / hardCount),
      0.2
    ));
  }

  return questions;
}

// ── Main Seed ─────────────────────────────────────────────
async function main() {
  console.log('🌱 QuizGenius Seed dimulai...\n');
  console.log('© 2026 QuizGenius by Abiyyu Rafa Ramadhan\n');

  await prisma.sessionAnswer.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.question.deleteMany();
  await prisma.subtest.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Data lama dibersihkan');

  for (const catData of CATEGORIES) {
    console.log(`\n📂 Membuat kategori: ${catData.name}`);

    const category = await prisma.category.create({
      data: {
        name:        catData.name,
        slug:        catData.slug,
        description: catData.description,
        iconEmoji:   catData.iconEmoji,
        color:       catData.color,
      },
    });

    for (let si = 0; si < catData.subtests.length; si++) {
      const st = catData.subtests[si];
      console.log(`  📋 Subtest: ${st.name}`);

      const subtest = await prisma.subtest.create({
        data: {
          categoryId:    category.id,
          name:          st.name,
          slug:          st.slug,
          iconEmoji:     st.emoji,
          timeLimit:     st.time,
          sortOrder:     si,
          totalQuestions:500,
        },
      });

      const questions = generateQuestionsForSubtest(subtest.id, st.slug, 500);

      const BATCH = 100;
      for (let b = 0; b < questions.length; b += BATCH) {
        await prisma.question.createMany({
          data: questions.slice(b, b + BATCH),
        });
        process.stdout.write(`    ✅ ${Math.min(b + BATCH, questions.length)}/500 soal\r`);
      }
      console.log(`    ✅ 500 soal berhasil dibuat untuk ${st.name}`);
    }
  }

  // FIXED: Menggunakan bcryptjs dengan cara yang benar
  const hash = await bcrypt.hash('Admin2026!', 12);

  await prisma.user.upsert({
    where:  { email: 'admin@quizgenius.id' },
    update: {},
    create: {
      name:     'Admin QuizGenius',
      email:    'admin@quizgenius.id',
      password: hash,
      role:     'ADMIN',
      tier:     'ELITE',
      tierPoints:99999,
      totalXP:  99999,
      level:    99,
    },
  });

  const totalCats     = CATEGORIES.length;
  const totalSubtests = CATEGORIES.reduce((s, c) => s + c.subtests.length, 0);
  const totalQuestions= totalSubtests * 500;

  console.log('\n🎉 Seed selesai!');
  console.log(`📊 Statistik:`);
  console.log(`   • ${totalCats} Kategori`);
  console.log(`   • ${totalSubtests} Subtest`);
  console.log(`   • ${totalQuestions.toLocaleString('id')} Soal total`);
  console.log(`   • 1 Admin user (admin@quizgenius.id)`);
  console.log('\n© 2026 QuizGenius by Abiyyu Rafa Ramadhan');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
