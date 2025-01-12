// src/routes/genre/genre.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все жанры
export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        movies: true, // Включаем фильмы
      },
    });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении жанров' });
  }
};

// Получить жанр по ID
export const getGenreById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID жанра' });
  } else {
    try {
      const genre = await prisma.genre.findUnique({
        where: { id: Number(id) },
        include: {
          movies: true, // Включаем фильмы
        },
      });
      if (!genre) {
        res.status(404).json({ error: 'Жанр не найден' });
      } else {
        res.json(genre);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении жанра' });
    }
  }
};

// Создать новый жанр
export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newGenre = await prisma.genre.create({
      data: { name },
    });
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании жанра' });
  }
};

// Обновить жанр
export const updateGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID жанра' });
  } else {
    try {
      const updatedGenre = await prisma.genre.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.json(updatedGenre);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении жанра' });
    }
  }
};

// Удалить жанр
export const deleteGenre = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID жанра' });
  } else {
    try {
      await prisma.genre.delete({
        where: { id: Number(id) },
      });
      res.status(204).send(); // Успешное удаление, без содержимого в ответе
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении жанра' });
    }
  }
};