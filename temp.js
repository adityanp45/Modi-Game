// // const follower = document.querySelector('.cont');
// // const body = document.body;
// // let width = window.innerWidth;
// // let height = window.innerHeight;

// // document.addEventListener('mousemove', (e) => {
// //     let x = e.clientX;
// //     follower.style.left = `${x}px`
// // })

// // function addBox() {
// //     const div = document.createElement('div')
// //     div.classList.add('box');
// //     let dA = Math.floor(Math.random() * 5 + 2);
// //     let lv = Math.floor(Math.random() * (width - 100))
// //     let dam = dA * 1000
// //     div.style.left = `${lv}px`
// //     div.style.animationDuration = `${dA}s`
// //     body.appendChild(div)
// //     setTimeout(() => {
// //         div.remove()
// //         console.log('elem deleted');
// //     }, dam)
// // }
// // addBox()
// // setInterval(addBox, boxgt)


// const follower = document.querySelector('.cont');
// const sg = document.getElementById('mod');
// const bkl = document.getElementById('bkl')
// const body = document.body;
// let width = window.innerWidth;
// let height = window.innerHeight;

// // --- 1. Follower Movement ---
// document.addEventListener('mousemove', (e) => {
//     // Note: It's often better to set follower's position using the game loop, 
//     // but for simplicity, setting it directly here works for horizontal movement.
//     let x = e.clientX - follower.offsetWidth / 2; // Adjust for center alignment
//     follower.style.left = `${x}px`;
// })

// // --- 2. Box Generation ---
// function addBox() {
//     const div = document.createElement('div')
//     div.classList.add('box');
//     let dA = Math.floor(Math.random() * 5 + 2); // 2s to 6s duration
//     let lv = Math.floor(Math.random() * (width - 100)) // Random left pos (width - box width)
//     let dam = dA * 1000 // duration in ms

//     div.style.left = `${lv}px`
//     div.style.animationDuration = `${dA}s`
//     body.appendChild(div)

//     // Remove the box after its animation duration
//     setTimeout(() => {
//         div.remove()
//         // console.log('elem deleted');
//     }, dam)
// }

// // Start generating boxes
// addBox()
// setInterval(addBox, boxgt)

// // --- 3. Collision Detection Function ---

// function checkCollision(player, obstacle) {
//     // Use getBoundingClientRect() to get the current coordinates of the element
//     const rectA = player.getBoundingClientRect(); // Player (.cont)
//     const rectB = obstacle.getBoundingClientRect(); // Falling box (.box)

//     // AABB Collision Detection Logic:
//     // Collision happens if there is NO separation on either the X or Y axis.

//     const x_overlap = (rectA.left < rectB.right) && (rectA.right > rectB.left);
//     const y_overlap = (rectA.top < rectB.bottom) && (rectA.bottom > rectB.top);

//     return x_overlap && y_overlap;
// }

// // --- 4. Main Game Loop ---

// function gameLoop() {
//     const activeBoxes = document.querySelectorAll('.box');
//     let collisionDetected = false;

//     // Check collision with every falling box
//     activeBoxes.forEach(box => {
//         if (checkCollision(follower, box)) {
//             collisionDetected = true;
//             // Immediate response (e.g., change player color, stop game)
//             follower.style.backgroundColor = 'red';
//             sg.pause()
//             bkl.play()
//             // Optionally, break/stop the game here
//             cancelAnimationFrame(gameLoop);
//             // return; // Stop processing the rest of the boxes for this frame
//         }
//     });

//     if (!collisionDetected) {
//         // If no collision, revert player appearance
//         sg.play()
//         bkl.pause()

//         follower.style.backgroundColor = 'transparent';
//     }

//     // Continue the loop for the next frame
//     requestAnimationFrame(gameLoop);
// }

// // Start the game loop
// gameLoop();
const follower = document.querySelector('.cont');
const sg = document.getElementById('mod');
const bkl = document.getElementById('bkl');
const body = document.body;
const startButton = document.getElementById('start-button');
const overlay = document.getElementById('game-start-overlay'); // Added overlay element
const res = document.querySelector('.res')

let width = window.innerWidth;
let height = window.innerHeight;
let gameActive = false; // Game starts inactive, waiting for user click
let boxIntervalId;
const boxgt = 600
// --- 1. Game Initialization on Click ---
startButton.addEventListener('click', () => {
    // Prevent starting if already active
    if (gameActive) return;

    // Audio and UI
    sg.play().catch(e => console.warn("Music play failed:", e));
    overlay.style.display = 'none'; // Hide the entire overlay

    // Game Start
    gameActive = true;
    boxIntervalId = setInterval(addBox, boxgt);
    requestAnimationFrame(gameLoop);
});

res.addEventListener('click', () => {
    bkl.pause()
    sg.play()
    res.style.display='none'
    gameActive = true;
    boxIntervalId = setInterval(addBox, boxgt);
    requestAnimationFrame(gameLoop);
})

// --- 2. Follower Movement ---
document.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    
    let x = e.clientX - follower.offsetWidth / 2;
    if (x < 0) x = 0;
    if (x > width - follower.offsetWidth) x = width - follower.offsetWidth;
    
    follower.style.left = `${x}px`;
});

// --- 3. Box Generation ---
function addBox() {
    if (!gameActive) return;
    
    const div = document.createElement('div')
    div.classList.add('box');
    div.style.backgroundImage = 'url("rahulg.jpg")'
    div.style.backgroundImage.height = '100px'
    div.style.backgroundImage.width = '100px'
    let dA = Math.floor(Math.random() * 5 + 2);
    let lv = Math.floor(Math.random() * (width - 100))
    let dam = dA * 1000
    
    div.style.left = `${lv}px`
    div.style.animationDuration = `${dA}s`
    body.appendChild(div)
    
    setTimeout(() => {
        div.remove()
    }, dam)
}

// --- 4. Collision Detection ---
function checkCollision(player, obstacle) {
    const rectA = player.getBoundingClientRect();
    const rectB = obstacle.getBoundingClientRect();
    
    const x_overlap = (rectA.left < rectB.right) && (rectA.right > rectB.left);
    const y_overlap = (rectA.top < rectB.bottom) && (rectA.bottom > rectB.top);
    
    return x_overlap && y_overlap;
}

// --- 5. Game Over Logic ---
function gameOver() {
    if (!gameActive) return;
    
    gameActive = false;
    clearInterval(boxIntervalId);
    res.style.display ="block";
    
    // Pause CSS animations
    document.querySelectorAll('.box').forEach(box => {
        box.style.animationPlayState = 'paused';
    });
    
    // Audio Control
    sg.pause();
    bkl.currentTime = 0;
    bkl.play();
    
    follower.style.backgroundColor = 'red';
    console.log("GAME OVER! Collision Detected.");
    
    // Optional: Show a "Restart" button or Game Over screen here
}

// --- 6. Main Game Loop ---
function gameLoop() {
    if (!gameActive) return;
    
    const activeBoxes = document.querySelectorAll('.box');
    for (const box of activeBoxes) {
        if (checkCollision(follower, box)) {
            gameOver();
            return;
        }
    }
    
    requestAnimationFrame(gameLoop);
}