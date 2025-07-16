import { useState } from 'react';

export default function Admin() {
  const [nomeEvento, setNomeEvento] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function adicionarMarcaDAgua(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Erro ao obter contexto do canvas');

          ctx.drawImage(img, 0, 0);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.shadowBlur = 4;

          const primitiveFontSize = Math.floor(canvas.width / 8);
          const subFontSize = Math.floor(canvas.width / 25);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          ctx.font = `bolder ${primitiveFontSize}px Arial`;
          ctx.fillText('PRIMITIVE', centerX, centerY - subFontSize);

          ctx.font = `normal ${subFontSize}px Arial`;
          ctx.fillText('Produções audiovisuais', centerX, centerY + primitiveFontSize * 0.3);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject('Erro ao criar Blob da imagem');
              const fileComMarca = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(fileComMarca);
            },
            'image/jpeg',
            0.95
          );
        };

        img.onerror = () => reject('Erro ao carregar imagem');
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject('Erro ao ler arquivo');
      reader.readAsDataURL(file);
    });
  }

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

    try {
      for (let i = 0; i < files.length; i++) {
        const fotoOriginal = files[i];
        console.log(`🖼️ Processando: ${fotoOriginal.name}`);

        // 1. Enviar a original para o bucket privado "pagas"
        const caminhoOriginal = `${nomeEvento}/${fotoOriginal.name}`;
        const resOriginal = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-nome-arquivo': caminhoOriginal,
            'x-bucket': 'pagas',
          },
          body: fotoOriginal,
        });

        if (!resOriginal.ok) {
          throw new Error(`Erro ao enviar original: ${resOriginal.statusText}`);
        }

        // 2. Adicionar marca d'água e enviar para o bucket público "fotos"
        const fotoComMarca = await adicionarMarcaDAgua(fotoOriginal);
        const caminhoPublico = `public/${nomeEvento}/${fotoComMarca.name}`;
        const resComMarca = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-nome-arquivo': caminhoPublico,
          },
          body: fotoComMarca,
        });

        if (!resComMarca.ok) {
          throw new Error(`Erro ao enviar com marca: ${resComMarca.statusText}`);
        }
      }

      input.value = '';
      setMensagem('Upload concluído com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      setMensagem('Erro ao processar as imagens. Veja o console.');
    }
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

        <input id="input-fotos" type="file" multiple className="w-full" />

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
