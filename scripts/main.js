document.getElementById("submit-button").addEventListener("click", () => {
    const dataJson = getDataFromAPI()
    dataJson.then(data => {
        updateWebsite(data)
    })
})

async function getDataFromAPI(){
    try{
        let usernameField = document.getElementById("username-field")

        const username = usernameField.value.trim()

        const response = await fetch('https://api.github.com/users/'+username)

        if(response.status !== 200){
            throw "Request resulted 404."
        }

        const data = await response.json()
        
        return data
    }
    catch(e){
        console.log("Error: " + e)
    }
    finally{
        console.log("End of API request.")
    }
}

function updateWebsite(data){
    console.log(data);
    document.getElementsByClassName("primary-data")[0].style.visibility="visible"
    let fullname = document.getElementById("fullname")
    let username = document.getElementById("username")
    fullname.innerHTML = fullname.innerHTML + data.name
    username.innerHTML = username.innerHTML + data.login
}