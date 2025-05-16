const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 9999

http.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('New User Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})