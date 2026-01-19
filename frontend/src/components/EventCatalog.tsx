import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { EventCard } from './EventCard';
import { Event } from '../types/event';

export function EventCatalog({ events, onViewDetails }: { events: Event[], onViewDetails: (id: number) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || e.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    /* max-w-4xl centra el contenido y evita que las tarjetas sean demasiado anchas */
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      
      {/* Header Centrado */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#002855] mb-2">Catálogo de Eventos</h1>
        <p className="text-gray-500">Encuentra y regístrate en las próximas actividades de la ESPOL</p>
      </div>

      {/* Barra de Filtros Centrada */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿Qué evento buscas?..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-blue-600 outline-none text-gray-700"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Académico">Académico</option>
              <option value="Social">Social</option>
              <option value="Cultural">Cultural</option>
              <option value="Deportivo">Deportivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Eventos (Tarjetas) */}
      <div className="space-y-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 font-medium">No se encontraron resultados</h3>
            <p className="text-gray-500 text-sm mt-1">Prueba con otras palabras o limpia los filtros.</p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </p>
      </div>
    </div>
  );
}