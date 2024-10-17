let Movies_url = "http://localhost:5228/api/Movie/Movie"

const Movies = [];
fetch(Movies_url)
    .then(response => response.json())
    .then(movie => {
        Movies.push(...movie)
        Movie_view_function();
    })
console.log(Movies)

function Movie_view_function() {
    for (let i = 0; i < Movies.length; i++) {
        let movies = Movies[i]
        let tr = document.createElement('tr')
        tr.className = "tr"
        tr.innerHTML = `  
                    <td>${movies.name}</td>
                    <td>${movies.genere}</td>
                    <td>${movies.director}</td>
                    <td>${movies.actor}</td>
                    <td>${movies.release}</td>
                    <td>${movies.quantity}</td>
                    <td>${movies.price}</td>
                    <td class="btn-flex">
                        <Button class="Edit-btn btn" onclick="Edit(event)" value="${i}">🖊️</Button><Button class="Delete-btn btn"
                            onclick="Delete(event)" value="${i}">❎  </Button>
                    </td>`
        document.getElementById('Movie-table').appendChild(tr)
    }
}


function Edit(event) {
    var btnValue = event.target.value
    console.log(btnValue);
    var TembArray = Movies[btnValue]
    document.querySelector('.pop-cover').style.display = "block"
    console.log(TembArray);
    document.getElementById("movieName").value = TembArray.name
    document.getElementById("director").value = TembArray.director
    document.getElementById("genere").value = TembArray.genere
    document.getElementById("actor").value = TembArray.actor
    document.getElementById("rDate").value = TembArray.release
    document.getElementById("Price").value = TembArray.price
    document.getElementById("Quantity").value = TembArray.quantity

    document.getElementById('form').addEventListener('submit', async function (event) {
        event.preventDefault();
        let name = document.getElementById('movieName').value.trim();
        let genere = document.getElementById('genere').value.trim();
        let director = document.getElementById('director').value.trim();
        let actor = document.getElementById('actor').value.trim();
        let qty = document.getElementById('Quantity').value.trim();
        let price = document.getElementById('Price').value.trim();
        let release = document.getElementById('rDate').value.trim();
        const data = {name:name,genere:genere,director:director,actor:actor,quantity:qty,price:price,release:release,images:[]}
        
        // const formData = new FormData();
        // formData.append('Name', document.getElementById('movieName').value.trim());
        // formData.append('Genere', document.getElementById('genere').value.trim());
        // formData.append('Director', document.getElementById('director').value.trim());
        // formData.append('Actor', document.getElementById('actor').value.trim());
        // formData.append('Quantity', document.getElementById('Quantity').value.trim());
        // formData.append('Price', document.getElementById('Price').value.trim());
        // formData.append('Release', document.getElementById('rDate').value.trim());

        // Gather the files
        // const images = document.getElementById('image').files;
        // console.log(images);
        // let img = [];
        // if (images.length > 0) {
        //     for (const image of images) {
        //         img.push(image)
        //         // formData.append('images', image); // Append each image file
        //     }
        // }
        // console.log(img);

            try {
                const response = await fetch(`${Movies_url}/${TembArray.id}`, {
                    method: 'PUT',
                    headers:{
                        'content-type':'application/json'
                    },
                    body:JSON.stringify(data)
                    })
                if (response.ok) {
                    alert(`Movie Edited SuccesFully`)
                }
                else if (response) {
                     const data = await response.text();
                    console.log('Upload failed:', response);
                    alert('Failed to upload movie...');
                }
            }
            catch (error) {
                console.error('Error adding movie:', error);
                alert('An error occurred while uploading the movie.');.0
            }
            document.querySelector('.pop-cover').style.display = "none"
            window.location.reload()
    })
}

function Delete(event) {
    var btnValue = event.target.value
    let TembArray = Movies[btnValue]
    fetch(`${Movies_UpdateUrl}/${TembArray.id}`, {
        method: 'DELETE',
    })
    event.target.parentNode.parentNode.remove();
    window.location.reload()
}

function CancelPopup() {
    document.querySelector('.pop-cover').style.display = "none"

}