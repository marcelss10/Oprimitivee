import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { evento, foto } = req.query;

  if (typeof evento !== 'string' || typeof foto !== 'string') {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  try {
    const caminhoArquivo = `pagas/${evento}/${foto}`;
    console.log(`[DOWNLOAD ORIGINAL] Tentando gerar signed URL para: ${caminhoArquivo}`);

    // Gera a signed URL — use o caminho literal, pois é como está salvo no bucket
    const { data, error } = await supabase.storage
      .from('pagas')
      .createSignedUrl(caminhoArquivo, 60);

    if (error || !data?.signedUrl) {
      console.error(`[ERRO] Falha ao criar signed URL para: ${caminhoArquivo}`, error);
      return res.status(500).json({ error: 'Erro ao acessar arquivo' });
    }

    // Use a URL assinada para fazer fetch — aqui é onde o encodeURI é importante para evitar erro com espaços
    const signedUrlEncoded = encodeURI(data.signedUrl);
    console.log(`[INFO] URL assinada codificada para fetch: ${signedUrlEncoded}`);

    const arquivoRes = await fetch(signedUrlEncoded);

    if (!arquivoRes.ok) {
      console.error(`[ERRO] Falha ao baixar arquivo da signed URL: ${signedUrlEncoded}`, await arquivoRes.text());
      return res.status(500).json({ error: 'Erro ao baixar arquivo' });
    }

    const buffer = await arquivoRes.arrayBuffer();

    res.setHeader('Content-Type', arquivoRes.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${foto}"`);
    res.setHeader('Content-Length', buffer.byteLength.toString());

    console.log(`[SUCESSO] Enviando arquivo original: ${foto}`);
    res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    console.error('[ERRO] Exceção inesperada no handler:', e);
    res.status(500).json({ error: 'Erro interno' });
  }
}
