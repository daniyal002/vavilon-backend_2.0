import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Интерфейс для типизации запроса
interface UserRequest {
  phone: string;
  password: string;
  roleId: string;
}

// Получить всех пользователей с фильтрацией
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { phone, roleId } = req.query;

    // Формируем условия фильтрации
    const where: Prisma.UserWhereInput = {
      ...(phone && { phone: { contains: phone as string } }),
      ...(roleId && { roleId: parseInt(roleId as string) }),
    };

    const users = await prisma.user.findMany({
      where,
      include: { role: true },
      orderBy: { id: 'asc' },
    });

    // Скрываем пароли в ответе
    const safeUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

// Получить пользователя по ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID пользователя' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { role: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
};

// Создать нового пользователя
export const createUser = async (
  req: Request<{}, {}, UserRequest>,
  res: Response
): Promise<void> => {
  const { password, phone, roleId } = req.body;

  try {
    if (!password || !phone || !roleId) {
      res.status(400).json({ error: 'Все поля обязательны для заполнения' });
      return;
    }

    // Проверка формата телефона
    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400).json({ error: 'Некорректный формат телефона' });
      return;
    }

    // Проверка существования роли
    const role = await prisma.userRole.findUnique({
      where: { id: parseInt(roleId) },
    });

    if (!role) {
      res.status(400).json({ error: 'Указанная роль не существует' });
      return;
    }

    // Проверка уникальности телефона
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ error: 'Пользователь с таким телефоном уже существует' });

      return;
    }

    // Валидация пароля
    if (password.length < 4) {
      res
        .status(400)
        .json({ error: 'Пароль должен содержать минимум 6 символов' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        password: hashedPassword,
        phone,
        roleId: parseInt(roleId),
      },
      include: { role: true },
    });

    // Скрываем пароль в ответе
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
};

// Обновить пользователя
export const updateUser = async (
  req: Request<{ id: string }, {}, Partial<UserRequest>>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { password, phone, roleId } = req.body;

  try {
    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return 
    }

    // Валидация телефона если он передан
    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{10,14}$/;
      if (!phoneRegex.test(phone)) {
        res.status(400).json({ error: 'Некорректный формат телефона' });
        return 
      }

      // Проверка уникальности нового телефона
      const userWithPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (userWithPhone && userWithPhone.id !== Number(id)) {
        res
        .status(400)
        .json({ error: 'Пользователь с таким телефоном уже существует' });
        
        return 
      }
    }

    // Проверка роли если она передана
    if (roleId) {
      const role = await prisma.userRole.findUnique({
        where: { id: parseInt(roleId) },
      });

      if (!role) {
        res.status(400).json({ error: 'Указанная роль не существует' });
        return 
      }
    }

    let hashedPassword;
    if (password) {
      if (password.length < 4) {
        res
        .status(400)
        .json({ error: 'Пароль должен содержать минимум 6 символов' });
        
        return 
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(hashedPassword && { password: hashedPassword }),
        ...(phone && { phone }),
        ...(roleId && { roleId: parseInt(roleId) }),
      },
      include: { role: true },
    });

    // Скрываем пароль в ответе
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
};

// Удалить пользователя
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID пользователя' });
      return 
    }

    // Проверка существования пользователя
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return 
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
};
