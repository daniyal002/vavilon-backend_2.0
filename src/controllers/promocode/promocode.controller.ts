// src/routes/promocode/promocode.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все промокоды
export const getPromoCodes = async (req: Request, res: Response) => {
  try {
    const promoCodes = await prisma.promoCode.findMany({include:{product:true}});
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении промокодов' });
  }
};

// Получить промокод по ID
export const getPromoCodeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID промокода' });
  } else {
    try {
      const promoCode = await prisma.promoCode.findUnique({
        where: { id: Number(id) },
      });
      if (!promoCode) {
        res.status(404).json({ error: 'Промокод не найден' });
      } else {
        res.json(promoCode);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении промокода' });
    }
  }
};

// Получить промокод по code
export const getPromoCodeByCode = async (req: Request, res: Response) => {
  const { code } = req.params;

  if (isNaN(Number(code))) {
    res.status(400).json({ error: 'Некорректный code промокода' });
  } else {
    try {
      const promoCode = await prisma.promoCode.findUnique({
        where: { code: code },include:{product:true}
      });
      if (!promoCode) {
        res.status(404).json({ error: 'Промокод не найден' });
      } else {
        const currentDate = new Date();
        if (
          currentDate < promoCode.startDate ||
          currentDate > promoCode.endDate
        ) {
          res
            .status(400)
            .json({
              error: 'Срок действия промокода истек или еще не начался',
            });
        } else {
          res.json(promoCode);
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении промокода' });
    }
  }
};

// Создать новый промокод
export const createPromoCode = async (req: Request, res: Response) => {
  const { code, type, value, startDate, endDate, productId } = req.body;
  try {
    const newPromoCode = await prisma.promoCode.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        productId: parseFloat(productId),
      },
    });
    res.status(201).json(newPromoCode);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании промокода' + error });
  }
};

// Обновить промокод
export const updatePromoCode = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, type, value, startDate, endDate, productId } = req.body;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID промокода' });
  } else {
    try {
      const updatedPromoCode = await prisma.promoCode.update({
        where: { id: Number(id) },
        data: {
          code,
          type,
          value: parseFloat(value),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          productId: parseFloat(productId),
        },
      });
      res.json(updatedPromoCode);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Ошибка при обновлении промокода' + error });
    }
  }
};

// Удалить промокод
export const deletePromoCode = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID промокода' });
  } else {
    try {
      await prisma.promoCode.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении промокода' });
    }
  }
};
