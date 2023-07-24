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
    next(error);
  }
}

export async function createBookingRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body as BookingRequest;

    const booking = await bookingService.postBookingRoom(userId, roomId);

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  if (!bookingId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const { roomId } = req.body as BookingRequest;
    const booking = await bookingService.changeBookingRoom(userId, roomId);

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    next(error);
  }
}
