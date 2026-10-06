// 儲存五題 p5.js 簡易指令測驗資料。
const questions = [
  // 設定第一題資料。
  {
    // 設定第一題題目。
    question: "哪一個函式可以建立 p5.js 畫布？",
    // 設定第一題的四個選項。
    options: ["createCanvas()", "makeCanvas()", "newCanvas()", "canvasCreate()"],
    // 設定第一題正確答案的索引值。
    answer: 0
  },

  // 設定第二題資料。
  {
    // 設定第二題題目。
    question: "哪一個函式可以設定畫布背景顏色？",
    // 設定第二題的四個選項。
    options: ["bg()", "background()", "canvasColor()", "fillBackground()"],
    // 設定第二題正確答案的索引值。
    answer: 1
  },

  // 設定第三題資料。
  {
    // 設定第三題題目。
    question: "哪一個函式可以繪製橢圓形？",
    // 設定第三題的四個選項。
    options: ["circle()", "ellipse()", "oval()", "round()"],
    // 設定第三題正確答案的索引值。
    answer: 1
  },

  // 設定第四題資料。
  {
    // 設定第四題題目。
    question: "p5.js 中通常只會執行一次的函式是哪一個？",
    // 設定第四題的四個選項。
    options: ["draw()", "loop()", "setup()", "start()"],
    // 設定第四題正確答案的索引值。
    answer: 2
  },

  // 設定第五題資料。
  {
    // 設定第五題題目。
    question: "p5.js 中會持續重複執行的函式是哪一個？",
    // 設定第五題的四個選項。
    options: ["repeat()", "draw()", "run()", "animate()"],
    // 設定第五題正確答案的索引值。
    answer: 1
  }
];

// 儲存目前題目的索引值。
let currentQuestion = 0;

// 儲存使用者答對的題數。
let score = 0;

// 儲存使用者選擇的答案索引值。
let selectedAnswer = -1;

// 儲存目前題目是否已答對。
let questionCompleted = false;

// 儲存目前題目是否答錯。
let answerIsWrong = false;

// 儲存正確選項動畫的開始時間。
let animationStartTime = 0;

// 儲存所有選項的畫面區域。
let optionAreas = [];

// 儲存下一題按鈕的畫面區域。
let nextButtonArea = null;

// 儲存目前裝置與畫布的版面設定。
let layout = {};

// 建立畫布並設定初始畫面。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平與垂直置中。
  textAlign(CENTER, CENTER);

  // 設定矩形從左上角開始繪製。
  rectMode(CORNER);

  // 關閉圖形外框。
  noStroke();

  // 計算響應式版面尺寸。
  calculateLayout();
}

// 持續繪製測驗畫面。
function draw() {
  // 設定深色背景。
  background("#18212F");

  // 持續更新響應式版面設定。
  calculateLayout();

  // 判斷是否完成全部題目。
  if (currentQuestion >= questions.length) {
    // 顯示測驗結果。
    drawResult();

    // 結束目前這一幀的繪製。
    return;
  }

  // 顯示測驗標題與進度。
  drawHeader();

  // 顯示目前題目。
  drawQuestion();

  // 顯示四個選項。
  drawOptions();

  // 顯示下一題按鈕。
  drawNextButton();
}

// 根據目前畫布大小計算所有版面尺寸。
function calculateLayout() {
  // 取得目前畫布寬度。
  const canvasWidth = width;

  // 取得目前畫布高度。
  const canvasHeight = height;

  // 計算左右安全邊距，避免手機畫面貼邊。
  const sidePadding = constrain(canvasWidth * 0.06, 16, 48);

  // 計算內容最大寬度，避免電腦畫面過度拉寬。
  const contentWidth = min(canvasWidth - sidePadding * 2, 820);

  // 判斷目前是否為窄版手機畫面。
  const isSmallScreen = canvasWidth < 480;

  // 判斷目前是否為橫向畫面。
  const isLandscape = canvasWidth > canvasHeight;

  // 根據螢幕方向與寬度計算標題大小。
  const titleSize = isSmallScreen
    ? min(28, canvasWidth * 0.075)
    : isLandscape
      ? min(34, canvasWidth * 0.055)
      : min(42, canvasWidth * 0.075);

  // 根據螢幕大小計算一般文字大小。
  const bodySize = isSmallScreen
    ? min(18, canvasWidth * 0.048)
    : min(23, canvasWidth * 0.04);

  // 根據螢幕大小計算題目文字大小。
  const questionSize = isSmallScreen
    ? min(22, canvasWidth * 0.06)
    : isLandscape
      ? min(25, canvasWidth * 0.04)
      : min(30, canvasWidth * 0.055);

  // 根據螢幕大小計算選項高度。
  const optionHeight = isSmallScreen ? 56 : 64;

  // 根據螢幕方向計算選項開始位置。
  const optionStartY = isLandscape
    ? max(170, canvasHeight * 0.32)
    : max(220, canvasHeight * 0.29);

  // 根據選項高度計算選項間距。
  const optionGap = isSmallScreen ? 12 : 16;

  // 根據目前版面計算下一題按鈕高度。
  const buttonHeight = isSmallScreen ? 52 : 58;

  // 根據畫布大小計算下一題按鈕寬度。
  const buttonWidth = min(contentWidth, isSmallScreen ? 260 : 300);

  // 根據螢幕方向計算下一題按鈕垂直位置。
  const buttonY = isLandscape
    ? min(canvasHeight - buttonHeight - 18, optionStartY + optionHeight * 4 + optionGap * 4)
    : min(canvasHeight - buttonHeight - 24, optionStartY + optionHeight * 4 + optionGap * 4);

  // 儲存完整的響應式版面設定。
  layout = {
    // 儲存左右邊距。
    sidePadding: sidePadding,

    // 儲存內容寬度。
    contentWidth: contentWidth,

    // 儲存標題文字大小。
    titleSize: titleSize,

    // 儲存一般文字大小。
    bodySize: bodySize,

    // 儲存題目文字大小。
    questionSize: questionSize,

    // 儲存選項高度。
    optionHeight: optionHeight,

    // 儲存選項起始位置。
    optionStartY: optionStartY,

    // 儲存選項間距。
    optionGap: optionGap,

    // 儲存下一題按鈕寬度。
    buttonWidth: buttonWidth,

    // 儲存下一題按鈕高度。
    buttonHeight: buttonHeight,

    // 儲存下一題按鈕垂直位置。
    buttonY: buttonY,

    // 儲存目前是否為窄版畫面。
    isSmallScreen: isSmallScreen
  };
}

