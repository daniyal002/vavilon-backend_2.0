import { Request, Response } from 'express';
import { PrismaClient, SettingKey } from '@prisma/client';

const prisma = new PrismaClient();

// Получить все настройки
export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await prisma.settings.findMany();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении настроек' });
  }
};

// Обновить настройку по ключу
export const updateSetting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { key, value } = req.body;

  if (!key || typeof value !== 'boolean') {
    res
      .status(400)
      .json({ error: 'Некорректные данные для обновления настройки' });
    return;
  }

  try {
    const updatedSetting = await prisma.settings.update({
      where: { key },
      data: { value },
    });

    res.json(updatedSetting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении настройки' });
  }
};
