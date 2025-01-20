import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const saveSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { subscription } = req.body;

  if (!subscription || !subscription.endpoint) {
    res.status(400).json({ error: "Некорректная подписка" });
    return;
  }

  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { endpoint: subscription.endpoint }, // Уникальный ключ для подписки
    });

    if (!existingSubscription) {
      await prisma.subscription.create({
        data: {
          subscription: JSON.stringify(subscription),
          endpoint: subscription.endpoint,
        },
      });
    }

    res.status(201).json({ message: "Подписка сохранена" });
  } catch (error) {
    console.error("Ошибка сохранения подписки:", error);
    res.status(500).json({ error: "Ошибка при сохранении подписки" });
  }
};
