import { useEffect, useMemo, useState } from 'react'
import Filters from './Filters.jsx'
import CatCard from './CatCard.jsx'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { searchImages } from '../services/catApi.js'

const PAGE_SIZE = 6  // baja a 3 si sigues viendo 429

export default function Gallery() {
  const [filters, setFilters] = useState({ breedId: '', breedName: '', mimeTypes: [] })
  const [images, setImages] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [favIds, setFavIds] = useLocalStorage('cat-favs', [])
  const favSet = useMemo(() => new Set(favIds), [favIds])

  async function loadMore(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const data = await searchImages({
        page: nextPage,
        limit: PAGE_SIZE,
        breedId: filters.breedId,
        mimeTypes: filters.mimeTypes,
      }) // <- ¡sin selectedBreedName aquí!
      setImages(prev => (nextPage === 0 ? data : [...prev, ...data]))
      setPage(nextPage + 1)
    } catch (e) {
      console.error('[Gallery] loadMore error:', e)
      setError(e?.message || 'No se pudieron cargar imágenes. Reintenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setImages([])
    setPage(0)
    loadMore(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.breedId, filters.mimeTypes.join(',')])

  function toggleFav(item) {
    setFavIds(prev => {
      const id = item.id
      return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    })
  }

  return (
    <section>
      <Filters value={filters} onChange={setFilters} />

      {error && <div className="error" role="alert">{error}</div>}

      <div className="grid">
        {images.map(img => (
          <CatCard
            key={img.id}
            item={img}
            isFav={favSet.has(img.id)}
            onToggleFav={toggleFav}
            selectedBreedName={filters.breedName}  // <- aquí sí pasamos el nombre
          />
        ))}
      </div>

      <div className="actions">
        <button className="btn" disabled={loading} onClick={() => loadMore(page)}>
          {loading ? 'Cargando…' : 'Ver más'}
        </button>
      </div>
    </section>
  )
}
