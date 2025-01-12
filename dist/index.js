"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors")); // Импортируем cors
const morgan_1 = __importDefault(require("morgan"));
const booking_routes_1 = __importDefault(require("./routes/booking/booking.routes"));
const genre_routes_1 = __importDefault(require("./routes/genre/genre.routes"));
const menu_routes_1 = __importDefault(require("./routes/menu/menu.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie/movie.routes"));
const product_routes_1 = __importDefault(require("./routes/product/product.routes"));
const productCategory_routes_1 = __importDefault(require("./routes/productCategory/productCategory.routes"));
const promocode_routes_1 = __importDefault(require("./routes/promocode/promocode.routes"));
const role_routes_1 = __importDefault(require("./routes/role/role.routes"));
const showtime_routes_1 = __importDefault(require("./routes/showtime/showtime.routes"));
const user_routes_1 = __importDefault(require("./routes/user/user.routes"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Настройка CORS
app.use((0, cors_1.default)({
    origin: '*', // Разрешаем все домены (можно указать конкретные домены)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
}));
// Логирование запросов в формате 'dev'
app.use((0, morgan_1.default)('dev'));
// Middleware для парсинга JSON
app.use(express_1.default.json());
app.use('/bookings', booking_routes_1.default);
app.use('/genres', genre_routes_1.default);
app.use('/menu', menu_routes_1.default);
app.use('/movies', movie_routes_1.default);
app.use('/products', product_routes_1.default);
app.use('/product-categories', productCategory_routes_1.default);
app.use('/promocodes', promocode_routes_1.default);
app.use('/roles', role_routes_1.default);
app.use('/showtimes', showtime_routes_1.default);
app.use('/users', user_routes_1.default);
// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
