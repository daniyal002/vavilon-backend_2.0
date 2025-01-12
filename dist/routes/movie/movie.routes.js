"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/movie/movie.routes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const movie_controller_1 = require("../../controllers/movie/movie.controller");
const router = (0, express_1.Router)();
// Папка для хранения изображений
const movieDir = 'movieImage/';
// Проверка и создание папки, если она не существует
if (!fs_1.default.existsSync(movieDir)) {
    fs_1.default.mkdirSync(movieDir, { recursive: true });
}
// Настройка multer для хранения загруженных изображений
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, movieDir); // Папка для хранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
    },
});
const upload = (0, multer_1.default)({ storage });
// Создаем маршруты с использованием multer для загрузки изображений
router.get('/', movie_controller_1.getMovies);
router.get('/:id', movie_controller_1.getMovieById);
router.post('/', upload.single('image'), movie_controller_1.createMovie); // Загрузка изображения при создании фильма
router.put('/:id', upload.single('image'), movie_controller_1.updateMovie); // Загрузка изображения при обновлении фильма
router.delete('/:id', movie_controller_1.deleteMovie);
exports.default = router;
