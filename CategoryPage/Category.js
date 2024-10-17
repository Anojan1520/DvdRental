const SearchParam = new URLSearchParams(window.location.search)
const UserId = SearchParam.get('loginId')

const homeLink = document.getElementById('homeLink');
if (UserId) {
    homeLink.href = `../HomePage/Home.html?loginId=${UserId}`;
}
const CategoryLink = document.getElementById("CategoryLink")
if (UserId) {
    CategoryLink.href = `../CategoryPage/Category.html?loginId=${UserId}`
}

const movies = [];
let RentedItems = []
const Notify = [];
const User = [];
const LoginUsers = [];

let commonurl = "http://localhost:5228/Resources/";
let Movie_Url = "http://localhost:5228/api/Movie/Movie";
let Rented_Url = "http://localhost:5228/api/RentedItems/RentedItem";
let Notify_Url = "http://localhost:5228/api/Notification/Notification";
let User_Url = "http://localhost:5228/api/Users/User"
let LoginUser_Url = "http://localhost:5228/api/Login/User"

document.addEventListener("DOMContentLoaded", function () {
    fetchData();
});

async function fetchData() {

    await fetch(User_Url)
        .then(response => response.json())
        .then(array => {
            User.push(...array)


        })
    await fetch(Movie_Url)
        .then(response => response.json())
        .then(array => {
            movies.push(...array);
            Movie_View();
            nav_func();
        })

    await fetch(Rented_Url)
        .then(response => response.json())
        .then(array => {
            RentedItems.push(...array)
            CartcountBasket()
            console.log("RentedItem" + RentedItems)
        })

    await fetch(Notify_Url)
        .then(response => response.json())
        .then(array => {
            Notify.push(...array);
            console.log(Notify)
        })

    await fetch(LoginUser_Url)
        .then(response => response.json())
        .then(array => {
            LoginUsers.push(...array)
            console.log("Login" + LoginUsers)
        })
}
console.log(RentedItems)
console.log(User)

function CartcountBasket() {
    let Count = 0
    for (let i = 0; i < RentedItems.length; i++) {
        const element = RentedItems[i];
        if (element.status == "Pending") {
            Count++
        }
    }
    document.getElementById("rentCount").textContent = Count
}

async function logout() {
    let User_details = User.find(x => x.id == UserId)
    let Temb_User = LoginUsers.find(x => x.username == User_details.username)
    await fetch(`${LoginUser_Url}/?id=${Temb_User.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const url = new URL(window.location.href);
    url.searchParams.delete('loginId');
    window.history.replaceState({}, '', url);
    window.location.reload()
}

async function nav_func() {
    if (UserId != null) {
        document.getElementById("login").style.display = "none"
        document.getElementById("signin").style.display = "none"
        document.getElementById("Profile").style.display = "block"
        document.getElementById("logout").style.display = "block"
        document.getElementById("Notification").style.display = "block"

        let rentBtn = document.querySelectorAll(".rent-btnLog")
        for (let r = 0; r < rentBtn.length; r++) {
            const element = rentBtn[r];
            element.style.display = "block"
        }
    }
    else {
        document.getElementById("login").style.display = "block"
        document.getElementById("signin").style.display = "block"
        document.getElementById("Profile").style.display = "none"
        document.getElementById("logout").style.display = "none"
        document.getElementById("Notification").style.display = "none"

        let rentBtn = document.querySelectorAll(".rent-btnLog")
        for (let r = 0; r < rentBtn.length; r++) {
            const element = rentBtn[r];
            element.style.display = "none"
        }
    }
}

async function Profile() {
    
    document.querySelector(".pop-cover").style.display = "block"
    let Users = User.find(user => user.id == UserId)
    var TembArray = Users
    console.log(TembArray)
    document.getElementById("firstname").value = TembArray.firstname
    document.getElementById("Nic").value = TembArray.nic
    document.getElementById("Phone").value = TembArray.phone
    document.getElementById("email").value = TembArray.email
    document.getElementById("Position").value = TembArray.position

    document.getElementById("form").addEventListener('submit', function (event) {
        event.preventDefault()
        var firstname = document.getElementById("firstname").value.trim()
        var phone = document.getElementById("Phone").value.trim()
        var email = document.getElementById("email").value.trim()

        TembArray.firstname = firstname
        TembArray.phone = phone
        TembArray.email = email
        fetch(`${User_Url}/?id=${UserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(TembArray)
        })
        document.querySelector(".pop-cover").style.display = "none"
       
        setTimeout(() => {
             window.location.reload()
        }, 900);

    })
}
console.log(movies)

