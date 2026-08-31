"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  Loader2,
  Copy,
  CheckCheck,
  ChevronRight,
  Wand2,
} from "lucide-react";

const PROMPTS = [
  { label: "Write Introduction", prompt: "Write a compelling 2-paragraph introduction for this article that hooks the reader immediately." },
  { label: "Improve Headline", prompt: "Suggest 5 powerful, SEO-optimized headline variations for this article. Make them click-worthy and specific." },
  { label: "Write Conclusion", prompt: "Write a strong 1-paragraph conclusion that summarizes the key takeaways and ends with a call to action." },
  { label: "SEO Meta Description", prompt: "Write an SEO meta description (under 160 characters) for this article that maximizes click-through rate." },
  { label: "Summarize Content", prompt: "Summarize the key points of this article in 5 concise bullet points." },
  { label: "Fix Grammar & Style", prompt: "Review the existing content and suggest grammar improvements, clearer phrasing, and style fixes." },
  { label: "Add Subheadings", prompt: "Suggest 4-6 subheadings (H2) that would improve the structure and readability of this article." },
  { label: "Expand Section", prompt: "Expand on the main topic with more detail, examples, and expert insights." },
];

interface AiAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: { title: string; excerpt: string; content: string };
  onInsert: (text: string) => void;
}

export function AiAssistantPanel({
  isOpen,
  onClose,
  context,
  onInsert,
}: AiAssistantPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const runPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI request failed");
        return;
      }

      setResult(data.text);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-panel">
      {/* Header */}
      <div className="ai-panel__header">
        <div className="ai-panel__header-left">
          <div className="ai-panel__icon">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="ai-panel__title">AI Writing Assistant</h3>
            <p className="ai-panel__subtitle">Powered by Gemini 2.0 Flash</p>
          </div>
        </div>
        <button onClick={onClose} className="ai-panel__close" aria-label="Close AI panel">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="ai-panel__section">
        <p className="ai-panel__section-label">Quick Actions</p>
        <div className="ai-panel__prompts">
          {PROMPTS.map((p) => (
            <button
              key={p.label}
              onClick={() => runPrompt(p.prompt)}
              disabled={isLoading}
              className="ai-panel__prompt-btn"
            >
              <ChevronRight className="w-3 h-3 opacity-50" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="ai-panel__section">
        <p className="ai-panel__section-label">Custom Prompt</p>
        <div className="ai-panel__custom">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask anything about this article..."
            rows={3}
            className="input ai-panel__textarea"
          />
          <button
            onClick={() => customPrompt.trim() && runPrompt(customPrompt)}
            disabled={isLoading || !customPrompt.trim()}
            className="btn btn-primary ai-panel__submit"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Result */}
      {(result || error || isLoading) && (
        <div className="ai-panel__result-section">
          <div className="ai-panel__result-header">
            <p className="ai-panel__section-label">Result</p>
            {result && (
              <div className="ai-panel__result-actions">
                <button onClick={handleCopy} className="ai-panel__action-btn">
                  {copied ? (
                    <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => onInsert(result)}
                  className="ai-panel__action-btn ai-panel__action-btn--primary"
                >
                  Insert into Editor
                </button>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="ai-panel__loading">
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
              <span>Generating response...</span>
            </div>
          )}

          {error && (
            <div className="ai-panel__error">
              {error}
            </div>
          )}

          {result && !isLoading && (
            <div className="ai-panel__result-text">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
