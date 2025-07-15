import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Corrigido: identificar pastas (eventos)
export async function listarEventos() {
  const { data, error } = await supabase.storage
    .from('fotos')
    .list('public', { limit: 100 });

  if (error) {
    console.error('Erro ao listar eventos:', error);
    return [];
  }

  // Se não tiver ponto (.), é uma "pasta"
  const pastas = data
    .filter(item => !item.name.includes('.'))
    .map(folder => folder.name);

  return pastas;
}

// ✅ Fotos por evento
export async function listarFotosEvento(evento: string) {
  const { data, error } = await supabase.storage
    .from('fotos')
    .list(`public/${evento}`, { limit: 100 });

  if (error) {
    console.error('Erro ao listar fotos:', error);
    return [];
  }

  return data
    .filter(file => file.name) // evitar nulos
    .map(file => ({
      nome: file.name,
      url: supabase.storage
        .from('fotos')
        .getPublicUrl(`public/${evento}/${file.name}`).data.publicUrl,
    }));
}
