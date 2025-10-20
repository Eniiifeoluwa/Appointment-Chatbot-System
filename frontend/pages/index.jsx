import { useState, useEffect } from 'react'
import ChatWidget from '../components/ChatWidget'
import LoginForm from '../components/LoginForm'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Try to fetch current user session (placeholder)
    fetch('http://localhost:4000/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null))
  }, [])

  return (
    <main style={{ maxWidth: 900, margin: '24px auto', padding: 12 }}>
      <h1>Appointment Chatbot</h1>
      {!user ? (
        <LoginForm onLogin={u => setUser(u)} />
      ) : (
        <ChatWidget user={user} />
      )}
    </main>
  )
}
