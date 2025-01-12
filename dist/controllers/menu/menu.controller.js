"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenu = exports.updateMenu = exports.createMenu = exports.getMenuById = exports.getMenus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все пункты меню
const getMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield prisma.menu.findMany({
            include: {
                roles: true, // Включаем связанные роли
            },
        });
        res.json(menus);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пунктов меню' });
    }
});
exports.getMenus = getMenus;
// Получить пункт меню по ID
const getMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID пункта меню' });
    }
    else {
        try {
            const menu = yield prisma.menu.findUnique({
                where: { id: Number(id) },
                include: {
                    roles: true, // Включаем связанные роли
                },
            });
            if (!menu) {
                res.status(404).json({ error: 'Пункт меню не найден' });
            }
            else {
                res.json(menu);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении пункта меню' });
        }
    }
});
exports.getMenuById = getMenuById;
// Создать новый пункт меню
const createMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, path, roleIds } = req.body; // roleIds - массив ID ролей
    try {
        const newMenu = yield prisma.menu.create({
            data: {
                name,
                path,
                roles: {
                    connect: roleIds.map((id) => ({ id })), // Связываем роли
                },
            },
        });
        res.status(201).json(newMenu);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании пункта меню' });
    }
});
exports.createMenu = createMenu;
// Обновить пункт меню
const updateMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, path, roleIds } = req.body; // roleIds - массив ID ролей
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID пункта меню' });
    }
    else {
        try {
            const updatedMenu = yield prisma.menu.update({
                where: { id: Number(id) },
                data: {
                    name,
                    path,
                    roles: {
                        set: roleIds.map((id) => ({ id })), // Обновляем связи с ролями
                    },
                },
            });
            res.json(updatedMenu);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении пункта меню' });
        }
    }
});
exports.updateMenu = updateMenu;
// Удалить пункт меню
const deleteMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID пункта меню' });
    }
    else {
        try {
            yield prisma.menu.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении пункта меню' });
        }
    }
});
exports.deleteMenu = deleteMenu;
