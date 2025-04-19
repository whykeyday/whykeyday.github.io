// Import necessary modules from the Three.js library
import * as THREE from 'three'; // Core Three.js components
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Loader for GLTF/GLB models
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Camera controls (rotate, zoom, pan)

// --- Renderer Setup ---
// Create the WebGL renderer with anti-aliasing for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Set the color space for correct color representation
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Set the size of the renderer to match the window dimensions
renderer.setSize(window.innerWidth, window.innerHeight);
// Set the background color of the scene (black in this case)
renderer.setClearColor(0x000000);
// Set the pixel ratio for sharper rendering on high-density displays
renderer.setPixelRatio(window.devicePixelRatio);

// Enable shadow mapping in the renderer
renderer.shadowMap.enabled = true;
// Set the type of shadow map for softer shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add the renderer's canvas element to the HTML document's body
document.body.appendChild(renderer.domElement);

// --- Scene Setup ---
// Create a new Three.js scene to hold all objects, lights, and cameras
const scene = new THREE.Scene();

// --- Camera Setup ---
// Create a perspective camera
// Parameters: FOV, aspect ratio, near clipping plane, far clipping plane
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// Set the initial position of the camera (adjust as needed for your model)
camera.position.set(4, 5, 11); // x, y, z coordinates

// --- Controls Setup ---
// Create OrbitControls to allow user interaction with the camera
const controls = new OrbitControls(camera, renderer.domElement);
// Enable damping (inertia) for smoother camera movement
controls.enableDamping = true;
// Disable panning (optional, uncomment to enable)
controls.enablePan = false;
// Set minimum and maximum zoom distances
controls.minDistance = 5;
controls.maxDistance = 20;
// Set minimum and maximum vertical rotation angles (in radians)
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
// Disable auto-rotation (optional, set to true to enable)
controls.autoRotate = false;
// Set the point the camera looks at (adjust as needed)
controls.target = new THREE.Vector3(0, 1, 0);
// Apply initial control settings
controls.update();

// --- Ground Plane Setup ---
// Create geometry for a flat plane
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32); // width, height, segments
// Rotate the plane to be horizontal
groundGeometry.rotateX(-Math.PI / 2); // Rotate 90 degrees around the X-axis
// Create a standard material for the ground
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555, // Gray color
  side: THREE.DoubleSide // Render both sides of the plane
});
// Create a mesh by combining the geometry and material
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// The ground should not cast shadows
groundMesh.castShadow = false;
// The ground should receive shadows from other objects
groundMesh.receiveShadow = true;
// Add the ground mesh to the scene
scene.add(groundMesh);

// --- Lighting Setup ---
// Create a spotlight
// Parameters: color, intensity, distance, angle, penumbra, decay
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
// Set the position of the spotlight (adjust as needed)
spotLight.position.set(0, 25, 0); // High above the center
// Enable the light to cast shadows
spotLight.castShadow = true;
// Adjust shadow bias to prevent shadow artifacts
spotLight.shadow.bias = -0.0001;
// Add the spotlight to the scene
scene.add(spotLight);

// Add an AmbientLight to lighten shadows
// Parameters: color, intensity (0 to 1 is a typical range)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White light, half intensity
scene.add(ambientLight);

// You might want to add an AmbientLight for overall scene illumination:
// const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
// scene.add(ambientLight);

// --- Model Loading ---
// Create a GLTF loader instance and set the path to the models folder
const loader = new GLTFLoader().setPath('models/'); // Adjust path if needed

// Load the GLB model file
loader.load(
    'model.glb', // Your model file name
    // Success callback function (runs when model loads)
    (gltf) => {
        console.log('Model loaded successfully');
        // Get the main scene object from the loaded GLTF data
        const mesh = gltf.scene;

        // Traverse through all objects within the loaded model
        mesh.traverse((child) => {
            // If the child object is a mesh (geometry with material)
            if (child.isMesh) {
                // Enable casting and receiving shadows for each part of the model
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Set the position of the loaded model in the scene
        // Adjust these x, y, z values to position your model correctly
        mesh.position.set(1.5, 0, 0); // Example: Place at the origin

        // Optional: Adjust the scale of the model if needed
        mesh.scale.set(15, 15, 15); // Example: No scaling

        // Add the loaded model to the scene
        scene.add(mesh);

        // Hide the loading progress indicator now that the model is loaded
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    },
    // Progress callback function (runs during loading)
    (xhr) => {
        // Calculate and display the loading percentage
        const percentLoaded = Math.round(xhr.loaded / xhr.total * 100);
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.textContent = `Loading Model... ${percentLoaded}%`;
        }
        console.log(`Loading model: ${percentLoaded}%`);
    },
    // Error callback function (runs if loading fails)
    (error) => {
        console.error('Error loading model:', error);
        // Display an error message to the user
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            progressElement.textContent = 'Error loading model.';
            progressElement.style.color = 'red';
        }
    }
);

// --- Window Resize Handling ---
// Add an event listener to handle browser window resizing
window.addEventListener('resize', () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  // Update the camera's projection matrix
  camera.updateProjectionMatrix();
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
// Create a function that will be called repeatedly to render the scene
function animate() {
  // Request the next frame from the browser
  requestAnimationFrame(animate);
  // Update controls (important for damping)
  controls.update();
  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Start the animation loop
animate();