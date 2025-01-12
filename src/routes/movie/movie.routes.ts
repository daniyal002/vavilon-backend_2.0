// src/routes/movie/movie.routes.ts
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../controllers/movie/movie.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Папка для хранения изображений
const movieDir = 'movieImage/';

// Проверка и создание папки, если она не существует
if (!fs.existsSync(movieDir)) {
  fs.mkdirSync(movieDir, { recursive: true });
}

// Настройка multer для хранения загруженных изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, movieDir); // Папка для хранения изображений
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
  },
});

const upload = multer({ storage });

// Создаем маршруты с использованием multer для загрузки изображений
router.get('/', authenticateToken, authorizeAdmin, getMovies);
router.get('/:id', getMovieById);
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), createMovie); // Загрузка изображения при создании фильма
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateMovie); // Загрузка изображения при обновлении фильма
router.delete('/:id', authenticateToken, authorizeAdmin, deleteMovie);

export default router;