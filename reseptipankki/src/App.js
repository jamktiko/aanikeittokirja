import React from 'react';

import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import FrontPage from './components/FrontPage';
import OwnRecipes from './components/OwnRecipes';
import RecipeFull from './components/RecipeFull';
import OwnLists from './components/OwnLists';
import OwnList from './components/OwnList';
import SearchRecipes from './components/RecipeSearchPage';
import RecipeAddForm from './components/RecipeAddForm';
import PhotoRecipe from './components/PhotoRecipe';
import DownloadRecipe from './components/DownloadRecipe';
import MealPlanner from './components/MealPlanner';
import ShoppingLists from './components/ShoppingLists';
import ShoppingList from './components/ShoppingList';
import UserLoginPage from './components/UserLoginPage';
import UserRegisterPage from './components/UserRegisterPage';
import UserForgotPassword from './components/UserForgotPassword';
import UserWelcomePage from './components/UserWelcomePage';
import UserPage from './components/UserPage';

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
          {/*
            Jokainen sovelluksen reitti (urlin loppuosa). Vastaavat
            yhtä komponenttia, joka näytetään kyseisessä reitissä.
            Kirjautumista vaativien reittien komponentit on upotettu
            PrivateRoute-komponentin sisälle. Se tarkistaa, onko käyttäjä
            kirjautunut sisään.
          */}
          <Routes className="sideMenuLinks">
            <Route path="/" element={<FrontPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/reseptit"
              element={
                <PrivateRoute>
                  <OwnRecipes />
                </PrivateRoute>
              }
            />
            <Route path="/reseptit/:id" element={<RecipeFull />} />
            <Route
              path="/listat"
              element={
                <PrivateRoute>
                  <OwnLists />
                </PrivateRoute>
              }
            />
            <Route path="/listat/:id" element={<OwnList />} />
            <Route path="/haku" element={<SearchRecipes />} />
            <Route
              path="/uusi"
              element={
                <PrivateRoute>
                  {' '}
                  <RecipeAddForm />{' '}
                </PrivateRoute>
              }
            />
            <Route
              path="/muokkaa"
              element={
                <PrivateRoute>
                  <RecipeAddForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/kuvaa"
              element={
                <PrivateRoute>
                  <PhotoRecipe />
                </PrivateRoute>
              }
            />
            <Route
              path="/lataa"
              element={
                <PrivateRoute>
                  <DownloadRecipe />
                </PrivateRoute>
              }
            />
            <Route
              path="/ateriat"
              element={
                <PrivateRoute>
                  <MealPlanner />
                </PrivateRoute>
              }
            />
            <Route
              path="/ostoslistat"
              element={
                <PrivateRoute>
                  <ShoppingLists />
                </PrivateRoute>
              }
            />
            <Route
              path="/ostoslistat/:id"
              element={
                <PrivateRoute>
                  <ShoppingList />
                </PrivateRoute>
              }
            />
            <Route path="/kirjaudu" element={<UserLoginPage />} />
            <Route path="/rekisteroidy" element={<UserRegisterPage />} />
            <Route path="/uusi_salasana" element={<UserForgotPassword />} />
            <Route
              path="/kayttaja"
              element={
                <PrivateRoute>
                  <UserPage />
                </PrivateRoute>
              }
            />
            <Route path="/tervetuloa" element={<UserWelcomePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
