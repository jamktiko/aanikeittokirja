import React from 'react';
import NavBar from './components/NavBar';
import FrontPage from './components/FrontPage';
import OwnRecipes from './components/OwnRecipes';
import RecipeFull from './components/RecipeFull';
import OwnLists from './components/OwnLists';
import SearchRecipes from './components/RecipeSearchPage';
import RecipeAddForm from './components/RecipeAddForm';
import PhotoRecipe from './components/PhotoRecipe';
import DownloadRecipe from './components/DownloadRecipe';
import MealPlanner from './components/MealPlanner';
import ShoppingLists from './components/ShoppingLists';
import UserLoginPage from './components/UserLoginPage';
import UserRegisterPage from './components/UserRegisterPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/*
Sovelluksen juurikomponentti, jonka päälle kasataan Nav Bar sekä
routerin mukainen näytettävä komponentti.
*/
function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar className="navBarComponent" />
        <div className="container">
          <Routes className="sideMenuLinks">
            <Route path="/" element={<FrontPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/reseptit" element={<OwnRecipes />} />
            <Route path="/reseptit/:id" element={<RecipeFull />} />
            <Route path="/listat" element={<OwnLists />} />
            <Route path="/haku" element={<SearchRecipes />} />
            <Route path="/uusi" element={<RecipeAddForm />} />
            <Route path="/muokkaa" element={<RecipeAddForm />} />
            <Route path="/kuvaa" element={<PhotoRecipe />} />
            <Route path="/lataa" element={<DownloadRecipe />} />
            <Route path="/ateriat" element={<MealPlanner />} />
            <Route path="/ostoslistat" element={<ShoppingLists />} />
            <Route path="/kirjaudu" element={<UserLoginPage />} />
            <Route path="/rekisteroidy" element={<UserRegisterPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
