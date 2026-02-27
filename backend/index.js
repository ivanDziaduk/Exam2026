import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from './bd_models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ivanivan";
const JWT_SECRET = process.env.JWT_SECRET || "ivanivan";

app.use(cors());
app.use(express.json());

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "Токен не предоставлен" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Срок действия токена истёк" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Невалидный токен" });
        }
        return res.status(500).json({ error: "Ошибка проверки токена" });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: "Доступ запрещён" });
    }
    next();
};

app.post("/registration", async (req, res) => {
    const { login, fullName, phone, email, password } = req.body;

    if (!login || !fullName || !phone || !email || !password) {
        return res.status(400).json({ error: "Все поля обязательны для заполнения" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Пароль должен содержать минимум 8 символов" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ login }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: "Пользователь с таким логином или email уже существует" });
        }

        const newUser = new User({
            login,
            password,
            fullName,
            phone,
            email,
            role: 'user'
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "Пользователь успешно зарегистрирован!",
            token,
            user: {
                _id: newUser._id,
                login: newUser.login,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Ошибка регистрации:", error);

        if (error.code === 11000) {
            return res.status(409).json({ error: "Такой пользователь уже существует" });
        }

        res.status(500).json({ error: "Ошибка сервера при регистрации" });
    }
});

app.post("/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: "Логин и пароль обязательны" });
    }

    try {
        const user = await User.findOne({ login }).select('+password');

        if (!user) {
            return res.status(401).json({ error: "Пользователь не найден" });
        }

        const isMatch = password === user.password;

        if (!isMatch) {
            return res.status(401).json({ error: "Неверный пароль" });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role,
                login: user.login,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userData = {
            _id: user._id,
            login: user.login,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.status(200).json({
            message: "Вход успешен",
            token,
            user: userData
        });

    } catch (error) {
        console.error("Ошибка входа:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


async function StartApp() {
    try {
        await mongoose.connect(DB_URL);
        console.log("MongoDB подключена");
        app.listen(PORT, () => {
            console.log(`Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Ошибка подключения к БД:", error);
        process.exit(1);
    }
}

StartApp();
