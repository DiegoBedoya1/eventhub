import { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Seminario de Inteligencia Artificial',
    description: 'Charla sobre las últimas tendencias en IA y Machine Learning. Incluye casos de estudio y aplicaciones prácticas en la industria.',
    category: 'Académico',
    date: '2024-12-16',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Auditorio Principal - Edificio de Postgrados',
    capacity: 150,
    attendees: 87,
    organizer: 'Facultad de Ingeniería en Electricidad y Computación',
    requirements: ['Laptop personal (opcional)', 'Conocimientos básicos de programación']
  },
  {
    id: '2',
    title: 'Torneo Relámpago de Ajedrez',
    description: 'Competencia amistosa de ajedrez entre estudiantes de todas las facultades. Premios para los primeros tres lugares.',
    category: 'Deportivo',
    date: '2024-12-17',
    startTime: '16:00',
    endTime: '19:00',
    location: 'Centro de Estudiantes',
    capacity: 64,
    attendees: 45,
    organizer: 'Club de Ajedrez ESPOL',
    requirements: ['Registro previo obligatorio']
  },
  {
    id: '3',
    title: 'Festival de Música Latina',
    description: 'Concierto con bandas estudiantiles y artistas invitados. Celebración de la diversidad musical latinoamericana.',
    category: 'Cultural',
    date: '2024-12-18',
    startTime: '18:00',
    endTime: '22:00',
    location: 'Plaza Central ESPOL',
    capacity: 500,
    attendees: 312,
    organizer: 'Bienestar Estudiantil',
    requirements: []
  },
  {
    id: '4',
    title: 'Workshop: Diseño UX/UI',
    description: 'Taller práctico sobre principios de diseño de experiencia de usuario e interfaces. Actividad hands-on con proyectos reales.',
    category: 'Académico',
    date: '2024-12-19',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Laboratorio de Diseño - Edificio FIEC',
    capacity: 30,
    attendees: 28,
    organizer: 'Google Developer Student Club',
    requirements: ['Laptop con Figma instalado', 'Cupos limitados']
  },
  {
    id: '5',
    title: 'Noche de Trivia ESPOL',
    description: 'Competencia de preguntas y respuestas sobre cultura general, historia de ESPOL y conocimientos académicos.',
    category: 'Social',
    date: '2024-12-20',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Cafetería Central',
    capacity: 100,
    attendees: 67,
    organizer: 'Asociación de Estudiantes',
    requirements: ['Formar equipos de 4 personas']
  },
  {
    id: '6',
    title: 'Conferencia: Emprendimiento Tech',
    description: 'Panel con emprendedores exitosos del ecosistema tecnológico ecuatoriano. Sesión de Q&A incluida.',
    category: 'Académico',
    date: '2024-12-21',
    startTime: '15:00',
    endTime: '17:30',
    location: 'Auditorio ESPOL Emprende',
    capacity: 200,
    attendees: 156,
    organizer: 'Centro de Emprendimiento',
    requirements: []
  }
];

export const getEventsForWeek = (startDate: Date): Event[] => {
  return mockEvents;
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};
