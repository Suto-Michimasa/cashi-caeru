import React, { useState, useEffect, createContext, ReactNode } from "react";
import type { AppProps } from "next/app";
import { Liff } from "@line/liff/exports";

// Create a context for LIFF
const LiffContext = createContext<{
  liff: Liff | null;
  error: string | null;
}>({
  liff: null,
  error: null,
});

export const LineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        liff
          .init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
            withLoginOnExternalBrowser: true, // Enable automatic login process
          })
          .then(() => {
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            setLiffError(error.toString());
          });
      });
  }, []);

  // Use context to provide `liff` object and `liffError` object
  // to children components
  return (
    <LiffContext.Provider value={{ liff: liffObject, error: liffError }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  return React.useContext(LiffContext);
};
