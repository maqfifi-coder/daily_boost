import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getT } from '../i18n.js'

const load = () => JSON.parse(localStorage.getItem('db_state')||'{}')
const save = (s) => localStorage.setItem('db_state', JSON.stringify(s))

const askNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission !== 'denied') {
    try {
      const res = await Notification.requestPermission()
      return res
    } catch { return 'denied' }
  }
  return Notification.permission
}

const scheduleReminder = (timeStr) => {
  // Best-effort scheduler while the app is open
  // Store desired time and a next trigger timestamp
  const state = load()
  state.reminderTime = timeStr
  const [h,m] = timeStr.split(':').map(Number)
  const now = new Date()
  const next = new Date()
  next.setHours(h, m, 0, 0)
  if (next <= now) next.setDate(next.getDate()+1)
  state.nextReminderAt = next.toISOString()
  save(state)

  // start a lightweight ticker
  if (!window.__dbTicker) {
    window.__dbTicker = setInterval(()=>{
      const s = load()
      if(!s.nextReminderAt) return
      const t = new Date(s.nextReminderAt)
      const diff = t - new Date()
      if (diff <= 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('DailyBoost', { body: '¡Es hora de tu mensaje diario!' })
        }
        // schedule next day
        const n = new Date(t); n.setDate(n.getDate()+1)
        s.nextReminderAt = n.toISOString()
        save(s)
      }
    }, 30 * 1000) // check every 30s
  }
}

export default function Settings(){
  const [state, setState] = useState(load())
  const t = getT(state)
  const [toast, setToast] = useState('')

  useEffect(()=>{
    // Apply theme
    const root = document.documentElement
    root.classList.remove('light','dark')
    const theme = state.theme || 'auto'
    if (theme === 'light') root.classList.add('light')
    if (theme === 'dark') root.classList.add('dark')
  }, [state.theme])

  const onSave = async () => {
    const next = { ...state }
    setState(next); save(next)
    if (next.reminderTime) {
      const perm = await askNotificationPermission()
      if (perm === 'granted') {
        scheduleReminder(next.reminderTime)
        setToast(t('scheduleOK'))
      } else {
        setToast(t('scheduleFail'))
      }
    } else {
      setToast(t('saved'))
    }
    setTimeout(()=>setToast(''), 2000)
  }

  return (
    <div className="container">
      <div className="header">
        <div className="title">{t('settings')}</div>
        <div className="nav">
          <Link to="/" className="btn secondary">{t('back')}</Link>
        </div>
      </div>

      <div className="card">
        <div className="grid cols-2">
          <div>
            <label className="small">{t('language')}</label>
            <select value={state.lang||'es'} onChange={e=>setState({...state, lang:e.target.value})}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="small">{t('theme')}</label>
            <select value={state.theme||'auto'} onChange={e=>setState({...state, theme:e.target.value})}>
              <option value="auto">{t('theme_auto')}</option>
              <option value="light">{t('theme_light')}</option>
              <option value="dark">{t('theme_dark')}</option>
            </select>
          </div>
        </div>

        <hr/>

        <div className="grid cols-2">
          <div>
            <label className="small">{t('reminderTime')}</label>
            <input type="time" value={state.reminderTime||''}
              onChange={e=>setState({...state, reminderTime:e.target.value})} />
          </div>
          <div>
            <label className="small">{t('allowNotifications')}</label>
            <button className="btn" onClick={async ()=>{
              const res = await askNotificationPermission()
              setToast(res)
              setTimeout(()=>setToast(''), 1500)
            }}>OK</button>
          </div>
        </div>

        <hr/>

        <div className="grid cols-2">
          <div>
            <label className="small">{t('exportData')}</label>
            <button className="btn secondary" onClick={()=>{
              const blob = new Blob([localStorage.getItem('db_state')||'{}'], {type:'application/json'})
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = 'dailyboost-data.json'; a.click()
              URL.revokeObjectURL(url)
            }}>{t('exportData')}</button>
          </div>
          <div>
            <label className="small">{t('importData')}</label>
            <input type="file" accept="application/json" onChange={async (e)=>{
              const file = e.target.files?.[0]; if(!file) return
              const text = await file.text()
              try { const obj = JSON.parse(text); localStorage.setItem('db_state', JSON.stringify(obj)); setState(obj) }
              catch {}
            }} />
            <div className="small">{t('importHint')}</div>
          </div>
        </div>

        <div className={"toast " + (toast?'show':'')}>{toast}</div>
      </div>
    </div>
  )
}
