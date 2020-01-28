import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'

// define port for the express app
const port = process.env.PORT || 3000

// create express app
const app = express()

app.use(logger('common'))

app.use(bodyParser.raw({ type: 'application/octet-stream' }))

const __dirname = path.resolve(path.dirname(''))
const DIST_DIR = path.join(__dirname, 'build')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

// handle all static file requests
app.use(express.static(DIST_DIR))

app.post('/predict', (req, res) => {
  console.log('Got a predict request')
  console.log("body:", req.body)
  res.send('version 1')
})

app.get('*', (req, res) => {
  console.log('req', req)
  res.sendFile(HTML_FILE)
})

app.listen(port, () => {
  console.log('App listening on port: ' + port);
})