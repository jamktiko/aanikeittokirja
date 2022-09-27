import React from 'react';
import NavBar from './components/NavBar';
import FrontPage from './components/FrontPage';
import TestPage from './components/TestPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/*
Sovelluksen juurikomponentti, jonka päälle kasataan Nav Bar sekä
routerin mukainen näytettävä komponentti.
*/
function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <div className="container">
          <Routes className="sideMenuLinks">
            <Route path="/" element={<FrontPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
