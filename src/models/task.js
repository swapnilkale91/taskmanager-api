const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({ 
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
},  {
    timestamps: true
})

taskSchema.pre('save', function(next) {
    const task = this

    console.log('before saving !')
    next()
    
})

const Task = mongoose.model('tasks', taskSchema)

module.exports = Task
