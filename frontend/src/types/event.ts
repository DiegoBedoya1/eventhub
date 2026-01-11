export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'Académico' | 'Social' | 'Deportivo' | 'Cultural';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  attendees: number;
  organizer: string;
  imageUrl?: string;
  requirements?: string[];
}

export interface EventAttendance {
  eventId: string;
  userName: string;
  userEmail: string;
  confirmedAt: string;
}
