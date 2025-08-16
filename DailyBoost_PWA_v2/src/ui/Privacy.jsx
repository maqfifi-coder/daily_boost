import React from 'react'
import { Link } from 'react-router-dom'

export default function Privacy(){
  return (
    <div className="container">
      <div className="header">
        <div className="title">Privacidad</div>
        <Link to="/" className="btn secondary">Inicio</Link>
      </div>
      <div className="card">
        <p>DailyBoost almacena datos mínimos en tu dispositivo (localStorage): categoría elegida, estado de ánimo diario y si tienes PRO activo. No enviamos datos a servidores.</p>
        <p>Si publicas esta app, deberás actualizar esta política con el dominio, responsable y contacto.</p>
      </div>
    </div>
  )
}
