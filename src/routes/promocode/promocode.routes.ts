// src/routes/promocode/promocode.routes.ts
import { Router } from 'express';
import {
  getPromoCodes,
  getPromoCodeById,
  getPromoCodeByCode,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from '../../controllers/promocode/promocode.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

 const router = Router();

// Получить все промокоды
router.get('/', authenticateToken, authorizeAdmin, getPromoCodes);

// Получить промокод по ID
router.get('/:id', authenticateToken, authorizeAdmin, getPromoCodeById);

router.get('/code/:code', getPromoCodeByCode);

// Создать новый промокод
router.post('/', authenticateToken, authorizeAdmin, createPromoCode);

// Обновить промокод по ID
router.put('/:id', authenticateToken, authorizeAdmin, updatePromoCode);

// Удалить промокод по ID
router.delete('/:id', authenticateToken, authorizeAdmin, deletePromoCode);

export default router;