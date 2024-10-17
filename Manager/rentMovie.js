const RentedItems = [];
const movies = [];
const ConfirmOrders = [];
const Notify = []
const Customer = []

// const Status=Json.Parse(localStorage.getItem("status"))||[];
Rented_Url = "http://localhost:5228/api/RentedItems/RentedItem";
movie_Url = "http://localhost:5228/api/Movie/get_All-Movies";
notification_Url = "http://localhost:5228/api/Notification/Notification";
User_Url = "http://localhost:5228/api/Users/User";


Promise.all([
  fetch(Rented_Url)
    .then(response => response.json())
    .then(array => {
      RentedItems.push(...array)
    }),

  fetch(movie_Url)
    .then(response => response.json())
    .then(array => {
      movies.push(...array)
    }),

  fetch(notification_Url)
    .then(response => response.json())
    .then(array => {
      Notify.push(...array)
    }),

  fetch(User_Url)
    .then(response => response.json())
    .then(array => {
      Customer.push(...array)
    })
]).then(() => {
  Order_view()
})


async function Order_view() {
  for (let i = 0; i < RentedItems.length; i++) {
    let Order = RentedItems[i]
    console.log(Order)
    let movie = movies.find(x => x.id == Order.movieId)
    console.log(movie)

    let UserName = Customer.find(x => x.id == Order.userId);
    console.log('UserName:', UserName);

    console.log(UserName)
    let total = 0
    if (movie) {
      total = Order.rentQuantity * movie.price

    }
    if (UserName && Order.status == "Request") {
      let tr = document.createElement('tr')
      tr.className = "tr"
      tr.innerHTML = `
                 <td>${UserName.firstname}</td>  
                    <td>${Order.id}</td>
                  <td>${movie.name}</td>
                  <td>${Order.rentQuantity}</td>
                  <td>Rs${total}</td>
                  <td>${Order.rentedDate}</td>
                  <td class="btn-flex">
                      <Button class="Edit-btn btn" onclick="Accept(event)" value="${Order.id}">✅ </Button><Button class="Delete-btn btn"
                          onclick="Decline(event)" value="${Order.id}">❎</Button>
                  </td>`
      document.getElementById('Movie-table').appendChild(tr)
    }


  }
}



async function Accept(event) {
  let Id = event.target.value
  let order = RentedItems.find(x => x.id == Id)
  alert(order.id)
  let movie = movies.find(x => x.id == order.MovieId)
  let RentedId = order.RentedId

  let Notification = Notify.find(x => x.rentedId === order.id)

  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1
  let retDate = new Date().getDate() + 7
  let Rdate = retDate
  let Ryear = year
  let Rmonth = month
  let RentDate = `${Ryear}/${Rmonth}/${Rdate}`
  order.ReturnDate = RentDate
  order.status = 'Accepted'

  if (Notification) {
    Notification.status = 'true'
    Notification.requestDate = RentDate
    await fetch(`${notification_Url}/?id=${Notification.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Notification)
    })

  } else {
    alert("Order member clear their history")
  }
  fetch(`${Rented_Url}/?id=${order.id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(order)
  })


  setTimeout(() => {
    window.location.reload()
  }, 900);

}

async function Decline(event) {
  let Id = event.target.value

  let Order = RentedItems.find(ord => ord.id == Id)
  let MOVIE = movies.find(ord => ord.id == Order.movieId)
  let Notification = Notify.find(x => x.RentedId == Order.id)
  // MOVIE.Quantity += parseInt(Order.RentQuantity)
  // await fetch(`${movie_Url}/${MOVIE.id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'content-type': 'application/json'
  //   },
  //   body: JSON.stringify(MOVIE)
  // })
  if (Notification) {
    Notification.Status = "Rejected"
    await fetch(`${notification_Url}/?id=${Notification.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Notification)
    })
  } else {
    alert("Order member clear their history")
  }
  await fetch(`${Rented_Url}/?id=${Order.id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
  setTimeout(() => {
    window.location.reload()
  }, 900);

}
