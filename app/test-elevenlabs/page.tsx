/**
 * ElevenLabs Test Page
 * 
 * A test page to demonstrate and test the ElevenLabs Text to Speech integration.
 * This page provides a comprehensive interface for testing all features.
 */

import { TextToSpeechDemo } from '@/components/elevenlabs/TextToSpeechDemo';
import { TextToDialogueDemo } from '@/components/elevenlabs/TextToDialogueDemo';

export default function TestElevenLabsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">ElevenLabs Integration Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates the ElevenLabs Text to Speech and Text to Dialogue integration. 
            You can test voice generation, dialogue creation, voice selection, and audio playback features.
          </p>
        </div>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Text to Speech</h2>
            <TextToSpeechDemo />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Text to Dialogue</h2>
            <TextToDialogueDemo />
          </div>
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Setup Instructions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">1. Environment Configuration</h3>
                <p className="text-muted-foreground">
                  Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root with:
                </p>
                <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-x-auto">
{`ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_DEFAULT_VOICE_ID=JBFqnCBsd6RMkjVDRZzb
ELEVENLABS_DEFAULT_MODEL_ID=eleven_multilingual_v2`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Get Your API Key</h3>
                <p className="text-muted-foreground">
                  Visit the <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ElevenLabs Dashboard</a> to create an API key.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">3. Test the Integration</h3>
                <p className="text-muted-foreground">
                  Use the interface above to test text to speech generation, voice selection, and audio playback.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Features Demonstrated</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">Core Features</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Text to Speech conversion</li>
                  <li>• Text to Dialogue with audio tags</li>
                  <li>• Voice selection and management</li>
                  <li>• Voice settings customization</li>
                  <li>• Audio playback controls</li>
                  <li>• Multiple output formats</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Advanced Features</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Audio tag management and validation</li>
                  <li>• Multi-speaker dialogue support</li>
                  <li>• Text enhancement with emotional tags</li>
                  <li>• Usage statistics monitoring</li>
                  <li>• Voice search and filtering</li>
                  <li>• Audio waveform visualization</li>
                  <li>• Download functionality</li>
                  <li>• Error handling and validation</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-muted px-2 py-1 rounded">POST /api/elevenlabs/text-to-speech</code>
                <p className="text-muted-foreground mt-1">Generate speech from text</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">POST /api/elevenlabs/text-to-dialogue</code>
                <p className="text-muted-foreground mt-1">Generate expressive dialogue with audio tags</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/voices</code>
                <p className="text-muted-foreground mt-1">Get available voices</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/audio-tags</code>
                <p className="text-muted-foreground mt-1">Get available audio tags</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/v3-voices</code>
                <p className="text-muted-foreground mt-1">Get V3 optimized voices</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/languages</code>
                <p className="text-muted-foreground mt-1">Get supported languages</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/v3-prompting</code>
                <p className="text-muted-foreground mt-1">Get v3 prompting guide features</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/sound-effects</code>
                <p className="text-muted-foreground mt-1">Get sound effects data and generate effects</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/voice-design</code>
                <p className="text-muted-foreground mt-1">Design and create custom voices from text</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/music</code>
                <p className="text-muted-foreground mt-1">Generate studio-grade music from text prompts</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/pricing</code>
                <p className="text-muted-foreground mt-1">Track usage, calculate costs, and manage pricing</p>
              </div>
              
              <div>
                <code className="bg-muted px-2 py-1 rounded">GET /api/elevenlabs/usage</code>
                <p className="text-muted-foreground mt-1">Get usage statistics</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
            <p className="text-muted-foreground mb-4">
              For detailed documentation and examples, see:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/docs/elevenlabs-integration" className="text-primary hover:underline">
                  📖 ElevenLabs Integration Guide
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-usage-examples" className="text-primary hover:underline">
                  💡 Text to Speech Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-dialogue-examples" className="text-primary hover:underline">
                  🎭 Text to Dialogue Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-v3-voice-examples" className="text-primary hover:underline">
                  🎤 V3 Voice Library Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-multilingual-examples" className="text-primary hover:underline">
                  🌍 Multilingual Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-v3-prompting-examples" className="text-primary hover:underline">
                  📖 V3 Prompting Guide Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-sound-effects-examples" className="text-primary hover:underline">
                  🔊 Sound Effects Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-voice-design-examples" className="text-primary hover:underline">
                  🎨 Voice Design Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-music-examples" className="text-primary hover:underline">
                  🎵 Music Generation Examples
                </a>
              </li>
              <li>
                <a href="/examples/elevenlabs-pricing-examples" className="text-primary hover:underline">
                  💰 Pricing & Usage Examples
                </a>
              </li>
              <li>
                <a href="https://elevenlabs.io/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  🔗 ElevenLabs Official Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
