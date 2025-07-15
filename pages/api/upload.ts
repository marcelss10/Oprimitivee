// pages/api/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false, // importante!
  },
};

function buffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const nomeArquivo = req.headers['x-nome-arquivo'] as string;
  if (!nomeArquivo) {
    return res.status(400).json({ error: 'Nome do arquivo não informado' });
  }

  try {
    const fileBuffer = await buffer(req);

    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(nomeArquivo, fileBuffer, {
        contentType: 'image/jpeg', // ajuste conforme necessário
        upsert: true,
      });

    if (error) {
      console.error('❌ Supabase erro:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ Erro geral:', err);
    return res.status(500).json({ error: 'Erro no upload' });
  }
}
