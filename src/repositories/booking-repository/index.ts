import { Booking } from '@prisma/client';
import { CreateBookingParams } from '@/protocols';
import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
    include: {
      Room: true,
    },
  });
}

async function createBookingRoom({ roomId, userId }: CreateBookingParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findByRoomId,
  createBookingRoom,
};

export default bookingRepository;
