import NavBar from "./(view)/(nav-bar)/nav-bar";
import TodoPage from "./(view)/home/page";
import "./globals.css";
import { SearchProvider } from "./SearchContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SearchProvider>
          <NavBar></NavBar>
          <TodoPage></TodoPage>
        </SearchProvider>
      </body>
    </html>
  );
}
