import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { Templates } from './pages/Templates';
import AtsScore from './pages/AtsScore';
import { Settings } from './pages/Settings';
import { AtsGuide } from './pages/AtsGuide';
import { PdfEditor } from './pages/PdfEditor';
import { ToastProvider } from './providers/ToastProvider';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/ats-score" element={<AtsScore />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ats-guide" element={<AtsGuide />} />
            <Route path="/pdf-editor" element={<PdfEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