// 繪製測驗標題與進度。
function drawHeader() {
  // 設定標題文字顏色。
  fill("#FFFFFF");

  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 根據畫面高度計算標題垂直位置。
  const titleY = max(28, min(48, height * 0.075));

  // 顯示測驗標題。
  text("p5.js 簡易指令測驗", width / 2, titleY);

  // 設定進度文字顏色。
  fill("#B7C7D9");

  // 設定進度文字大小。
  textSize(layout.bodySize);

  // 計算進度文字垂直位置。
  const progressY = titleY + layout.titleSize * 1.35;

  // 顯示目前題數與總題數。
  text(
    "第 " + (currentQuestion + 1) + " 題／共 " + questions.length + " 題",
    width / 2,
    progressY
  );
}

// 繪製目前題目。
function drawQuestion() {
  // 設定題目文字顏色。
  fill("#FFFFFF");

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 計算題目區域寬度。
  const questionWidth = layout.contentWidth;

  // 計算題目區域垂直位置。
  const questionY = layout.isSmallScreen ? 142 : 150;

  // 計算題目區域高度。
  const questionHeight = layout.isSmallScreen ? 88 : 100;

  // 顯示目前題目。
  text(
    questions[currentQuestion].question,
    width / 2,
    questionY,
    questionWidth,
    questionHeight
  );
}

// 繪製四個答案選項。
function drawOptions() {
  // 清除上一幀的選項位置資料。
  optionAreas = [];

  // 計算選項水平位置。
  const optionX = (width - layout.contentWidth) / 2;

  // 逐一繪製四個選項。
  for (let i = 0; i < 4; i++) {
    // 計算目前選項的垂直位置。
    let optionY =
      layout.optionStartY + i * (layout.optionHeight + layout.optionGap);

    // 判斷是否需要讓正確選項上下跳動。
    if (answerIsWrong && i === questions[currentQuestion].answer) {
      // 計算正確選項的上下動畫位移。
      const bounceOffset =
        sin((millis() - animationStartTime) * 0.012) * 9;

      // 將動畫位移加入選項垂直位置。
      optionY += bounceOffset;
    }

    // 儲存目前選項的畫面區域。
    optionAreas.push({
      // 儲存選項水平位置。
      x: optionX,

      // 儲存選項垂直位置。
      y: optionY,

      // 儲存選項寬度。
      width: layout.contentWidth,

      // 儲存選項高度。
      height: layout.optionHeight
    });

    // 判斷是否為答錯後的正確選項。
    if (answerIsWrong && i === questions[currentQuestion].answer) {
      // 設定正確選項的粉紅色背景。
      fill("#F7B1B0");
    } else if (questionCompleted && i === selectedAnswer) {
      // 設定答對選項的綠色背景。
      fill("#79D6A5");
    } else {
      // 設定一般選項的深色背景。
      fill("#2D4055");
    }

    // 繪製圓角選項背景。
    rect(optionX, optionY, layout.contentWidth, layout.optionHeight, 12);

    // 判斷目前是否為粉紅色正確選項。
    if (answerIsWrong && i === questions[currentQuestion].answer) {
      // 設定粉紅色背景上的文字顏色。
      fill("#351D22");
    } else {
      // 設定一般選項文字顏色。
      fill("#FFFFFF");
    }

    // 設定選項文字大小。
    textSize(layout.bodySize);

    // 顯示選項文字。
    text(
      String.fromCharCode(65 + i) +
        ". " +
        questions[currentQuestion].options[i],
      optionX + layout.contentWidth / 2,
      optionY + layout.optionHeight / 2
    );
  }
}

