import "./globals.css";

export const metadata = {
  title: "MINYEONG KIM CHATBOT",
  description: "Find out about me through the chatbot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
