// main function to add event listeners to all the cat cards' buttons on the collection pgae
function main() {
    // select all the text content of all the cat cards on this page
    const catCards = document.querySelectorAll('.card-body');
    // add an event listener to the button on each card
    for (const catCard of catCards) {
        const btn = catCard.querySelector('.btn');
        btn.addEventListener('click', onClick);
    }
}

// when a button on a cat card is clicked, send a request to the server telling it to feed that cat fish!
async function onClick(event) {
    // get the name of the cat whose card was clicked
    const catName = event.target.parentElement.querySelector('#catName').textContent;
    // send a POST request to the server with the cat name
    const res = await fetch('/collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({catName})
    });
    // parse the response
    const updatedData = await res.json();
    if (updatedData.errorMsg) { // the player is not allowed to feed this cat fish - show the alert banner
        const errorMsg = document.querySelector('.alert');
        errorMsg.classList.remove('d-none');
        errorMsg.textContent = updatedData.errorMsg;
    } else { // otherwise update cat's HP text and user's fish text
        const hp = event.target.parentElement.querySelector('#hp');
        hp.textContent = '❤️ ' + updatedData.currentHP;
        const fishCount = event.target.parentElement.querySelector('#fishCount');
        fishCount.textContent = '🐟 ' + updatedData.fish;
    }
}

document.addEventListener('DOMContentLoaded', main);