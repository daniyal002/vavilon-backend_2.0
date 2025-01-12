"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/promocode/promocode.routes.ts
const express_1 = require("express");
const promocode_controller_1 = require("../../controllers/promocode/promocode.controller");
const router = (0, express_1.Router)();
// Получить все промокоды
router.get('/', promocode_controller_1.getPromoCodes);
// Получить промокод по ID
router.get('/:id', promocode_controller_1.getPromoCodeById);
// Создать новый промокод
router.post('/', promocode_controller_1.createPromoCode);
// Обновить промокод по ID
router.put('/:id', promocode_controller_1.updatePromoCode);
// Удалить промокод по ID
router.delete('/:id', promocode_controller_1.deletePromoCode);
exports.default = router;
