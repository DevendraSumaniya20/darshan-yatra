import type { BookingRepository } from '../../../domain/booking/booking-repository.ts';
import type { BookingRequest } from '../../../domain/booking/booking-request.ts';
import type { PrismaClient } from './prisma-client.ts';

export class PrismaBookingRepository implements BookingRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async placeWithSeatHold(booking: BookingRequest, expectedSeatsBooked: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      // The seat count in the WHERE clause makes this a compare-and-set:
      // if another booking landed first, no row matches and nothing is written.
      const held = await tx.departure.updateMany({
        where: { id: booking.departureId, seatsBooked: expectedSeatsBooked },
        data: { seatsBooked: { increment: booking.travellers } },
      });
      if (held.count === 0) return false;

      await tx.bookingRequest.create({
        data: {
          id: booking.id,
          reference: booking.reference,
          departureId: booking.departureId,
          contactName: booking.contactName,
          phone: booking.phone,
          email: booking.email,
          travellers: booking.travellers,
          note: booking.note,
          status: booking.status,
          totalPaise: booking.total,
          createdAt: booking.createdAt,
        },
      });
      return true;
    });
  }
}
