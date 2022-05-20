const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

const limiter = rateLimit({
    windowMS: 10 * 60 * 1000, //10 minutes
    max: 90
})

app.use(limiter)
app.set('trust proxy', 1)

// Parse request body as JSON
app.use(express.json())

// Routes
app.use('/openai', require('./routes/openai.js'))

// Enable cors
app.use(cors())

app.get('/', async (req, res) => {
    res.status(200).json("Service is running")
})

app.listen(PORT, () => console.log('Server running on port ' + PORT))