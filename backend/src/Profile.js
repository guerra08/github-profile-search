const axios = require('axios').default

module.exports = {
    async getProfile(req,res){
        try{
            const username = req.query.username
            const response = await axios.get(`https://api.github.com/users/${username}`)
            return res.json(response.data)
        }
        catch(err){
            res.sendStatus(err.response.status)
        }
    }
}