import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { BookingRequest } from '../protocols';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBookingByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    //return res.sendStatus(httpStatus.NOT_FOUND);
    next(error);
  }
}

export async function createBookingRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body as BookingRequest;

    const booking = await bookingService.postBookingRoom(userId, roomId);

    return res.status(httpStatus.OK).send({
      booking: booking.id,
    });
  } catch (error) {
    next(error);
  }
}
