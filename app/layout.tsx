import type { Metadata } from "next";
import "./globals.css";
import ReduxWrap from "@/components/ReduxWrap"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "मुंबई प्लस - मुंबई की आवाज़, अब हर दिन आपके साथ!",
  description:
    "मुंबई की ताज़ा लोकल खबरें, भ्रष्टाचार के खिलाफ आवाज़, वार्ड-विशेष समाचार, सिटीजन जर्नलिज्म | Mumbai Plus Daily News",
  keywords:
    "मुंबई प्लस, मुंबई न्यूज़, लोकल न्यूज़, भ्रष्टाचार, वार्ड न्यूज़, सिटीजन रिपोर्टर, मुंबई दैनिक समाचार",
  openGraph: {
    title: "मुंबई प्लस - मुंबई की आवाज़",
    description: "2009 से मुंबई की सच्ची आवाज़ | अब दैनिक समाचार पत्र",
    url: "https://www.mumbaiplu.in",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700;900&family=Hind:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon-mumbaiplus.ico" />
        
        {/* लोगो के exact colors से थीम बदली गई */}
        <meta name="theme-color" content="#E30613" />
        
        <style>{`
          :root {
            --mp-red: #E30613;
            --mp-dark-red: #8B1A1A;
            --mp-gold: #F9A825;
            --mp-black: #1A1A1A;
          }
          
          .font-mumbai {
            font-family: 'Hind', 'Noto Sans Devanagari', sans-serif !important;
          }
          .font-bold-hindi {
            font-family: 'Noto Sans Devanagari', sans-serif;
            font-weight: 900;
          }
          
          /* लोगो की exact लाल थीम */
          .bg-mp-red { background-color: #E30613; }
          .bg-mp-dark { background-color: #8B1A1A; }
          .bg-mp-gold { background-color: #F9A825; }
          .text-mp-red { color: #E30613; }
          .text-mp-gold { color: #F9A825; }
          .border-mp-red { border-color: #E30613; }
          .hover\\:bg-mp-red:hover { background-color: #E30613; }
          .hover\\:text-mp-gold:hover { color: #F9A825; }
        `}</style>
      </head>
      
      {/* सिर्फ़ बैकग्राउंड कलर लोगो की लाल थीम से मैच किया */}
      <body className="font-mumbai bg-white text-gray-900">
     <ReduxWrap>
      <Header/>
        {children}
    </ReduxWrap>
      </body>
    </html>
  );
}