import { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar, Clock, MapPin, Users, FileText, Tag } from 'lucide-react';

export function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Académico' as 'Académico' | 'Social' | 'Deportivo' | 'Cultural',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: '',
    organizer: '',
    requirements: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const categories: Array<'Académico' | 'Social' | 'Deportivo' | 'Cultural'> = [
    'Académico',
    'Social',
    'Deportivo',
    'Cultural'
  ];

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

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'La fecha no puede ser en el pasado';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es obligatoria';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'La hora de fin es obligatoria';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    if (!formData.location) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'La capacidad es obligatoria';
    } else if (parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'La capacidad debe ser al menos 1';
    } else if (parseInt(formData.capacity) > 500) {
      newErrors.capacity = 'La capacidad máxima es 500 personas';
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'El organizador es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In real app: save to database
      console.log('Event created:', formData);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: 'Académico',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
          capacity: '',
          organizer: '',
          requirements: ''
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-green-900 mb-3">¡Evento creado exitosamente!</h2>
          <p className="text-[var(--color-text-light)] mb-6">
            Tu evento ha sido registrado y estará visible en el catálogo una vez sea aprobado.
          </p>
          <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-green-800">
              Recibirás una notificación en tu correo institucional con los detalles de la aprobación.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--color-border)]">
        <div className="mb-8">
          <h2 className="mb-2">Crear nuevo evento</h2>
          <p className="text-[var(--color-text-light)]">
            Completa el formulario para registrar un nuevo evento en ESPOL
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Requisitos para crear un evento:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>El evento debe ser de carácter académico, social, deportivo o cultural</li>
              <li>Debe contar con la aprobación de la facultad o departamento organizador</li>
              <li>La capacidad debe ajustarse a los espacios disponibles en ESPOL</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[var(--color-secondary)]" />
              <span>Título del evento *</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                errors.title ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
              placeholder="Ej: Seminario de Inteligencia Artificial"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[var(--color-secondary)]" />
              <span>Categoría *</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[var(--color-secondary)]" />
              <span>Descripción *</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] resize-none ${
                errors.description ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
              placeholder="Describe el evento, objetivos, actividades principales..."
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-text-light)]">
                  Mínimo 20 caracteres
                </p>
              )}
              <p className="text-sm text-[var(--color-text-light)]">
                {formData.description.length} caracteres
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Fecha *</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                  errors.date ? 'border-red-500' : 'border-[var(--color-border)]'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Hora inicio *</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                  errors.startTime ? 'border-red-500' : 'border-[var(--color-border)]'
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.startTime}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Hora fin *</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                  errors.endTime ? 'border-red-500' : 'border-[var(--color-border)]'
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Location and Capacity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Ubicación *</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white ${
                  errors.location ? 'border-red-500' : 'border-[var(--color-border)]'
                }`}
              >
                <option value="">Selecciona una ubicación</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Capacidad *</span>
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                min="1"
                max="500"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                  errors.capacity ? 'border-red-500' : 'border-[var(--color-border)]'
                }`}
                placeholder="Número máximo de asistentes"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.capacity}
                </p>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[var(--color-secondary)]" />
              <span>Organizador *</span>
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => handleChange('organizer', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] ${
                errors.organizer ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
              placeholder="Ej: Facultad de Ingeniería, Club de Ajedrez, etc."
            />
            {errors.organizer && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.organizer}
              </p>
            )}
          </div>

          {/* Requirements (Optional) */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-secondary)]" />
              <span>Requisitos (opcional)</span>
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] resize-none"
              placeholder="Separa cada requisito con una coma. Ej: Laptop personal, Conocimientos de Python, Registro previo"
            />
            <p className="mt-1 text-sm text-[var(--color-text-light)]">
              Separa múltiples requisitos con comas
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-secondary)] text-white py-3 rounded-lg hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Crear evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
