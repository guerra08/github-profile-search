document.getElementById("submit-button").addEventListener("click", () => {
    const dataJson = getDataFromAPI()
    dataJson.then(data => {
        data !== false ? updateWebsite(data) : {}
    })
})

async function getDataFromAPI(){
    try{
        let usernameField = document.getElementById("username-field")
        const username = usernameField.value.trim()
        usernameField.value = ''

        if(username == ""){
            alert("Empty username!")
            throw "Empty username!"
        }

        const mainDataResponse = await fetch(`http://localhost:3333/profile?username=${username}`, 
            {
                method: 'GET'
            }
        )

        const reposResponse = await fetch(`http://localhost:3333/repos?username=${username}`, 
            {
                method: 'GET'
            }
        )

        if(mainDataResponse.status !== 200 || reposResponse.status !== 200){
            alert("No results found!")
            return false;
        }
        
        return {mainData: await mainDataResponse.json(), reposData: await reposResponse.json()}
    }
    catch(e){
        console.log("Error: " + e)
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
    avatar.style="width: 65%; border: 5px solid #021a40;"

    document.getElementsByClassName("photo-container")[0].appendChild(avatar)

    fullname.innerHTML = "Fullname: " + data.mainData.name
    username.innerHTML = "Username: " + data.mainData.login
    repos.innerHTML = "Repos: " + data.mainData.public_repos
    followers.innerHTML = "Followers: " + data.mainData.followers

    reposContainer.innerHTML="";

    const reposTitle = document.createElement("p")

    if(data.mainData.public_repos == 0){
        reposTitle.innerHTML = "User has 0 repos."
        reposContainer.appendChild(reposTitle)
    }
    else{
        reposTitle.innerHTML = "User repos: "
        reposContainer.appendChild(reposTitle)

        data.reposData.forEach(elem => {
            const label = document.createElement("label")
            const link = document.createElement("a")
            label.textContent = elem.description
            link.text = elem.name
            link.href = elem.svn_url
            reposContainer.appendChild(link)
            reposContainer.appendChild(label)
        })
    }

}