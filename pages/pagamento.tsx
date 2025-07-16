import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Importa QRCodeSVG dinamicamente sem tipos extras
const QRCodeSVG = dynamic(() =>
  import('qrcode.react').then((mod) => mod.QRCodeSVG), { ssr: false });

export default function Pagamento() {
  const router = useRouter();
  const { evento, foto } = router.query as { evento?: string; foto?: string };
  const [pagou, setPagou] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState('');

  if (!evento || !foto) {
    return <p className="p-10 text-center text-red-500">Parâmetros inválidos.</p>;
  }

  const chavePix = 'pix-chave-exemplo@exemplo.com';

  async function handleSimularPagamento() {
    setErro('');
    setBaixando(true);

    try {
      const res = await fetch(
        `/api/downloadOriginal?evento=${encodeURIComponent(evento)}&foto=${encodeURIComponent(foto)}`
      );

      if (!res.ok) throw new Error('Erro ao obter foto original');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = foto;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPagou(true);
    } catch (e: any) {
      setErro(e.message || 'Erro desconhecido');
    } finally {
      setBaixando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Pagamento para baixar foto original</h1>

      <p className="mb-4 text-center">
        Evento: <strong>{evento}</strong><br />
        Foto: <strong>{foto}</strong>
      </p>

      <div className="mb-8 text-center">
        <p className="mb-2">Escaneie o QR Code abaixo para simular o pagamento via PIX:</p>
        <QRCodeSVG
          value={`00020126580014BR.GOV.BCB.PIX0136${chavePix}52040000530398654051005802***6304`}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin
        />
        <p className="mt-3 select-all font-mono bg-white text-black inline-block p-2 rounded">
          {chavePix}
        </p>
      </div>

      <button
        onClick={handleSimularPagamento}
        disabled={baixando || pagou}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold shadow"
      >
        {baixando ? 'Processando...' : pagou ? 'Download liberado!' : 'Simular pagamento e baixar'}
      </button>

      {erro && <p className="mt-4 text-red-500">{erro}</p>}
    </main>
  );
}
