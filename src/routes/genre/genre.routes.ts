// src/routes/genre/genre.routes.ts
import { Router } from 'express';
import { getGenres, getGenreById, createGenre, updateGenre, deleteGenre } from '../../controllers/genre/genre.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить все жанры
router.get('/', getGenres);

// Получить жанр по ID
router.get('/:id', getGenreById);

// Создать новый жанр
router.post('/', authenticateToken, authorizeAdmin, createGenre);

// Обновить жанр по ID
router.put('/:id', authenticateToken, authorizeAdmin, updateGenre);

// Удалить жанр по ID
router.delete('/:id', authenticateToken, authorizeAdmin, deleteGenre);

export default router;