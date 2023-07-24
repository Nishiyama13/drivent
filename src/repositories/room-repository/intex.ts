import { prisma } from '@/config';

async function findAllRoomsByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

async function findRoomByRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const roomRepository = { findAllRoomsByHotelId, findRoomByRoomId };

export default roomRepository;
