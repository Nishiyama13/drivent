import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import {
  buildValidBody,
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketType,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is givin', async () => {
    const response = await server.get('/booking');
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if no token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('should respond with status 404 when user has not a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);
      //const room = await createRoomWithHotelId(hotel.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('shoul respond with status 200 and when user has a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is givin', async () => {
    const validBody = buildValidBody(1);
    const response = await server.post('/booking').send(validBody);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if no token is not valid', async () => {
    const token = faker.lorem.word();
    const validBody = buildValidBody(1);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const validBody = buildValidBody(1);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('should respond with status 400 when send invalid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);
      //const room = await createRoomWithHotelId(hotel.id);
      const invalidBody = {
        roomId: 0,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(invalidBody);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when send sending a different roomId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await buildValidBody(room.id);
      const invalidBody = {
        roomId: room.id + 1,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(invalidBody);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 when send valid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const validBody = await buildValidBody(room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it('should respond with status 403 when they choose a room without a vacancy', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const validBody = await buildValidBody(room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not paid the ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const validBody = await buildValidBody(room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});
