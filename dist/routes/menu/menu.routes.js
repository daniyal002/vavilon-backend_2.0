"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/menu/menu.routes.ts
const express_1 = require("express");
const menu_controller_1 = require("../../controllers/menu/menu.controller");
const router = (0, express_1.Router)();
// Получить все пункты меню
router.get('/', menu_controller_1.getMenus);
// Получить пункт меню по ID
router.get('/:id', menu_controller_1.getMenuById);
// Создать новый пункт меню
router.post('/', menu_controller_1.createMenu);
// Обновить пункт меню
router.put('/:id', menu_controller_1.updateMenu);
// Удалить пункт меню
router.delete('/:id', menu_controller_1.deleteMenu);
exports.default = router;
