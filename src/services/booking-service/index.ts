import roomRepository from '@/repositories/room-repository/intex';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError, cannotBookingError } from '@/errors';

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function verifyEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError(); //fazer um erro corretamente

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError(); //usar o erro que deve ser criado 403
  }
}

async function verifyValidBooking(roomId: number) {
  const room = await roomRepository.findRoomByRoomId(roomId);
  const bookings = await bookingRepository.findByRoomId(roomId); //fazer um find by room id;

  if (!room) throw notFoundError(); //404
  if (room.capacity <= bookings.length) throw cannotBookingError(); //403

  return bookings;
}

async function postBookingRoom(userId: number, roomId: number) {
  if (!roomId) throw notFoundError(); //testa se veio o roomId

  await verifyEnrollment(userId); //checar se o enrollment é válido
  await verifyValidBooking(roomId); //checar se o booking é válido

  return bookingRepository.createBookingRoom({
    roomId,
    userId,
  });
}

export default { getBookingByUserId, postBookingRoom };
