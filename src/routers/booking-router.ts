import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBookingRoom, getBookingByUser } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBookingByUser).post('/', createBookingRoom);

export { bookingRouter };
