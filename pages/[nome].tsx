import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { listarFotosEvento } from '../lib/supabaseClient';
import FaceRecognition from '../components/FaceRecognition';

type Foto = { nome: string; url: string };

export default function Evento() {
  const router = useRouter();
  const { nome } = router.query as { nome: string };
  const [fotos, setFotos] = useState<Foto[]>([]);

  useEffect(() => {
    if (!nome) {
      console.log('Nome do evento ainda não definido');
      return;
    }
    console.log('Nome do evento:', nome);

    async function loadFotos() {
      const fotosDoEvento = await listarFotosEvento(nome);
      console.log('Fotos do evento:', fotosDoEvento);
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

      <hr className="my-10 border-gray-700" />

      <FaceRecognition fotos={fotos} />
    </main>
  );
}
