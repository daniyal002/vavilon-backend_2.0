// src/routes/showtime/showtime.routes.ts
import { Router } from 'express';
import { getShowTimes, getShowTimeById, createShowTime, updateShowTime, deleteShowTime, checkBooking, getAllShowTimesWithBookingCount } from '../../controllers/showtime/showtime.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить все сеансы
router.get('/', getShowTimes);

router.get('/allShowTimesWithBookingCount',authenticateToken,authorizeAdmin, getAllShowTimesWithBookingCount);

// Получить сеанс по ID
router.get('/:id', authenticateToken, authorizeAdmin, getShowTimeById);

router.get('/checkBooking/:id',authenticateToken, authorizeAdmin, checkBooking)

// Создать новый сеанс
router.post('/', authenticateToken, authorizeAdmin, createShowTime);

// Обновить сеанс по ID
router.put('/:id', authenticateToken, authorizeAdmin, updateShowTime);

// Удалить сеанс по ID
router.delete('/:id', authenticateToken, authorizeAdmin, deleteShowTime);

export default router;