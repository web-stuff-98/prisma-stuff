import Document, { Html, Head, Main, NextScript } from "next/document";

function MyDocument() {
  return (
    <Html>
      <Head>
      <link href="https://fonts.googleapis.com/css2?family=Archivo&family=Archivo+Black&display=swap" rel="stylesheet"/> 
            </Head>
      <body className="dark:bg-neutral-900 dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;