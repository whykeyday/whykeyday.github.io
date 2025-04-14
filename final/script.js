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