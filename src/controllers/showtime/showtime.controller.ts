// src/routes/showtime/showtime.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../auth.middleware';

const prisma = new PrismaClient();

// Получить все сеансы
export const getShowTimes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const setting = await prisma.settings.findUnique({where:{key:'ENABLE_PROMOCODE'}})
    const ENABLE_PROMOCODE = setting?.value
    // Получаем количество забронированных мест для каждого showtime
    const bookingsCount = await prisma.booking.groupBy({
      by: ['showTimeId'],
      _sum: {
        reservedSeats: true,
      },
    });

    // Создаем объект для хранения количества забронированных мест по showTimeId
    const reservedSeatsCountMap: Record<number, number> = {};
    // @ts-ignore
    bookingsCount.forEach((booking) => {
      reservedSeatsCountMap[booking.showTimeId] =
        booking._sum.reservedSeats || 0;
    });

    const showTimes = await prisma.showTime.findMany({
      include: {
        movie: { include: { genres: true } },
        theater: true,
        bookings: true,
      },
    });

    // Добавляем количество забронированных мест к каждому сеансу
    // @ts-ignore
    const showTimesWithReservedSeats = showTimes.map((showTime) => ({
      ...showTime,
      reservedSeatsCount: reservedSeatsCountMap[showTime.id] || 0,
      availableSeats:
        showTime.seatsAvailable - (reservedSeatsCountMap[showTime.id] || 0),
    }));

    res.json({showTimes:[...showTimesWithReservedSeats],ENABLE_PROMOCODE});
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении сеансов' });
  }
};

// Получить все showtime с количеством забронированных мест для каждого
export const getAllShowTimesWithBookingCount = async (
  req: Request,
  res: Response
) => {
  try {
    // Получаем все showtime
    const showTimes = await prisma.showTime.findMany({
      include: {
        movie: true,
        theater: true,
        bookings: {include:{product:true}},
      },
    });

    // Получаем количество забронированных мест для каждого showtime
    const bookingsCount = await prisma.booking.groupBy({
      by: ['showTimeId'],
      _sum: {
        reservedSeats: true,
      },
    });

    // Создаем объект для хранения количества забронированных мест по showTimeId
    const reservedSeatsCountMap: Record<number, number> = {};
    // @ts-ignore
    bookingsCount.forEach((booking) => {
      reservedSeatsCountMap[booking.showTimeId] =
        booking._sum.reservedSeats || 0; // Если нет бронирований, устанавливаем 0
    });

    // Объединяем данные showtime с количеством забронированных мест
    // @ts-ignore
    const showTimesWithReservedSeatsCount = showTimes.map((showTime) => ({
      ...showTime,
      reservedSeatsCount: reservedSeatsCountMap[showTime.id] || 0, // Устанавливаем количество забронированных мест
    }));

    res.json(showTimesWithReservedSeatsCount);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных showtime' });
  }
};

// Получить сеанс по ID
export const getShowTimeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID сеанса' });
  } else {
    try {
      const showTime = await prisma.showTime.findUnique({
        where: { id: Number(id) },
        include: {
          movie: true,
          theater: true,
          bookings: { include: { user: { select: { phone: true } } } },
        },
      });
      if (!showTime) {
        res.status(404).json({ error: 'Сеанс не найден' });
      } else {
        res.json(showTime);
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении сеанса' });
    }
  }
};

// Контроллер для проверки наличия бронирования
export const checkBooking = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId; // Получаем ID пользователя из запроса
  const { id } = req.params;
  console.log(req.params);
  // Проверяем, что userId и showTimeId существуют
  if (!userId || !id) {
    res.status(400).json({ error: 'Неверные параметры запроса' });
  } else {
    try {
      // Проверяем наличие бронирования
      const booking = await prisma.booking.findUnique({
        where: {
          userId_showTimeId: {
            userId: Number(userId), // Преобразуем userId в число
            showTimeId: Number(id),
          },
        },
      });

      // Возвращаем результат
      if (booking) {
        res.json({ isBooked: true });
      } else {
        if (!booking) res.json({ isBooked: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при проверке бронирования' });
    }
  }
};

// Создать новый сеанс
export const createShowTime = async (req: Request, res: Response) => {
  const {
    movieId,
    startTime,
    endTime,
    price,
    date,
    seatsAvailable,
    theaterId,
  } = req.body;
  // Преобразуем дату и время в формат Date
  const startDateTime = new Date(`${date}T${startTime}`); // Объединяем дату и время для начала
  const endDateTime = new Date(`${date}T${endTime}`); // Объединяем дату и время для окончания

  try {
    const newShowTime = await prisma.showTime.create({
      data: {
        movie: {
          connect: { id: Number(movieId) },
        },
        theater: {
          connect: {
            id: Number(theaterId),
          },
        },
        startTime: startDateTime,
        endTime: endDateTime,
        price: parseFloat(price),
        date: new Date(date),
        seatsAvailable: parseInt(seatsAvailable),
      },
      include: { movie: true, theater: true },
    });
    res.status(201).json(newShowTime);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании сеанса' + error });
  }
};

// Обновить сеанс
export const updateShowTime = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    movieId,
    startTime,
    endTime,
    price,
    date,
    seatsAvailable,
    theaterId,
  } = req.body;
  // Преобразуем дату и время в формат Date
  const startDateTime = new Date(`${date}T${startTime}`); // Объединяем дату и время для начала
  const endDateTime = new Date(`${date}T${endTime}`); // Объединяем дату и время для окончания

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID сеанса' });
  } else {
    try {
      const updatedShowTime = await prisma.showTime.update({
        where: { id: Number(id) },
        data: {
          movie: {
            connect: { id: Number(movieId) },
          },
          theater: {
            connect: {
              id: Number(theaterId),
            },
          },
          startTime: startDateTime,
          endTime: endDateTime,
          price: parseFloat(price),
          date: new Date(date),
          seatsAvailable: parseInt(seatsAvailable),
        },
        include: { movie: true, theater: true },
      });
      res.json(updatedShowTime);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении сеанса' });
    }
  }
};

// Удалить сеанс
export const deleteShowTime = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID сеанса' });
  } else {
    try {
      await prisma.showTime.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении сеанса' });
    }
  }
};
