"use client"

// Imports de React et des états
import { useState, useEffect } from "react";

// Imports pour Supabase, Zustand et les composants d'authentification
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useStore";
import { useMediaStore } from "@/store/useMediaStore";
import LoginModal from "@/components/auth/LoginModal";
import UserProfile from "@/components/auth/UserProfile";

// Imports des composants UI et des icônes
import { Button } from "@/components/ui/button";
import { Crown, Folder, FileText, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Import du composant de chat
import ChatInterface from "@/components/chat/ChatInterface";
// Import du composant d'authentification automatique
import AuthPrompt from "@/components/auth/AuthPrompt";
// Import du composant unifié
import UnifiedInput from "@/components/UnifiedInput";
import { MediaItem } from "@/components/chat/mediaTypes";
// Import des composants d'interface
import YourDesignsContent from "@/components/YourDesignsContent";

export default function AIDesignToolV2() {
  // États locaux pour le prompt et la visibilité de la modale de connexion
  const [prompt, setPrompt] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "designs" | "templates">("ai");

  // Accès au store Zustand pour l'état global (utilisateur, prompt sauvegardé)
  const { user, setUser, promptBeforeLogin, setPromptBeforeLogin } = useAppStore();
  const { loadUserMediaFromDatabase } = useMediaStore();

  // Effet pour gérer l'état d'authentification et restaurer le prompt après connexion
  useEffect(() => {
    // Si un prompt a été sauvegardé avant la redirection de connexion, on le restaure
    if (promptBeforeLogin) {
      setPrompt(promptBeforeLogin);
      setPromptBeforeLogin(''); // Nettoyer le store après la restauration
    }

    // Récupérer la session initiale au chargement de la page
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Écouter les changements d'état d'authentification (connexion, déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Met toujours à jour l'état de l'utilisateur, quel que soit l'événement
      setUser(session?.user ?? null);

      // CORRECTION : Ne ferme la modale que lors d'un événement de connexion réussie.
      // Cela empêche la modale de se fermer lors des vérifications de session initiales.
      if (event === 'SIGNED_IN') {
        setShowLoginModal(false);
        // Load user media when they sign in
        if (session?.user?.id) {
          loadUserMediaFromDatabase(session.user.id);
        }
      }
    });

    // Nettoyer l'abonnement quand le composant est démonté pour éviter les fuites de mémoire
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, promptBeforeLogin, setPromptBeforeLogin]);

  // Effet pour gérer le scroll global quand l'interface de chat est active
  useEffect(() => {
    if (showChatInterface) {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }

    return () => {
      document.body.classList.remove('chat-active');
    };
  }, [showChatInterface]);


  // Gère l'envoi authentifié du prompt
  const handleAuthenticatedSend = (promptText: string, media: MediaItem[]) => {
    console.log("Utilisateur connecté. Envoi du prompt :", promptText);
    console.log("Médias sélectionnés :", media);
    // Afficher l'interface de chat
    setShowChatInterface(true);
  };

  return (
    <>
      {/* Affiche conditionnellement la modale de connexion par-dessus le reste de l'application */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* Affiche conditionnellement l'interface de chat */}
      {showChatInterface && (
        <ChatInterface
          initialPrompt={prompt}
          onBack={() => setShowChatInterface(false)}
          user={user}
        />
      )}



      {/* Interface par défaut - masquée pendant le chat */}
      {!showChatInterface && (
        <div className="min-h-screen font-sans bg-background">
          {/* Conteneur du header avec masque de fondu */}
          <div
            className="absolute top-0 left-0 w-full h-1/2 dark:h-0 bg-gradient-to-r from-[#abf4fd] via-blue-100 to-purple-300"
            style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Header Section */}
            <header className="flex justify-between items-center p-6">
              <div className="flex-1" />
              
              {/* Bouton de toggle de thème */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                {/* Affiche le profil de l'utilisateur s'il est connecté, sinon le bouton "Upgrade" */}
                {user ? (
                  <div className="flex items-center gap-2">
                    <UserProfile />
                    <Button className="bg-purple-100 dark:bg-purple-300 cursor-pointer hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                      <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade your plan
                    </Button>
                  </div>
                ) : (
                  <Button className="bg-purple-100 dark:bg-purple-300 hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                    <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade your plan
                  </Button>
                )}
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center px-6 pb-10">
              {/* AI Tab - Full Content */}
              {activeTab === "ai" && (
                <>
                  <div className="text-center mb-12 pt-16">
                    <div className="mb-10">
                      <h1 className="text-5xl ibarra-real-nova mb-2">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent dark:text-white">
                          If you can dream it
                        </span>
                      </h1>
                      <h1 className="text-5xl ibarra-real-nova">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent dark:text-white">
                          You can make it
                        </span>
                      </h1>
                    </div>
                  </div>

                  {/* AI Tab Navigation */}
                  <div className="flex justify-center gap-2 mb-8">
                    <button
                      onClick={() => setActiveTab("designs")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors text-gray-600 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-500"
                    >
                      <Folder className="w-4 h-4" /> Your designs
                    </button>
                    <button
                      onClick={() => setActiveTab("ai")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors text-purple-800 dark:text-purple-50 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" /> Prompt AI
                    </button>
                  </div>

                  <div className="w-full max-w-3xl mb-12">
                    <UnifiedInput
                      value={prompt}
                      onChange={setPrompt}
                      onAuthenticatedSend={handleAuthenticatedSend}
                      showLoginModal={() => setShowLoginModal(true)}
                      placeholder="Describe your idea, and I'll bring it to life"
                      mediaPreviewSize="small"
                    />
                    <p className="text-center text-xs text-gray-500/80 dark:text-gray-50 mt-4">
                      DreamCut AI can make mistakes. Please check for accuracy.{" "}
                      <button className="underline hover:no-underline">See terms</button>
                      {" • "}
                      <button className="underline hover:no-underline">Give feedback</button>
                    </p>
                  </div>


                </>
              )}

              {/* Designs & Templates Tabs - Compact Header */}
              {(activeTab === "designs" || activeTab === "templates") && (
                <div className="w-full pt-8">
                  {/* Compact Header */}
                  <div className="text-center mb-8">
                    <div className="text-center mb-6">
                      <h1 className="text-5xl ibarra-real-nova mb-2">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent dark:text-white">
                          If you can dream it
                        </span>
                      </h1>
                      <h1 className="text-5xl ibarra-real-nova">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent dark:text-white">
                          You can make it
                        </span>
                      </h1>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-2 mb-8">
                      <button
                        onClick={() => setActiveTab("designs")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === "designs"
                            ? "text-purple-800 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50"
                            : "text-gray-600 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-500"
                          }`}
                      >
                        <Folder className="w-4 h-4" /> Your designs
                      </button>
                      <button
                        onClick={() => setActiveTab("ai")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors text-gray-600 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-500"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" /> Prompt AI
                      </button>
                    </div>
                    
                  </div>

                  {/* Content Container */}
                  {activeTab === "designs" && (
                    <div className="w-full max-w-7xl h-[calc(100vh-260px)]">
                      <YourDesignsContent user={user} />
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Modal d'authentification automatique - affiché uniquement pour les utilisateurs non connectés */}
      {!user && <AuthPrompt />}

    </>
  )
}