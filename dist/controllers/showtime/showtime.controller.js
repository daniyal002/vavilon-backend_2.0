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
exports.deleteShowTime = exports.updateShowTime = exports.createShowTime = exports.getShowTimeById = exports.getShowTimes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все сеансы
const getShowTimes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showTimes = yield prisma.showTime.findMany({
            include: {
                movie: true, // Включаем информацию о фильме
                promoCode: true, // Включаем информацию о промокоде
            },
        });
        res.json(showTimes);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении сеансов' });
    }
});
exports.getShowTimes = getShowTimes;
// Получить сеанс по ID
const getShowTimeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID сеанса' });
    }
    else {
        try {
            const showTime = yield prisma.showTime.findUnique({
                where: { id: Number(id) },
                include: {
                    movie: true,
                    promoCode: true,
                },
            });
            if (!showTime) {
                res.status(404).json({ error: 'Сеанс не найден' });
            }
            else {
                res.json(showTime);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении сеанса' });
        }
    }
});
exports.getShowTimeById = getShowTimeById;
// Создать новый сеанс
const createShowTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, startTime, endTime, price, date, seatsAvailable, promoCodeId } = req.body;
    try {
        const newShowTime = yield prisma.showTime.create({
            data: {
                movie: {
                    connect: { id: movieId },
                },
                startTime,
                endTime,
                price,
                date,
                seatsAvailable,
                promoCode: promoCodeId ? {
                    connect: { id: promoCodeId },
                } : undefined,
            },
        });
        res.status(201).json(newShowTime);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании сеанса' });
    }
});
exports.createShowTime = createShowTime;
// Обновить сеанс
const updateShowTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { movieId, startTime, endTime, price, date, seatsAvailable, promoCodeId } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID сеанса' });
    }
    else {
        try {
            const updatedShowTime = yield prisma.showTime.update({
                where: { id: Number(id) },
                data: {
                    movie: {
                        connect: { id: movieId },
                    },
                    startTime,
                    endTime,
                    price,
                    date,
                    seatsAvailable,
                    promoCode: promoCodeId ? {
                        connect: { id: promoCodeId },
                    } : undefined,
                },
            });
            res.json(updatedShowTime);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении сеанса' });
        }
    }
});
exports.updateShowTime = updateShowTime;
// Удалить сеанс
const deleteShowTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID сеанса' });
    }
    else {
        try {
            yield prisma.showTime.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении сеанса' });
        }
    }
});
exports.deleteShowTime = deleteShowTime;
