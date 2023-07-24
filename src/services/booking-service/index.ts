import roomRepository from '@/repositories/room-repository/index';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError, cannotBookingError, badRequestError } from '@/errors';

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function verifyEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError(); //403

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError(); //403
  }
}

async function verifyValidBooking(roomId: number) {
  const room = await roomRepository.findRoomByRoomId(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId);

  if (!room) throw notFoundError(); //404
  if (room.capacity <= bookings.length) throw cannotBookingError(); //403

  return bookings;
}

async function postBookingRoom(userId: number, roomId: number) {
  if (!roomId) throw badRequestError();

  await verifyEnrollment(userId);
  await verifyValidBooking(roomId);

  return bookingRepository.createBookingRoom({
    roomId,
    userId,
  });
}

async function changeBookingRoom(userId: number, roomId: number) {
  if (!roomId) throw badRequestError();

  await verifyValidBooking(roomId);

  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking || booking.userId !== userId) {
    throw cannotBookingError();
  }

  return bookingRepository.upsertBookingRoom({
    id: booking.id,
    roomId,
    userId,
  });
}

export default { getBookingByUserId, postBookingRoom, changeBookingRoom, verifyEnrollment, verifyValidBooking };
