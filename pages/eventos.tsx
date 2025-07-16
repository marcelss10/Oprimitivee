import { useEffect, useState } from 'react';
import { listarEventos, listarFotosEvento } from '../lib/supabaseClient';
import FaceRecognition from '../components/FaceRecognition';

type Foto = { nome: string; url: string };

export default function Eventos() {
  const [eventos, setEventos] = useState<string[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);

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

  // Baixar imagem com marca d'água (URL pública)
  async function baixarComMarca(url: string, nomeArquivo: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Erro ao baixar a foto com marca d\'água.');
      console.error(error);
    }
  }

  // Redirecionar para página de pagamento para baixar foto original
  function redirecionarPagamento(fotoNome: string) {
    if (!eventoSelecionado) {
      alert('Nenhum evento selecionado.');
      return;
    }
    const url = `/pagamento?evento=${encodeURIComponent(eventoSelecionado)}&foto=${encodeURIComponent(fotoNome)}`;
    window.location.href = url;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Eventos</h1>

      {/* Lista de eventos */}
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
        <>
          {/* Reconhecimento Facial - aparece antes das fotos */}
          <section className="text-center mb-10">
            <h2 className="text-xl font-bold mb-4">Reconhecimento facial</h2>
            <FaceRecognition fotos={fotos} />
          </section>

          {/* Fotos do Evento */}
          <section>
            <h2 className="text-xl mb-6">Fotos do evento: {eventoSelecionado}</h2>
            {fotos.length === 0 ? (
              <p>Sem fotos para este evento.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {fotos.map((foto) => (
                  <div key={foto.nome} className="relative group">
                    <img
                      src={foto.url}
                      alt={foto.nome}
                      className="rounded shadow-md w-full h-auto"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => baixarComMarca(foto.url, foto.nome)}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded shadow"
                        title="Baixar com marca d'água"
                      >
                        Baixar
                      </button>
                      <button
                        onClick={() => redirecionarPagamento(foto.nome)}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded shadow"
                        title="Baixar versão original (após pagamento)"
                      >
                        Baixar Original
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
