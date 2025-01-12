// src/routes/userRole/userRole.routes.ts
import { Router } from 'express';
import { getUserRoles, getUserRoleById, createUserRole, updateUserRole, deleteUserRole } from '../../controllers/role/role.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить все роли пользователей
router.get('/', authenticateToken, authorizeAdmin, getUserRoles);

// Получить роль пользователя по ID
router.get('/:id', authenticateToken, authorizeAdmin, getUserRoleById);

// Создать новую роль пользователя
router.post('/', authenticateToken, authorizeAdmin, createUserRole);

// Обновить роль пользователя
router.put('/:id', authenticateToken, authorizeAdmin, updateUserRole);

// Удалить роль пользователя
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUserRole);

export default router;
