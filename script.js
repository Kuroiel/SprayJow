// Get references to our HTML elements
const gameContainer = document.getElementById('game-container');
const sprayBottle = document.getElementById('spray-bottle');
const jowImage = document.getElementById('jow-image');
const scoreCounter = document.getElementById('score-counter');

// Initialize the score
let score = 0;

// Store the bottle's state in variables
let currentAngle = 0;
let isSpraying = false;

// A central function to update the bottle's transform property
function updateBottleTransform() {
    let transformString = `rotate(${currentAngle}deg)`;
    if (isSpraying) {
        transformString += ' scale(0.95)';
    }
    sprayBottle.style.transform = transformString;
}

// --- Make the spray bottle follow and aim ---
window.addEventListener('mousemove', (event) => {
    // Get mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Position the bottle's PIVOT POINT (0% 50%) at the cursor
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

    // Store the angle and update the visual transform
    currentAngle = angleInDegrees + 180;
    updateBottleTransform();
});

// --- Handle the spraying action on click ---
window.addEventListener('click', (event) => {
    // 1. Update the score
    score++;
    scoreCounter.textContent = `Times Jow has been sprayed: ${score}`;

    // 2. Handle the kickback animation
    if (!isSpraying) {
        isSpraying = true;
        updateBottleTransform();
        setTimeout(() => {
            isSpraying = false;
            updateBottleTransform();
        }, 100);
    }

    // 3. --- THIS IS THE MAJOR FIX ---
    // Calculate the true position of the nozzle before spraying.

    // Define the offset. Based on your description, the nozzle is about 20px
    // "above" the pivot point when the bottle is pointing right (0 degrees).
    // You can TWEAK THIS VALUE to get it pixel perfect!
    const nozzleOffset = 40; // Negative because it's "up"

    // We need the angle in radians for trigonometry (Math.cos, Math.sin)
    // The angle we stored (`currentAngle`) is what the bottle is visually showing.
    const angleInRadians = currentAngle * (Math.PI / 180);

    // Use trigonometry to calculate the nozzle's actual screen position
    // startX/Y is the pivot point (the mouse cursor's location)
    const startX = event.clientX;
    const startY = event.clientY;
    
    const nozzleX = startX + (nozzleOffset * Math.sin(angleInRadians));
    const nozzleY = startY - (nozzleOffset * Math.cos(angleInRadians));

    // 4. Create the spray from the CALCULATED nozzle position, not the mouse position.
    createWaterSpray(nozzleX, nozzleY);
});

// --- Function to create the water spray effect (Unchanged) ---
function createWaterSpray(startX, startY) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('water-particle');
        gameContainer.appendChild(particle);
        // Start particles at the calculated nozzle position
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
