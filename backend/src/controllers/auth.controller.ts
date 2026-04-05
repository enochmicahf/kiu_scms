import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    // Basic mock login for UI demo without requiring complex DB insertions right now
    if (identifier === 'admin@kiu.ac.ug' && password === 'admin123') {
      const token = jwt.sign({ userId: 1, roleId: 1 }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ status: 'success', token, user: { id: 1, email: identifier, role: 'Admin' } });
    }

    // Connect to DB for real logic
    const [users]: any = await db.query(
      `SELECT users.*, roles.name as role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`,
      [identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, roleId: user.role_id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role_name
      }
    });

  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
