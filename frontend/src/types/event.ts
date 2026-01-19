// 1. Para la lista (lo que usa EventCard)
export interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  category_id: number;
  max_capacity: number;
  available_spots: number;
  category: { id: number; name: string };
  type: string;
}

export interface EventDetail {
  id: number;
  titulo: string;          
  fecha_visible: string;    
  horario: string;         
  ubicacion: string;
  organizador: string;     
  descripcion: string;
  capacidad_maxima: number;
  cupos_disponibles: number;
  inscritos: number;
  tipo: string;
}
export interface EventAttendance {
  event_id: string; // Usamos snake_case para coincidir con la BD
  user_name: string;
  user_email: string;
  confirmed_at: string;
}