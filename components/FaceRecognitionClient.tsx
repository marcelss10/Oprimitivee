// components/FaceRecognitionClient.tsx
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface Foto {
  nome: string;
  url: string;
}

export default function FaceRecognitionClient({ fotos }: { fotos: Foto[] }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [imagemReferencia, setImagemReferencia] = useState<HTMLImageElement | null>(null);
  const [fotosCorrespondentes, setFotosCorrespondentes] = useState<Foto[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadModels() {
      console.log('Iniciando carregamento dos modelos...');
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      console.log('Modelos carregados!');
    }
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) console.log('Modelos prontos para uso');
  }, [modelsLoaded]);

  async function handleImagemSelecionada(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    console.log('Imagem selecionada:', file);
    if (!file) return;

    try {
      const img = await carregarImagem(file);
      setImagemReferencia(img);

      const descricao = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!descricao) {
        alert('Nenhum rosto detectado na selfie.');
        return;
      }

      const descritorSelfie = descricao.descriptor;
      console.log('Descritor da selfie obtido');

      const fotosCompativeis: Foto[] = [];

      for (const foto of fotos) {
        console.log('Processando foto:', foto.nome);
        const imgTeste = await carregarImagem(foto.url);
        const descTeste = await faceapi
          .detectSingleFace(imgTeste, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (descTeste) {
          const distancia = faceapi.euclideanDistance(descritorSelfie, descTeste.descriptor);
          console.log(`Distância para ${foto.nome}:`, distancia);
          if (distancia < 0.5) {
            fotosCompativeis.push(foto);
            console.log(`Foto compatível: ${foto.nome}`);
          }
        } else {
          console.log(`Nenhum rosto detectado na foto: ${foto.nome}`);
        }
      }

      setFotosCorrespondentes(fotosCompativeis);
      console.log('Fotos correspondentes:', fotosCompativeis);
    } catch (error) {
      console.error('Erro ao processar a imagem:', error);
    }
  }

  function carregarImagem(src: File | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      if (typeof src === 'string') {
        img.src = src;
      } else {
        img.src = URL.createObjectURL(src);
      }
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  }

  return (
    <div className="text-center my-8 border border-yellow-500 p-4">
      <h2 className="text-xl font-bold mb-4 text-yellow-300">
        📷 Faça upload da sua selfie para encontrar suas fotos
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImagemSelecionada}
        ref={fileInputRef}
        className="mb-6"
      />

      {fotosCorrespondentes.length > 0 ? (
        <div>
          <h3 className="text-lg mb-2">Encontramos essas fotos com base no seu rosto:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {fotosCorrespondentes.map((foto) => (
              <img key={foto.nome} src={foto.url} alt={foto.nome} className="rounded shadow" />
            ))}
          </div>
        </div>
      ) : imagemReferencia ? (
        <p className="text-gray-400">Nenhuma correspondência encontrada.</p>
      ) : (
        <p className="text-gray-400">Aguardando selfie...</p>
      )}
    </div>
  );
}
