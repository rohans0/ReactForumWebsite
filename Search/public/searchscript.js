// script.js
const inputField = document.getElementById('searchBar');
const output = document.getElementById('output');
let searchQuery = '';
let foundResult = false;
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchQuery = inputField.value;
        output.innerHTML = `Searching for: ${searchQuery}<br>`;

        fetch(`http://localhost:3000/user/${searchQuery}`)
            .then((response) => response.json())
            .then((data) => {
                for(let thread of data) {
                    console.log(data);
                    output.innerHTML += `<br>${thread.Title}<br>${thread.TextContent}`;
                }
            })
            .catch((error) => {
                /*console.error('Error:', error);
                output.textContent += `\nError: ${error}`;*/
            });
            
        fetch(`http://localhost:3000/thread/${searchQuery}`)
            .then((response) => response.json())
            .then((data) => {
                for(let thread of data) {
                    console.log(data);
                    output.innerHTML += `<br>${thread.Title}<br>${thread.TextContent}`;
                }
            })
            .catch((error) => {
                /*console.error('Error:', error);
                output.textContent += `\nError: ${error}`;*/
            });

    }
});
