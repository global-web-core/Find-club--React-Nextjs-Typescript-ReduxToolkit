import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const lang = this.props.__NEXT_DATA__?.props?.pageProps?.metadata?.lang;

    return (
      <Html lang={lang}>
        <Head>
					<link rel="icon" href="/favicon.ico" />
				</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;