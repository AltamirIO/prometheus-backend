import express from 'express'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import { createServer } from 'http'

import CMSAuth from  './githubCMSAuth'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({silent: true})
}

const port = process.env.PORT || 3000

const app = express()

app.use(compression())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

CMSAuth(app)

// Server any static files
// app.use(express.static('public'))

const server = createServer(app);

server.listen(port, () => {
  console.log(`API Server is now running on port ${port}`);
})
