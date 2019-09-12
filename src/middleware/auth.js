const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
   
    try {

        console.log('Authenticating user..')
        console.log('get header : ' + req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ','')
        console.log('token ' + token)
        const decoded = jwt.verify(token, JWTSECRET)
        console.log('decoded id..' + decoded._id)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        console.log('user..' + user)

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        console.log(token)

        next()

    } catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }

    
}

module.exports = auth