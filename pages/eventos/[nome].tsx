import { useRouter } from 'next/router';

export default function EventoFotos() {
  const { nome } = useRouter().query;
  const fotos = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/400/300?random=${i}`);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 capitalize">{(nome as string)?.replace(/-/g, ' ')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {fotos.map((src, i) => (
          <div key={i} className="overflow-hidden rounded shadow-lg">
            <img src={src} alt={`Foto ${i}`} className="w-full h-auto hover:scale-105 transition-transform" />
          </div>
        ))}
      </div>
    </section>
  );
}
