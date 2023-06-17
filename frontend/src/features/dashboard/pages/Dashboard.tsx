import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useLiff } from "@/middleware/LineProvider";
import { Box, Button, Image } from "@chakra-ui/react"
import { createLoan, completePayment, sendReminder, updateLoan } from "@/features/loans/functions";
import { requestLoanData } from "../models";

export const DashboardPage = () => {
  const { liff, error: liffError } = useLiff();
  const idToken = liff?.getDecodedIDToken();
  const userName = idToken?.name;
  const picture = idToken?.picture;
  // 以下テスト用

  const onClick = () => {
    createLoan(requestLoanData);
  };

  const onClick2 = () => {
    completePayment('frqZTvdBCG0xCXv0YUHF');
  };

  const onClick3 = () => {
    sendReminder({ eventName: "古谷", creditorName: "古賀", daysRemaining: 4 });
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
              <Button onClick={onClick}>決済追加ボタン</Button>
              <Button onClick={onClick2}>決済完了ボタン</Button>
              <Button onClick={onClick3}>古賀のちんちん大きくなるボタン</Button>
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
