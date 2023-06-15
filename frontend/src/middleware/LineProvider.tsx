import React, { useState, useEffect, createContext, ReactNode } from "react";
import { Liff } from "@line/liff/exports";
import { createUser } from "./functions/createUser";

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
            // ログインしたら、ユーザー情報を取得して、DBに保存する
            (async () => {
              // UsersテーブルのLineIdに一致するユーザーがいなければ、ユーザーを作成する
              const profile = await liff.getProfile();
              await createUser({
                lineId: profile.userId,
                name: profile.displayName,
                pictureUrl: profile.pictureUrl || "",
              });
            })();
          })
          .catch((error: Error) => {
            setLiffError(error.toString());
          });
      });
  }, []);

  return (
    <LiffContext.Provider value={{ liff: liffObject, error: liffError }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  return React.useContext(LiffContext);
};
