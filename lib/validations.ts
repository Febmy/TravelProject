import { z } from 'zod';

export const bookingSchema = z.object({
  userId: z.string().optional(),
  itemType: z.enum(['TOUR', 'HOTEL']).optional().default('TOUR'),
  title: z.string().optional(),
  scheduleId: z.string().optional(),
  hotelId: z.string().optional(),
  hotelRoomId: z.string().optional(),
  numParticipants: z.number().int().min(1, 'Jumlah peserta minimal 1 orang.').optional().default(1),
  totalPrice: z.number().optional(),
  paymentMethod: z.string().optional().default('MANUAL_TRANSFER'),
  proofUrl: z.string().url('URL bukti transfer tidak valid.').optional().or(z.literal('')),
  senderBank: z.string().optional(),
  senderName: z.string().optional(),
  guestName: z.string().min(2, 'Nama pemesan minimal 2 karakter.'),
  guestEmail: z.string().email('Format email pemesan tidak valid.'),
  guestPhone: z.string().min(9, 'Nomor telepon tidak valid.'),
  specialRequest: z.string().optional(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
});
