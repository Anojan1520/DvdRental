let Movies_url="http://localhost:5228/api/Movie/Movie"

const Movies = [];

fetch(Movies_url)
.then(movie=>movie.json())
.then(movie=>{Movies.push(...movie)})

console.log(Movies)

document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault()
    let movieName = document.getElementById('movieName').value.trim();
    let movieCheck = Movies.find(m => m.name.toLowerCase() == movieName.toLowerCase());

    const formData = new FormData();
    formData.append('Name', document.getElementById('movieName').value.trim());
    formData.append('Genere', document.getElementById('genere').value.trim());
    formData.append('Director', document.getElementById('director').value.trim());
    formData.append('Actor', document.getElementById('actor').value.trim());
    formData.append('Release', document.getElementById('rDate').value.trim());
    formData.append('Price', document.getElementById('Price').value.trim());
    formData.append('Quantity', document.getElementById('Quantity').value.trim());

    // Gather the files
    const images = document.getElementById('image').files;
    for (const image of images) {
        formData.append('images', image); // Append each image file
    }

    try {
        const response = await fetch(Movies_url,
            {
                method: 'POST',
                body: formData,
            });

        if (response.ok) {
            alert('Movie uploaded successfully!');
        }
        else if (response) {
            const data = await response.json();
            console.log('Upload failed:', data);
            alert('Failed to upload movie: ' + response.statusText);
        }
    }
    catch (error) {
        console.error('Error adding movie:', error);
        alert('An error occurred while uploading the movie.');
    }

})
   

 
   




