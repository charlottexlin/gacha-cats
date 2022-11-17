// Script to confirm if the player wants to navigate away before submitting the form
// REFERENCE: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
function main() {
    window.addEventListener('beforeunload', function (event) {
        const form = document.querySelector("#renameCatForm");
        form.submit();
    });
}

document.addEventListener('DOMContentLoaded', main);