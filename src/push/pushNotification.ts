import { Booking, PrismaClient } from "@prisma/client";
import webpush from "web-push";


const prisma = new PrismaClient();

export const notifyNewBooking = async (booking: Booking): Promise<void> => {
    const subscriptions = await prisma.subscription.findMany();
    const showTime = await prisma.showTime.findUnique({
      where: { id: booking?.showTimeId },
    });
    const movie = await prisma.movie.findUnique({
      where: { id: showTime?.movieId },
    });
    const timeAndDate = showTime?.startTime
    const readableDate = timeAndDate?.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone:"UTC"
    })
    const notificationPayload = JSON.stringify({
      title: "Новая бронь!",
      body: `Новая бронь на ${movie?.title} по дате и времени ${readableDate} по телефону ${booking.phone} на ${booking.totalAmount}₽.`,
    });

    subscriptions.forEach(async (subscription) => {
      try {
        console.log(
          "Отправка уведомления для подписки:",
          subscription.subscription
        );

        await webpush.sendNotification(
          JSON.parse(subscription.subscription), // Преобразование строки JSON в объект
          notificationPayload
        );

        console.log("Уведомление успешно отправлено");
      } catch (error) {
        console.error("Ошибка отправки уведомления:", error);
      }
    });
  };

  export const notifyDeleteBooking = async (booking: Booking): Promise<void> => {
    const subscriptions = await prisma.subscription.findMany();
    const showTime = await prisma.showTime.findUnique({
      where: { id: booking?.showTimeId },
    });
    const movie = await prisma.movie.findUnique({
      where: { id: showTime?.movieId },
    });
    const timeAndDate = showTime?.startTime
    const readableDate = timeAndDate?.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone:"UTC"
    })
    const notificationPayload = JSON.stringify({
      title: "Бронь удалена!",
      body: `Бронь удалена на ${movie?.title} по дате и времени ${readableDate} по телефону ${booking.phone} на ${booking.totalAmount}₽.`,
    });

    subscriptions.forEach(async (subscription) => {
      try {
        console.log(
          "Отправка уведомления для подписки:",
          subscription.subscription
        );

        await webpush.sendNotification(
          JSON.parse(subscription.subscription), // Преобразование строки JSON в объект
          notificationPayload
        );

        console.log("Уведомление успешно отправлено");
      } catch (error) {
        console.error("Ошибка отправки уведомления:", error);
      }
    });
  };