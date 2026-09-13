const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");

let score = 0;
let gameOver = false;
let menang = false;

const gravity = 0.6;

// ==========================
// PLAYER
// ==========================

const player = {
    x: 50,
    y: 300,
    width: 35,
    height: 45,
    speed: 5,
    velocityY: 0,
    jumpPower: -12,
    onGround: false
};

// ==========================
// TOMBOL
// ==========================

const keys = {};

document.addEventListener("keydown", function(e) {

    keys[e.key] = true;

    if (
        (e.key === "ArrowUp" || e.key === " ") &&
        player.onGround
    ) {
        player.velocityY = player.jumpPower;
        player.onGround = false;
    }
});

document.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

// ==========================
// PLATFORM
// ==========================

const platforms = [
    {
        x: 0,
        y: 350,
        width: 800,
        height: 50
    },

    {
        x: 180,
        y: 280,
        width: 150,
        height: 20
    },

    {
        x: 400,
        y: 220,
        width: 150,
        height: 20
    },

    {
        x: 620,
        y: 280,
        width: 100,
        height: 20
    }
];

// ==========================
// COIN
// ==========================

let coins = [
    {
        x: 250,
        y: 240,
        radius: 12,
        collected: false
    },

    {
        x: 470,
        y: 180,
        radius: 12,
        collected: false
    },

    {
        x: 650,
        y: 240,
        radius: 12,
        collected: false
    }
];

// ==========================
// BENDERA
// ==========================

const flag = {
    x: 750,
    y: 290,
    width: 15,
    height: 60
};

// ==========================
// UPDATE GAME
// ==========================

function update() {

    if (gameOver || menang) {
        return;
    }

    // Gerakan kiri
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    // Gerakan kanan
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    // Batas layar
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Gravitasi
    player.velocityY += gravity;
    player.y += player.velocityY;

    player.onGround = false;

    // Collision platform
    platforms.forEach(platform => {

        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height + 15 &&
            player.velocityY >= 0
        ) {

            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
        }

    });

    // Cek coin
    coins.forEach(coin => {

        if (coin.collected) return;

        const distanceX =
            player.x + player.width / 2 - coin.x;

        const distanceY =
            player.y + player.height / 2 - coin.y;

        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );

        if (distance < 30) {

            coin.collected = true;

            score++;
            scoreText.textContent = score;
        }
    });

    // Cek bendera
    if (
        player.x + player.width > flag.x &&
        player.x < flag.x + flag.width &&
        player.y + player.height > flag.y
    ) {

        if (score === coins.length) {
            menang = true;
        }
    }

    // Jika jatuh
    if (player.y > canvas.height) {
        gameOver = true;
    }
}

// ==========================
// GAMBAR BACKGROUND
// ==========================

function drawBackground() {

    ctx.fillStyle = "#071426";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bintang
    ctx.fillStyle = "white";

    const stars = [
        [50, 50],
        [120, 90],
        [200, 40],
        [300, 80],
        [370, 30],
        [500, 70],
        [590, 40],
        [700, 90],
        [760, 45]
    ];

    stars.forEach(star => {
        ctx.fillRect(star[0], star[1], 3, 3);
    });

    // Bulan
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(680, 70, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#071426";
    ctx.beginPath();
    ctx.arc(690, 62, 25, 0, Math.PI * 2);
    ctx.fill();
}

// ==========================
// GAMBAR PLATFORM
// ==========================

function drawPlatforms() {

    platforms.forEach(platform => {

        // Tanah
        ctx.fillStyle = "#70402a";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );

        // Rumput
        ctx.fillStyle = "#35c94a";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            8
        );
    });
}

// ==========================
// GAMBAR PLAYER
// ==========================

function drawPlayer() {

    // Kepala
    ctx.fillStyle = "#f1c27d";

    ctx.beginPath();

    ctx.arc(
        player.x + 18,
        player.y + 10,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Badan
    ctx.fillStyle = "#247cff";

    ctx.fillRect(
        player.x + 5,
        player.y + 20,
        26,
        20
    );

    // Kaki
    ctx.fillStyle = "#222";

    ctx.fillRect(
        player.x + 5,
        player.y + 40,
        10,
        5
    );

    ctx.fillRect(
        player.x + 20,
        player.y + 40,
        10,
        5
    );
}

// ==========================
// GAMBAR COIN
// ==========================

function drawCoins() {

    coins.forEach(coin => {

        if (coin.collected) return;

        ctx.fillStyle = "#ffd21f";

        ctx.beginPath();

        ctx.arc(
            coin.x,
            coin.y,
            coin.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "#ff9d00";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#fff3a0";

        ctx.beginPath();

        ctx.arc(
            coin.x - 4,
            coin.y - 4,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

// ==========================
// GAMBAR BENDERA
// ==========================

function drawFlag() {

    // Tiang
    ctx.fillStyle = "#ddd";

    ctx.fillRect(
        flag.x,
        flag.y,
        5,
        flag.height
    );

    // Bendera
    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.moveTo(flag.x + 5, flag.y);
    ctx.lineTo(flag.x + 45, flag.y + 15);
    ctx.lineTo(flag.x + 5, flag.y + 30);

    ctx.closePath();

    ctx.fill();
}

// ==========================
// GAME OVER / MENANG
// ==========================

function drawMessage() {

    if (gameOver) {

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "bold 40px Arial";
        ctx.fillText(
            "GAME OVER",
            280,
            190
        );

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Klik Restart untuk bermain lagi",
            240,
            230
        );
    }

    if (menang) {

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#247cff";
        ctx.font = "bold 40px Arial";

        ctx.fillText(
            "🎉 KAMU MENANG!",
            220,
            190
        );

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";

        ctx.fillText(
            "Semua coin berhasil dikumpulkan!",
            230,
            230
        );
    }
}

// ==========================
// DRAW
// ==========================

function draw() {

    drawBackground();
    drawPlatforms();
    drawCoins();
    drawFlag();
    drawPlayer();
    drawMessage();
}

// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// ==========================
// RESTART
// ==========================

function restartGame() {

    player.x = 50;
    player.y = 300;
    player.velocityY = 0;

    score = 0;
    scoreText.textContent = score;

    gameOver = false;
    menang = false;

    coins.forEach(coin => {
        coin.collected = false;
    });
}

gameLoop();
