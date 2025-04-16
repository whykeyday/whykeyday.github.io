document.addEventListener('DOMContentLoaded', () => {
    // Select all images that need the source swapped on hover
    const imagesToSwap = document.querySelectorAll('.hover-swap');

    imagesToSwap.forEach(img => {
        // Store the original and hover sources (from data attributes)
        const originalSrc = img.dataset.original;
        const hoverSrc = img.dataset.hover;

        // Preload hover image (optional, but good practice)
        const hoverImage = new Image();
        hoverImage.src = hoverSrc;

        // Event listener for when the mouse enters the image area
        img.addEventListener('mouseenter', () => {
            if (hoverSrc) { // Check if hover source exists
                img.src = hoverSrc;
            }
        });

        // Event listener for when the mouse leaves the image area
        img.addEventListener('mouseleave', () => {
            if (originalSrc) { // Check if original source exists
                img.src = originalSrc;
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Image Swap Logic ---
    const imagesToSwap = document.querySelectorAll('.hover-swap');
    imagesToSwap.forEach(img => {
        const originalSrc = img.dataset.original;
        const hoverSrc = img.dataset.hover;
        const hoverImage = new Image();
        hoverImage.src = hoverSrc; // Preload

        img.addEventListener('mouseenter', () => {
            if (hoverSrc) { img.src = hoverSrc; }
        });
        img.addEventListener('mouseleave', () => {
            if (originalSrc) { img.src = originalSrc; }
        });
    });

    // --- UPDATED: Title Display Bar Logic ---
    const titleBar = document.getElementById('title-display-bar');
    const hoverableImagesForTitle = document.querySelectorAll('.hover-swap, .rotate-hover');

    if (titleBar) {
        hoverableImagesForTitle.forEach(img => {
            img.addEventListener('mouseenter', (event) => { // Use event if needed, not strictly necessary here
                const title = img.getAttribute('alt');
                if (!title) return; // Exit if no alt text

                // 1. Update text content (might affect size)
                titleBar.textContent = title;

                // 2. Get image position and dimensions relative to viewport
                const imgRect = img.getBoundingClientRect();

                // 3. Get title bar dimensions (ensure text is set first)
                const barWidth = titleBar.offsetWidth;
                const barHeight = titleBar.offsetHeight;

                // 4. Get viewport dimensions
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // 5. Define margin/spacing
                const margin = 10; // Space between image and title bar

                // 6. Calculate desired position (Default: below image, centered horizontally)
                let potentialTop = imgRect.bottom + margin;
                let potentialLeft = imgRect.left + (imgRect.width / 2) - (barWidth / 2);

                // --- Boundary Checks ---

                // Check bottom boundary: If placing below goes off-screen, try placing above
                if (potentialTop + barHeight > viewportHeight - margin) { // Check against bottom edge + margin
                    potentialTop = imgRect.top - barHeight - margin; // Place above
                }

                // Check top boundary: If placing above also goes off-screen, place just inside top edge
                if (potentialTop < margin) {
                    potentialTop = margin;
                }

                // Check left boundary
                if (potentialLeft < margin) {
                    potentialLeft = margin;
                }

                // Check right boundary
                if (potentialLeft + barWidth > viewportWidth - margin) {
                    potentialLeft = viewportWidth - barWidth - margin;
                }

                // --- End Boundary Checks ---

                // 7. Apply calculated position
                // getBoundingClientRect is relative to viewport. Since the titleBar is positioned
                // absolutely relative to the body (which is the offset parent here unless
                // another ancestor is positioned), and the body isn't scrolled (overflow: hidden),
                // we can directly use the viewport coordinates.
                titleBar.style.top = `${potentialTop}px`;
                titleBar.style.left = `${potentialLeft}px`;

                // 8. Make it visible
                titleBar.classList.add('visible');
            });

            // Mouse leaving the image
            img.addEventListener('mouseleave', () => {
                titleBar.classList.remove('visible'); // Hide the bar
            });
        });
    } else {
        console.error("Element with ID 'title-display-bar' not found.");
    }
}); // End of DOMContentLoaded