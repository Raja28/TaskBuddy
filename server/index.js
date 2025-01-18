const express = require('express')
const { connect } = require('./config/dbConnection')
const app = express()
PORT = process.env.PORT
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
PORT = process.env.PORT || 5000

connect()

const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")

app.get("/", (req, res) => {
    res.send(`<h1>Task buddy server running on port: ${PORT}</h1>`)
})

app.use("/auth/", authRouter)
app.use("/user/", userRouter)

app.listen(PORT, () => {
    console.log(`Task buddy server running on port:`, PORT);
})