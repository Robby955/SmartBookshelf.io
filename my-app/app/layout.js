// File: C:\Users\robby\PycharmProjects\SmartShelf\my-app\app\layout.js
import { Inter } from "next/font/google";
import "../styles/globals.css"; // Update this path to point to the correct location

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
