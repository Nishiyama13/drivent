import { Booking } from '@prisma/client';
import { CreateBookingParams, UpsertBookingParams } from '@/protocols';
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

async function upsertBookingRoom({ id, roomId, userId }: UpsertBookingParams): Promise<Booking> {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findByRoomId,
  createBookingRoom,
  upsertBookingRoom,
};

export default bookingRepository;
