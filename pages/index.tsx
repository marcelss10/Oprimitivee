import Header from "../components/Header";
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  // Simule a lista de eventos disponíveis aqui.
  const eventosDisponiveis = []; // ← deixe vazio para testar a mensagem de "nenhum evento"

  return (
    <>
      <Header />

      {/* Busca evento */}
      <section className="bg-black text-white py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Participou de um evento?</h2>
        <p className="text-xl mb-6">Busque aqui suas fotos.</p>
        <input
          type="text"
          placeholder="Digite aqui o nome do evento..."
          className="w-full md:w-1/2 p-3 border rounded text-black mb-4"
        />
        <br />
        <button
          onClick={() => router.push('/eventos')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:scale-105 transition"
        >
          Buscar
        </button>
      </section>

      {/* Eventos por categoria */}
      <section className="bg-gray-900 py-16 px-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-10">Eventos por categoria</h2>

        {eventosDisponiveis.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-semibold max-w-4xl mx-auto">
            {['Corrida', 'Ciclismo', 'Motor', 'Futebol', 'Treinos', 'Outros'].map((cat) => (
              <button
                key={cat}
                className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition rounded p-6"
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">Nenhum evento recente.</p>
        )}
      </section>

      {/* Serviços */}
      <section className="bg-black py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de uma sessão fotográfica?</h2>
          <p className="mb-6">
            Você está precisando de fotografia para melhorar as vendas do seu negócio ou quer registrar um momento especial? No Primitive, você solicita um trabalho - fotos do seu cardápio, dos seus produtos ou de algum evento - e nossa base de fotógrafos irá te atender.
          </p>
          <p className="mb-6">Aqui, nos adaptamos ao seu orçamento.</p>
          <a
            href="/faca-seu-evento"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-lg transition"
          >
            Solicitar serviço
          </a>
        </div>
      </section>

      {/* Prime Chatbot Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-white p-3 rounded-full shadow-lg text-2xl hover:scale-105 transition"
            title="Falar com Prime"
          >
            🤖
          </button>
        ) : (
          <div className="bg-white text-black p-4 rounded-lg shadow-xl w-80">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Prime 🤖</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-black">✖</button>
            </div>
            <p className="text-sm mb-4">Olá! Eu sou o Prime 🤖 Como posso ajudar?</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/eventos')}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ir para fotos
              </button>
              <a
                href="https://wa.me/5541987936037"
                target="_blank"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 text-center"
              >
                Precisa de um fotógrafo?
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-8">
        <p>© 2025 Primitive. Todos os direitos reservados.</p>
        <p className="text-xs text-gray-400 mt-2">Desenvolvido por Marcel Ambrosio</p>
      </footer>
    </>
  );
}
