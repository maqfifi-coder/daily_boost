import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getT } from '../i18n.js'

export default function Paywall() {
  const nav = useNavigate()
  const state = JSON.parse(localStorage.getItem('db_state')||'{}')
  const t = getT(state)
  const [loading, setLoading] = useState(false)

  const activateProMock = () => {
    const state = JSON.parse(localStorage.getItem('db_state')||'{}')
    localStorage.setItem('db_state', JSON.stringify({ ...state, isPro: true }))
    nav('/')
  }

  const goToStripe = async () => {
    setLoading(true)
    const testCheckout = 'https://example.com/checkout' // reemplaza por tu enlace Stripe
    window.location.href = testCheckout
  }

  return (
    <div className="container">
      <div className="header">
        <div className="title">{t('planPRO')}</div>
        <Link to="/" className="btn secondary">{t('back')}</Link>
      </div>
      <div className="card">
        <h2 style={{marginTop:0}}>{t('unlockPRO')}</h2>
        <ul>
          { (['features'] in t) ? null : null }
          <li>Mensajes extra por categoría</li>
          <li>Recordatorio diario configurable</li>
          <li>Soporte prioritario</li>
          <li>Coach con micro-acciones</li>
        </ul>
        <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
          <button className="btn" onClick={goToStripe} disabled={loading}>
            {loading ? 'Abriendo pago…' : t('subscribe')}
          </button>
          <button className="btn secondary" onClick={activateProMock}>
            {t('activateDemo')}
          </button>
        </div>
        <p className="small" style={{marginTop:12}}>
          Demo local sin pagos reales.
        </p>
      </div>
    </div>
  )
}
