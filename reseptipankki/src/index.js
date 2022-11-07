import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Renderöi sovelluksen juurikomponentin (App.js).
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Ottaa service workerin käyttöön ja liittää sen sovellukseen.
serviceWorkerRegistration.register();
