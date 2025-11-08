const API_BASE = 'https://api.thecatapi.com/v1';
const API_KEY = import.meta.env.VITE_CAT_API_KEY || '';

function headers() {
  return API_KEY ? { 'x-api-key': API_KEY } : {};
}

// Espera ms milisegundos
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function checkedFetch(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { ...headers(), ...(opts.headers || {}) } });
  if (!res.ok) {
    // Mensajes claros por código
    if (res.status === 429) throw new Error('Has alcanzado el límite de peticiones anónimas (429). Espera unos segundos o usa una API key gratis.');
    if (res.status === 401 || res.status === 403) throw new Error('La API requiere una API key válida para esta operación (401/403).');
    throw new Error(`Error de red — HTTP ${res.status}`);
  }
  return res.json();
}

export async function getBreeds() {
  return checkedFetch(`${API_BASE}/breeds`);
}

// Intenta con filtros y, si falla, reintenta (backoff) y luego hace fallback sin filtros.
export async function searchImages({ page = 0, limit = 6, breedId = '', mimeTypes = [] }) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('order', 'Desc');
  if (breedId) {
    params.set('breed_ids', breedId)
    params.set('has_breeds', '1')    // sólo imágenes que llevan raza
  } else {
    params.set('has_breeds', '1')    // opcional: aplica también en “Todas”
  }
  if (mimeTypes.length) params.set('mime_types', mimeTypes.join(','));
  const url = `${API_BASE}/images/search?${params.toString()}`;

  try {
    return await checkedFetch(url);
  } catch (e) {
    // 1º reintento rápido (backoff breve) si es rate-limit u otro error temporal
    console.warn('[searchImages] primer fallo:', e.message);
    await sleep(900);
    try {
      return await checkedFetch(url);
    } catch (e2) {
      // 2º intento: FALLO con filtros → probamos sin filtros (max compatibilidad)
      console.warn('[searchImages] segundo fallo, probando sin filtros:', e2.message);
      const fallback = `${API_BASE}/images/search?limit=${limit}&page=${page}&order=Desc`;
      return checkedFetch(fallback);
    }
  }
}

export async function getByIds(ids = []) {
  const items = await Promise.all(ids.map((id) => checkedFetch(`${API_BASE}/images/${id}`)));
  return items;
}
