const CusOrders = [];
const Movies = [];

const movie_url = "http://localhost:5228/api/Movie/Movie";
const confrim_url = "http://localhost:5228/api/RentedItems/RentedItem";

async function fetchData() {
    const movieResponse = await fetch(movie_url);
    const movieArray = await movieResponse.json();
    Movies.push(...movieArray);
    console.log("Movies: ", Movies);

    const confirmResponse = await fetch(confrim_url);
    const confirmArray = await confirmResponse.json();
    CusOrders.push(...confirmArray);
    console.log("Customer Orders: ", CusOrders);

    OrderItemView();
}

fetchData();

ReturnNotify();
function ReturnNotify() {
    CusOrders.forEach(n => {
        const retDate = new Date(n.ReturnDate.replace(/\//g, '-'));
        const noeDate = new Date();
        if (retDate > noeDate) {
            alert(n.UserId + "This user did not Return their dvd")
        }
    })
    setTimeout(ReturnNotify, 60000);
}

function OrderItemView() {
    for (let i = 0; i < CusOrders.length; i++) {
        const element = CusOrders[i];

        if (element.status == 'Accepted') {
            const movie = Movies.find(x => x.id == element.movieId)
            console.log(movie)
            let tr = document.createElement('tr')
            tr.className = "tr"
            tr.innerHTML = ` <td>${element.userId}</td>
                        <td>${element.id}</td>
                        <td>${movie.name}</td>
                        <td>${element.rentQuantity}</td>
                        <td>${element.rentedDate}</td>
                        <td>${element.returnDate}</td>
                        <td><button class="Delete-btn btn" value="${element.id}" onclick="ReturnDvd(event)">🔄</button></td>`
            document.getElementById('Movie-table').appendChild(tr)
        }
    }
}

async function ReturnDvd(event) {
    let Id = event.target.value
    let Rmovie = CusOrders.find(mov => mov.id == Id)
    console.log(Rmovie)
    let movie = Movies.find(mov => mov.id == Rmovie.movieId)
    console.log(movie)

    alert(movie.Name)
    movie.quantity = parseInt(Rmovie.RentQuantity) + parseInt(movie.Quantity)

    if (movie) {
        await fetch(`${movie_url}/${movie.id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(movie)
        })
    }
    await fetch(`${confrim_url}/?id=${Id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }
    })

    alert('Return Sucessfully..........')

    setTimeout(() => {
        window.location.reload()
    }, 900);
}