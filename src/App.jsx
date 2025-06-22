import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import EditMenu from './pages/EditMenu.jsx';
import PublicMenu from './pages/PublicMenu.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/edit/:id" element={<EditMenu />} />
    <Route path="/menu/:id" element={<PublicMenu />} />
  </Routes>
);

export default App;
