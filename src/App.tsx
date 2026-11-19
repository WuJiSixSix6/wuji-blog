import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WuJiCanvas } from './components/WuJiCanvas';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { HomePage } from './pages/HomePage';
import { BlogListPage } from './pages/BlogListPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ArchivePage } from './pages/ArchivePage';
import { AboutPage } from './pages/AboutPage';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-[calc(100vh-140px)]"
  >
    {children}
  </motion.main>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/blog"
          element={
            <PageWrapper>
              <BlogListPage />
            </PageWrapper>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PageWrapper>
              <PostDetailPage />
            </PageWrapper>
          }
        />
        <Route
          path="/archive"
          element={
            <PageWrapper>
              <ArchivePage />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative min-h-screen overflow-x-clip">
          <WuJiCanvas />
          <div className="grain-overlay" aria-hidden="true" />
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
          <AnimatedRoutes />
          <Footer />
          <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
