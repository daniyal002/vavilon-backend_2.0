import { Router } from 'express';
import { getUsers, getUserById, createUser , updateUser , deleteUser  } from '../../controllers/user/user.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить всех пользователей
router.get('/', authenticateToken,authorizeAdmin, getUsers);

// Получить пользователя по ID
router.get('/:id', authenticateToken, authorizeAdmin, getUserById);

// Создать нового пользователя
router.post('/', authenticateToken, authorizeAdmin, createUser );

// Обновить пользователя
router.put('/:id', authenticateToken, authorizeAdmin, updateUser );

// Удалить пользователя
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser );

export default router;