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
exports.deleteUserRole = exports.updateUserRole = exports.createUserRole = exports.getUserRoleById = exports.getUserRoles = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить все роли пользователей
const getUserRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield prisma.userRole.findMany();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении ролей пользователей' });
    }
});
exports.getUserRoles = getUserRoles;
// Получить роль пользователя по ID
const getUserRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID роли пользователя' });
    }
    else {
        try {
            const role = yield prisma.userRole.findUnique({
                where: { id: Number(id) },
            });
            if (!role) {
                res.status(404).json({ error: 'Роль пользователя не найдена' });
            }
            else {
                res.json(role);
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при получении роли пользователя' });
        }
    }
});
exports.getUserRoleById = getUserRoleById;
// Создать новую роль пользователя
const createUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newRole = yield prisma.userRole.create({
            data: { name },
        });
        res.status(201).json(newRole);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании роли пользователя' });
    }
});
exports.createUserRole = createUserRole;
// Обновить роль пользователя
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID роли пользователя' });
    }
    else {
        try {
            const updatedRole = yield prisma.userRole.update({
                where: { id: Number(id) },
                data: { name },
            });
            res.json(updatedRole);
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении роли пользователя' });
        }
    }
});
exports.updateUserRole = updateUserRole;
// Удалить роль пользователя
const deleteUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Некорректный ID роли пользователя' });
    }
    else {
        try {
            yield prisma.userRole.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении роли пользователя' });
        }
    }
});
exports.deleteUserRole = deleteUserRole;
