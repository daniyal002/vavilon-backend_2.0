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
exports.deletePromoCode = exports.updatePromoCode = exports.createPromoCode = exports.getPromoCodeById = exports.getPromoCodes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все промокоды
const getPromoCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promoCodes = yield prisma.promoCode.findMany();
        res.json(promoCodes);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении промокодов' });
    }
});
exports.getPromoCodes = getPromoCodes;
// Получить промокод по ID
const getPromoCodeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID промокода' });
    }
    else {
        try {
            const promoCode = yield prisma.promoCode.findUnique({
                where: { id: Number(id) },
            });
            if (!promoCode) {
                res.status(404).json({ error: 'Промокод не найден' });
            }
            else {
                res.json(promoCode);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении промокода' });
        }
    }
});
exports.getPromoCodeById = getPromoCodeById;
// Создать новый промокод
const createPromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, type, value, startDate, endDate } = req.body;
    try {
        const newPromoCode = yield prisma.promoCode.create({
            data: {
                code,
                type,
                value,
                startDate,
                endDate,
            },
        });
        res.status(201).json(newPromoCode);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании промокода' });
    }
});
exports.createPromoCode = createPromoCode;
// Обновить промокод
const updatePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { code, type, value, startDate, endDate } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID промокода' });
    }
    else {
        try {
            const updatedPromoCode = yield prisma.promoCode.update({
                where: { id: Number(id) },
                data: {
                    code,
                    type,
                    value,
                    startDate,
                    endDate,
                },
            });
            res.json(updatedPromoCode);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении промокода' });
        }
    }
});
exports.updatePromoCode = updatePromoCode;
// Удалить промокод
const deletePromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID промокода' });
    }
    else {
        try {
            yield prisma.promoCode.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении промокода' });
        }
    }
});
exports.deletePromoCode = deletePromoCode;
