import { pgTable, serial, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  date: timestamp('date').notNull(),
  timeSlot: text('time_slot').notNull(), // e.g., "14:00-18:00"
  depositAmount: numeric('deposit_amount').notNull(),
  totalAmount: numeric('total_amount').notNull(),
  status: text('status').$type<'pending' | 'confirmed' | 'completed' | 'cancelled'>().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  amount: numeric('amount').notNull(),
  category: text('category').notNull(), // e.g., "Maintenance", "Supplies"
  date: timestamp('date').defaultNow(),
});
