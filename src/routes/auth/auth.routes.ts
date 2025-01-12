import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from '../../controllers/auth/auth.controller';
import { authenticateToken } from '../../auth.middleware';

const router = Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Вход пользователя
router.post('/login', loginUser);

// Обновление access токена
router.post('/refresh-token', refreshAccessToken);

export default router;
