import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBookingRoom, getBookingByUser, upsertBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookingByUser)
  .post('/', createBookingRoom)
  .put('/:bookingId', upsertBooking);

export { bookingRouter };
