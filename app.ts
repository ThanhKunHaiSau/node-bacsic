import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello Worleeed')
})

app.listen(3000)