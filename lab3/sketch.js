var colourPicker;
let strokeWeightSlider;
var bgColourPicker;
var brushEraserButton;
var textButton;
var textInput;
var undoButton;
var isErasing = false;
var isTextMode = false;
var canvasHistory = []; // Stores snapshots for undo
var maxHistory = 10; // Limit history to avoid memory issues

function setup() {
    let canvas = createCanvas(1500, 1080);
    centerCanvas(canvas);
    saveCanvasState(); // Save the initial empty canvas state
    strokeWeightSlider = createSlider(1, 50, 5, 1);
    strokeWeightSlider.position(10, 60);

    colourPicker = createColorPicker('pink');
    colourPicker.position(160, 98);


    bgColourPicker = createColorPicker("#bac0de");
    bgColourPicker.position(160, 130);
    let bgColorLabel = createP("Background color:");
    bgColorLabel.position(10, 120); 


    // Brush/Eraser Toggle Button
    let brushEraserLabel = createP("Eraser/Brush:");
    brushEraserLabel.position(10, 85); 
    brushEraserButton = createButton('Click');
    brushEraserButton.position(100, 100);
    brushEraserButton.mousePressed(toggleBrushEraser);

    // Text Button
    textButton = createButton('✎ Text');
    textButton.position(10, 160);
    textButton.mousePressed(toggleTextMode);

    // Text Input (Hidden initially)
    textInput = createInput('');
    textInput.position(10, 190);
    textInput.size(100);
    textInput.attribute('placeholder', 'Click / Enter'); // Placeholder
    textInput.hide();
    textInput.changed(submitText); // Submit text when pressing "Enter"

    // Undo Button
    undoButton = createButton('Undo');
    undoButton.position(10, 220);
    undoButton.mousePressed(() => undoLastAction(1)); // Default: Undo 1 step per click
    
    var bgColourButton = createButton('Refresh');
    bgColourButton.position(100, 220);
    bgColourButton.mousePressed(repaint);
    bgColourPicker.changed(repaint);
    background(bgColourPicker.value());
}


function draw() {
    if (isTextMode) return; // Disable free drawing in text mode

    strokeWeight(strokeWeightSlider.value());
    stroke(isErasing ? bgColourPicker.value() : colourPicker.value());

    if (mouseIsPressed) {
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

// Save the state after each brush/eraser stroke
function mouseReleased() {
    if (!isTextMode) {
        saveCanvasState(); // Save state only after mouse is released to capture each stroke
    }
}

function repaint() {
    background(bgColourPicker.value());
    saveCanvasState(); // Save new background state
}

// Toggle between Brush and Eraser
function toggleBrushEraser() {
    isErasing = !isErasing;
    brushEraserButton.html(isErasing ? 'Brush' : 'Eraser');
    isTextMode = false;
    textInput.hide();
}

// Toggle Text Mode
function toggleTextMode() {
    isTextMode = !isTextMode;
    if (isTextMode) {
        textButton.style('background-color', '#ccc');
        brushEraserButton.html('Eraser');
        isErasing = false;
        textInput.show();
        textInput.elt.focus(); // Auto-focus input field
    } else {
        textButton.style('background-color', '');
        textInput.hide();
    }
}

// Submit text on Enter key press
function submitText() {
    if (isTextMode) {
        let textValue = textInput.value().trim();
        if (textValue) {
            saveCanvasState(); // Save state before adding text
            fill(colourPicker.value());
            textSize(32);
            text(textValue, mouseX, mouseY);
            textInput.value(''); // Clear input after submission
        }
    }
}

// 🚀 **Fixed Undo: Now Works Step-by-Step**
function undoLastAction(steps = 1) {
    if (canvasHistory.length > 1) {
        for (let i = 0; i < steps; i++) {
            if (canvasHistory.length > 1) {
                canvasHistory.pop(); // Remove latest state
            }
        }
        let previousState = canvasHistory[canvasHistory.length - 1];
        clear(); // Clear current canvas
        image(previousState, 0, 0); // Restore previous state
    }
}

// Save the current canvas state AFTER finishing a stroke or adding text
function saveCanvasState() {
    if (canvasHistory.length >= maxHistory) {
        canvasHistory.shift(); // Remove the oldest state
    }
    canvasHistory.push(get()); // Capture current canvas
}

// Handle window resize
function windowResized() {
    centerCanvas();
}

// Center canvas function
function centerCanvas(canvas) {
    if (!canvas) {
        canvas = select('canvas');
    }
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
}