import { BadRequestError } from '../../common/errors/base-error.js';
import { emailService } from '../../services/email.service.js';
import { eventsRepository } from './events.repository.js';
import type { CreateEventInput } from './events.type.js';

function formatEventAddress(event: {
  address: string | null;
  district: string | null;
  city: string | null;
  location_note: string | null;
  latitude: number;
  longitude: number;
}) {
  const textAddress = [event.address, event.district, event.city, event.location_note]
    .filter(Boolean)
    .join(', ');

  return textAddress || `${event.latitude}, ${event.longitude}`;
}

export const eventsService = {
  async list(viewerId?: string) {
    return eventsRepository.findMany(viewerId);
  },

  async getById(eventId: string, viewerId?: string) {
    return eventsRepository.findById(eventId, viewerId);
  },

  async create(userId: string, payload: CreateEventInput) {
    return eventsRepository.create(userId, payload);
  },

  async register(eventId: string, userId: string, userEmail: string | null, userName: string) {
    if (!userEmail) {
      throw new BadRequestError('Authenticated user email not found');
    }

    const event = await eventsRepository.findById(eventId, userId);
    const registration = await eventsRepository.createRegistration(eventId, userId, userEmail);

    const emailResult = await emailService.sendEventRegistrationEmail({
      to: userEmail,
      recipientName: userName,
      eventTitle: event.title,
      organizer: event.organizer,
      eventDate: event.event_date,
      address: formatEventAddress(event),
    });

    return {
      ...registration,
      email_notification: emailResult,
    };
  },
};
