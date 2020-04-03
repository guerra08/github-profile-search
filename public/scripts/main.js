const submitButton = document.getElementById("submit-button")
const usernameField = document.getElementById("username-field")
const darkToggle = document.getElementById("dark-toggle")

submitButton.addEventListener("click", () => {
    executeBulk()
})
usernameField.addEventListener("keyup", (e) => {
    (e.keyCode === 13) ? executeBulk() : {}
})
darkToggle.addEventListener("click", () => {
    (darkToggle.value === "L") ? darkOn() : lightOn()
})

function executeBulk(){
    const dataJson = getDataFromAPI()
    dataJson.then(data => {
        data !== false ? updateWebsite(data) : {}
    })
}

function darkOn(){
    darkToggle.value = "D"
    document.body.className = "dark"
}

function lightOn(){
    darkToggle.value = "L"
    document.body.className = ""
}

async function getDataFromAPI(){
    try{

        checkUsername()

        const username = usernameField.value.trim()

        usernameField.value = ''

        const mainDataResponse = await fetch(`https://api.github.com/users/${username}`, {
            mode: 'cors'
        })

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
            mode: 'cors'
        })

        if(mainDataResponse.status !== 200 || reposResponse.status !== 200){
            alert("No results found!")
            throw "Error while processing request."
        }

        const mainData = await mainDataResponse.json()
        const reposData = await reposResponse.json();
        
        return {mainData: mainData, reposData: reposData}
    }
    catch(e){
        console.log(`Error: ${e}`)
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

    document.getElementsByClassName("photo-container")[0].innerHTML = ''

    avatar.src=data.mainData.avatar_url
    avatar.style="width: 65%; border: 5px solid #021a40;"

    document.getElementsByClassName("photo-container")[0].appendChild(avatar)

    fullname.innerHTML = `Fullname: ${data.mainData.name}`
    username.innerHTML = `Username: ${data.mainData.login}`
    repos.innerHTML = `Repos: ${data.mainData.public_repos}`
    followers.innerHTML = `Followers: ${data.mainData.followers}`

    reposContainer.innerHTML= '';

    const reposTitle = document.createElement("p")

    if(data.mainData.public_repos == 0){
        reposTitle.innerHTML = 'User has 0 public repos.'
        reposContainer.appendChild(reposTitle)
    }
    else{
        reposTitle.innerHTML = 'User repos: '
        reposContainer.appendChild(reposTitle)

        const reposArray = sortAndRetrieveRepos(data.reposData)

        reposArray.forEach(elem => {
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
        console.log(`Error: ${e}`)
        return false
    }
}

function checkUsername(){
    if(usernameField.value === ''){
        alert("Empty username!")
        throw "Empty username!"
    }    
}