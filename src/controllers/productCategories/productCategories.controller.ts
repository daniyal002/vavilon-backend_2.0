import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Получить все категории продуктов
export const getProductCategories = async (req: Request, res: Response) => {
    try {
      const categories = await prisma.productCategory.findMany();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении категорий продуктов' });
    }
  };

  // Получить категорию продукта по ID
export const getProductCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID категории продукта' });
  }

  try {
    const category = await prisma.productCategory.findUnique({where: { id: Number(id) }});

    if (!category) {
      res.status(404).json({ error: 'Категория продукта не найдена' });
    }else{
      res.json(category);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категории продукта' });
  }
};
  
  // Создать новую категорию продукта
  export const createProductCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
  
    try {
      const newCategory = await prisma.productCategory.create({
        data: {
          name,
        },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании категории продукта' });
    }
  };
  
  // Удалить категорию продукта
  export const deleteProductCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID категории продукта' });
    } else {
      try {
        await prisma.productCategory.delete({
          where: { id: Number(id) },
        });
        res.status(204).send(); // Успешное удаление, без содержимого в ответе
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении категории продукта' });
      }
    }
  };
  
  // Обновить категорию продукта
  export const updateProductCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
  
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID категории продукта' });
    } else {
      try {
        const updatedCategory = await prisma.productCategory.update({
          where: { id: Number(id) },
          data: {
            name,
          },
        });
        res.json(updatedCategory);
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении категории продукта' });
      }
    }
  };