function Movie_View() {
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].quantity > 0) {
            var div = document.createElement('div')
            div.className = "movie-card"
            div.innerHTML = `<img src="${commonurl}${movies[i].images[0]}" alt="movie">
                            <figcaption>${movies[i].name}</figcaption>
                            <h4 class="act">${movies[i].actor}</h4>
                            <h4 class="gen">${movies[i].genere}</h4>
                            <div>
                                 <h4 class="price">Price:</h4>
                                 <p>${movies[i].price}Rs</p>
                            </div>
                            <button value="${movies[i].id}" onclick="rentPopup(event)" class="rent-btnLog">Rent Now</button> `
            let movieDiv = document.querySelector('.all-movie-card')
            movieDiv.appendChild(div)
        }
    }

    loginCheck()
    const uniqueActors = new Set();
    const uniqueMovies = new Set();

    movies.forEach(movie => {
        uniqueActors.add(movie.actor);
    });
    movies.forEach(movie => {
        uniqueMovies.add(movie.genere);
    });

    uniqueMovies.forEach(movie => {
        let Option = document.createElement('option')
        Option.value = movie
        Option.textContent = movie
        document.getElementById('genere-select').appendChild(Option)
    })
    uniqueActors.forEach(actor => {
        let Option = document.createElement('option')
        Option.value = actor
        Option.textContent = actor
        document.getElementById('actor-select').appendChild(Option)
    })
}

function loginCheck() {
    if (UserId == null) {
        let cards = document.querySelectorAll(".movie-card")
        cards.forEach(x => {
            x.addEventListener('click', () => {
                window.location.href = "../Registration/Signin.html"
            })
        })
    }
}

function cancelProfile() {
    document.querySelector(".pop-cover").style.display = "none"
}

function OrderHistoryView() {
    for (let i = 0; i < Notify.length; i++) {
        const element = Notify[i];

        if (element.userId == UserId) {
            let check = movies.find(mov => mov.id == element.movieId);
            let checkDate = "Order"
            let status = "Rejected"
            if (element.status == 'true') {
                status = "Accepted"
                checkDate = "Return Date"

            } else if (element.status == 'false') {
                status = "Pending"
                checkDate = "Request Date"
            }
            let tot = parseInt(element.rentedQuantity) * parseInt(check.price)
            let div = document.createElement('div')
            div.className = "rented-card"
            div.innerHTML = `
                        <div class="rented-image">
                            <img src="${commonurl}${check.images[0]}" alt="" id="image-rent">
                        </div>
                        <div class="rented-content ">
                            <div class="rent-inline">
                                <P class="key">Name:</P>
                                <P class="val">${check.name}</P>
                            </div>
                            <div class="rent-inline">
                                <P class="key">Price:</P>
                                <P class="val">${check.price}</P>
                                <div class="rent-inline">
                                    <P class="key">Total:</P>
                                    <P class="val">${tot}</P>
                                </div>
                            </div>
                            <div class="rent-inline">
                                <P class="key">Quantity:</P>
                                <P class="val">${element.rentedQuantity}</P>
                            </div>
                            <div class="rent-inline">
                                <P class="key">Status:</P>
                                <P class="val">${status}</P>
                            </div>
                              <div class="rent-inline">
                                <P class="key">${checkDate}:</P>
                                <P class="val">${element.requestDate}</P>
                            </div>
                            <div class="rent-btn">
                            <button value="${element.id}" onclick="NotifyDelete(event)">Clear</button>
                        </div>
                            
                        </div>`
            document.getElementById("notify-i").appendChild(div)
        }
    }
}

function Search() {
    var enterText = document.getElementById('search').value.toUpperCase()
    console.log(enterText)
    var all_movie = document.querySelector(".all-movie-card")
    var Movies = all_movie.querySelectorAll('.movie-card')

    for (let i = 0; i < Movies.length; i++) {
        var movies = Movies[i]
        console.log(movies)

        var movie_name = movies.querySelector('figcaption').textContent.toUpperCase()
        if (movie_name.indexOf(enterText) < 0) {
            movies.style.display = "none"
        }
        else {
            movies.style.display = "block"
        }

    }

}

function select() {
    let selected_data = document.getElementById("genere-select").value.toUpperCase()
    console.log(selected_data)
    var allMovie = document.querySelector(".all-movie-card")
    var Movies = allMovie.querySelectorAll(".movie-card")
    for (let i = 0; i < Movies.length; i++) {
        var data = Movies[i]
        var genere = data.querySelector('.gen').textContent.toUpperCase()
        if (selected_data == "ALLMOVIES") {
            data.style.display = "block"
        } else {
            if (selected_data != genere) {
                data.style.display = "none"
            } else {
                data.style.display = "block"
            }
        }
    }
}

