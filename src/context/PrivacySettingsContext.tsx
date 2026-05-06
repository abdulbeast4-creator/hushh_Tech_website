import React, { createContext, useContext } from "react";
import usePrivacySettings from "../hooks/usePrivacySettings";

type PrivacySettingsContextValue = {
  isPrivacyModeEnabled: boolean;
  setIsPrivacyModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const PrivacySettingsContext = createContext<PrivacySettingsContextValue | undefined>(undefined);

export function PrivacySettingsProvider({ children }: { children: React.ReactNode }) {
  const value = usePrivacySettings();
  return (
    <PrivacySettingsContext.Provider value={value}>
      {children}
    </PrivacySettingsContext.Provider>
  );
}

export function usePrivacySettingsContext() {
  const context = useContext(PrivacySettingsContext);
  if (!context) {
    throw new Error("usePrivacySettingsContext must be used within PrivacySettingsProvider");
  }
  return context;
}
