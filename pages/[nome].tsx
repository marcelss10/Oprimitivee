import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { listarFotosEvento } from '../lib/supabaseClient';

export default function Evento() {
  const router = useRouter();
  const { nome } = router.query as { nome: string };
  const [fotos, setFotos] = useState<{ nome: string; url: string }[]>([]);

  useEffect(() => {
    if (!nome) return;

    async function loadFotos() {
      const fotosDoEvento = await listarFotosEvento(nome);
      setFotos(fotosDoEvento);
    }

    loadFotos();
  }, [nome]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl mb-6">Fotos do evento: {nome}</h1>
      {fotos.length === 0 ? (
        <p>Nenhuma foto encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fotos.map(({ nome, url }) => (
            <img key={nome} src={url} alt={nome} className="rounded shadow" />
          ))}
        </div>
      )}
    </main>
  );
}
