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

    // ✨ trail
    const arr = [1, 0.9, 0.8, 0.5, 0.2]; // Opacity/offset influence values
    arr.forEach(function(i) { // Use i to influence offset/randomness
      let offset = (1 - i) * 40; // Base offset on i
      let star = document.createElement('div');
      star.className = 'star';
      star.textContent = '✦'; // Set the star character
      // Randomize position slightly around the cursor
      star.style.top = (e.pageY + Math.random() * offset - offset / 2) + 'px';
      star.style.left = (e.pageX + Math.random() * offset - offset / 2) + 'px';
      // Set the random hue for the CSS variable
      star.style.setProperty('--hue', String(Math.floor(Math.random() * 360))); // Ensure it's a string
      document.body.appendChild(star);

      // --- MODIFIED TIMEOUT ---
      // Remove the star after 600ms (matching CSS animation) + a tiny buffer
      setTimeout(() => {
          // Check if the star still exists in the DOM before trying to remove
          if (star.parentNode === document.body) {
              document.body.removeChild(star);
          }
      }, 650); // Duration slightly longer than the animation
    });
});