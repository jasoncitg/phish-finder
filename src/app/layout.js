import "./globals.css";

export const metadata = {
  title: "Phish Finder — AI-Powered Show Recommendations",
  description: "Find the perfect Phish show by vibe, energy, era, and more. Powered by Phish.net data and Claude AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
