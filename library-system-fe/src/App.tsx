import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { HomePage, LibraryBooksPage, BookDetailsPage, LoginPage } from './pages';

export default function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
