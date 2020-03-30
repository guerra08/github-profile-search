const express = require('express')
const routes = require('./routes')
const cors = require('cors')

const app = express()

app.use(routes)
app.use(cors())

app.listen(3333)