import httpStatus from 'http-status';
import { Response } from 'express';
import bookingService from '@/services/booking-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
