import { useState } from 'react'
export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('alice@example.com')
  const [password, setPassword] = useState('password')
  const [err, setErr] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setErr(null)
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'login failed')
      onLogin(data.user)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <div>
        <label>Email</label><br/>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
    </form>
  )
}
