import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useLiff } from "@/middleware/LineProvider";
import { Box, Button, Image } from "@chakra-ui/react"
import { createLoan } from "@/features/loans/functions";
import { requestLoanData } from "../models";

export const DashboardPage = () => {
  const { liff, error: liffError } = useLiff();
  const idToken = liff?.getDecodedIDToken();
  const userName = idToken?.name;
  const picture = idToken?.picture;
  const getProfile = async () => {
    const profile = await liff?.getProfile();
    // pictureUrl = profile?.pictureUrl;
    // ログインしたら、ユーザー情報を取得して、DBに保存する
    console.log(profile);
  };
  // 以下テスト用
  const onClick = () => {
    createLoan(requestLoanData);
  };
  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>create-liff-app</h1>
        {liff && (
          <div>
            <p>LIFF init succeeded.</p>
            <p>{userName}</p>
            <Image
              borderRadius={'9999'}
              boxSize={'150px'}
              src={picture}
              alt={'profile image'}
            />
            <Box mt={10}>
              <Button onClick={onClick}>テスト</Button>
              <Button onClick={getProfile}>プロフィール</Button>
            </Box>
          </div>
        )}
        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
};