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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGenre = exports.updateGenre = exports.createGenre = exports.getGenreById = exports.getGenres = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все жанры
const getGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield prisma.genre.findMany({
            include: {
                movies: true, // Включаем фильмы
            },
        });
        res.json(genres);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении жанров' });
    }
});
exports.getGenres = getGenres;
// Получить жанр по ID
const getGenreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID жанра' });
    }
    else {
        try {
            const genre = yield prisma.genre.findUnique({
                where: { id: Number(id) },
                include: {
                    movies: true, // Включаем фильмы
                },
            });
            if (!genre) {
                res.status(404).json({ error: 'Жанр не найден' });
            }
            else {
                res.json(genre);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении жанра' });
        }
    }
});
exports.getGenreById = getGenreById;
// Создать новый жанр
const createGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newGenre = yield prisma.genre.create({
            data: { name },
        });
        res.status(201).json(newGenre);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании жанра' });
    }
});
exports.createGenre = createGenre;
// Обновить жанр
const updateGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID жанра' });
    }
    else {
        try {
            const updatedGenre = yield prisma.genre.update({
                where: { id: Number(id) },
                data: { name },
            });
            res.json(updatedGenre);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении жанра' });
        }
    }
});
exports.updateGenre = updateGenre;
// Удалить жанр
const deleteGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID жанра' });
    }
    else {
        try {
            yield prisma.genre.delete({
                where: { id: Number(id) },
            });
            res.status(204).send(); // Успешное удаление, без содержимого в ответе
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении жанра' });
        }
    }
});
exports.deleteGenre = deleteGenre;
