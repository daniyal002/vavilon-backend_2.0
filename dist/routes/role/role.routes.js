"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRole/userRole.routes.ts
const express_1 = require("express");
const role_controller_1 = require("../../controllers/role/role.controller");
const router = (0, express_1.Router)();
// Получить все роли пользователей
router.get('/', role_controller_1.getUserRoles);
// Получить роль пользователя по ID
router.get('/:id', role_controller_1.getUserRoleById);
// Создать новую роль пользователя
router.post('/', role_controller_1.createUserRole);
// Обновить роль пользователя
router.put('/:id', role_controller_1.updateUserRole);
// Удалить роль пользователя
router.delete('/:id', role_controller_1.deleteUserRole);
exports.default = router;
