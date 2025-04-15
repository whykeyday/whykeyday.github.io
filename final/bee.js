// Element to be operated on
const bee = document.querySelector('.bee');

// Record the last x-coordinate (used to determine bee's facing direction)
let last_x = 0;

// Mouse move event
window.addEventListener('mousemove', function(e) {
    let x = e.clientX - 15;
    let y = e.clientY - 15;

    bee.style.left = x + 'px';
    bee.style.top = y + 'px';

    if (last_x < x) {
        // Facing right
        bee.classList.add('flip');
    } else {
        // Facing left
        bee.classList.remove('flip');
    }

    // Update last_x
    last_x = x;
});
