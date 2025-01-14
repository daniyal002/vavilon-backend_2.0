// src/routes/booking/booking.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BookingRequest {
  showTimeId: number;
  phone: string;
  reservedSeats: number;
  totalAmount: number;
  row: number[];
  seatPerRow: number[];
  productId:number
}

// Получить все бронирования
export const getBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        showTime: {
          include: {
            movie: true,
            theater: true,
          },
        },
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
};

// Создать новое бронирование
export const createBooking = async (
  req: Request<{}, {}, BookingRequest>,
  res: Response
): Promise<void> => {
  const { showTimeId, phone, reservedSeats, totalAmount, row, seatPerRow, productId } =
    req.body;

  try {
    const showTime = await prisma.showTime.findUnique({
      where: { id: showTimeId },
    });

    if (!showTime) {
      res.status(404).json({ error: 'Сеанс не найден' });
      return;
    }

    if (reservedSeats <= 0) {
      res.status(400).json({ error: 'Количество мест должно быть больше 0' });
      return;
    }

    if (reservedSeats > showTime.seatsAvailable) {
      res.status(400).json({ error: 'Недостаточно свободных мест' });
      return;
    }

    // Проверяем существующее бронирование
    const existingBooking = await prisma.booking.findFirst({
      where: {
        showTimeId,
        phone,
      },
    });

    if (existingBooking) {
      const updatedBooking = await prisma.booking.update({
        where: { id: existingBooking.id },
        data: {
          reservedSeats,
          totalAmount,
          row,
          seatPerRow,
          confirmation: false,
          productId
        },
      });
      res.json(updatedBooking);
      return;
    }

    const newBooking = await prisma.booking.create({
      data: {
        showTimeId,
        phone,
        reservedSeats,
        totalAmount,
        row,
        seatPerRow,
        confirmation: false,
        productId
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании бронирования' });
  }
};

// Получить бронирования по телефону
export const getBookingsByPhone = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phone } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { phone },
      include: {
        showTime: {
          include: {
            movie: true,
            theater: true,
          },
        },
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирований' + error });
  }
};

// Получить бронирование по ID
export const getBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        showTime: {
          include: {
            movie: true,
            theater: true,
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ error: 'Бронирование не найдено' });
      return;
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении бронирования' + error });
  }
};

// Удалить бронирование
export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { showTimeId } = req.params;
  const { phone } = req.body;

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        showTimeId: Number(showTimeId),
        phone,
      },
    });

    if (!booking) {
      res.status(404).json({ error: 'Бронирование не найдено' });
      return;
    }

    if(booking.confirmation){
      res.status(403).json({error: 'Вы не можете отменить подтвержденную бронь!'});
      return;
    }

    await prisma.booking.delete({
      where: { id: booking.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении бронирования' });
  }
};

// Подтвердить бронирование
export const confirmBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      res.status(404).json({ error: 'Бронирование не найдено' });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { confirmation: true },
    });

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при подтверждении бронирования' });
  }
};

// Обновить бронирование
export const updateBooking = async (
  req: Request<{ id: string }, {}, Partial<BookingRequest>>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { showTimeId, phone, reservedSeats, totalAmount, row, seatPerRow, productId } =
    req.body;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      res.status(404).json({ error: 'Бронирование не найдено' });
      return;
    }

    if (showTimeId) {
      const showTime = await prisma.showTime.findUnique({
        where: { id: showTimeId },
      });

      if (!showTime) {
        res.status(404).json({ error: 'Сеанс не найден' });
        return;
      }

      if (reservedSeats && reservedSeats > showTime.seatsAvailable) {
        res.status(400).json({ error: 'Недостаточно свободных мест' });
        return;
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        ...(showTimeId && { showTimeId }),
        ...(phone && { phone }),
        ...(reservedSeats && { reservedSeats }),
        ...(totalAmount && { totalAmount }),
        ...(row && { row }),
        ...(seatPerRow && { seatPerRow }),
        ...(productId && {productId})
      },
      include: {
        showTime: {
          include: {
            movie: true,
            theater: true,
          },
        },
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении бронирования' });
  }
};

// Удалить бронирование по ID
export const deleteBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      res.status(400).json({ error: 'Некорректный ID бронирования' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      res.status(404).json({ error: 'Бронирование не найдено' });
      return;
    }

    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении бронирования' });
  }
};


// Получить количество бронирований и общую сумму по телефону
export const getBookingSummariesByPhone = async (req: Request, res: Response): Promise<void> => {
  try {
    const summaries = await prisma.booking.groupBy({
      by: ['phone'],
      _count: { _all: true },
      _sum: { totalAmount: true },
    });

    // @ts-ignore
    const formattedSummaries = summaries.map(summary => ({
      phone: summary.phone,
      bookingCount: summary._count._all,
      totalAmount: summary._sum.totalAmount || 0,
    }));

    res.json(formattedSummaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении статистики бронирований' });
  }
};

export const checkConfirmation = async (req: Request, res: Response): Promise<void> => {
  const { bookings } = req.body; // Ожидаем массив объектов { showTimeId, phone }

  if (!Array.isArray(bookings) || bookings.length === 0) {
    res.status(400).json({ error: 'Некорректные данные. Ожидается массив объектов с showTimeId и phone.' });
    return;
  }

  try {
    const confirmations = await Promise.all(bookings.map(async ({ showTimeId, phone }) => {
      const booking = await prisma.booking.findFirst({
        where: {
          showTimeId,
          phone,
        },
        select: {
          confirmation: true,
        },
      });

      return {
        showTimeId,
        phone,
        confirmation: booking ? booking.confirmation : false, // Если бронирование не найдено, confirmation будет false
      };
    }));

    res.json({bookings:confirmations});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при проверке подтверждений' });
  }
};