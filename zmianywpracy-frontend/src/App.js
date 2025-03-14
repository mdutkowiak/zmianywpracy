import React, { useState } from 'react';
import './App.css';
import Register from './Register'; // Dodaj komponent rejestracji
import Login from './Login'; // Dodaj komponent logowania

import logo from './logo.svg'; // Zostaw logo React

function App() {
  const [token, setToken] = useState(null); // Przechowywanie tokenu po logowaniu

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Zmiany w pracy</h1>
        {token ? (
          <div>
            <h2>Welcome, you are logged in!</h2>
            {/* Tutaj możesz dodać inne komponenty, takie jak harmonogram */}
          </div>
        ) : (
          <div>
            <h2>Please log in or register</h2>
            <Register /> {/* Komponent rejestracji */}
            <Login setToken={setToken} /> {/* Komponent logowania */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
