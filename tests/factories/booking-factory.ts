import { Address, Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
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

export async function getBookingByRoomIdReturn() {
  const booking: (Booking & { Room: Room })[] = [
    {
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
    },
  ];
  return booking;
}

type CreateValidBody = Pick<Booking, 'roomId'>;
export async function buildValidBody(roomId: number) {
  const buildValidBody: CreateValidBody = {
    roomId: roomId,
  };
  return buildValidBody;
}

export async function enrollmentWithAddressReturn() {
  const enrollment: Enrollment & { Adress: Address[] } = {
    id: 1,
    name: 'Ali',
    cpf: '44455566699',
    birthday: new Date(),
    phone: '998899889',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    Adress: [
      {
        id: 1,
        cep: '09310040',
        street: 'Augusta',
        city: 'Saint Paul',
        state: 'SP',
        number: '666',
        neighborhood: 'centro',
        addressDetail: 'logo ali',
        enrollmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
  return enrollment;
}

export async function ticketByEnrollmentIdReturn() {
  const ticket: Ticket & { TicketType: TicketType } = {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: 'Room Dale',
      price: 199,
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  return ticket;
}

export async function getRoomByRoomIdReturn() {
  const room: Room = {
    id: 1,
    name: 'Room x',
    capacity: 3,
    hotelId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return room;
}
