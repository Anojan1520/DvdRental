let Customer_url = "http://localhost:5228/api/Users/User"


const Users = [];
fetch(Customer_url, {
    method: 'GET',
    headers: {
        'Content-type': 'application/json'
    }
}).then(cus => cus.json())
    .then(cus => {
        Users.push(...cus)
    })
    console.log(Users)


document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    let position = document.getElementById('select').value.trim()
    let firstname = document.getElementById('firstname').value.trim()
    let username = document.getElementById('Username').value.trim()
    let password = document.getElementById('Password').value.trim()
    let nic = document.getElementById('Nic').value.trim()
    let phone = document.getElementById('Phone').value.trim()
    let email = document.getElementById('email').value.trim()



    let username_check = Users.find(check => check.username == username)
    if (username_check == null) {
        let userData = {
            position: position,
            firstname: firstname,
            username: username,
            password: password,
            nic: nic,
            phone: phone,
            email: email
        };
        fetch(Customer_url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        document.getElementById('message').textContent = "Registration SuccessFull."
        setInterval(() => {
            window.location.href = "./Signin.html"
        },900);
      
    }
    else {
        document.getElementById('message').textContent = "Your user name already exist.."

    }

})