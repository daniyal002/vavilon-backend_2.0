"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/product.routes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const product_controller_1 = require("../../controllers/product/product.controller");
const router = (0, express_1.Router)();
// Папка для хранения изображений
const imageDir = 'productImage/';
// Проверка и создание папки, если она не существует
if (!fs_1.default.existsSync(imageDir)) {
    fs_1.default.mkdirSync(imageDir, { recursive: true });
}
// Настройка multer для хранения загруженных изображений
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir); // Папка для хранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
    },
});
const upload = (0, multer_1.default)({ storage });
// Продукты
router.get('/products', product_controller_1.getProducts);
router.get('/products/:id', product_controller_1.getProductById);
router.post('/products', upload.single('image'), product_controller_1.createProduct); // Загрузка изображения при создании продукта
router.put('/products/:id', upload.single('image'), product_controller_1.updateProduct); // Загрузка изображения при обновлении продукта
router.delete('/products/:id', product_controller_1.deleteProduct);
exports.default = router;
