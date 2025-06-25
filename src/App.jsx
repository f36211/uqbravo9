import { useEffect, useState } from "react";
import Navbars from '@/components/Navbar'
import ASATStudyHub from '@/components/ui/studyhub'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbars />} />
        <Route path="/study-hub" element={<ASATStudyHub/>} />
        <Route path="*" element={<Navbars />} />
      </Routes>
    </Router>
  );
}

export default App;
