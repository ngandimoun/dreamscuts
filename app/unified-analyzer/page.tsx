/**
 * Unified Analyzer Test Page
 * 
 * Replaces all individual test pages with a single comprehensive interface
 * for testing the complete analysis pipeline.
 */

import UnifiedAnalyzerDemo from "@/components/analyzer/UnifiedAnalyzerDemo";

export default function UnifiedAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            DreamCut Unified Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete analysis pipeline combining query analysis, asset processing, 
            AI synthesis, and structured output generation in a single unified interface.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Together AI Models
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Replicate Vision Models
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              AI-Enhanced Synthesis
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Structured JSON Output
            </span>
          </div>
        </div>

        <UnifiedAnalyzerDemo />

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Implementation Notes</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">Pipeline Steps</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Step 1:</strong> Query analysis using Together AI models with robust fallbacks</li>
                <li>• <strong>Step 2:</strong> Parallel asset analysis using specialized Replicate models</li>
                <li>• <strong>Step 3:</strong> AI-enhanced synthesis combining query and asset insights</li>
                <li>• <strong>Step 4:</strong> Structured JSON output with executive summary and recommendations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Unified API endpoint replacing multiple legacy endpoints</li>
                <li>• Comprehensive error handling and validation</li>
                <li>• Customizable analysis depth and optimization focus</li>
                <li>• Performance metrics and pipeline efficiency tracking</li>
                <li>• Production readiness assessment</li>
                <li>• Executive summaries for stakeholder communication</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">Migration Notice</h3>
          <p className="text-sm text-amber-700">
            This unified analyzer replaces the following legacy endpoints:
            <code className="mx-1">/api/dreamcut/query-analyzer</code>,
            <code className="mx-1">/api/dreamcut/query-analyzer-async</code>,
            <code className="mx-1">/api/analyzer/step1</code>, and
            <code className="mx-1">/api/analyzer/step1-parallel</code>.
            Please migrate to the new <code>/api/dreamcut/unified-analyzer</code> endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
