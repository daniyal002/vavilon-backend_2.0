// src/routes/product.routes.ts
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/product/product.controller';
import { authenticateToken, authorizeAdmin } from '../../auth.middleware';

const router = Router();

// Папка для хранения изображений
const imageDir = 'productImage/';

// Проверка и создание папки, если она не существует
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Настройка multer для хранения загруженных изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir); // Папка для хранения изображений
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Уникальное имя файла
  },
});

const upload = multer({ storage });

// Продукты
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), createProduct); // Загрузка изображения при создании продукта
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateProduct); // Загрузка изображения при обновлении продукта
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

export default router;