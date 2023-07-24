import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

type CreateBookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;

export async function createBooking({ userId, roomId }: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function getBooking() {
  const booking: Booking & { Room: Room } = {
    id: 1,
    userId: 1,
    roomId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    Room: {
      id: 1,
      name: 'Room 1',
      capacity: 2,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  return booking;
}

type CreateValidBody = Pick<Booking, 'roomId'>;
export async function buildValidBody(roomId: number) {
  const buildValidBody: CreateValidBody = {
    roomId: roomId,
  };
  return buildValidBody;
}
