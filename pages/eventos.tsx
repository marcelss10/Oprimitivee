import { useEffect, useState } from 'react';
import { listarEventos, listarFotosEvento } from '../lib/supabaseClient';

export default function Eventos() {
  const [eventos, setEventos] = useState<string[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [fotos, setFotos] = useState<{ nome: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchEventos() {
      const evs = await listarEventos();
      setEventos(evs);
    }
    fetchEventos();
  }, []);

  useEffect(() => {
    if (!eventoSelecionado) {
      setFotos([]);
      return;
    }

    async function fetchFotos() {
      const fotosEvento = await listarFotosEvento(eventoSelecionado);
      setFotos(fotosEvento);
    }
    fetchFotos();
  }, [eventoSelecionado]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Eventos</h1>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Selecione um evento:</h2>
        {eventos.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {eventos.map((evento) => (
              <li key={evento}>
                <button
                  onClick={() => setEventoSelecionado(evento)}
                  className={`px-4 py-2 rounded ${
                    evento === eventoSelecionado ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {evento}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {eventoSelecionado && (
        <section>
          <h2 className="text-xl mb-4">Fotos do evento: {eventoSelecionado}</h2>
          {fotos.length === 0 ? (
            <p>Sem fotos para este evento.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fotos.map((foto) => (
                <img
                  key={foto.nome}
                  src={foto.url}
                  alt={foto.nome}
                  className="rounded shadow-md"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