// function Dselect(){
//     let director_data = document.getElementById("director-select").value.toUpperCase()
//     var allMovie = document.querySelector(".all-movie-card")
//     var Movies = allMovie.querySelectorAll(".movie-card")
//     for (let i = 0; i < Movies.length; i++) {
//         var data = Movies[i]
//         var director = data.querySelector('.dir').textContent.toUpperCase()
//         if (director_data == "AllDIRECTOR") {
//             data.style.display = "block"
//         } else {
//             if (director_data != director) {
//                 data.style.display = "none"
//             } else {
//                 data.style.display = "block"
//             }
//         }
//     }
// }

function Aselect() {
    let actor_data = document.getElementById("actor-select").value.toUpperCase().trim()
    var allMovie = document.querySelector(".all-movie-card")
    var Movies = allMovie.querySelectorAll(".movie-card")

    for (let i = 0; i < Movies.length; i++) {
        var data = Movies[i]
        var actor = data.querySelector('.act').textContent.toUpperCase().trim()
        if (actor_data == "ALLACTOR") {
            data.style.display = "block"
        } else {
            if (actor_data != actor) {
                data.style.display = "none"
            } else {
                data.style.display = "block"
            }
        }
    }
}

function rentPopup(event) {
    document.getElementById("rent-pop").style.display = "block"
    let btnVal = event.target.value
    let mov = movies.find(mov => mov.id == btnVal)
    let rentDetails = mov
    document.getElementById("no").innerHTML = `No:${btnVal}`
    document.getElementById("movie-rent").src = `${commonurl}${rentDetails.images[0]}  `
    document.getElementById("movie-name").textContent = rentDetails.name
    document.getElementById("movie-genre").textContent = rentDetails.genere
    document.getElementById("rent-director").textContent = rentDetails.director
    document.getElementById("Rent-actor").textContent = rentDetails.actor
    document.getElementById("rent-relesedate").textContent = rentDetails.release
    document.getElementById("rent-Quantity").textContent = rentDetails.quantity
    document.getElementById("AddCart").value = btnVal
}

function CancelPop() {
    document.getElementById("rent-pop").style.display = "none"
}

