// src/routes/userRole/userRole.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все роли пользователей
export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.userRole.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении ролей пользователей' });
  }
};

// Получить роль пользователя по ID
export const getUserRoleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID роли пользователя' });
  } else {
    try {
      const role = await prisma.userRole.findUnique({
        where: { id: Number(id) },
      });
      if (!role) {
        res.status(404).json({ error: 'Роль пользователя не найдена' });
      } else {
        res.json(role);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении роли пользователя' });
    }
  }
};

// Создать новую роль пользователя
export const createUserRole = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newRole = await prisma.userRole.create({
      data: { name },
    });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании роли пользователя' });
  }
};

// Обновить роль пользователя
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID роли пользователя' });
  } else {
    try {
      const updatedRole = await prisma.userRole.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.json(updatedRole);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении роли пользователя' });
    }
  }
};

// Удалить роль пользователя
export const deleteUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID роли пользователя' });
  } else {
    try {
      await prisma.userRole.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении роли пользователя' });
    }
  }
};