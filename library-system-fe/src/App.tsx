import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import { HomePage, LibraryBooksPage, BookDetailsPage } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="library/:libraryId" element={<LibraryBooksPage />} />
          <Route path="library/:libraryId/book/:bookId" element={<BookDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
