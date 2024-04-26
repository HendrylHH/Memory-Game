
import './App.css';
import { useState, useRef, useEffect } from 'react'
import Cartas from './Componentes/Cartas';

function App() {

  return (
    <div className="App">
      <h1>Animais</h1>
      <Cartas />
    </div>
  );
}

export default App;
