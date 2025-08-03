import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";

// Для ES Modules, __dirname та __filename не визначені напряму.
// Потрібно отримати їх за допомогою 'url' та 'path'.
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000; // Ви можете обрати інший порт

// Дозволяємо CORS запити з вашого React додатку
app.use(cors());
// Дозволяємо Express роздавати статичні файли з папки uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Шлях до папки, куди будуть зберігатися завантажені файли
const uploadDirectory = path.join(__dirname, "uploads");

// Перевіряємо, чи існує папка uploads, якщо ні - створюємо її
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Налаштування Multer для зберігання файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Вказуємо папку для збереження файлів
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Створюємо унікальне ім'я файлу, щоб уникнути конфліктів
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// --- API-маршрут для завантаження файлів ---
app.post("/upload", upload.array("images", 10), (req, res) => {
  // `images` - це ім'я поля форми, яке містить файли (name атрибут input'а)
  // `10` - максимальна кількість файлів, які можна завантажити одночасно

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Файли не вибрано." });
  }

  // Отримуємо інформацію про завантажені файли
  const uploadedFiles = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    path: `/uploads/${file.filename}`, // Шлях до файлу на сервері
  }));

  res.status(200).json({
    message: "Файли успішно завантажено!",
    files: uploadedFiles,
  });
});

// Запускаємо сервер
app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
  console.log(`Папка для завантажень: ${uploadDirectory}`);
});
