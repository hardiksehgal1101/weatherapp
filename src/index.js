import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TwinklingParticles from './modules/backgroundComponent';

ReactDOM.render(
  <React.StrictMode>
    <TwinklingParticles/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);