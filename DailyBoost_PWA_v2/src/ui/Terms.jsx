import React from 'react'
import { Link } from 'react-router-dom'

export default function Terms(){
  return (
    <div className="container">
      <div className="header">
        <div className="title">Términos de uso</div>
        <Link to="/" className="btn secondary">Inicio</Link>
      </div>
      <div className="card">
        <p>Esta app se ofrece "tal cual". No garantizamos disponibilidad continua. El contenido motivacional es informativo y no sustituye asesoramiento profesional.</p>
      </div>
    </div>
  )
}
