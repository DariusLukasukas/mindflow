"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

const MIC_PERMISSION_TOAST_KEY = "mindflow_mic_permission_toast_shown";
const NETWORK_ERROR_TOAST_KEY = "mindflow_network_error_toast_shown";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const manualStopRef = useRef(false);

  const initRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return null;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Handlers for continuous speech recognition
    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      // Process all results from the current recognition session
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const combinedTranscript = (finalTranscript + interimTranscript).trim();
      if (combinedTranscript) {
        setTranscript(combinedTranscript);
      }
    };

    recognition.onerror = (event) => {
      // Don't show errors if user manually stopped
      if (manualStopRef.current) {
        return;
      }

      const fatalErrors = [
        "not-allowed", // Permission denied
        "service-not-allowed", // Service disabled
        "network", // Network issues
        "audio-capture", // Can't access microphone
      ];

      if (fatalErrors.includes(event.error)) {
        manualStopRef.current = true;
        setIsListening(false);

        // Only show toast once per session for permission denial
        if (event.error === "not-allowed") {
          const hasShown = sessionStorage.getItem(MIC_PERMISSION_TOAST_KEY);
          if (!hasShown) {
            sessionStorage.setItem(MIC_PERMISSION_TOAST_KEY, "true");
            toast.error("Microphone Blocked", {
              description:
                "Please allow microphone access in your browser settings",
              duration: 5000,
              position: "top-center",
            });
          }
        } else if (event.error === "network") {
          // Only show network error toast once per session
          const hasShown = sessionStorage.getItem(NETWORK_ERROR_TOAST_KEY);
          if (!hasShown) {
            sessionStorage.setItem(NETWORK_ERROR_TOAST_KEY, "true");
            toast.error("Voice Input Unavailable", {
              description:
                "Speech recognition is not supported in this browser",
              duration: 5000,
              position: "top-center",
            });
          }
        } else {
          toast.error("Unable to Access Microphone");
        }
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");

      // Auto-restart if user didn't manually stop (handles Safari 60s timeout)
      if (!manualStopRef.current && recognitionRef.current) {
        console.log("Auto-restarting recognition");
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Auto-restart failed:", error);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const startListening = () => {
    // If retrying after any error, reset the recognition instance and clear toast flags
    const hasShownPermissionToast = sessionStorage.getItem(
      MIC_PERMISSION_TOAST_KEY,
    );
    const hasShownNetworkToast = sessionStorage.getItem(
      NETWORK_ERROR_TOAST_KEY,
    );

    if (
      (hasShownPermissionToast || hasShownNetworkToast) &&
      recognitionRef.current
    ) {
      recognitionRef.current = null;
      sessionStorage.removeItem(MIC_PERMISSION_TOAST_KEY);
      sessionStorage.removeItem(NETWORK_ERROR_TOAST_KEY);
    }

    const recognition = initRecognition();

    if (!recognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    try {
      manualStopRef.current = false;
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Start failed:", error);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Abort failed:", e);
        }
      }
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        manualStopRef.current = true;
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error("Stop failed:", error);
        setIsListening(false);
      }
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          manualStopRef.current = true;
          recognitionRef.current.abort();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
