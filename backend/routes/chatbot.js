const express = require('express')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const router = express.Router()

router.get('/token', (req, res) => {
  // In production, validate user session before issuing token
  const user = { id: 1, name: 'local-user' }
  const token = jwt.sign({ sub: user.id, name: user.name }, process.env.CHATBOT_TOKEN_SECRET || 'chat-secret', { expiresIn: '2m' })
  res.json({ token })
})

router.post('/message', async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: 'text is required' })
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' })
    const token = auth.split(' ')[1]
    try { jwt.verify(token, process.env.CHATBOT_TOKEN_SECRET || 'chat-secret') } catch (err) { return res.status(401).json({ error: 'invalid token' }) }
    const pyUrl = process.env.PY_MS_URL || 'http://localhost:5000/api/respond'
    const pyRes = await axios.post(pyUrl, { text, userId: req.body.userId || null }, { timeout: 20000 })
    return res.json({ reply: pyRes.data.reply, meta: pyRes.data.meta || null })
  } catch (err) {
    console.error(err?.toString?.() || err)
    return res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
