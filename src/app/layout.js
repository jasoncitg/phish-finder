import "./globals.css";

export const metadata = {
  title: "Phish Out of Water — Find Bluegrass Songs from Live Phish Shows",
  description:
    "Discover every time Phish played a bluegrass song in concert. Filter by Era and find the shows where Rocky Top, Nellie Kane, Poor Heart, and more appeared. Powered by Phish.net.",
  openGraph: {
    title: "Phish Out of Water",
    description: "Find bluegrass songs from live Phish shows — filter by Era",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
