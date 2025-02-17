
/*----------------------------------------------------------------------------------------------*/
/* tutorial from https://diviengine.com/snippets/divi/confetti-effect-when-clicking-a-divi-button-module/ */
/* confetti animation */
  document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.confetti-button');  // Selects the button by class name
    
    button.addEventListener('click', function(event) {
      const rect = button.getBoundingClientRect();  // Gets the button's position
      
      const x = (rect.left + rect.right) / 2;  // Calculates the horizontal center
      const y = (rect.top + rect.bottom) / 2;  // Calculates the vertical center
      
      const confettiSettings = {
        particleCount: 100,  // Number of particles
        spread: 70,           // Spread angle
        origin: {
          x: x / window.innerWidth,  // Normalizes the x position based on window width
          y: y / window.innerHeight  // Normalizes the y position based on window height
        }
      };
      
      // Trigger the confetti effect when the button is clicked
      confetti(confettiSettings);
    });
  });
/*end tutorial code */
/*----------------------------------------------------------------------------------------------*/