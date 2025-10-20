require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('./middleware/rateLimiter')
const authRoutes = require('./routes/auth')
const chatbotRoutes = require('./routes/chatbot')

const app = express()
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(morgan('combined'))
app.use(rateLimit)

app.use('/api/auth', authRoutes)
app.use('/api/chatbot', chatbotRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Backend running on', PORT))
