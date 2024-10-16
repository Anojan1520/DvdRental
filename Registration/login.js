const Users = [];
const Login_User = [];
let User_Url = "http://localhost:5228/api/Users/User"
let Login_Url = "http://localhost:5228/api/Login/User"
fetch(User_Url)
    .then(Response => Response.json())
    .then(User => {
        Users.push(...User)
    })

console.log(Users)

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();


    let username = document.getElementById('Username').value.trim()
    let password = document.getElementById('Password').value.trim()

    let detail_check = Users.find(opt => opt.username == username && opt.password == password);
    if (detail_check != null) {
        if (detail_check.position == "user") {
            let temb_login = { username: username, password: password }

            fetch(Login_Url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(temb_login)
            })
           setTimeout(() => {
            window.location.href = `../HomePage/Home.html?loginId=${detail_check.id}`
           }, 900);
        }
        else {
            setTimeout(() => {
            window.location.href = "../Manager/manager.html"
                
            }, 900);

        }
    }
    else {
        document.getElementById('message').textContent = "Your username or password invalid"

    }


})