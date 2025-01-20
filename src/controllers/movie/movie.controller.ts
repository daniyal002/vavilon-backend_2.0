// src/routes/movie/movie.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs'

const prisma = new PrismaClient();

// Получить все фильмы
export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        genres: true, // Теперь включаем массив жанров
      },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении фильмов' });
  }
};

// Получить фильм по ID
export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID фильма' });
  } else {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id: Number(id) },
        include: {
          genres: true, // Теперь включаем массив жанров
        },
      });
      if (!movie) {
        res.status(404).json({ error: 'Фильм не найден' });
      } else {
        res.json(movie);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении фильма' });
    }
  }
};

// Создать новый фильм
// export const createMovie = async (req: Request, res: Response) => {
//   const {
//     title,
//     description,
//     rating,
//     year,
//     ageRestriction,
//     trailerLink,
//     premiere,
//     genreIds,
//   } = req.body; // genreIds теперь массив
//   const imagePath = req.file ? path.join('movieImage', req.file.filename) : '';

//   try {
//     const newMovie = await prisma.movie.create({
//       data: {
//         title,
//         description,
//         rating: parseFloat(rating),
//         year: parseInt(year),
//         ageRestriction,
//         imagePath,
//         trailerLink,
//         premiere: Boolean(premiere),
//         genres: {
//           connect: genreIds.map((id: string) => ({ id: parseInt(id) })), // Подключаем все жанры
//         },
//       },
//       include: { genres: true },
//     });
//     res.status(201).json(newMovie);
//   } catch (error) {
//     res.status(500).json({ error: 'Ошибка при создании фильма' + error });
//   }
// };

export const createMovie = async (req: Request, res: Response) => {
  const {
    title,
    description,
    rating,
    year,
    ageRestriction,
    trailerLink,
    premiere,
    genreIds,
  } = req.body;
  const imagePath = req.file ? path.join('movieImage', req.file.filename) : '';

  try {
    // Преобразуем genreIds в массив, если это строка
    const genreIdsArray = Array.isArray(genreIds)
      ? genreIds
      : typeof genreIds === 'string'
        ? [genreIds]
        : [];

    const newMovie = await prisma.movie.create({
      data: {
        title,
        description,
        rating: parseFloat(rating),
        year: parseInt(year),
        ageRestriction,
        imagePath,
        trailerLink,
        premiere: premiere === 'true' ? true : false,
        genres: {
          connect: genreIdsArray.map((id: string) => ({ id: parseInt(id) })),
        },
      },
      include: { genres: true },
    });
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Ошибка при создании фильма: ' + error });
  }
}

// Обновить фильм
export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    rating,
    year,
    ageRestriction,
    trailerLink,
    premiere,
    genreIds,
  } = req.body;
  const imagePath = req.file
    ? path.join('movieImage', req.file.filename)
    : null;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID фильма' });
  } else {
    try {
      const currentMovie = await prisma.movie.findUnique({
        where: { id: Number(id) },
      });

      if (currentMovie && currentMovie.imagePath && imagePath) {
        const oldImagePath = currentMovie.imagePath;
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          }
        });
      }

      const genreIdsArray = Array.isArray(genreIds)
        ? genreIds
        : typeof genreIds === 'string'
          ? [genreIds]
          : [];
      const updatedMovie = await prisma.movie.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          rating: parseFloat(rating),
          year: parseInt(year),
          ageRestriction,
          imagePath: imagePath ? imagePath : undefined,
          trailerLink,
          premiere: premiere === 'true' ? true : false,
          genres: {
            set: [], // Сначала очищаем все жанры
            connect: genreIdsArray.map((id: string) => ({ id: parseInt(id) })), // Затем подключаем новые
          },
        },
        include: { genres: true },
      });
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении фильма' + error});
    }
  }
};

// Удалить фильм
export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID фильма ' });
  } else {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id: Number(id) },
      });

      if (movie && movie.imagePath) {
        const imagePath = movie.imagePath;
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          }
        });
      }

      await prisma.movie.delete({
        where: { id: Number(id) },
      });
      res.status(204).send(); // Успешное удаление, без содержимого в ответе
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении фильма' });
    }
  }
};
