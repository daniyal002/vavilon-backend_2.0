"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/showtime/showtime.routes.ts
const express_1 = require("express");
const showtime_controller_1 = require("../../controllers/showtime/showtime.controller");
const router = (0, express_1.Router)();
// Получить все сеансы
router.get('/', showtime_controller_1.getShowTimes);
// Получить сеанс по ID
router.get('/:id', showtime_controller_1.getShowTimeById);
// Создать новый сеанс
router.post('/', showtime_controller_1.createShowTime);
// Обновить сеанс по ID
router.put('/:id', showtime_controller_1.updateShowTime);
// Удалить сеанс по ID
router.delete('/:id', showtime_controller_1.deleteShowTime);
exports.default = router;
