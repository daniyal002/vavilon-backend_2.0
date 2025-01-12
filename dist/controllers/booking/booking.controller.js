"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.getBookings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все бронирования
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield prisma.booking.findMany({
            include: {
                showTime: true, user: true, // Включаем информацию о пользователе
            },
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении бронирований' });
    }
});
exports.getBookings = getBookings;
// Получить бронирование по ID
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID бронирования' });
    }
    else {
        try {
            const booking = yield prisma.booking.findUnique({
                where: { id: Number(id) },
                include: {
                    showTime: true,
                    user: true,
                },
            });
            if (!booking) {
                res.status(404).json({ error: 'Бронирование не найдено' });
            }
            else {
                res.json(booking);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении бронирования' });
        }
    }
});
exports.getBookingById = getBookingById;
// Создать новое бронирование
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { showTimeId, userId, reservedSeats, totalAmount, confirmation, qrCode } = req.body;
    try {
        const newBooking = yield prisma.booking.create({
            data: {
                showTime: {
                    connect: { id: showTimeId },
                },
                user: {
                    connect: { id: userId },
                },
                reservedSeats,
                totalAmount,
                confirmation,
                qrCode,
            },
        });
        res.status(201).json(newBooking);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании бронирования' });
    }
});
exports.createBooking = createBooking;
// Обновить бронирование
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { showTimeId, userId, reservedSeats, totalAmount, confirmation, qrCode } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID бронирования' });
    }
    else {
        try {
            const updatedBooking = yield prisma.booking.update({
                where: { id: Number(id) },
                data: {
                    showTime: {
                        connect: { id: showTimeId },
                    },
                    user: {
                        connect: { id: userId },
                    },
                    reservedSeats,
                    totalAmount,
                    confirmation,
                    qrCode,
                },
            });
            res.json(updatedBooking);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении бронирования' });
        }
    }
});
exports.updateBooking = updateBooking;
// Удалить бронирование
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID бронирования' });
    }
    else {
        try {
            yield prisma.booking.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении бронирования' });
        }
    }
});
exports.deleteBooking = deleteBooking;
