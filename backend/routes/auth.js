const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// NOTE: This is a minimal placeholder. Replace with real DB calls.

const fakeUser = { id: 1, email: 'alice@example.com', name: 'Alice', passwordHash: '$2b$10$abcdefghijklmnopqrstuv' }

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  // In real app, fetch user from DB and compare bcrypt
  // This placeholder accepts any password.
  const token = jwt.sign({ sub: fakeUser.id, email: fakeUser.email }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' })
  res.cookie('session', token, { httpOnly: true })
  res.json({ user: { id: fakeUser.id, email: fakeUser.email, name: fakeUser.name } })
})

router.get('/me', (req, res) => {
  // For simplicity, read token from cookie (not robust). In production validate properly.
  res.json({ user: null })
})

module.exports = router
