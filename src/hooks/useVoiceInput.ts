"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type LanguageCode = "en-US" | "ar-SA";

export interface UseVoiceInputOptions {
  language?: LanguageCode;
  onResult?: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  onError?: (error: string, humanMessage: string) => void;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { language = "en-US", onResult, onInterim, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const manualStopRef = useRef(false);

  // Store callbacks in refs to avoid stale closures inside long-lived SpeechRecognition handlers
  const onResultRef = useRef(onResult);
  const onInterimRef = useRef(onInterim);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onInterimRef.current = onInterim;
  }, [onInterim]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const stop = useCallback(() => {
    manualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop errors if already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      onErrorRef.current?.(
        "unsupported",
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    // Stop existing instance if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
    }

    manualStopRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let currentFinal = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcriptPart;
        } else {
          currentInterim += transcriptPart;
        }
      }

      if (currentFinal) {
        setFinalTranscript((prev) => (prev ? prev + " " + currentFinal.trim() : currentFinal.trim()));
        onResultRef.current?.(currentFinal.trim());
      }

      setInterimTranscript(currentInterim);
      onInterimRef.current?.(currentInterim);
    };

    recognition.onerror = (event: any) => {
      const errType = event.error;

      // Ignore benign errors (no-speech or user aborted)
      if (errType === "no-speech" || errType === "aborted") {
        return;
      }

      let humanMessage = "Voice dictation error.";
      if (errType === "not-allowed") {
        humanMessage = "Microphone access blocked. Please allow permissions in browser.";
      } else if (errType === "audio-capture") {
        humanMessage = "No microphone found on your device.";
      } else if (errType === "network") {
        humanMessage = "Network error during speech processing.";
      }

      onErrorRef.current?.(errType, humanMessage);
      stop();
    };

    recognition.onend = () => {
      // Auto-restart on end unless user explicitly pressed stop
      if (!manualStopRef.current && isListening) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    // Call start() directly from user gesture handler
    try {
      recognition.start();
    } catch (err: any) {
      console.warn("SpeechRecognition start error:", err?.message);
      setIsListening(false);
    }
  }, [language, isListening, stop]);

  return {
    isListening,
    isSupported,
    interimTranscript,
    finalTranscript,
    start,
    stop,
  };
}
