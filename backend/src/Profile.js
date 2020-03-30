const axios = require('axios').default

module.exports = {
    async getProfile(req,res){
        try{
            const response = await axios.get('https://api.github.com/users/guerra08')
            return res.json(response.data)
        }catch(err){
            console.log(err)
        }
    }
}