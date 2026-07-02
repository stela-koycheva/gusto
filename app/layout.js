export const metadata = {
  title: "Gusto",
  description: "A familiar for the hungry soul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
