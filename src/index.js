import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import DataContext from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import './css/index.css';
import './css/main.css';
import 'leaflet/dist/leaflet.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <DataContext>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </DataContext>

);

