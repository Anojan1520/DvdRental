const users = [];
const customer = []
const movies = [];
const ConfirmOrders = [];

viewReports()
async function viewReports() {
  await fetch("http://localhost:5228/api/Login/User")
    .then(response => response.json())
    .then(array => {
      users.push(...array)
    })
  await fetch("http://localhost:5228/api/Users/User")
    .then(response => response.json())
    .then(array => {
      customer.push(...array)
      user()
    })
  await fetch("http://localhost:5228/api/Movie/Movie")
    .then(response => response.json())
    .then(array => {
      movies.push(...array)
    })

  await fetch("http://localhost:5228/api/RentedItems/RentedItem")
    .then(response => response.json())
    .then(array => {
      ConfirmOrders.push(...array)
      use()
    })

}


function user() {
  let tr = document.createElement('tr')
  tr.className = "tr"
  tr.innerHTML = `
                 <td>Unicom</td>  
                    <td>${customer.length}</td>
                  <td>${users.length}</td>
                `
  document.getElementById('UsersDetail-table').appendChild(tr)

}


function use() {
  let tr = document.createElement('tr')
  tr.className = "tr"
  tr.innerHTML = `
               <td>Unicom</td>  
                  <td>${movies.length}</td>
                <td>${ConfirmOrders.length}</td>
              `
  document.getElementById('movies-table').appendChild(tr)
}