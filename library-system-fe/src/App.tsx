import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { HomePage, LibraryBooksPage, BookDetailsPage, LoginPage, NotFoundPage } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="library/:libraryId" element={<LibraryBooksPage />} />
          <Route path="library/:libraryId/book/:bookId" element={<BookDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
