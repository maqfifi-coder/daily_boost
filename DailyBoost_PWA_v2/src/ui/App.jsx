import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MESSAGES } from '../messages.js'
import { coachSuggest } from '../coach.js'
import { getT } from '../i18n.js'

const CATEGORIES = [
  { key: 'general', label: 'General' },
  { key: 'trabajo', label: 'Trabajo' },
  { key: 'bienestar', label: 'Bienestar' },
]

const todayKey = () => new Date().toISOString().slice(0,10)
const loadState = () => { try { return JSON.parse(localStorage.getItem('db_state') || '{}') } catch { return {} } }
const saveState = (s) => localStorage.setItem('db_state', JSON.stringify(s))

const getDailyMessage = (category, dateStr, isPro) => {
  const base = MESSAGES[category] || MESSAGES.general
  const pro = MESSAGES[category + '_pro'] || []
  const list = isPro ? base.concat(pro) : base
  const seed = Array.from(dateStr + category + (isPro?'pro':''))
    .reduce((acc,c)=>acc+c.charCodeAt(0), 0)
  return list[seed % list.length]
}

export default function App(){
  const nav = useNavigate()
  const [state, setState] = useState(loadState())
  const t = getT(state)
  const dateStr = todayKey()
  const isPro = !!state.isPro

  const category = state.category || 'general'
  const message = useMemo(() => getDailyMessage(category, dateStr, isPro), [category, dateStr, isPro])

  const moods = state.moods || {}
  const todayMood = moods[dateStr] || ''
  const setMood = (m) => {
    const next = { ...state, moods: { ...moods, [dateStr]: m } }
    // update streak if positive
    const positive = ['🙂','😊','😀','😍'].includes(m)
    next.streak = positive ? (state.streak||0) + 1 : 0
    setState(next); saveState(next)
  }

  const stats = useMemo(() => {
    const last7 = Array.from({length:7}).map((_,i) => {
      const d = new Date(); d.setDate(d.getDate()-i)
      const k = d.toISOString().slice(0,10)
      return { date: k, mood: (state.moods||{})[k] || '' }
    }).reverse()
    const positives = last7.filter(x => ['😀','😄','😍','😊','😌','🙂'].includes(x.mood)).length
    return { last7, positives }
  }, [state])

  const coach = useMemo(()=> coachSuggest(category, todayMood, isPro, dateStr), [category, todayMood, isPro, dateStr])

  useEffect(()=>{ saveState(state) }, [state])

  // Apply theme
  useEffect(()=>{
    const root = document.documentElement
    root.classList.remove('light','dark')
    const theme = state.theme || 'auto'
    if (theme === 'light') root.classList.add('light')
    if (theme === 'dark') root.classList.add('dark')
  }, [state.theme])

  return (
    <div className="container">
      <div className="header">
        <div className="title">⚡ {t('appName')}</div>
        <div className="nav">
          <Link to="/" className="active">Home</Link>
          <Link to="/pro">{isPro ? t('manage') : t('improve')}</Link>
          <Link to="/settings">{t('settings')}</Link>
          <Link to="/privacy">{t('privacy')}</Link>
          <Link to="/terms">{t('terms')}</Link>
        </div>
      </div>

      <div className="card">
        <div className="grid cols-2">
          <div>
            <label className="small">{t('category')}</label>
            <select value={category} onChange={e=>{
              const next = { ...state, category: e.target.value }
              setState(next); saveState(next)
            }}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="small">{t('day')}</label>
            <input value={dateStr} disabled />
          </div>
        </div>
        <hr/>
        <h2 style={{marginTop:0}}>{t('todayMsg')}</h2>
        <p style={{fontSize:18}}>{message}</p>
        {!isPro && <div className="small">💡 {t('freeHint')}</div>}
      </div>

      <div className="card" style={{marginTop:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{marginTop:0}}>{t('howFeel')}</h3>
          <div className="badge">{t('streak')}: {state.streak||0}</div>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {['😞','😐','🙂','😊','😀','😍'].map(m => (
            <button key={m} className="btn" onClick={()=>setMood(m)}>{m}</button>
          ))}
        </div>
        <div className="small" style={{marginTop:8}}>{t('savedMood')}: {todayMood || '—'}</div>
        <hr/>
        <h4 style={{marginTop:0}}>{t('coach')}</h4>
        <div className="small">{t('coachTip')}:</div>
        <p style={{fontSize:16, marginTop:6}}>{coach}</p>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <h3 style={{marginTop:0}}>{t('yourWeek')}</h3>
          <div className="small">{t('goal')}: {state.goal||3}</div>
        </div>
        {stats.last7.map(row => (
          <div className="stat" key={row.date}>
            <div className="small">{row.date}</div>
            <div style={{fontSize:18}}>{row.mood || '—'}</div>
          </div>
        ))}
        <hr/>
        <div className="stat">
          <div className="small">{t('positiveDays')}</div>
          <strong>{stats.positives} / 7</strong>
        </div>
        <div className="grid cols-2" style={{marginTop:8}}>
          <input type="number" min="1" max="7" value={state.goal||3}
            onChange={e=>{ const next = { ...state, goal: Number(e.target.value) }; setState(next); saveState(next) }}/>
          <button className="btn secondary" onClick={()=>{
            alert((stats.positives >= (state.goal||3)) ? '🎉 ¡Objetivo semanal cumplido!' : '¡Ánimo! Aún puedes lograrlo.' )
          }}>{t('setGoal')}</button>
        </div>
      </div>
    </div>
  )
}
