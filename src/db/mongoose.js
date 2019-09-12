const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});


/* task.save().then(()=>{
    console.log(task)
}).catch((error) => {
    console.log(error.message)
})
  */
