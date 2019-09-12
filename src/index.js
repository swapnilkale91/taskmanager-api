const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const User = require('./models/user')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.port || 3000

const multer = require('multer')
const upload = multer({
    dest: 'images'
})

/* app.use((req, res, next) => {
       res.status(503).send('This site under maintainence')
}) */

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => { 
    console.log('Server is up on port ' + port)
})

 /*
const main = async() => {
    const task = await Task.findById('5d72aff51b065d5208ac4c29')
    await task.populate('owner').execPopulate()
    console.log('task owner' + task.owner) 

    const user = await User.findById('5d72ae9065e9fa211cb74ba9')    
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()*/