import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: number; roleId: number };
}

const prisma = new PrismaClient();


export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Токен не предоставлен' });
    }
  
    const token = authHeader?.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token as string, process.env.JWT_ACCESS_SECRET!) as { userId: number; roleId: number };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Неверный токен' });
    }
  };

  export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = await prisma.userRole.findUnique({where:{name: 'admin'}})
    if (req.user?.roleId !== role?.id) {
      res.status(403).json({ error: 'Доступ запрещён' });
      return
    }
    next();
  };