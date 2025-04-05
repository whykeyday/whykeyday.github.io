let score = 0;
let highscore = 0;
let playername = '';
let highscorename = 'Unknown';
let playernameInput, resetButton;
let previousPlayername = ""; // 新增变量，保存上一个名字
 
let data;           // JSON 数据
let bgm;
let catImage;
let catImages = [];
let bgColor;
let musicOn = true;

let allthekitties = [];
let currentkitty = 0;
let kittyposition = {x: 100, y: 100, w: 100, h: 100};
let dogImages = [];
let currentDog = 0;
let dogPosition = { x: 300, y: 300, w: 100, h: 100 };



function preload() {
  data = loadJSON('data.json'); // 加载 JSON
  let url = 'https://api.thecatapi.com/v1/images/search?limit=10';
  loadJSON(url, successCallback);
  let dogUrl = 'https://api.thedogapi.com/v1/images/search?limit=10';
  loadJSON(dogUrl, successDogCallback);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
  textAlign(CENTER);

  // 背景初始颜色
  bgColor = color(255, 200, 200);

  // 加载音乐
  bgm = loadSound(data.music, () => {
    userStartAudio().then(() => {
      if (!bgm.isPlaying()) bgm.loop();
    });
  });

  // 加载图片
  for (let imgPath of data.images) {
    catImages.push(loadImage(imgPath));
  }

  // 加载本地最高分
  if (getItem('highscore') !== null) {
    highscore = int(getItem('highscore'));
    highscorename = getItem('highscorename');
  }

  playernameInput = createInput();
  playernameInput.attribute('placeholder', 'Player');
  playernameInput.position(windowWidth / 2-140, windowHeight / 7);

  let cleared = false;
playernameInput.input(() => {
  if (!cleared && playernameInput.value() === 'Player') {
    playernameInput.value('');
    cleared = true;
  }
});
playernameInput.elt.focus();


  resetButton = createButton('🔄Reset');
  resetButton.position(windowWidth /2+40, windowHeight / 7);
  resetButton.mousePressed(() => {
    clearStorage();
    highscore = 0;
    highscorename = 'Unknown';
    score = 0;
  });

  // 初始化显示第一张猫图
  catImage = random(catImages);
   // 音乐按钮事件监听
   document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
}

function draw() {
  let r = map(mouseX, 0, width, 255, 180);  // 多一点红
  let g = map(mouseY, 0, height, 180, 200); // 少一点绿
  let b = map(mouseX + mouseY, 0, width + height, 255, 230); // 多一点蓝
  background(r, g, b);

  playername = playernameInput.value();
  let currentName = playernameInput.value();
  // 如果玩家名字变了，就重置 score
  if (currentName !== previousPlayername) {
    score = 0;
    previousPlayername = currentName;
  }


  fill(255);
  ellipse(width / 2, height / 2, 100, 100);

  fill(0);
  text(`Score: ${score}`, width / 2, 30);
  text(`Player: ${playername}`, width / 2, 60);
  text(`Highscore: ${highscore} by ${highscorename}`, width / 2, 90);

  image(catImage, width / 2 - 50, height - 150, 100, 100);

  // 绘制随机猫猫（若已加载）
if (allthekitties.length > 0) {
  image(allthekitties[currentkitty], kittyposition.x, kittyposition.y, kittyposition.w, kittyposition.h);
}
if (dogImages.length > 0 && dogImages[currentDog]) {
  image(dogImages[currentDog], dogPosition.x, dogPosition.y, dogPosition.w, dogPosition.h);
}
console.log("allthekitties:", allthekitties.length, "dogImages:", dogImages.length);
}

function mousePressed() {
  // 是否点击到了中心圆圈
  if (dist(mouseX, mouseY, width / 2, height / 2) < 50) {
    addScore();
  }

  // 是否点击到了狗
  if (
    mouseX > dogPosition.x && mouseX < dogPosition.x + dogPosition.w &&
    mouseY > dogPosition.y && mouseY < dogPosition.y + dogPosition.h
  ) {
    score--; // 扣分
    currentDog = (currentDog + 1) % dogImages.length;
    dogPosition.x = random(width - dogPosition.w);
    dogPosition.y = random(height - dogPosition.h);
  }
  


  // 是否点击到了猫猫
  if (
    mouseX > kittyposition.x && mouseX < kittyposition.x + kittyposition.w &&
    mouseY > kittyposition.y && mouseY < kittyposition.y + kittyposition.h
  ) {
    addScore();

    // 显示下一只猫猫并随机位置
    currentkitty = (currentkitty + 1) % allthekitties.length;
    kittyposition.x = random(width - kittyposition.w);
    kittyposition.y = random(height - kittyposition.h);
  }
}

function addScore() {
  score++;
  if (score > highscore) {
    highscore = score;
    highscorename = playername;
    storeItem('highscore', highscore);
    storeItem('highscorename', highscorename);
  }


}


function toggleMusic() {
  if (musicOn) {
    bgm.setVolume(0);
    document.getElementById('toggleMusic').innerText = '🔈 Music On';
  } else {
    bgm.setVolume(1);
    document.getElementById('toggleMusic').innerText = '🔇 Music Off';
  }
  musicOn = !musicOn;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function successCallback(data){
  for(let kitty of data){
    let img = createImg(kitty.url);
    img.hide(); // 不要直接显示在 HTML 中
    allthekitties.push(img);
  }
}
function successDogCallback(data) {
  for (let dog of data) {
    loadImage(dog.url,
      (img) => {
        dogImages.push(img); // 加载成功
      },
      (err) => {
        console.error("🐶 Failed to load dog image:", err);
      }
    );
  }
}



