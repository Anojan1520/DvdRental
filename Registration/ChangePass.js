const Users = []
const CheckUsers = JSON.parse(sessionStorage.getItem('OTP'))
console.log(Users)

fetch("http://localhost:5228/api/Users/User")
.then(data => data.json())
.then(data => {
    Users.push(...data)
})
console.log(Users)
console.log(CheckUsers)

alert("out work")


document.getElementById("form").addEventListener('submit', function (event) {
    event.preventDefault();

    let pass = document.getElementById('password').value.trim()
    let repass = document.getElementById('Repassword').value.trim()

    if (pass == repass) {
        let ChangePass = Users.find(user => user.username == CheckUsers.User)
        console.log(ChangePass)
        ChangePass.password = pass
        console.log(ChangePass)
        fetch(`http://localhost:5228/api/Users/User/?id=${ChangePass.id}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(ChangePass)
        })
       setTimeout(() => {
        // window.location.href="./Signin.html"
       }, 900);

    }
    else{
        document.getElementById('message').textContent="Yourpassword not matched"
    }

})