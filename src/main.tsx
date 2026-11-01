import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/components/layout';
import { Contact } from '@/pages/contact';
import { Home } from '@/pages/home';
import { NotFound } from '@/pages/not-found';
import { ProjectDetail } from '@/pages/project';
import { Studio } from '@/pages/studio';
import { Work } from '@/pages/work';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          {(location) => (
            <Routes location={location}>
              <Route index element={<Home />} />
              <Route path="work" element={<Work />} />
              <Route path="work/:slug" element={<ProjectDetail />} />
              <Route path="studio" element={<Studio />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
