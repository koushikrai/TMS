"use client";

import React, { useState } from "react";
import VoiceInputButton from "./VoiceInputButton";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { useTMSStore } from "@/lib/store/tmsStore";

interface AiFormAssistantProps {
  type: "light" | "heavy";
  sampleChips: string[];
  onExtract: (fields: Record<string, any>) => void;
}

export default function AiFormAssistant({
  type,
  sampleChips,
  onExtract,
}: AiFormAssistantProps) {
  const { addToast } = useTMSStore();
  const [aiText, setAiText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    if (!aiText.trim()) {
      addToast({
        type: "warning",
        title: "Prompt Required",
        message: "Please enter or dictate a description before extracting.",
      });
      return;
    }

    setIsExtracting(true);
    try {
      const res = await fetch("/api/ai/extract-request-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText, type }),
      });

      if (!res.ok) {
        throw new Error("AI Extraction endpoint error");
      }

      const json = await res.json();
      if (json.fields) {
        onExtract(json.fields);
        addToast({
          type: "success",
          title: "Form Auto-Filled",
          message: "Form filled — Review the values before submitting.",
        });
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "AI Extraction Error",
        message: "Failed to extract fields. Please try again or fill manually.",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-teal/10 via-white to-brand-blue/10 border border-brand-teal/30 rounded-apple-lg p-5 shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-apple-pill bg-brand-teal text-white flex items-center justify-center shadow-overlay">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">AI &amp; Voice Form Assistant</h3>
            <p className="text-[11px] text-ink-muted">
              Dictate or type your request in natural language (English / Arabic). Our AI automatically extracts and populates form fields for review.
            </p>
          </div>
        </div>
      </div>

      {/* Sample Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Try Sample:</span>
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setAiText(chip)}
            className="px-2.5 py-1 bg-white border border-border-soft hover:border-brand-teal rounded-apple-pill text-[11px] font-medium text-ink-muted hover:text-brand-teal transition-all shadow-sm"
          >
            &ldquo;{chip}&rdquo;
          </button>
        ))}
      </div>

      {/* Textarea + Voice Button */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder={`Describe your request (e.g., "Need a Sedan for 1 month starting tomorrow for Jubail site visits")...`}
            className="w-full p-3 pr-28 bg-white border border-border-soft rounded-apple-md text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
          <div className="absolute right-2 bottom-2.5">
            <VoiceInputButton
              onTranscript={(t) => setAiText((prev) => (prev ? `${prev} ${t}` : t))}
            />
          </div>
        </div>
      </div>

      {/* Extract Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleExtract}
          disabled={isExtracting || !aiText.trim()}
          className="h-9 px-4 bg-brand-teal text-white rounded-apple-pill text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-overlay disabled:opacity-50"
        >
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Extracting Form Fields...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Extract &amp; Fill Form</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
