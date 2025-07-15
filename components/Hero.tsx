export default function Hero() {
  return (
    <section className="bg-black text-white py-20 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Bem-vindo ao Primitive</h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">
        Encontre suas fotos de eventos com facilidade.
      </p>
      <a
        href="/eventos"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-lg transition"
      >
        Ver Eventos
      </a>
    </section>
  );
}
