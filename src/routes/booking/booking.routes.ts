// src/routes/booking/booking.routes.ts
import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByPhone,
  confirmBooking,
  deleteBookingById,
  getBookingSummariesByPhone,
  checkConfirmation,
} from '../../controllers/booking/booking.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Получить все бронирования
router.get('/', authenticateToken, authorizeAdmin, getBookings);

router.get('/phone/:phone', authenticateToken, authorizeAdmin, getBookingsByPhone);

// Получить бронирование по ID
router.get('/:id', authenticateToken, authorizeAdmin, getBookingById);

// Создать новое бронирование
router.post('/', createBooking);

// Обновить бронирование по ID
router.put('/:id', authenticateToken, authorizeAdmin, updateBooking);

router.delete('/:showTimeId', deleteBooking);

// Удалить бронирование по ID
router.delete('/delete/:id', authenticateToken, authorizeAdmin, deleteBookingById);
// Подтвердить бронирование
router.patch('/:id/confirm', confirmBooking);

router.get('/summaries/summaries',authenticateToken, authorizeAdmin, getBookingSummariesByPhone)

router.post('/check-confirmation', checkConfirmation);
export default router;
