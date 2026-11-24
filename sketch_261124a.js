// ================================================
//  动物性格测试 · 简洁版（只显示图片）
// ================================================

let W = 400, H = 860;
let screen = 0;
let answers = [0, 0, 0, 0];
let totalScore10 = 0;
let resultIndex = 0;
let imgY = 0, imgH = 0;

let qImgs = [], rImgs = [];

function preload() {
  for (let i = 0; i < 4; i++) {
    qImgs[i] = loadImage("data/q" + (i + 1) + ".png");
    rImgs[i] = loadImage("data/r" + i + ".png");
  }
}

function setup() {
  let s = min(windowWidth / W, windowHeight / H, 1);
  createCanvas(W * s, H * s);
  textAlign(CENTER, CENTER);
  noStroke();
}

let drawScale = 1;

function draw() {
  push();
  drawScale = width / W;
  scale(drawScale);
  background(245, 245, 246);

  if (screen === 0)      drawStart();
  else if (screen <= 4)  drawQuestion(screen - 1);
  else                   drawResult();
  pop();
}

function getMouse() {
  return { x: mouseX / drawScale, y: mouseY / drawScale };
}

// ===== 开始页 =====
function drawStart() {
  fill(30); textSize(34);
  text("动物性格测试", W/2, 200);
  fill(130); textSize(16);
  text("回答 4 个问题", W/2, 260);
  text("点击你认为最像自己的选项", W/2, 288);
  button("开始测试", W/2 - 110, 350);
}

// ===== 题目页 =====
function drawQuestion(qi) {
  let img = qImgs[qi];
  if (!img) {
    fill(200, 0, 0); textSize(16);
    text("缺少图片 q" + (qi + 1) + ".png", W/2, 300);
    return;
  }
  let iw = W;
  let ih = iw * img.height / img.width;
  let oy = (H - ih) / 2 - 30;
  imageMode(CORNER);
  image(img, 0, oy, iw, ih);

  fill(150); textSize(14);
  text("第 " + (qi + 1) + " / 4 题", W/2, 40);

  imgY = oy; imgH = ih;
}

// ===== 结果页（只有得分 + 图片 + 按钮）=====
function drawResult() {
  fill(30); textSize(28);
  text("你的得分", W/2, 55);

  fill(45, 55, 65); textSize(58);
  text(nf(totalScore10, 1, 1), W/2, 125);
  fill(140); textSize(15);
  text("/ 10 分", W/2, 172);

  // 结果图片：尽量放大，宽度撑满左右留 40px
  let img = rImgs[resultIndex];
  if (img) {
    let iw = W - 80;
    let ih = iw * img.height / img.width;
    let maxH = H - 480;   // 给得分和按钮留出空间
    if (ih > maxH) { ih = maxH; iw = ih * img.width / img.height; }
    image(img, W/2 - iw/2, 220, iw, ih);
  }

  button("重新测试", W/2 - 110, 780);
}

// ===== 按钮 =====
function button(label, x, y) {
  let m = getMouse();
  let hover = m.x > x && m.x < x + 220 && m.y > y && m.y < y + 58;
  fill(hover ? color(70, 82, 95) : color(45, 55, 65));
  rect(x, y, 220, 58, 29);
  fill(255); textSize(17);
  text(label, x + 110, y + 29);
}

// ===== 点击 =====
function mousePressed() { handleClick(); }
function touchStarted() { handleClick(); return false; }

function handleClick() {
  let m = getMouse();

  if (screen === 0) {
    if (m.x > W/2-110 && m.x < W/2+110 && m.y > 350 && m.y < 408) {
      answers = [0, 0, 0, 0];
      screen = 1;
    }
    return;
  }

  if (screen >= 1 && screen <= 4) {
    let qi = screen - 1;
    let picked = pickOption(qi, m);
    if (picked > 0) {
      answers[qi] = picked;
      if (qi < 3) screen++;
      else { calculateResult(); screen = 5; }
    }
    return;
  }

  if (screen === 5) {
    if (m.x > W/2-110 && m.x < W/2+110 && m.y > 780 && m.y < 838) {
      screen = 0;
    }
  }
}

// ===== 判断点中哪个选项 =====
const optYs = [218, 288, 361, 430];
const optHs = [62, 62, 59, 60];

function pickOption(qi, m) {
  let img = qImgs[qi];
  if (!img) return 0;
  let s = W / img.width;
  let relX = m.x / s;
  let relY = (m.y - imgY) / s;
  if (relX < 48 || relX > 355) return 0;
  for (let i = 0; i < 4; i++) {
    if (relY > optYs[i] && relY < optYs[i] + optHs[i]) return i + 1;
  }
  return 0;
}

// ===== 计算结果 =====
function calculateResult() {
  let sum = answers[0] + answers[1] + answers[2] + answers[3];
  totalScore10 = map(sum, 4, 16, 0, 10);
  if (totalScore10 >= 9)      resultIndex = 3;   // 猫鲸
  else if (totalScore10 >= 7) resultIndex = 2;   // 鳄鱼
  else if (totalScore10 >= 4) {
    if (answers[0] <= 2 && answers[2] <= 2) resultIndex = 0;  // 猪猪
    else resultIndex = 1;                                      // 梅花鹿
  }
  else resultIndex = 0;
}

function windowResized() {
  let s = min(windowWidth / W, windowHeight / H, 1);
  resizeCanvas(W * s, H * s);
}
