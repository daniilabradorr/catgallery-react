import { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { getByIds } from '../services/catApi'
import CatCard from './CatCard'


export default function Favorites() {
const [favIds, setFavIds] = useLocalStorage('cat-favs', [])
//cargo los objetos completos de las imágenes favoritas
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')


//el useeffect cada vez que cambie la lista de IDs, volvemos a pedir detalles
useEffect(() => {
(async () => {
if (!favIds.length) { setItems([]); return }
setLoading(true)
setError('')
try {
const data = await getByIds(favIds)
setItems(data)
} catch (e) {
setError('No se pudieron cargar tus favoritos.')
} finally {
setLoading(false)
}
})()
}, [favIds])
//en favoritos, solo permito quitar (toggle = quitar)
function toggleFav(item) {
setFavIds(prev => prev.filter(x => x !== item.id))
}

if (!favIds.length) {
return <p className="muted">Aún no tienes favoritos ✨ Marca algunos desde la Galería.</p>
}

return (
<section>
{error && <div className="error" role="alert">{error}</div>}
{loading && <p className="muted">Cargando favoritos…</p>}


<div className="grid">
{items.map(item => (
<CatCard key={item.id} item={item} isFav onToggleFav={toggleFav} />
))}
</div>
</section>
)
}