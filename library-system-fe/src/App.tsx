import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LibraryGrid from "./components/LibraryGrid";
import BooksListPage from "./components/BooksListPage";
import BookDetailsPage from "./components/BookDetailsPage";
import AddLibraryModal from "./components/AddLibraryModal";
import AddBookModal from "./components/AddBookModal";
import LoginModal from "./components/LoginModal";
import { Toaster } from "./components/ui/sonner";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Library {
  id: number;
  name: string;
  description: string;
  privacyStatus: "PUBLIC" | "PRIVATE";
  bookCount: number;
  owner: { id: number; name: string };
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  description: string;
  coverUrl: string;
  commentsCount: number;
  libraryId: number;
}

export interface Comment {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt: string;
  bookId: number;
}

type Page = "home" | "books-list" | "book-details";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleLogin = (
    email: string,
    password: string,
    name?: string,
    isRegister?: boolean
  ) => {
    // Mock authentication
    const newUser: User = {
      id: 1,
      email,
      name: name || "Erikas Lau",
      role: "USER",
    };
    setUser(newUser);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const handleAddLibrary = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowAddLibraryModal(true);
  };

  const handleAddBook = (library: Library) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedLibrary(library);
    setShowAddBookModal(true);
  };

  const handleViewLibraryBooks = (library: Library) => {
    setSelectedLibrary(library);
    setCurrentPage("books-list");
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setCurrentPage("book-details");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedLibrary(null);
    setSelectedBook(null);
  };

  const handleBackToBooks = () => {
    setCurrentPage("books-list");
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onLogoClick={handleBackToHome}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {currentPage === "home" && (
          <LibraryGrid
            user={user}
            onAddLibrary={handleAddLibrary}
            onAddBook={handleAddBook}
            onViewLibrary={handleViewLibraryBooks}
          />
        )}

        {currentPage === "books-list" && selectedLibrary && (
          <BooksListPage
            library={selectedLibrary}
            user={user}
            onBack={handleBackToHome}
            onAddBook={() => handleAddBook(selectedLibrary)}
            onBookClick={handleBookClick}
          />
        )}

        {currentPage === "book-details" && selectedBook && (
          <BookDetailsPage
            book={selectedBook}
            user={user}
            onBack={handleBackToBooks}
          />
        )}
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSubmit={handleLogin}
        />
      )}

      {showAddLibraryModal && (
        <AddLibraryModal
          onClose={() => setShowAddLibraryModal(false)}
          user={user}
        />
      )}

      {showAddBookModal && selectedLibrary && (
        <AddBookModal
          library={selectedLibrary}
          onClose={() => {
            setShowAddBookModal(false);
            setSelectedLibrary(null);
          }}
        />
      )}

      <Toaster />
    </div>
  );
}
