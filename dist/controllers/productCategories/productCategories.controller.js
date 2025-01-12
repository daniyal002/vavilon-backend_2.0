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
exports.updateProductCategory = exports.deleteProductCategory = exports.createProductCategory = exports.getProductCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все категории продуктов
const getProductCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.productCategory.findMany({
            include: {
                products: true, // Включаем продукты в категории
            },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении категорий продуктов' });
    }
});
exports.getProductCategories = getProductCategories;
// Создать новую категорию продукта
const createProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newCategory = yield prisma.productCategory.create({
            data: {
                name,
            },
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании категории продукта' });
    }
});
exports.createProductCategory = createProductCategory;
// Удал ить категорию продукта
const deleteProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID категории продукта' });
    }
    else {
        try {
            yield prisma.productCategory.delete({
                where: { id: Number(id) },
            });
            res.status(204).send(); // Успешное удаление, без содержимого в ответе
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении категории продукта' });
        }
    }
});
exports.deleteProductCategory = deleteProductCategory;
// Обновить категорию продукта
const updateProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID категории продукта' });
    }
    else {
        try {
            const updatedCategory = yield prisma.productCategory.update({
                where: { id: Number(id) },
                data: {
                    name,
                },
            });
            res.json(updatedCategory);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении категории продукта' });
        }
    }
});
exports.updateProductCategory = updateProductCategory;
