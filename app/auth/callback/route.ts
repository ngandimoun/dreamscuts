import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // S'il y a une `next` dans les params, c'est là que nous devrions rediriger l'utilisateur après la connexion
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // CORRECTION 1 : Les fonctions doivent être déclarées `async`
          async get(name: string) {
            // CORRECTION 2 : On utilise `await` avant d'accéder aux méthodes de `cookieStore`
            // Notez les parenthèses qui sont importantes ici
            return (await cookieStore).get(name)?.value
          },
          async set(name: string, value: string, options: CookieOptions) {
            (await cookieStore).set({ name, value, ...options })
          },
          async remove(name: string, options: CookieOptions) {
            (await cookieStore).delete({ name, ...options })
          },
        },
      }
    )
    // Échange le code d'autorisation contre une session utilisateur
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // La redirection doit être vers une URL absolue
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // URL vers laquelle rediriger en cas d'erreur ou si aucun code n'est présent
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}