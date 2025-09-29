// Get references to our HTML elements
const gameContainer = document.getElementById('game-container');
const sprayBottle = document.getElementById('spray-bottle');
const jowImage = document.getElementById('jow-image');
const scoreCounter = document.getElementById('score-counter');

// Initialize the score
let score = 0;

// NEW: We need to store the bottle's state in variables
let currentAngle = 0;
let isSpraying = false;

// NEW: A central function to update the bottle's transform property
// This ensures that rotation and scaling are applied together correctly.
function updateBottleTransform() {
    let transformString = `rotate(${currentAngle}deg)`;
    if (isSpraying) {
        // If we are spraying, add the scale effect
        transformString += ' scale(0.95)';
    }
    sprayBottle.style.transform = transformString;
}

// --- Make the spray bottle follow and aim ---
window.addEventListener('mousemove', (event) => {
    // Get mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Position the bottle's nozzle at the cursor (this part is still correct)
    const bottleHeight = sprayBottle.offsetHeight;
    sprayBottle.style.left = `${mouseX}px`;
    sprayBottle.style.top = `${mouseY - (bottleHeight / 2)}px`;

    // Calculate the target angle
    const jowRect = jowImage.getBoundingClientRect();
    const jowCenterX = jowRect.left + jowRect.width / 2;
    const jowCenterY = jowRect.top + jowRect.height / 2;
    const deltaX = jowCenterX - mouseX;
    const deltaY = jowCenterY - mouseY;
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // MODIFIED: Instead of setting the style directly, we store the angle...
    currentAngle = angleInDegrees + 180;
    // ...and then call our new update function.
    updateBottleTransform();
});

// --- Handle the spraying action on click ---
window.addEventListener('click', (event) => {
    // 1. Update the score
    score++;
    scoreCounter.textContent = `Times Jow has been sprayed: ${score}`;

    // 2. MODIFIED: Handle the kickback animation in JavaScript
    // We no longer add/remove a CSS class.
    if (!isSpraying) { // Prevents re-triggering the animation if clicking rapidly
        isSpraying = true;
        updateBottleTransform(); // Apply the scale immediately

        // Set a timer to remove the scale effect
        setTimeout(() => {
            isSpraying = false;
            updateBottleTransform(); // Update transform back to normal
        }, 100); // Animation duration of 100ms
    }

    // 3. Create and animate water particles (this part doesn't need to change)
    createWaterSpray(event.clientX, event.clientY);
});

// --- Function to create the water spray effect (Unchanged) ---
function createWaterSpray(startX, startY) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('water-particle');
        gameContainer.appendChild(particle);
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        const jowRect = jowImage.getBoundingClientRect();
        const endX = jowRect.left + jowRect.width / 2;
        const endY = jowRect.top + jowRect.height / 2;
        const randomX = endX + (Math.random() - 0.5) * 80;
        const randomY = endY + (Math.random() - 0.5) * 80;
        setTimeout(() => {
            particle.style.left = `${randomX}px`;
            particle.style.top = `${randomY}px`;
            particle.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}
