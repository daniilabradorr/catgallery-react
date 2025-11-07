import { useMemo } from 'react'


export default function CatCard({ item, isFav, onToggleFav }) {
//uso el usememo para que memoerize la primera rza asociada a la imagen(si existe claro)
const breed = useMemo(() => item.breeds?.[0], [item])


return (
<article className="card">
<div className="image-wrap">
{/*loading="lazy" para mejor rendimiento en scroll*/}
<img src={item.url} alt={breed?.name ? `Gato — ${breed.name}` : 'Gato'} loading="lazy" />
</div>
<div className="card-body">
<div className="card-row">
<strong>{breed?.name ?? 'Sin raza'}</strong>
<button className={isFav ? 'btn fav' : 'btn'} onClick={() => onToggleFav(item)}>
{isFav ? '★ Favorito' : '☆ Favorito'}
</button>
</div>
{/*los metadatos opcionales de la raza*/}
{breed?.temperament && <p className="muted">{breed.temperament}</p>}
{breed?.origin && <p className="muted">Origen: {breed.origin}</p>}
</div>
</article>
)
}