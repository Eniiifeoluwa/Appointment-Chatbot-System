import { useState } from 'react'
import axios from 'axios'

export default function ChatWidget({ user }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text) => {
    const msg = { role: 'user', text, createdAt: new Date().toISOString() }
    setMessages(m => [...m, msg])
    setLoading(true)

    try {
      const tokenRes = await fetch('http://localhost:4000/api/chatbot/token', { credentials: 'include' })
      if (!tokenRes.ok) throw new Error('token failed')
      const { token } = await tokenRes.json()

      const res = await axios.post('http://localhost:4000/api/chatbot/message', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setMessages(m => [...m, { role: 'assistant', text: res.data.reply, createdAt: new Date().toISOString() }])
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error: failed to connect', createdAt: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <div style={{ maxHeight: '50vh', overflow: 'auto', marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <b>{m.role}</b>: <span>{m.text}</span><br/>
            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1 }} />
        <button disabled={loading} type="submit">Send</button>
      </form>
    </div>
  )
}
