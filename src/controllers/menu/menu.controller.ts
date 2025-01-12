// src/routes/menu/menu.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все пункты меню
export const getMenus = async (req: Request, res: Response) => {
    try {
      const menus = await prisma.menu.findMany({
        include: {
          roles: true, // Включаем связанные роли
        },
      });
      res.json(menus);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении пунктов меню' });
    }
  };
  
  // Получить пункт меню по ID
  export const getMenuById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID пункта меню' });
    } else {
      try {
        const menu = await prisma.menu.findUnique({
          where: { id: Number(id) },
          include: {
            roles: true, // Включаем связанные роли
          },
        });
        if (!menu) {
          res.status(404).json({ error: 'Пункт меню не найден' });
        } else {
          res.json(menu);
        }
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пункта меню' });
      }
    }
  };

// Создать новый пункт меню
export const createMenu = async (req: Request, res: Response) => {
    const { name, path, roleIds } = req.body; // roleIds - массив ID ролей
    try {
      const newMenu = await prisma.menu.create({
        data: {
          name,
          path,
          roles: {
            connect: roleIds.map((id: number) => ({ id })), // Связываем роли
          },
        },
      });
      res.status(201).json(newMenu);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании пункта меню' });
    }
  };
  
  // Обновить пункт меню
  export const updateMenu = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, path, roleIds } = req.body; // roleIds - массив ID ролей
  
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID пункта меню' });
    } else {
      try {
        const updatedMenu = await prisma.menu.update({
          where: { id: Number(id) },
          data: {
            name,
            path,
            roles: {
              set: roleIds.map((id: number) => ({ id })), // Обновляем связи с ролями
            },
          },
        });
        res.json(updatedMenu);
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении пункта меню' });
      }
    }
  };

// Удалить пункт меню
export const deleteMenu = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID пункта меню' });
  } else {
    try {
      await prisma.menu.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении пункта меню' });
    }
  }
};