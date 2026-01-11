import { EventCatalog } from './components/EventCatalog';
import { mockEvents } from './utils/mockData';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main>
        <EventCatalog events={mockEvents} />
      </main>
    </div>
  );
}
