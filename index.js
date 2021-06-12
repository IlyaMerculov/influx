
fetch('http://localhost:3000')
    .then((response) => {
        if(response.ok){
            return response.json()
        } 
        
        return Promise.reject(response)
    }).then((data) => {
        console.log(data.msg)
    }).catch((error) => {
        console.log(error)
    })
