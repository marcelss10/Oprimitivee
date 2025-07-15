import { useState } from 'react';

export default function Admin() {
  const [nomeEvento, setNomeEvento] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleUpload = async () => {
    const input = document.getElementById('input-fotos') as HTMLInputElement | null;

    if (!input || !input.files) {
      alert('Erro ao acessar os arquivos. Tente novamente.');
      return;
    }

    const files = input.files;

    if (!nomeEvento.trim()) {
      alert('Informe o nome do evento');
      return;
    }

    if (files.length === 0) {
      alert('Selecione as fotos');
      return;
    }

    setMensagem('Enviando fotos...');

    for (let i = 0; i < files.length; i++) {
      const foto = files[i];
      const caminho = `public/${nomeEvento}/${foto.name}`;
      console.log(`🖼️ Enviando: ${foto.name}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-nome-arquivo': caminho,
        },
        body: foto,
      });

      const resposta = await res.text();
      console.log('🟢 Resposta status:', res.status);
      console.log('🟢 Resposta texto:', resposta);

      if (!res.ok) {
        setMensagem(`Erro ao enviar: ${res.status} - ${res.statusText}`);
        return;
      }
    }

    input.value = '';
    setMensagem('Upload concluído com sucesso!');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white flex flex-col items-center justify-center px-6">
      <div className="text-4xl font-bold mb-8 text-center">Primitive</div>
      <div className="bg-black bg-opacity-30 p-10 rounded-lg shadow-lg w-full max-w-xl text-center space-y-6">
        <h1 className="text-2xl font-semibold">Área Administrativa</h1>

        <input
          type="text"
          placeholder="Nome do evento"
          value={nomeEvento}
          onChange={(e) => setNomeEvento(e.target.value)}
          className="w-full p-3 rounded text-black"
        />

        <input
          id="input-fotos" // ✅ ESSENCIAL para que o JS consiga acessar os arquivos
          type="file"
          multiple
          className="w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-lg"
        >
          Enviar Fotos
        </button>

        {mensagem && <p className="mt-4 text-green-400">{mensagem}</p>}

        <a
          href="/"
          className="inline-block bg-white text-black font-semibold mt-4 px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Ir ao site
        </a>
      </div>

      <footer className="text-xs text-gray-400 mt-12">
        © 2025 Primitive. Todos os direitos reservados.
      </footer>
    </section>
  );
}
