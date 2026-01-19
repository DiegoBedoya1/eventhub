import { User, Mail } from 'lucide-react';

interface Participant {
  id: number;
  full_name: string;
  email: string;
}

export function AttendanceTable({ participants }: { participants: Participant[] }) {
  return (
    <div className="mt-4 border rounded-xl overflow-hidden bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600">Asistente</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Contacto</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {participants.length > 0 ? (
            participants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{p.full_name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    {p.email}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="p-8 text-center text-gray-400 text-sm">
                Aún no hay inscritos en este evento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}