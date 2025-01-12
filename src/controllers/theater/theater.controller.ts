// src/controllers/theater/theater.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все залы
export const getTheaters = async (req: Request, res: Response) => {
  try {
    const theaters = await prisma.theater.findMany();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении залов' });
  }
};

// Получить зал по ID
export const getTheaterById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID зала' });
  } else {
    try {
      const theater = await prisma.theater.findUnique({
        where: { id: Number(id) },
      });
      if (!theater) {
        res.status(404).json({ error: 'Зал не найден' });
      } else {
        res.json(theater);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении зала' });
    }
  }
};

// Создать новый зал
export const createTheater = async (req: Request, res: Response) => {
  const { name, type, rows, seatsPerRow } = req.body;
  try {
    const newTheater = await prisma.theater.create({
      data: { name, type, rows, seatsPerRow },
    });
    res.status(201).json(newTheater);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании зала' });
  }
};

// Обновить зал
export const updateTheater = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, rows, seatsPerRow } = req.body;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID зала' });
  } else {
    try {
      const updatedTheater = await prisma.theater.update({
        where: { id: Number(id) },
        data: { name, type, rows, seatsPerRow },
      });
      res.json(updatedTheater);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении зала' });
    }
  }
};

// Удалить зал
export const deleteTheater = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID зала' });
  } else {
    try {
      await prisma.theater.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении зала' });
    }
  }
};