async function CartRent(event) {
    event.preventDefault()
    console.log(event)
    let btnVal = event.target.value
    var data = RentedItems.findIndex(x => x.id == btnVal)
    RentedItems.splice(data, 1)
    await fetch(`${Rented_Url}/?id=${btnVal}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log(res);
    event.target.parentNode.parentNode.parentNode.remove()
    Calulate(event)
}

async function AddCart(event) {
    let btn = event.target.value
    let already = RentedItems.find(mov => mov.movieId == btn && mov.status == "Pending")
    let check = movies.find(movie => movie.id == btn)
    if (already == null) {
        let movieCheck = { movieId: check.id, userId: UserId, status: 'Pending', rentQuantity: 1, rentedDate: '', returnDate: '' }
        console.log(movieCheck)
        console.log('Sending:', JSON.stringify(movieCheck));

        fetch(Rented_Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieCheck)
        })
        alert("work")
        RentedItems.push(movieCheck)
        CartcountBasket()
        document.getElementById("rent-pop").style.display = "none"
        // window.location.reload()
    }
    else {
        document.getElementById("rent-pop").style.display = "none"
        alert("This item already in the cart")
    }
}

function Calulate(event) {
    let quant = event.target.value
    let parent = event.target.parentNode.parentNode
    let price = parent.querySelector(".quant").textContent
    let total = price * quant
    parent.querySelector(".tot").textContent = total + ".00"
    totalPrice()
}

function totalPrice() {
    let parent = document.getElementById("all-cards")
    let array = parent.querySelectorAll(".tot")
    let total = 0
    for (let i = 0; i < array.length; i++) {
        let element = array[i].textContent;
        let changenum = parseInt(element)
        total = total + changenum
    }

    document.getElementById("priceQuant").textContent = total
    let totCount=0;
    for (let i = 0; i < RentedItems.length; i++) {
        
        totCount++
    }
    document.getElementById("movieTot").textContent = totCount
}

async function Rmovieload() {
    RentedItems = []
    await fetch(Rented_Url)
        .then(response => response.json())
        .then(array => {
            RentedItems.push(...array)
            RentedItemLoad()
        })
}

function RentedItemLoad() {
    for (let i = 0; i < RentedItems.length; i++) {
        let Rentmovies = RentedItems[i];
        if (Rentmovies.status == 'Pending') {
            let movie = movies.find(mov => mov.id == Rentmovies.movieId)
            let movieQuant = movie.quantity
            if (movie != null) {
                let div = document.createElement('div')
                div.className = "rented-card"
                div.innerHTML = ` <div class="rented-image">
                                <img src="${commonurl}${movie.images[0]}" alt="" id="image-rent">
                            </div>
                            <div class="rented-content ">
                                <div class="rent-inline">
                                    <P class="key">Name:</P>
                                    <P class="val">${movie.name}</P>
                                </div>
                                <div class="rent-inline">
                                    <P class="key">Price:</P>
                                    <P class="val quant">${movie.price}</P>
                                    <div class="rent-inline">
                                    <P class="key">Total:</P>
                                    <P class="val tot">${movie.price}</P>
                                     </div>
                                </div>
                              
                                <div class="rent-inline">
                                    <P class="key">Quantity:</P>
                                    <input type="number" min="1" max="${movieQuant}" value="1" id="${movie.id}" onclick="Calulate(event)">
                                </div>
                                <div class="rent-btn">
                                    <button value="${Rentmovies.id}" onclick="CartRent(event)" type="button" >Cancel</button>
                                </div>
                            </div>`
                document.getElementById("all-cards").appendChild(div)
            }
        }
    }

    let parent = document.getElementById("all-cards")
    let array = parent.querySelectorAll(".tot")
    let total = 0
    for (let i = 0; i < array.length; i++) {
        let element = array[i].textContent;
        let changenum = parseInt(element)
        total = total + changenum
    }

    document.getElementById("priceQuant").textContent = total
    document.getElementById("movieTot").textContent = RentedItems.length
}

function rentMoviePop() {
    document.getElementById("rentedItem-pop").style.left = "0%"
    Rmovieload()
    document.getElementById("cart-id").style.display = "none"
    totalPrice()
}

function CancelrentMoviePop() {
    document.getElementById("rentedItem-pop").style.left = "200%"
    document.getElementById("cart-id").style.display = "block"
    window.location.reload()
}

console.log("Fucajsdncjdn02" + RentedItems[0]);

async function COrders() {
    for (let i = 0; i < RentedItems.length; i++) {
        const element = RentedItems[i];
          console.log(element)
      
        if (element.status.toUpperCase() == "PENDING") {
            console.log('movieId:', element.id);
            console.log('UserId:', UserId);
            let date = new Date().getDate()
            let year = new Date().getFullYear()
            let Month = new Date().getMonth() + 1
            let fulldate = `${year}/${Month}/${date}`
           
            if (element) {
                alert("inloop")
                let quant = document.getElementById(element.movieId).value
                alert(quant)
                let movie = movies.find(mov => mov.id == element.movieId)
                let Notification = { RentedId: element.id, rentedQuantity: quant, movieId: element.movieId, UserId: UserId, RequestDate: fulldate, Status: 'false' }
                // let Rent = RentedItems.find(x => x.id === element.id)
                // console.log("rented")
                // console.log(Notification)    
                // console.log('rent'+Rent) 
                await fetch(Notify_Url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Notification)
                })

                ////////////////////////////////// to reduce the quantity of the movie
                let movieQuant = movie.quantity - quant
                movie.quantity = movieQuant;
                movie.images=[];
                console.log(movie);
                await fetch(`${Movie_Url}/${movie.id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(movie)
                })

                element.RentQuantity = quant
                element.RentedDate = fulldate
                element.status = 'Request'
                console.log(`${Rented_Url}/${element.id}`)

                    await fetch(`${Rented_Url}/?id=${element.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(element)
                    });

                // await fetch(`${Rented_Url}/${element.id}`, {
                //     method: 'DELETE',
                //     headers: {
                //         'content-type': 'application/json'
                //     }
                // })
            }
        }
    }
    setTimeout(() => {
        window.location.reload();
    }, 900);
}

function OrderHistory() {
    OrderHistoryView();
    document.getElementById("rentNotification").style.display = "block"
    document.getElementById("rentNotification").style.top = "2%"
}

async function NotifyDelete(event) {
    let btnVal = event.target.value
    fetch(`${Notify_Url}/?id=${btnVal}`, {  
        method: 'DELETE',       
        headers: {
            'Content-Type': 'application/json'
        },
    })
    console.log(btnVal)
    event.target.parentNode.parentNode.parentNode.remove()
  }

function CancelHistory() {
    document.getElementById("rentNotification").style.display = "none"
    document.getElementById("rentNotification").style.top = "-102%"
    window.location.reload()
}

