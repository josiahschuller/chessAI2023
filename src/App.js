import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from "./Game";
import Menu from "./Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/play/:colour/:opponent" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
