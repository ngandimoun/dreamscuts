"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

// Déclare 'google' sur l'objet window pour éviter les erreurs TypeScript
declare global {
  interface Window {
    google: any;
  }
}

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const googleButtonDiv = useRef<HTMLDivElement>(null);

  // La fonction de callback qui sera appelée par Google après une connexion réussie
  const handleCredentialResponse = useCallback(async (response: any) => {
    // 'response.credential' contient le JWT (ID Token) fourni par Google
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    if (error) {
      console.error("Erreur de connexion avec le token Google:", error.message);
      // Gérer l'erreur (par ex: afficher un message à l'utilisateur)
    }
    // Si la connexion est réussie, le listener onAuthStateChange
    // dans votre composant principal s'occupera de fermer la modale et de mettre à jour l'UI.

  }, []);

  useEffect(() => {
    // Vérifier si la bibliothèque Google est chargée
    if (typeof window.google === 'undefined' || !googleButtonDiv.current) {
      return;
    }

    // 1. Initialiser la bibliothèque avec votre ID client et la fonction de callback
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    // 2. Rendre le bouton personnalisé dans le div prévu à cet effet
    window.google.accounts.id.renderButton(
      googleButtonDiv.current,
      {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left"
      } // Options de personnalisation
    );

  }, [handleCredentialResponse]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log in to continue</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to generate a design.</p>

        {/* Le bouton de connexion Google sera injecté ici */}
        <div ref={googleButtonDiv} className="flex justify-center"></div>

        <Button variant="ghost" onClick={onClose} className="w-full mt-4 text-gray-500">
          Cancel
        </Button>
      </div>
    </div>
  );
}