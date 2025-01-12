import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const prisma = new PrismaClient();

// Регистрация пользователя
export const registerUser = async (req: Request, res: Response) => {
  const { phone, roleId } = req.body;

  // Проверка на корректность номера телефона (например, длина)
  if (!phone || phone.length !== 11) {
    res.status(400).json({ error: 'Некорректный номер телефона' });
  } else {
    try {
      // Проверка, существует ли пользователь с таким номером телефона
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser) {
        res.status(400).json({
          error: 'Пользователь с таким номером телефона уже существует',
        });
      } else {
        const password = Math.floor(1000 + Math.random() * 9000).toString();

        // Отправка сообщения через API
        await axios.post(
          'https://api.green-api.com/waInstance1101823978/sendMessage/d0a3674c2d684bdfb47cbe1c66c04781e2f044544ad74a4199',
          {
            chatId: `${phone}@c.us`,
            message: `Здравствуйте, это ваш постоянный пароль от сайта kinovavilon.ru : ${password}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = await prisma.user.create({
          data: {
            phone,
            password: hashedPassword,
            roleId,
          },
        });

        res.status(201).json({ userId: newUser.id, phone: newUser.phone });
      }
    } catch (error) {
      console.error(error); // Логируем ошибку для отладки
      res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }
  }
};
// Вход пользователя
export const loginUser = async (req: Request, res: Response) => {
  const { phone, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      res.status(401).json({ error: 'Неверный телефон или пароль' });
    } else {
      // Проверяем пароль
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Неверный телефон или пароль' });
      } else {
        // Генерация токенов
        const accessToken = jwt.sign(
          { userId: user.id, roleId: user.roleId },
          process.env.JWT_ACCESS_SECRET!,
          {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION,
          }
        );

        const refreshToken = jwt.sign(
          { userId: user.id, roleId: user.roleId },
          process.env.JWT_REFRESH_SECRET!,
          {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
          }
        );

        // Сохраните refreshToken в базе данных, если необходимо
        // await prisma.user.update({
        //   where: { id: user.id },
        //   data: { refreshToken },
        // });

        res.json({ accessToken, refreshToken });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
};

// Обновление access токена
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
      res.status(408).json({ error: 'Refresh token не предоставлен' }); // Return here
  } else {
      try {
          const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
          console.log('Payload:', payload); // Отладка
          const user = await prisma.user.findUnique({
              where: { id: (payload as any).userId },
          });
          console.log('User :', user); // Отладка

          if (!user) {
              res.status(408).json({ error: 'Пользователь не найден' }); // Return here
          } else {
              const accessToken = jwt.sign(
                  { userId: user.id, roleId: user.roleId },
                  process.env.JWT_ACCESS_SECRET!,
                  {
                      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
                  }
              );

              res.json({ accessToken }); // Return here
          }
      } catch (error) {
          res.status(408).json({ error: 'Неверный refresh token' }); // Return here
      }
  }
};
