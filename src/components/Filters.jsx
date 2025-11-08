import { useEffect, useState } from 'react'
import { getBreeds } from '../services/catApi.js'

export default function Filters({ value, onChange }) {
  const [breeds, setBreeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // cargar razas al montar
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getBreeds()
        if (!cancelled) setBreeds(data)
      } catch {
        if (!cancelled) setError('No se pudieron cargar las razas.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  function handleBreed(e) {
    const id = e.target.value
    const sel = breeds.find(b => b.id === id)
    // además de breedId, guardamos breedName para usarlo como fallback en las tarjetas
    onChange({ ...value, breedId: id, breedName: sel?.name || '' })
  }

  function handleMime(e) {
    const { name, checked } = e.target
    const next = new Set(value.mimeTypes)
    checked ? next.add(name) : next.delete(name)
    onChange({ ...value, mimeTypes: Array.from(next) })
  }

  return (
    <section className="filters">
      <label>
        Raza:{' '}
        <select value={value.breedId} onChange={handleBreed} disabled={loading}>
          <option value="">Todas</option>
          {breeds.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </label>

      <fieldset className="mime-types">
        <legend>Tipo:</legend>
        {['jpg', 'png', 'gif'].map(type => (
          <label key={type}>
            <input
              type="checkbox"
              name={type}
              checked={value.mimeTypes.includes(type)}
              onChange={handleMime}
            /> {type.toUpperCase()}
          </label>
        ))}
      </fieldset>

      {loading && <span className="muted">Cargando razas…</span>}
      {error && <span className="error">{error}</span>}
    </section>
  )
}
