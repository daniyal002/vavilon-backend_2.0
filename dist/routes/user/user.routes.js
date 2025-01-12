"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user/user.controller");
const router = (0, express_1.Router)();
// Получить всех пользователей
router.get('/', user_controller_1.getUsers);
// Получить пользователя по ID
router.get('/:id', user_controller_1.getUserById);
// Создать нового пользователя
router.post('/', user_controller_1.createUser);
// Обновить пользователя
router.put('/:id', user_controller_1.updateUser);
// Удалить пользователя
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
