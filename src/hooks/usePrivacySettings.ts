import { useEffect, useState } from "react";

const PRIVACY_MODE_STORAGE_KEY = "hushh-privacy-mode";

export default function usePrivacySettings() {
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(PRIVACY_MODE_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PRIVACY_MODE_STORAGE_KEY, String(isPrivacyModeEnabled));
  }, [isPrivacyModeEnabled]);

  return { isPrivacyModeEnabled, setIsPrivacyModeEnabled };
}
