// src/controllers/product/product.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Получить все продукты
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Включаем категорию
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
};

// Получить продукт по ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID продукта' });
  } else {
    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          category: true, // Включаем категорию
        },
      });
      if (!product) {
        res.status(404).json({ error: 'Продукт не найден' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении продукта' });
    }
  }
};

// Создать новый продукт
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, categoryId, additionalInfo } = req.body;

  // Получаем путь к изображению из загруженного файла
  const imagePath = req.file
    ? path.join('productImage', req.file.filename)
    : ''; // Путь к загруженному изображению

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        category: {
          connect: {
            id: Number(categoryId),
          },
        },
        price: Number(price),
        additionalInfo,
        imagePath, // Используем загруженный путь к изображению
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании продукта' + error });
  }
};

// Обновить продукт
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, categoryId, additionalInfo } = req.body;

  // Получаем путь к изображению из загруженного файла
  const newImagePath = req.file
    ? path.join('productImage', req.file.filename)
    : null; // Путь к загруженному изображению

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID продукта' });
  } else {
    try {
      // Находим старый продукт, чтобы получить путь к старому изображению
      const oldProduct = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!oldProduct) {
        res.status(404).json({ error: 'Продукт не найден' });
      }else{


      // Если новое изображение загружено, удаляем старое изображение
      if (newImagePath) {
        const oldImagePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          oldProduct.imagePath
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Удаляем старое изображение
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name,
          category: {
            connect: {
              id: Number(categoryId),
            },
          },
          price: Number(price),
          additionalInfo,
          imagePath: newImagePath ? newImagePath : undefined, // Обновляем путь к изображению только если оно загружено
        },
      });
      res.json(updatedProduct);
    }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении продукта' });
    }
  }
};

// Удалить продукт
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID продукта' });
  } else {
    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        res.status(404).json({ error: 'Продукт не найден' });
      } else {
        // Удаляем изображение из файловой системы
        const imagePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          product.imagePath
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Удаляем изображение
        }

        await prisma.product.delete({
          where: { id: Number(id) },
        });
      }

      res.status(204).send(); // Успешное удаление, без содержимого в ответе
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении продукта' });
    }
  }
};
