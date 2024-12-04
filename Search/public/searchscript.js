// script.js
const inputField = document.getElementById('searchBar');
const output = document.getElementById('output');
let searchQuery = '';
let foundResult = false;
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchQuery = inputField.value;
        output.innerHTML = `Searching for: ${searchQuery}<br>`;
        fetchThreadsAndPostsByUser(searchQuery);
        fetchThreadsAndPostsByThreadTitle(searchQuery);
    }
});
async function fetchThreadsAndPostsByUser(searchQuery) {
    try {

        const response = await fetch(`http://localhost:3000/user/${searchQuery}`);
        const threads = await response.json();

        for (let thread of threads) {
            console.log(thread);
            output.innerHTML += `<br>${thread.Title}<br>${thread.TextContent}`;

            const postResponse = await fetch(`http://localhost:3000/post/${thread.ThreadID}`);
            const posts = await postResponse.json();

            for (let post of posts) {
                console.log(post);
                output.innerHTML += `<br>${post.TextContent}<br>Likes: ${post.likes}`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchThreadsAndPostsByThreadTitle(searchQuery) {
    try {
        const response = await fetch(`http://localhost:3000/thread/${searchQuery}`);
        const threads = await response.json();

        for (let thread of threads) {
            console.log(thread);
            output.innerHTML += `<br>${thread.Title}<br>${thread.TextContent}`;

            const postResponse = await fetch(`http://localhost:3000/post/${thread.ThreadID}`);
            const posts = await postResponse.json();

            for (let post of posts) {
                console.log(post);
                output.innerHTML += `<br>${post.TextContent}<br>Likes: ${post.likes}`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function
fetchThreadsAndPosts(searchQuery);

