// src/routes/menu/menu.routes.ts
import { Router } from 'express';
import { getMenus, getMenuById, createMenu, updateMenu, deleteMenu } from '../../controllers/menu/menu.controller';
import { authenticateToken } from '../../auth.middleware';

const router = Router();

// Получить все пункты меню
router.get('/', getMenus);

// Получить пункт меню по ID
router.get('/:id', getMenuById);

// Создать новый пункт меню
router.post('/', authenticateToken ,createMenu);

// Обновить пункт меню
router.put('/:id', authenticateToken, updateMenu);

// Удалить пункт меню
router.delete('/:id', authenticateToken, deleteMenu);

export default router;