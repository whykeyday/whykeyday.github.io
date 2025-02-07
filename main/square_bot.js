document.addEventListener("DOMContentLoaded", function() {
    const sqrAni = document.getElementById('squares-canvas');

    for (let i = 0; i < 2; i++) { // Create two squares
        const ani = document.createElement('div');
        ani.classList.add('square');
        ani.style.top = `${Math.random() * 100}%`;
        ani.style.left = `${i * 10}px`; // Set initial position with a 10px gap
        ani.style.animationDelay = `${Math.random() * 2}s`;
        sqrAni.appendChild(ani);
    }
});