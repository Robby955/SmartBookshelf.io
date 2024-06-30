// my-app/app/layout.js

import '../styles/globals.css';  // Ensure this path is correct

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <div className="font-sans antialiased">{children}</div>
      </body>
    </html>
  );
}
