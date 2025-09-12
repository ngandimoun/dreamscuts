"use client";

import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, LogIn } from "lucide-react";
import { useAppStore } from "@/store/useStore";



export default function AuthPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const user = useAppStore((state) => state.user);

    // Fonction pour lancer l'authentification Google via OAuth
    const handleGoogleSignIn = useCallback(async () => {
        try {
            console.log("Lancement de l'authentification Google OAuth...");

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) {
                console.error("Erreur lors du lancement de l'authentification:", error.message);
            } else {
                console.log("Authentification Google lancée:", data);
            }
        } catch (err) {
            console.error("Erreur inattendue lors de l'authentification Google:", err);
        }
    }, []);



    useEffect(() => {
        // Afficher le modal après un délai de 3 secondes
        const timer = setTimeout(() => {
            if (!isDismissed) {
                setIsVisible(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isDismissed]);

    // Réinitialiser l'état quand l'utilisateur se déconnecte
    useEffect(() => {
        if (!user) {
            setIsDismissed(false);
            setIsVisible(false);
        }
    }, [user]);



    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };

    // Ne pas afficher si l'utilisateur a déjà fermé le modal ou s'il est connecté
    if (!isVisible || isDismissed || user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-600">
                        Sign in with Google to access all features.
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400  mb-2 cursor-pointer hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {/* Bouton de connexion Google personnalisé */}
                <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white cursor-pointer hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-xs"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </Button>

                <p className="text-xs text-gray-500 text-center">
                Secure and instant login
                </p>
            </div>
        </div>
    );
}
