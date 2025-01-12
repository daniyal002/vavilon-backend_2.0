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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
// Получить все продукты
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            include: {
                category: true, // Включаем категорию
            },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
});
exports.getProducts = getProducts;
// Получить продукт по ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID продукта' });
    }
    else {
        try {
            const product = yield prisma.product.findUnique({
                where: { id: Number(id) },
                include: {
                    category: true, // Включаем категорию
                },
            });
            if (!product) {
                res.status(404).json({ error: 'Продукт не найден' });
            }
            else {
                res.json(product);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении продукта' });
        }
    }
});
exports.getProductById = getProductById;
// Создать новый продукт
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, categoryId, additionalInfo } = req.body;
    // Получаем путь к изображению из загруженного файла
    const imagePath = req.file ? path_1.default.join('uploads', req.file.filename) : ""; // Путь к загруженному изображению
    try {
        const newProduct = yield prisma.product.create({
            data: {
                name,
                price,
                categoryId,
                additionalInfo,
                imagePath, // Используем загруженный путь к изображению
            },
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании продукта' });
    }
});
exports.createProduct = createProduct;
// Обновить продукт
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, categoryId, additionalInfo } = req.body;
    // Получаем путь к изображению из загруженного файла
    const imagePath = req.file ? path_1.default.join('uploads', req.file.filename) : null; // Путь к загруженному изображению
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID продукта' });
    }
    else {
        try {
            const updatedProduct = yield prisma.product.update({
                where: { id: Number(id) },
                data: {
                    name,
                    price,
                    categoryId,
                    additionalInfo,
                    imagePath: imagePath ? imagePath : undefined, // Обновляем путь к изображению только если оно загружено
                },
            });
            res.json(updatedProduct);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении продукта' });
        }
    }
});
exports.updateProduct = updateProduct;
// Удалить продукт
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID продукта' });
    }
    else {
        try {
            yield prisma.product.delete({
                where: { id: Number(id) },
            });
            res.status(204).send(); // Успешное удаление, без содержимого в ответе
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении продукта' });
        }
    }
});
exports.deleteProduct = deleteProduct;
