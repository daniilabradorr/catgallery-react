import { useState } from 'react'
import Gallery from './components/Gallery'
import Favorites from './components/Favorites'


export default function App() {
//ueso el estado local para conmutar entre pestañas de "galería" y "favoritos"
const [tab, setTab] = useState('gallery')


return (
<div className="container">
<header className="header">
<h1>🐱 CatGallery</h1>
<nav className="tabs">
<button
className={tab === 'gallery' ? 'tab active' : 'tab'}
onClick={() => setTab('gallery')}
>Galería</button>


<button
className={tab === 'favorites' ? 'tab active' : 'tab'}
onClick={() => setTab('favorites')}
>Favoritos</button>
</nav>
</header>


<main>
{/*uso un renderizado condicional según la pestaña*/}
{tab === 'gallery' ? <Gallery /> : <Favorites />}
</main>


<footer className="footer">
<small>
Fuente: <a href="https://thecatapi.com/" target="_blank" rel="noreferrer">TheCatAPI</a>
</small>
</footer>
</div>
)
}