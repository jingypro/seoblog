import Document, { Html, Head, Main, NextScript } from "next/document";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

//However, including the viewport meta tag in _document.js is not recommended, since it can cause issues with mobile responsiveness and zooming.
//Instead, you should add the viewport meta tag to the Head component in your individual pages or layouts.

class MyDocument extends Document {
  setGoogleTags() {
    if (publicRuntimeConfig.PRODUCTION) {
      return {
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XY0BSXZND6');
        `,
      };
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css"
          />
          <link rel="stylesheet" href="/static/css/styles.css" />
          <script src="https://accounts.google.com/gsi/client" async defer />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-XY0BSXZND6"
          />
          <script dangerouslySetInnerHTML={this.setGoogleTags()} />
          <script src="https://apis.google.com/js/api.js"></script>
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
