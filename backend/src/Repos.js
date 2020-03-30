const axios = require('axios').default

module.exports = {
    async getRepos(req,res){
        try{
            const response = await axios.get('https://api.github.com/users/guerra08/repos')
            return res.json(_sortRepos(response.data))
        }catch(err){
            console.log(err)
        }
    }
}

function _sortRepos(repos){
    try{
        if(!repos){
            throw "No repos from the user."
        }
        repos.sort((a,b) => {
            if(a.created_at < b.created_at){
                return 1
            }
            if(a.created_at > b.created_at){
                return -1
            }
            return 0
        })
        return repos.slice(0,4);
    }
    catch(e){
        console.log("Error: " + e)
        return false
    }
}