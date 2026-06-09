import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Drop this component once inside your router tree (e.g. in App.tsx, right
 * after <BrowserRouter> or inside the layout wrapper). It watches the URL
 * pathname and instantly scrolls the window to (0, 0) on every navigation.
 *
 * Usage in App.tsx:
 *   <BrowserRouter>
 *     <ScrollToTop />
 *     <Navbar />
 *     <Routes>…</Routes>
 *     <Footer />
 *   </BrowserRouter>
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // renders nothing
}
