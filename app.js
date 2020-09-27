const express = require('express')
const app = express()
const port = 3001
const authRouter = require("./src/routers/user/auth");
app.use(express.json())
// const accountRouter = require("./src/routers/user/account");
// const taskRouter = require("./src/routers/tasks")

app.use(authRouter);
// app.use(accountRouter);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })