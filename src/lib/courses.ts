export type Question =
  | { type: "mc"; prompt: string; options: string[]; correctIndex: number; explain?: string }
  | { type: "fill"; prompt: string; answer: string; placeholder?: string; explain?: string }
  | { type: "code"; prompt: string; expected: string; starter?: string; explain?: string };

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
  units: Unit[];
}

const u1: Unit = {
  id: "u1",
  title: "Perkenalan",
  subtitle: "Apa itu JavaScript?",
  color: "#7B2CBF",
  lessons: [
    {
      id: "l1.1",
      unitId: "u1",
      title: "Apa itu JavaScript?",
      description: "Bahasa untuk membuat web hidup",
      icon: "✨",
      questions: [
        {
          type: "mc",
          prompt: "Apa fungsi utama JavaScript?",
          options: ["Styling web", "Membuat web interaktif", "Menyimpan database", "Hanya untuk server"],
          correctIndex: 1,
          explain: "JavaScript membuat halaman web bisa merespons aksi pengguna.",
        },
        {
          type: "mc",
          prompt: "Di mana JavaScript berjalan?",
          options: ["Hanya server", "Hanya mobile", "Browser", "Hanya desktop"],
          correctIndex: 2,
        },
        {
          type: "mc",
          prompt: "JavaScript sama dengan Java?",
          options: ["Ya, identik", "Tidak, beda bahasa", "Hampir sama", "Versi baru Java"],
          correctIndex: 1,
          explain: "Namanya mirip, tapi keduanya bahasa yang berbeda.",
        },
        {
          type: "mc",
          prompt: "Tahun berapa JavaScript dibuat?",
          options: ["1990", "1995", "2000", "2005"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "JavaScript membuat web menjadi ____",
          options: ["Statis", "Interaktif", "Hanya teks", "Lambat"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "l1.2",
      unitId: "u1",
      title: "Console & Output",
      description: "console.log untuk menampilkan hasil",
      icon: "🖨️",
      questions: [
        {
          type: "code",
          prompt: 'Tampilkan teks "Hello World" ke console.',
          expected: 'console.log("Hello World")',
          starter: 'console.log("")',
        },
        {
          type: "mc",
          prompt: "Fungsi console.log adalah?",
          options: ["Menyimpan data", "Menampilkan output", "Membuka browser", "Menghapus file"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Apa output dari console.log(5 + 3)?",
          options: ["53", "8", "5+3", "Error"],
          correctIndex: 1,
        },
        {
          type: "fill",
          prompt: "Lengkapi: ____.log('hi');",
          answer: "console",
          placeholder: "____",
        },
        {
          type: "mc",
          prompt: "console.log('A'); console.log('B'); akan menampilkan?",
          options: ["AB di satu baris", "A dan B di baris terpisah", "Hanya A", "Hanya B"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "l1.3",
      unitId: "u1",
      title: "Komentar Kode",
      description: "Catatan untuk diri sendiri",
      icon: "💬",
      questions: [
        {
          type: "mc",
          prompt: "Tanda komentar single line?",
          options: ["#", "//", "<!--", "/*"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Apakah komentar dieksekusi?",
          options: ["Ya", "Tidak", "Kadang-kadang", "Hanya di Chrome"],
          correctIndex: 1,
        },
        {
          type: "fill",
          prompt: "Lengkapi komentar: ____ Ini komentar",
          answer: "//",
        },
        {
          type: "mc",
          prompt: "Komentar multi-line menggunakan?",
          options: ["// //", "/* */", "<!-- -->", "## ##"],
          correctIndex: 1,
        },
        {
          type: "code",
          prompt: 'Tulis komentar "Belajar JavaScript"',
          expected: "// Belajar JavaScript",
          starter: "// ",
        },
      ],
    },
    {
      id: "l1.4",
      unitId: "u1",
      title: "Tipe Data Dasar",
      description: "String, Number, Boolean",
      icon: "🔤",
      questions: [
        {
          type: "mc",
          prompt: "Tipe data dari 'Hello' adalah?",
          options: ["Number", "String", "Boolean", "Object"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Tipe data dari 42 adalah?",
          options: ["String", "Number", "Boolean", "Bigint"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Tipe data dari true adalah?",
          options: ["String", "Number", "Boolean", "Undefined"],
          correctIndex: 2,
        },
        {
          type: "mc",
          prompt: "Mana yang BUKAN tipe data primitive?",
          options: ["String", "Number", "Array", "Boolean"],
          correctIndex: 2,
        },
        {
          type: "fill",
          prompt: "typeof 'abc' menghasilkan ____",
          answer: "string",
        },
      ],
    },
    {
      id: "l1.5",
      unitId: "u1",
      title: "Boss Challenge: Unit 1",
      description: "Buktikan kamu siap lanjut",
      icon: "👑",
      questions: [
        {
          type: "mc",
          prompt: "JavaScript dibuat untuk?",
          options: ["Sistem operasi", "Web interaktif", "Robot", "Game console"],
          correctIndex: 1,
        },
        {
          type: "code",
          prompt: 'Tampilkan "Hai!" ke console',
          expected: 'console.log("Hai!")',
          starter: "",
        },
        {
          type: "mc",
          prompt: "Komentar // bekerja untuk?",
          options: ["Multi-line", "Single line", "HTML saja", "CSS saja"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "typeof 100 mengembalikan?",
          options: ["'number'", "'string'", "'integer'", "'value'"],
          correctIndex: 0,
        },
        {
          type: "fill",
          prompt: "Lengkapi: console.____('halo')",
          answer: "log",
        },
      ],
    },
  ],
};

const u2: Unit = {
  id: "u2",
  title: "Variabel & Tipe Data",
  subtitle: "let, const, dan teman-teman",
  color: "#00F5D4",
  lessons: [
    {
      id: "l2.1",
      unitId: "u2",
      title: "Variabel: let & const",
      description: "Menyimpan nilai dengan nama",
      icon: "📦",
      questions: [
        {
          type: "code",
          prompt: 'Buat variabel "nama" berisi "Budi" pakai let.',
          expected: 'let nama = "Budi"',
          starter: "let nama = ",
        },
        {
          type: "code",
          prompt: 'Buat konstanta PI dengan nilai 3.14.',
          expected: "const PI = 3.14",
          starter: "const ",
        },
        {
          type: "mc",
          prompt: "Mana sintaks variabel yang benar?",
          options: ["variable umur = 20;", "let umur = 20;", "umur := 20;", "set umur 20;"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Perbedaan let dan const?",
          options: [
            "Tidak ada beda",
            "let bisa diubah, const tidak",
            "const lebih cepat",
            "let hanya untuk angka",
          ],
          correctIndex: 1,
        },
        {
          type: "fill",
          prompt: "Lengkapi: ____ nama = 'Ana';",
          answer: "let",
        },
      ],
    },
    {
      id: "l2.2",
      unitId: "u2",
      title: "String, Number, Boolean",
      description: "Mengenal tipe data inti",
      icon: "🎲",
      questions: [
        {
          type: "mc",
          prompt: "Hasil dari 'Halo' + ' ' + 'Dunia'?",
          options: ["HaloDunia", "Halo Dunia", "Halo+Dunia", "Error"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Hasil dari Number('42')?",
          options: ["'42'", "42", "NaN", "undefined"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Hasil dari Boolean(0)?",
          options: ["true", "false", "0", "null"],
          correctIndex: 1,
        },
        {
          type: "code",
          prompt: 'Tampilkan typeof dari 123 ke console',
          expected: "console.log(typeof 123)",
          starter: "console.log(",
        },
        {
          type: "fill",
          prompt: "typeof true menghasilkan ____",
          answer: "boolean",
        },
      ],
    },
    {
      id: "l2.3",
      unitId: "u2",
      title: "Operator Aritmatika",
      description: "+ - * / % **",
      icon: "➕",
      questions: [
        {
          type: "mc",
          prompt: "Hasil dari 10 % 3?",
          options: ["3", "1", "0", "10"],
          correctIndex: 1,
          explain: "Operator % adalah sisa pembagian.",
        },
        {
          type: "code",
          prompt: 'Buat variabel luas berisi 5 dikali 5 (let)',
          expected: "let luas = 5 * 5",
          starter: "let luas = ",
        },
        {
          type: "mc",
          prompt: "Operator pangkat di JavaScript?",
          options: ["^", "**", "pow", "//"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Hasil dari 7 + 3 * 2?",
          options: ["20", "13", "17", "10"],
          correctIndex: 1,
        },
        {
          type: "fill",
          prompt: "10 ____ 3 = 3.333…",
          answer: "/",
        },
      ],
    },
    {
      id: "l2.4",
      unitId: "u2",
      title: "Type Coercion",
      description: "Konversi tipe otomatis",
      icon: "🔄",
      questions: [
        {
          type: "mc",
          prompt: "Hasil dari '5' + 3?",
          options: ["8", "'53'", "'8'", "Error"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Hasil dari '5' - 3?",
          options: ["2", "'53'", "'2'", "NaN"],
          correctIndex: 0,
        },
        {
          type: "mc",
          prompt: "Boolean('') hasilnya?",
          options: ["true", "false", "''", "undefined"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Number('abc') hasilnya?",
          options: ["0", "abc", "NaN", "null"],
          correctIndex: 2,
        },
        {
          type: "fill",
          prompt: "String(123) menghasilkan tipe ____",
          answer: "string",
        },
      ],
    },
    {
      id: "l2.5",
      unitId: "u2",
      title: "Boss Challenge: Unit 2",
      description: "Pamerkan semua skill variabel",
      icon: "👑",
      questions: [
        {
          type: "code",
          prompt: 'Buat const skor berisi angka 100',
          expected: "const skor = 100",
          starter: "const ",
        },
        {
          type: "mc",
          prompt: "let bisa di-reassign?",
          options: ["Ya", "Tidak", "Hanya jika number", "Hanya di global"],
          correctIndex: 0,
        },
        {
          type: "mc",
          prompt: "Hasil 2 ** 3?",
          options: ["6", "8", "9", "23"],
          correctIndex: 1,
        },
        {
          type: "mc",
          prompt: "Hasil dari 'A' + 1?",
          options: ["'A1'", "B", "NaN", "Error"],
          correctIndex: 0,
        },
        {
          type: "fill",
          prompt: "Operator sisa pembagian: ____",
          answer: "%",
        },
      ],
    },
  ],
};

const stub = (id: string, title: string, subtitle: string, icon: string): Unit => ({
  id,
  title,
  subtitle,
  color: "#6B21A8",
  lessons: Array.from({ length: 5 }, (_, i) => ({
    id: `${id}.${i + 1}`,
    unitId: id,
    title: `${title} ${i + 1}`,
    description: subtitle,
    icon,
    questions: [],
  })),
});

export const javascriptCourse: Course = {
  id: "javascript_fundamentals",
  name: "JavaScript Fundamentals",
  icon: "JS",
  color: "#F7DF1E",
  units: [
    u1,
    u2,
    stub("u3", "Operator & Perbandingan", "==, ===, &&, ||", "⚖️"),
    stub("u4", "Kontrol Alur", "if, switch, ternary", "🔀"),
    stub("u5", "Loop", "for, while, do-while", "🔁"),
    stub("u6", "Fungsi", "function, arrow, scope", "λ"),
    stub("u7", "Array", "[].map, filter, find", "📚"),
    stub("u8", "Object", "{ key: value }", "🧩"),
    stub("u9", "DOM Manipulation", "getElement, querySelector", "🌐"),
    stub("u10", "Async JavaScript", "setTimeout, Promise, async", "⏳"),
  ],
};

export const lockedCourses = [
  { id: "python", name: "Python Basics", icon: "🐍", color: "#3776AB", unlockLevel: 10 },
  { id: "web", name: "Web Development", icon: "🌐", color: "#E34F26", unlockLevel: 15 },
  { id: "react", name: "React Basics", icon: "⚛️", color: "#61DAFB", unlockLevel: 20 },
];

export function findLesson(id: string): Lesson | undefined {
  for (const u of javascriptCourse.units) {
    const l = u.lessons.find((x) => x.id === id);
    if (l) return l;
  }
}

export function findUnit(id: string): Unit | undefined {
  return javascriptCourse.units.find((u) => u.id === id);
}
