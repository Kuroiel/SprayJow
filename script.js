// Get references to our HTML elements
const gameContainer = document.getElementById('game-container');
const sprayBottle = document.getElementById('spray-bottle');
const jowImage = document.getElementById('jow-image');
const scoreCounter = document.getElementById('score-counter');

// Initialize the score
let score = 0;

// --- Part 1: Make the spray bottle follow the mouse ---
window.addEventListener('mousemove', (event) => {
    // Get mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Position the spray bottle's top-left corner at the mouse cursor
    // We subtract half its width/height to center it, but let's just do top-left for simplicity
    sprayBottle.style.left = `${mouseX}px`;
    sprayBottle.style.top = `${mouseY}px`;

    // --- Part 2: Make the bottle aim at the center of Jow ---
    // Get the position and dimensions of the Jow image
    const jowRect = jowImage.getBoundingClientRect();
    const jowCenterX = jowRect.left + jowRect.width / 2;
    const jowCenterY = jowRect.top + jowRect.height / 2;

    // Calculate the angle between the mouse and the center of Jow
    const deltaX = jowCenterX - mouseX;
    const deltaY = jowCenterY - mouseY;
    // Math.atan2 gives the angle in radians. We convert it to degrees.
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Apply the rotation to the spray bottle
    sprayBottle.style.transform = `rotate(${angleInDegrees}deg)`;
});

// --- Part 3: Handle the spraying action on click ---
window.addEventListener('click', (event) => {
    // 1. Update the score
    score++;
    scoreCounter.textContent = `Times Jow has been sprayed: ${score}`;

    // 2. Add the "spraying" class for the kickback animation
    sprayBottle.classList.add('spraying');
    // Remove the class after a short time so the animation can run again
    setTimeout(() => {
        sprayBottle.classList.remove('spraying');
    }, 100); // 100 milliseconds

    // 3. Create and animate water particles
    createWaterSpray(event.clientX, event.clientY);
});

// --- Part 4: Function to create the water spray effect ---
function createWaterSpray(startX, startY) {
    const particleCount = 20; // How many drops to spray

    for (let i = 0; i < particleCount; i++) {
        // Create a new div element for the particle
        const particle = document.createElement('div');
        particle.classList.add('water-particle');
        gameContainer.appendChild(particle);

        // Start the particle at the mouse's position (nozzle of the bottle)
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        // Get the Jow image's center again to aim the particles
        const jowRect = jowImage.getBoundingClientRect();
        const endX = jowRect.left + jowRect.width / 2;
        const endY = jowRect.top + jowRect.height / 2;

        // Add some randomness to the end position to create a "spray" effect
        const randomX = endX + (Math.random() - 0.5) * 80; // Spread of 80px
        const randomY = endY + (Math.random() - 0.5) * 80;

        // Use a short timeout to make the browser update the particle's initial position
        // before we tell it to transition to the end position. This makes the animation work.
        setTimeout(() => {
            particle.style.left = `${randomX}px`;
            particle.style.top = `${randomY}px`;
            particle.style.opacity = '0';
        }, 10);

        // Remove the particle from the page after the animation is finished
        setTimeout(() => {
            particle.remove();
        }, 500); // 500ms, matching our CSS transition time
    }
}
