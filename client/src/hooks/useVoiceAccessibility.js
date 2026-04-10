import { useEffect, useMemo, useState } from "react";

export const useVoiceAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    document.body.style.filter = highContrast ? "contrast(150%) saturate(110%)" : "none";
  }, [fontScale, highContrast]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.toLowerCase() || "";
      if (text.includes("dashboard")) window.location.href = "/dashboard";
      if (text.includes("logout")) window.location.href = "/";
    };
    rec.start();
  };

  return useMemo(
    () => ({
      highContrast,
      setHighContrast,
      fontScale,
      setFontScale,
      voiceEnabled,
      setVoiceEnabled,
      speak,
      startListening,
      listening,
    }),
    [highContrast, fontScale, voiceEnabled, listening]
  );
};
