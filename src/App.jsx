import { useEffect, useState } from "react";
import Navbars from "@/components/Navbar";
import BelajarTo from "@/components/ui/ToTka";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbars />} />
        <Route path="/to-tka/*" element={<BelajarTo />} />
        <Route path="*" element={<Navbars />} />
      </Routes>
    </Router>
  );
}

export default App;
