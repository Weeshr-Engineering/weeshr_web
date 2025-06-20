"use client";

import Script from "next/script";

export default function RuutChat() {
  return (
    <Script
      id="ruut-chat-sdk"
      strategy="lazyOnload"
      src="https://app.ruut.chat/packs/js/sdk.js"
      onLoad={() => {
        window.ruutSDK?.run({
          websiteToken: "RE18sLhczDqbdwg7zKKtdrVF",
          baseUrl: "https://app.ruut.chat",
        });
      }}
    />
  );
}
