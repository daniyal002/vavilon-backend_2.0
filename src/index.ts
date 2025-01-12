import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // Импортируем cors
import morgan from 'morgan';
import bookingRoutes from './routes/booking/booking.routes';
import genreRoutes from './routes/genre/genre.routes';
import menuRoutes from './routes/menu/menu.routes';
import movieRoutes from './routes/movie/movie.routes';
import productRoutes from './routes/product/product.routes';
import productCategoryRoutes from './routes/productCategory/productCategory.routes';
import promoCodeRoutes from './routes/promocode/promocode.routes';
import roleRoutes from './routes/role/role.routes';
import showTimeRoutes from './routes/showtime/showtime.routes';
import userRoutes from './routes/user/user.routes';
import authRoutes from './routes/auth/auth.routes'
import theaterRoutes from './routes/theater/theater.routes'
import settingsRoutes from './routes/settings/settings.routes';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Настройка CORS
app.use(cors({
  origin: '*', // Разрешаем все домены (можно указать конкретные домены)
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
}));


// Логирование запросов в формате 'dev'
app.use(morgan('dev')); 

// Middleware для раздачи статических файлов
app.use('/movieImage', express.static(path.join(__dirname, '../movieImage')));
app.use('/productImage', express.static(path.join(__dirname, '../productImage')));
// Middleware для парсинга JSON
app.use(express.json());
app.use('/bookings',bookingRoutes);
app.use('/genres', genreRoutes)
app.use('/menu', menuRoutes);
app.use('/movies', movieRoutes);
app.use('/products',productRoutes);
app.use('/product-categories',productCategoryRoutes);
app.use('/promocodes',promoCodeRoutes);
app.use('/roles', roleRoutes);
app.use('/showtimes', showTimeRoutes);
app.use('/users', userRoutes);
app.use('/auth',authRoutes);
app.use('/theaters',theaterRoutes)
app.use('/settings', settingsRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});