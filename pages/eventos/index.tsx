import Link from 'next/link';
import Image from 'next/image';

export default function Eventos() {
  // Exemplo de um único evento
  const eventos = [
    {
      nome: 'Exemplo Corrida 10K',
      imagem: '/eventos/exemplo1/capa.jpg', // coloque uma imagem real aqui
      slug: 'Corrida SP - SESI'
    }
  ];

  return (
    <main className="bg-black min-h-screen text-white py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">Eventos Recentes</h1>

      {eventos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {eventos.map((evento) => (
            <Link
              key={evento.slug}
              href={`/eventos/${evento.slug}`}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition block"
            >
              <Image
                src={evento.imagem}
                alt={evento.nome}
                width={500}
                height={300}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{evento.nome}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">Nenhum evento disponível.</p>
      )}
    </main>
  );
}
