// Object to store the current slide index for each slider
let slideIndices = {};

// Function to initialize all sliders on the page
function initializeSliders() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    slideshows.forEach(slideshow => {
        const sliderId = slideshow.id;
        if (sliderId) {
            slideIndices[sliderId] = 1;
            showSlide(sliderId, 1);
        }
    });
}

// Function to change slide by delta (n = 1 for next, n = -1 for previous)
function changeSlide(sliderId, delta) {
    if (slideIndices.hasOwnProperty(sliderId)) {
        showSlide(sliderId, slideIndices[sliderId] + delta);
    }
}

// Function to show a specific slide by index (optional, if using dots)
function currentSlide(sliderId, index) {
     if (slideIndices.hasOwnProperty(sliderId)) {
        showSlide(sliderId, index);
    }
}

// Core function to display the correct slide
function showSlide(sliderId, n) {
    if (!slideIndices.hasOwnProperty(sliderId)) return;

    const sliderElement = document.getElementById(sliderId);
    if (!sliderElement) return;

    const slides = sliderElement.getElementsByClassName("media-slide");

    if (n > slides.length) {
        slideIndices[sliderId] = 1;
    } else if (n < 1) {
        slideIndices[sliderId] = slides.length;
    } else {
        slideIndices[sliderId] = n;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndices[sliderId] - 1].style.display = "block";
}

// --- Fullscreen API Logic ---
function openFullscreen(element) {
  if (!element) return;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { /* IE/Edge */
    element.msRequestFullscreen();
  }
}

/* Optional: Function to close fullscreen (often handled by ESC key automatically) */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

// --- Back to Top Button Logic ---
let backToTopButton = document.getElementById("backToTopBtn");

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopButton.classList.add("show");
  } else {
     backToTopButton.classList.remove("show");
  }
}

// When the user clicks on the button, scroll to the top of the document
backToTopButton.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// --- Initialize everything on page load ---
document.addEventListener('DOMContentLoaded', () => {
    initializeSliders();
    // The scroll listener is set globally above, no need to add it here
});