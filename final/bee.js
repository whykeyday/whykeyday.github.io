//---------------------------------------------------------------------------------------------------
//Tutorial from https://www.xiaohongshu.com/explore/630de51d0000000012008663
//Remixed code
//Function: Create a custom bee cursor that follows the mouse and leaves a glowing trail effect



const bee = document.querySelector('.bee'); // Target the element with class 'bee'

// Record the last x-coordinate (used to determine bee's facing direction)
let last_x = 0;

//---------------------------------------------------------------------------------------------------
//Move the bee to follow the mouse and flip direction based on movement
//Generate a glowing star trail behind the bee with randomized positions and colors
window.addEventListener('mousemove', function(e) {
    let x = e.clientX - 15; // Adjust X position so the bee centers on cursor
    let y = e.clientY - 15; // Adjust Y position

    // Move the bee element
    bee.style.left = x + 'px';
    bee.style.top = y + 'px';

    // Flip bee horizontally depending on movement direction
    if (last_x < x) {
        // Facing right
        bee.classList.add('flip');
    } else {
        // Facing left
        bee.classList.remove('flip');
    }

    // Update last_x for next comparison
    last_x = x;

    //  trail animation
    //Remixed tutorial code from https://www.smashingmagazine.com/2020/04/particle-trail-animation-javascript/ & https://www.youtube.com/watch?v=1Qv1Z1eznmg&ab_channel=SoftAsiaTech
    const arr = [1, 0.9, 0.8, 0.5, 0.2]; // Opacity/offset influence values
    arr.forEach(function(i) { // Use i to influence offset/randomness
      let offset = (1 - i) * 40; // Base offset on i
      let star = document.createElement('div'); // Create star element
      star.className = 'star';
      star.textContent = '✦'; // Star shape
      // Randomize position around cursor
      star.style.top = (e.pageY + Math.random() * offset - offset / 2) + 'px';
      star.style.left = (e.pageX + Math.random() * offset - offset / 2) + 'px';
      // Assign a random hue for a colorful trail effect
      star.style.setProperty('--hue', String(Math.floor(Math.random() * 360))); // Ensure it's a string
      document.body.appendChild(star);

      // --- MODIFIED TIMEOUT ---
      // Remove the star after 650ms (slightly longer than CSS animation duration)
      setTimeout(() => {
          if (star.parentNode === document.body) {
              document.body.removeChild(star);
          }
      }, 650);
    });
});
//Combines cursor tracking, visual orientation, and fading star trail for a dynamic and playful bee effect
//end of remix code
//---------------------------------------------------------------------------------------------------
