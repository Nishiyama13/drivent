import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

export default { getBookingByUserId };
