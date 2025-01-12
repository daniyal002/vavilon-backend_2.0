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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Получить всех пользователей
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении всех пользователй' });
    }
});
exports.getUsers = getUsers;
// Получить пользователя по ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'Нет такого ID' });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
});
exports.getUserById = getUserById;
// Создать нового пользователя
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, phone, roleId } = req.body;
    try {
        const newUser = yield prisma.user.create({
            data: {
                password,
                phone,
                roleId,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
});
exports.createUser = createUser;
// Обновить пользователя
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password, phone, roleId } = req.body;
    try {
        const updatedUser = yield prisma.user.update({
            where: { id: Number(id) },
            data: {
                password,
                phone,
                roleId,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
});
exports.updateUser = updateUser;
// Удалить пользователя
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.user.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
});
exports.deleteUser = deleteUser;
