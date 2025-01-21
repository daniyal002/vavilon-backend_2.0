import { Booking } from '@prisma/client';
import { Server } from 'ws';


const wss = new Server({ port:3003 });

wss.on('connection', (ws) => {
    console.log('Клиент подключен');

    ws.on('close', () => {
      console.log('Клиент отключен');
    });
  });


export const notifyNewBookingWs = (booking: Booking): void => {
    const message = JSON.stringify({ type: 'NEW_BOOKING', booking });
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) { // Используйте client вместо ws
            client.send(message);
        }
    });
};

export const notifyDeleteBookingWs = (booking: Booking): void => {
    const message = JSON.stringify({ type: 'DELETE_BOOKING', booking });
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) { // Используйте client вместо ws
            client.send(message);
        }
    });
};