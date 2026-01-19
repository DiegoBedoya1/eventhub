import { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar, Clock, MapPin, Users, FileText, Tag, Lock } from 'lucide-react';

// Mapeo de categorías (Asegúrate de que estos IDs coincidan con tu base de datos)
const categoryMap: Record<string, number> = {
  'Académico': 1,
  'Social': 2,
};

interface CreateEventProps {
  onEventCreated?: () => void;
}

export function CreateEvent({ onEventCreated }: CreateEventProps) {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Académico' as 'Académico' | 'Social',
    type: 'ABIERTO' as 'ABIERTO' | 'CERRADO', // Nuevo campo requerido
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const locations = [
    'Auditorio Principal',
    'Auditorio de Postgrados',
    'Centro de Estudiantes',
    'Plaza Central ESPOL',
    'Cafetería Central',
    'Laboratorio FIEC',
    'Sala de Conferencias',
    'Cancha Deportiva',
    'Biblioteca',
    'Otro'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';

    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) newErrors.date = 'La fecha no puede ser en el pasado';
    }

    if (!formData.startTime) newErrors.startTime = 'Hora inicio obligatoria';
    if (!formData.endTime) newErrors.endTime = 'Hora fin obligatoria';

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora fin debe ser después del inicio';
    }

    if (!formData.location) newErrors.location = 'La ubicación es obligatoria';

    if (!formData.capacity) {
      newErrors.capacity = 'Capacidad obligatoria';
    } else if (parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Mínimo 1 persona';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // 1. Construcción del Payload exacto para Laravel
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      start_time: `${formData.date} ${formData.startTime}:00`, // Formato SQL
      end_time: `${formData.date} ${formData.endTime}:00`,     // Formato SQL
      category_id: categoryMap[formData.category],
      type: formData.type,
      max_capacity: parseInt(formData.capacity)
    };

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          console.error("Validation Errors:", data.errors);
          alert("Error: Revisa los datos ingresados.");
        } else {
          throw new Error(data.message || 'Error al crear el evento');
        }
        return;
      }

      setSubmitted(true);
      if (onEventCreated) onEventCreated();

      // Reset
      setTimeout(() => {
        setFormData({
          title: '', description: '', category: 'Académico', type: 'ABIERTO',
          date: '', startTime: '', endTime: '', location: '', capacity: ''
        });
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-green-200 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-green-900 mb-3 text-2xl font-bold">¡Evento creado exitosamente!</h2>
          <p className="text-gray-500">Tu evento ha sido registrado en el sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Crear nuevo evento</h2>
          <p className="text-gray-500 mt-1">Ingresa los detalles oficiales del evento.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título del evento</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Ej: Integración de Novatos"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Categoría y Tipo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Académico">Académico</option>
                  <option value="Social">Social</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="ABIERTO">ABIERTO (Público)</option>
                  <option value="CERRADO">CERRADO (Privado)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Detalles del evento..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Fechas y Horas */}
          <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Inicio</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Ubicación y Capacidad */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">Selecciona ubicación...</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad Máxima</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 80"
                  min="1"
                />
              </div>
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-black py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Creando evento...' : <><CheckCircle className="w-5 h-5" /> Publicar Evento</>}
          </button>

        </form>
      </div>
    </div>
  );
}