const User = require('../models/user')
const auth = require('../middleware/auth')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()


router.get('/users', auth, async (req,res) => {
 
    try {
        const users = await User.find({})
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send(users)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()   
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})


router.post('/users/logout', auth, async (req, res) => {

    try {

        console.log('logout')
        console.log('req : ' + req.token)
        
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates !'})
    }

    const user = new User(req.body)

    try {
        const savedUser = await user.save()

        const token = await savedUser.generateAuthToken()
        
        if(!savedUser){
            return res.status(404).send()
        }
        res.status(201).send({savedUser, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.patch('/users/me', auth, async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'email', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates !'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }

})

router.delete('/users/me', auth, async(req, res) => {

    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
    
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
            return cb(new Error('Please upload an image file'))
         } 

         cb(undefined, true)
    } 
})

router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})
 

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()  
})

module.exports = router