// 繪製下一題按鈕。
function drawNextButton() {
  // 判斷目前題目是否已答對。
  if (!questionCompleted) {
    // 清除下一題按鈕區域。
    nextButtonArea = null;

    // 結束函式。
    return;
  }

  // 計算下一題按鈕水平位置。
  const buttonX = (width - layout.buttonWidth) / 2;

  // 建立下一題按鈕區域資料。
  nextButtonArea = {
    // 儲存按鈕水平位置。
    x: buttonX,

    // 儲存按鈕垂直位置。
    y: layout.buttonY,

    // 儲存按鈕寬度。
    width: layout.buttonWidth,

    // 儲存按鈕高度。
    height: layout.buttonHeight
  };

  // 設定按鈕背景顏色。
  fill("#4B9FE1");

  // 繪製下一題按鈕。
  rect(
    buttonX,
    layout.buttonY,
    layout.buttonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#FFFFFF");

  // 設定按鈕文字大小。
  textSize(layout.bodySize);

  // 判斷目前是否為最後一題。
  if (currentQuestion === questions.length - 1) {
    // 顯示查看結果文字。
    text(
      "查看結果",
      width / 2,
      layout.buttonY + layout.buttonHeight / 2
    );
  } else {
    // 顯示下一題文字。
    text(
      "下一題",
      width / 2,
      layout.buttonY + layout.buttonHeight / 2
    );
  }
}

// 處理滑鼠點擊事件。
function mousePressed() {
  // 如果已完成所有題目，則不再處理點擊。
  if (currentQuestion >= questions.length) {
    // 結束滑鼠事件。
    return;
  }

  // 如果目前題目已答對，則檢查下一題按鈕。
  if (questionCompleted) {
    // 確認下一題按鈕區域存在。
    if (nextButtonArea !== null) {
      // 判斷滑鼠是否點擊下一題按鈕。
      if (isPointInside(mouseX, mouseY, nextButtonArea)) {
        // 前往下一題。
        nextQuestion();
      }
    }

    // 結束滑鼠事件。
    return;
  }

  // 逐一檢查四個選項。
  for (let i = 0; i < optionAreas.length; i++) {
    // 判斷滑鼠是否點擊目前選項。
    if (isPointInside(mouseX, mouseY, optionAreas[i])) {
      // 檢查使用者答案。
      checkAnswer(i);

      // 結束選項檢查。
      return;
    }
  }
}

// 處理觸控點擊事件。
function touchStarted() {
  // 執行與滑鼠相同的點擊處理。
  mousePressed();

  // 防止手機瀏覽器產生額外的捲動或縮放。
  return false;
}

// 檢查使用者選擇的答案。
function checkAnswer(answerIndex) {
  // 儲存使用者選擇的選項。
  selectedAnswer = answerIndex;

  // 判斷使用者是否答對。
  if (answerIndex === questions[currentQuestion].answer) {
    // 將目前題目設定為已完成。
    questionCompleted = true;

    // 清除答錯狀態。
    answerIsWrong = false;

    // 將答對題數增加一題。
    score++;
  } else {
    // 設定目前題目為答錯狀態。
    answerIsWrong = true;

    // 記錄動畫開始時間。
    animationStartTime = millis();
  }
}

// 前往下一題。
function nextQuestion() {
  // 將目前題目索引增加一題。
  currentQuestion++;

  // 清除使用者選擇的答案。
  selectedAnswer = -1;

  // 清除題目完成狀態。
  questionCompleted = false;

  // 清除答錯狀態。
  answerIsWrong = false;

  // 清除下一題按鈕區域。
  nextButtonArea = null;
}

// 繪製最後的測驗結果。
function drawResult() {
  // 設定結果標題文字顏色。
  fill("#FFFFFF");

  // 設定結果標題文字大小。
  textSize(min(50, width * 0.09));

  // 顯示測驗完成文字。
  text("測驗完成！", width / 2, height * 0.32);

  // 設定分數文字顏色。
  fill("#F7B1B0");

  // 設定分數文字大小。
  textSize(min(38, width * 0.07));

  // 顯示答對題數。
  text(
    "你答對了 " + score + "／" + questions.length + " 題",
    width / 2,
    height * 0.47
  );

  // 設定提示文字顏色。
  fill("#B7C7D9");

  // 設定提示文字大小。
  textSize(min(24, width * 0.045));

  // 顯示測驗結束提示。
  text("感謝完成 p5.js 指令測驗！", width / 2, height * 0.58);
}

// 判斷指定座標是否位於矩形區域內。
function isPointInside(pointX, pointY, area) {
  // 回傳座標是否同時符合水平與垂直範圍。
  return (
    pointX >= area.x &&
    pointX <= area.x + area.width &&
    pointY >= area.y &&
    pointY <= area.y + area.height
  );
}

// 當瀏覽器視窗大小改變時重新調整畫布。
function windowResized() {
  // 重新建立符合新視窗大小的畫布。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算所有響應式尺寸。
  calculateLayout();
}