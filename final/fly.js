//---------------------------------------------------------------------------------------------------
//Resource from https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js
//Glowing Fireflies Animation:
//Tutorial from https://blog.csdn.net/weixin_39688750/article/details/117844809

//Function: Initialize animated firefly particles and simulate glowing movement using GSAP TweenMax
//Remixed code
// ---------------------------------------------------------------------------------------------------
var numP = 50;
TweenMax.set("#content", { transformOrigin: "50% -45%" }); // Set the transform origin for rotating content

// Loop to create and animate multiple particles
for (var i = 0; i <= numP; i++) {
  if (i === 0) {
    // The first particle acts as a hidden template
    TweenMax.set("#p0", { scale: 0 });
  } else {
    // Clone the template particle and assign a new ID
    var _p = document.getElementById("p0").cloneNode(false);
    _p.id = "p" + i;
    document.getElementById("particles").appendChild(_p);

    // Animate particle with a bezier path simulating glowing and floating
    TweenMax.fromTo(_p, 13, {
      x: 120 + 110 * Math.random(),
      y: 200 + 250 * Math.random(),
      scale: 3 * Math.random()
    }, {
      bezier: {
        type: 'thru',
        values: [
          { x: 90 + 60 * Math.random(), y: 50 + 100 * Math.random(), scale: .5 + Math.random(), alpha: 1 },
          { x: 40 + 80 * Math.random(), y: 200 + 160 * Math.random(), scale: 3 * Math.random(), alpha: 0.25 },
          { x: 60 + 60 * Math.random(), y: 390 + 50 * Math.random(), scale: 3 + Math.random(), alpha: .7 + 3 * Math.random() }
        ]
      },
      onComplete: loop,
      onCompleteParams: [_p],
      ease: Sine.easeInOut
    }).progress(i / numP); // Distribute start time for smoother animation
  }
}

//---------------------------------------------------------------------------------------------------
//Loop animation path for each particle to create continuous motion
function loop(_p) {
  var tl = new TimelineMax({ yoyo: true, repeat: -1 }); // Infinite back-and-forth animation
  tl.to(_p, 14, {
    ease: Sine.easeInOut,
    bezier: {
      type: 'thru',
      values: [
        { x: 190 + 30 * Math.random(), y: 100 + 60 * Math.random(), scale: 3 * Math.random() },
        { x: 190 + 50 * Math.random(), y: 150 + 100 * Math.random(), scale: .5 + Math.random(), alpha: 1 },
        { x: 190 + 60 * Math.random(), y: 200 + 160 * Math.random(), scale: 3 * Math.random(), alpha: 0.25 },
        { x: 200 + 70 * Math.random(), y: 390 + 50 * Math.random(), scale: 3 * Math.random(), alpha: 1 }
      ]
    }
  });
}
//Uses GSAP TimelineMax and bezier easing to animate particles in an infinite looping path
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
// Update the movement and rotation of the #content container based on mouse position
window.addEventListener('mousemove', function (e) {
  TweenMax.to("#content", 0.5, {
    x: -400 + 800 * (e.clientX / window.innerWidth),
    rotation: -25 + 50 * (e.clientX / window.innerWidth)
  });
});
//Makes the main content react to mouse position for an immersive parallax-like effect
//end of remix code
//---------------------------------------------------------------------------------------------------
