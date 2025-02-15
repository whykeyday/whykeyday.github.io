function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }



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
