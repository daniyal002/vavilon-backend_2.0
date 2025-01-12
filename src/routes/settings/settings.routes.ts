import express from 'express';
import {
  getSettings,
  updateSetting,
} from '../../controllers/settings/settings.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';


const router = express.Router();

// Получить все настройки
router.get('/', authenticateToken, authorizeAdmin, getSettings);

// Обновить настройку
router.put('/', authenticateToken, authorizeAdmin, updateSetting);

export default router;
