"use client";

import React, { useState } from "react";
import { useVoiceInput, LanguageCode } from "@/hooks/useVoiceInput";
import { Mic, MicOff, Globe, Loader2 } from "lucide-react";
import { useTMSStore } from "@/lib/store/tmsStore";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  className?: string;
  buttonText?: string;
}

export default function VoiceInputButton({
  onTranscript,
  language: externalLang,
  onLanguageChange,
  className = "",
  buttonText,
}: VoiceInputButtonProps) {
  const { addToast } = useTMSStore();
  const [internalLang, setInternalLang] = useState<LanguageCode>("en-US");

  const currentLang = externalLang || internalLang;

  const { isListening, isSupported, start, stop, interimTranscript } = useVoiceInput({
    language: currentLang,
    onResult: (finalText) => {
      if (finalText) {
        onTranscript(finalText);
      }
    },
    onError: (errCode, humanMsg) => {
      addToast({
        type: "warning",
        title: "Voice Dictation",
        message: humanMsg,
      });
    },
  });

  if (!isSupported) {
    return null; // Silent degradation if Web Speech API is unsupported in browser
  }

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLang: LanguageCode = currentLang === "en-US" ? "ar-SA" : "en-US";
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setInternalLang(newLang);
    }
  };

  const handleMicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stop();
    } else {
      start(); // Direct call inside click handler (preserves user-gesture chain)
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Language Toggle EN / AR */}
      <button
        type="button"
        onClick={toggleLanguage}
        title="Toggle Dictation Language (English / Arabic)"
        className="h-8 px-2 rounded-apple-pill border border-border-soft bg-background-secondary text-ink-muted hover:text-ink text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 select-none"
      >
        <Globe className="h-3 w-3 text-brand-teal" />
        <span>{currentLang === "en-US" ? "EN" : "العربية (AR)"}</span>
      </button>

      {/* Mic Trigger Button */}
      <button
        type="button"
        onClick={handleMicClick}
        title={isListening ? "Stop Voice Input" : "Start Voice Input"}
        className={`h-8 px-2.5 rounded-apple-pill border text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active ${
          isListening
            ? "bg-system-red text-white border-system-red shadow-overlay animate-pulse"
            : "bg-white text-ink border-border-soft hover:border-brand-teal hover:text-brand-teal"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="h-3.5 w-3.5 animate-spin" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="h-3.5 w-3.5 text-brand-teal" />
            <span>{buttonText || "Voice Input"}</span>
          </>
        )}
      </button>

      {/* Interim Live Transcript Indicator */}
      {isListening && interimTranscript && (
        <span className="text-[11px] font-mono text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded truncate max-w-[150px]">
          &ldquo;{interimTranscript}&rdquo;
        </span>
      )}
    </div>
  );
}
