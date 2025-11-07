import { useEffect, useState } from 'react'


//en este aricxcvho hagoun  Hook controlado que enlaza un estado de React con localStorage
export default function useLocalStorage(key, initialValue) {
//al inicializar, leemos desde localStorage (si hay) o usamos initialValue para iniciarlo correctamente
const [value, setValue] = useState(() => {
try {
const raw = localStorage.getItem(key)
return raw ? JSON.parse(raw) : initialValue
} catch {
return initialValue
}
})
//para serialziar el valor en JSON y qie lo guarde bien cada vez que se cambie
useEffect(() => {
try {
localStorage.setItem(key, JSON.stringify(value))
} catch {
//si localStorage falla lo ignoro
}
}, [key, value])

return [value, setValue]
}