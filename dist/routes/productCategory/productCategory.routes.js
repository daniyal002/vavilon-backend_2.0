"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productCategories_controller_1 = require("../../controllers/productCategories/productCategories.controller");
const router = (0, express_1.Router)();
//Категории
router.get('/product-categories', productCategories_controller_1.getProductCategories);
router.post('/product-categories', productCategories_controller_1.createProductCategory);
router.put('/product-categories/:id', productCategories_controller_1.updateProductCategory);
router.delete('/product-categories/:id', productCategories_controller_1.deleteProductCategory);
exports.default = router;
