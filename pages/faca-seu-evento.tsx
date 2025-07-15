export default function FacaSeuEvento() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">Organize seu Evento com a Gente</h1>
      <form className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <input type="text" placeholder="Seu nome" className="w-full border p-3 rounded" />
        <input type="email" placeholder="Seu email" className="w-full border p-3 rounded" />
        <textarea placeholder="Descrição do evento" className="w-full border p-3 rounded" rows={4}></textarea>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
          Enviar Pedido
        </button>
      </form>
    </section>
  );
}
