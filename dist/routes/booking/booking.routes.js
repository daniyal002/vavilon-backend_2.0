"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/booking/booking.routes.ts
const express_1 = require("express");
const booking_controller_1 = require("../../controllers/booking/booking.controller");
const router = (0, express_1.Router)();
// Получить все бронирования
router.get('/', booking_controller_1.getBookings);
// Получить бронирование по ID
router.get('/:id', booking_controller_1.getBookingById);
// Создать новое бронирование
router.post('/', booking_controller_1.createBooking);
// Обновить бронирование по ID
router.put('/:id', booking_controller_1.updateBooking);
// Удалить бронирование по ID
router.delete('/:id', booking_controller_1.deleteBooking);
exports.default = router;
