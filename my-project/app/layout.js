import "../styles/globals.css";

// Define the metadata object with title and description
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Define the RootLayout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

