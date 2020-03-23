document.getElementById("submit-button").addEventListener("click", () => {
    const dataJson = getDataFromAPI()
    dataJson.then(data => {
        data === false ? alert("No results found!") : updateWebsite(data)
    })
})

async function getDataFromAPI(){
    try{
        let usernameField = document.getElementById("username-field")

        const username = usernameField.value.trim()

        const mainDataResponse = await fetch('https://api.github.com/users/'+username)

        const reposResponse = await fetch('https://api.github.com/users/'+username+"/repos")

        if(mainDataResponse.status !== 200 || reposResponse.status !== 200){
            throw "Request resulted 404."
        }

        const mainData = await mainDataResponse.json()
        const reposData = await reposResponse.json();
        
        return {mainData: mainData, reposData: reposData}
    }
    catch(e){
        console.log("Error: " + e)
        return false
    }
    finally{
        console.log("End of API request.")
    }
}

function updateWebsite(data){

    document.getElementsByClassName("primary-data")[0].style.visibility="visible"

    const fullname = document.getElementById("fullname")
    const username = document.getElementById("username")
    const avatar = document.createElement("img")
    const repos = document.getElementById("repos")
    const followers = document.getElementById("followers")
    const reposContainer = document.getElementsByClassName("repos-container")[0]

    document.getElementsByClassName("photo-container")[0].innerHTML=""

    avatar.src=data.mainData.avatar_url
    avatar.style="width: 80%;"

    document.getElementsByClassName("photo-container")[0].appendChild(avatar)

    fullname.innerHTML = "Fullname: " + data.mainData.name
    username.innerHTML = "Username: " + data.mainData.login
    repos.innerHTML = "Repos: " + data.mainData.public_repos
    followers.innerHTML = "Followers: " + data.mainData.follower

    reposContainer.innerHTML="";

    const reposTitle = document.createElement("p")

    if(data.mainData.public_repos == 0){
        reposTitle.innerHTML = "User has 0 repos."
        reposContainer.appendChild(reposTitle)
    }
    else{
        reposTitle.innerHTML = "User repos: "
        reposContainer.appendChild(reposTitle)

        const reposArray = sortAndRetrieveRepos(data.reposData)

        reposArray.forEach(elem => {
            const link = document.createElement("a")
            link.text = elem.name
            link.href = elem.svn_url
            reposContainer.appendChild(link)
        })
    }

}

function sortAndRetrieveRepos(repos){
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