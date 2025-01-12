"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getMovieById = exports.getMovies = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
// Получить все фильмы
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield prisma.movie.findMany({
            include: {
                genre: true, // Включаем жанр
            },
        });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении фильмов' });
    }
});
exports.getMovies = getMovies;
// Получить фильм по ID
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID фильма' });
    }
    else {
        try {
            const movie = yield prisma.movie.findUnique({
                where: { id: Number(id) },
                include: {
                    genre: true, // Включаем жанр
                },
            });
            if (!movie) {
                res.status(404).json({ error: 'Фильм не найден' });
            }
            else {
                res.json(movie);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении фильма' });
        }
    }
});
exports.getMovieById = getMovieById;
// Создать новый фильм
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, rating, year, ageRestriction, trailerLink, premiere, genreId } = req.body;
    // Получаем путь к изображению из загруженного файла
    const imagePath = req.file ? path_1.default.join('uploads', req.file.filename) : ""; // Путь к загруженному изображению
    try {
        const newMovie = yield prisma.movie.create({
            data: {
                title,
                description,
                rating,
                year,
                ageRestriction,
                imagePath, // Используем загруженный путь к изображению
                trailerLink,
                premiere,
                genre: {
                    connect: { id: genreId },
                },
            },
        });
        res.status(201).json(newMovie);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании фильма' });
    }
});
exports.createMovie = createMovie;
// Обновить фильм
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, rating, year, ageRestriction, trailerLink, premiere, genreId } = req.body;
    // Получаем путь к изображению из загруженного файла
    const imagePath = req.file ? path_1.default.join('uploads', req.file.filename) : null; // Путь к загруженному изображению
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID фильма' });
    }
    else {
        try {
            const updatedMovie = yield prisma.movie.update({
                where: { id: Number(id) },
                data: {
                    title,
                    description,
                    rating,
                    year,
                    ageRestriction,
                    imagePath: imagePath ? imagePath : undefined, // Обновляем путь к изображению только если оно загружено
                    trailerLink,
                    premiere,
                    genre: {
                        connect: { id: genreId },
                    },
                },
            });
            res.json(updatedMovie);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении фильма' });
        }
    }
});
exports.updateMovie = updateMovie;
// Удалить фильм
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID фильма ' });
    }
    else {
        try {
            yield prisma.movie.delete({
                where: { id: Number(id) },
            });
            res.status(204).send(); // Успешное удаление, без содержимого в ответе
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении фильма' });
        }
    }
});
exports.deleteMovie = deleteMovie;
