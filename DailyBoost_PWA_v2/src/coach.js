import { MESSAGES } from './messages.js'

const PICK = (arr, seed=0) => arr[(seed % arr.length + arr.length) % arr.length]

export function coachSuggest(category, mood, isPro, dateStr){
  const base = {
    general: ['Escribe 3 tareas clave de hoy.','Elimina 1 distracción de tu espacio.','Define tu “una cosa” de hoy.'],
    trabajo: ['Cierra el correo por 20 min.','Haz una micro-tarea de < 5 min.','Pide feedback a un compañero.'],
    bienestar: ['Bebe un vaso de agua.','Camina 5 minutos.','Haz 10 respiraciones profundas.'],
  }
  const pro = {
    general: ['Bloquea 25 min en tu calendario.','Escribe una nota de progreso al final del día.'],
    trabajo: ['Entrega un borrador en 60 min.','Divide el trabajo en 3 bloques Pomodoro.'],
    bienestar: ['Plan de sueño: fija hora para dormir.','Estiramiento guiado 10 min.'],
  }
  let pool = base[category] || base.general
  if(isPro) pool = pool.concat(pro[category] || [])
  // Mood influence
  if(['😞','😐'].includes(mood)) pool = pool.filter(t => !/entrega|borrador|80%/i.test(t))
  const seed = Array.from((dateStr||'')+mood+category).reduce((a,c)=>a+c.charCodeAt(0),0)
  return PICK(pool, seed)
}
