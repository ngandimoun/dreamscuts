// MODIFIÉ : L'importation vient maintenant du paquet @supabase/ssr
import { createBrowserClient } from '@supabase/ssr'

// Le reste de votre code ne change pas, car la nouvelle bibliothèque
// exporte une fonction avec le même nom pour le côté client.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
)