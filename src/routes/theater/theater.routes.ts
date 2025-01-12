// src/routes/theater/theater.routes.ts
import { Router } from 'express';
import { 
  getTheaters, 
  getTheaterById, 
  createTheater, 
  updateTheater, 
  deleteTheater 
} from '../../controllers/theater/theater.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить все залы
router.get('/', getTheaters);

// Получить зал по ID
router.get('/:id', getTheaterById);

// Создать новый зал
router.post('/', authenticateToken, authorizeAdmin, createTheater);

// Обновить зал
router.put('/:id', authenticateToken, authorizeAdmin, updateTheater);

// Удалить зал
router.delete('/:id', authenticateToken, authorizeAdmin, deleteTheater);

export default router;