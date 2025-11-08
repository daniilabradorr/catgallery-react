import { useMemo } from 'react'

export default function CatCard({ item, isFav, onToggleFav, selectedBreedName = '' }) {
  // primera raza asociada a la imagen (si existe)
  const breed = useMemo(() => item.breeds?.[0], [item])

  // nombre a mostrar: de la imagen -> del filtro -> vacío (sin "Sin raza")
  const displayName = breed?.name || selectedBreedName || ''
  const alt = displayName ? `Gato — ${displayName}` : 'Gato'

  return (
    <article className="card">
      <div className="image-wrap">
        {/* loading="lazy" para mejor rendimiento en scroll */}
        <img src={item.url} alt={alt} loading="lazy" />
      </div>

      <div className="card-body">
        <div className="card-row">
          {/* si hay nombre lo mostramos; si no, dejamos un span vacío para mantener el layout */}
          {displayName ? <strong>{displayName}</strong> : <span aria-hidden="true" />}
          <button className={isFav ? 'btn fav' : 'btn'} onClick={() => onToggleFav(item)}>
            {isFav ? '★ Favorito' : '☆ Favorito'}
          </button>
        </div>

        {/* metadatos opcionales si vienen en la imagen */}
        {breed?.temperament && <p className="muted">{breed.temperament}</p>}
        {breed?.origin && <p className="muted">Origen: {breed.origin}</p>}
      </div>
    </article>
  )
}
