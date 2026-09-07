"use client";

import { useState, useEffect } from "react";
import { Volume2, Play, Square } from "lucide-react";

interface AudioItem {
  title: string;
  category?: string | { name?: string | null } | null;
}

interface AudioBriefingPlayerProps {
  items: AudioItem[];
}

export function AudioBriefingPlayer({ items }: AudioBriefingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio briefing is supported in your browser!");
      return;
    }

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const scriptText = items
      .map((item, idx) => `Insight ${idx + 1}: ${item.title}.`)
      .join(" ");

    const textToSpeak = `Welcome to today's TechCrest 2-Minute Executive Audio Briefing. Here are today's top technology insights. ${scriptText} Thank you for listening to TechCrest.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synth.cancel();
    synth.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="tc-brief-audio-bar">
      <div className="tc-brief-audio-left">
        <span 
          className="tc-brief-live-dot" 
          style={isPlaying ? { animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" } : {}}
        />
        <Volume2 
          size={16} 
          style={{ 
            color: "#2D7FF9", 
            animation: isPlaying ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none" 
          }} 
        />
        <span className="tc-brief-audio-title">
          {isPlaying ? "PLAYING 2-MIN EXECUTIVE AUDIO BRIEFING" : "TODAY'S 2-MIN EXECUTIVE AUDIO BRIEFING"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginRight: "0.25rem" }} aria-hidden="true">
            <span style={{ width: "4px", height: "12px", backgroundColor: "#2D7FF9", borderRadius: "9999px", animation: "pulse 1s infinite" }} />
            <span style={{ width: "4px", height: "16px", backgroundColor: "#2D7FF9", borderRadius: "9999px", animation: "pulse 1.2s infinite" }} />
            <span style={{ width: "4px", height: "8px", backgroundColor: "#2D7FF9", borderRadius: "9999px", animation: "pulse 0.8s infinite" }} />
          </div>
        )}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="tc-brief-play-btn"
          style={isPlaying ? { backgroundColor: "#dc2626", color: "white", borderColor: "#dc2626" } : {}}
          aria-label={isPlaying ? "Stop Audio Briefing" : "Listen to Audio Briefing"}
        >
          {isPlaying ? (
            <>
              <Square size={12} fill="currentColor" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
