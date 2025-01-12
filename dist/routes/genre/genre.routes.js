"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/genre/genre.routes.ts
const express_1 = require("express");
const genre_controller_1 = require("../../controllers/genre/genre.controller");
const router = (0, express_1.Router)();
// Получить все жанры
router.get('/', genre_controller_1.getGenres);
// Получить жанр по ID
router.get('/:id', genre_controller_1.getGenreById);
// Создать новый жанр
router.post('/', genre_controller_1.createGenre);
// Обновить жанр по ID
router.put('/:id', genre_controller_1.updateGenre);
// Удалить жанр по ID
router.delete('/:id', genre_controller_1.deleteGenre);
exports.default = router;
