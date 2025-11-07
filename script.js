// 1. 程式碼從這裡開始
document.addEventListener("DOMContentLoaded", () => {
  
  // --- 全域變數 ---
  // DOM 元素
  let koreanWordEl, romanizationEl, chineseWordEl, speakBtn, categorySelect;
  let learnModeBtn, quizModeBtn, cardView, navButtons, quizView;
  let learnModeControls, quizModeDescription;
  let hangulBtn, hangulModal, closeHangul;
  let wordlistBtn, wordlistModal, closeWordlist, wordlistBody;
  let questionEl, answerInput, feedbackEl, scoreEl, submitBtn, nextQuestionBtn, numberOfQuizEl;

  // 應用程式狀態
  let currentIndex = 0;
  let synth = null;
  let koreanVoice = null;
  let quizLimit = 10;
  let quizCorrect = 0;
  let quizTotal = 0;
  let currentQuizWord = null;
  let quizType = '';
  
  // ⭐ 資料庫變數
  let wordDatabase = {}; // 這個物件將用來儲存從 JSON 載入的所有單字
  let words = []; // 當前分類的單字陣列

  
  // 2. ⭐ 主要的啟動函式 (非同步)
  // 這個函式會先去抓取 JSON 資料，成功後才初始化整個 App
  async function initializeApp() {
    try {
      // 嘗試去抓取 `words.json` 檔案
      const response = await fetch('words.json');
      if (!response.ok) {
        throw new Error('無法載入 words.json: ' + response.statusText);
      }
      // 將抓取到的內容轉換為 JSON 物件
      wordDatabase = await response.json();
      
      // 3. ⭐ 資料載入成功，才開始執行 App
      console.log("單字資料庫載入成功!");
      
      // 3.1. 執行 DOM 元素選取 (現在才安全)
      findAllDOMElements();
      
      // 3.2. 綁定所有事件監聽器
      attachEventListeners();
      
      // 3.3. 初始化語音
      initializeSpeech();
      
      // 3.4. ⭐【新功能】載入進度或預設單字
      loadProgressOrDefault();

    } catch (error) {
      // 如果
      console.error("應用程式初始化失敗:", error);
      document.body.innerHTML = `<div style="padding: 20px; color: red; text-align: center;"><h1>錯誤</h1><p>無法載入單字資料 (words.json)。請檢查檔案是否存在，且 JSON 格式正確。</p></div>`;
    }
  }

  // 4. DOM 元素選取 (拆分成獨立函式)
  function findAllDOMElements() {
    koreanWordEl = document.getElementById("korean-word");
    romanizationEl = document.getElementById("romanization");
    chineseWordEl = document.getElementById("chinese-word");
    speakBtn = document.getElementById("speak-btn");
    categorySelect = document.getElementById("category-select");
    learnModeBtn = document.getElementById("learn-mode-btn");
    quizModeBtn = document.getElementById("quiz-mode-btn");
    cardView = document.getElementById("card-view");
    navButtons = document.getElementById("nav-buttons");
    quizView = document.getElementById("quiz-view");
    learnModeControls = document.getElementById("learn-mode-controls");
    quizModeDescription = document.getElementById("quiz-mode-description");
    hangulBtn = document.getElementById("toggle-hangul");
    hangulModal = document.getElementById("hangul-modal");
    closeHangul = document.getElementById("close-hangul");
    wordlistBtn = document.getElementById("toggle-wordlist");
    wordlistModal = document.getElementById("wordlist-modal");
    closeWordlist = document.getElementById("close-wordlist");
    wordlistBody = document.getElementById("wordlist-body");
    questionEl = document.getElementById('question');
    answerInput = document.getElementById('answer-input');
    feedbackEl = document.getElementById('feedback');
    scoreEl = document.getElementById('score');
    submitBtn = document.getElementById('submit-btn');
    nextQuestionBtn = document.getElementById('next-question-btn');
    numberOfQuizEl = document.getElementById('number-of-quiz');
  }

  // 5. 事件監聽器 (拆分成獨立函式)
  function attachEventListeners() {
    // 上/下一字
    document.getElementById("next-btn").addEventListener("click", () => {
      if (!words || words.length === 0) return;
      currentIndex = (currentIndex + 1) % words.length;
      updateWord();
      saveProgress(); // ⭐ 儲存進度
    });
    document.getElementById("prev-btn").addEventListener("click", () => {
      if (!words || words.length === 0) return;
      currentIndex = (currentIndex - 1 + words.length) % words.length;
      updateWord();
      saveProgress(); // ⭐ 儲存進度
    });

    // 發音
    speakBtn.addEventListener("click", () => {
      if (!synth || !words || words.length === 0) return;
      const word = words[currentIndex].word;
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = "ko-KR";
      if (koreanVoice) utter.voice = koreanVoice;
      utter.pitch = 1;
      utter.rate = 0.9;
      synth.speak(utter);
    });

    // 分類切換
    categorySelect.addEventListener("change", (e) => {
      const category = e.target.value;
      words = wordDatabase[category] || []; // 從 wordDatabase 中讀取
      currentIndex = 0;
      updateWord();
      saveProgress(); // ⭐ 儲存進度
      if (!quizView.classList.contains("hidden")) {
        resetQuiz();
      }
    });

    // 模式切換
    learnModeBtn.addEventListener("click", () => {
      quizView.classList.add("hidden");
      cardView.classList.remove("hidden");
      navButtons.classList.remove("hidden");
      learnModeControls.classList.remove("hidden");
      quizModeDescription.classList.add("hidden");
      learnModeBtn.classList.add("bg-indigo-500", "text-white");
      learnModeBtn.classList.remove("text-gray-700");
      quizModeBtn.classList.add("text-gray-700");
      quizModeBtn.classList.remove("bg-indigo-500", "text-white");
    });
    quizModeBtn.addEventListener("click", () => {
      cardView.classList.add("hidden");
      navButtons.classList.add("hidden");
      quizView.classList.remove("hidden");
      resetQuiz();
      learnModeControls.classList.add("hidden");
      quizModeDescription.classList.remove("hidden");
      quizModeBtn.classList.add("bg-indigo-500", "text-white");
      quizModeBtn.classList.remove("text-gray-700");
      learnModeBtn.classList.add("text-gray-700");
      learnModeBtn.classList.remove("bg-indigo-500", "text-white");
    });

    // 單字總覽
    wordlistBtn.addEventListener("click", () => {
      const selectedCategory = categorySelect.value;
      const wordsToShow = wordDatabase[selectedCategory] || [];
      wordlistBody.innerHTML = "";
      wordsToShow.forEach(word => {
        const row = document.createElement("tr");
        row.className = "hover:bg-indigo-50 cursor-pointer";
        row.onclick = () => {
          const selectedIndex = words.findIndex(w => w.word === word.word);
          if (selectedIndex !== -1) currentIndex = selectedIndex;
          updateWord();
          saveProgress(); // ⭐ 儲存進度
          wordlistModal.classList.add("hidden");
          if (!quizView.classList.contains("hidden")) learnModeBtn.click();
          cardView.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        row.innerHTML = `
          <td class="px-4 py-2 border-b">${word.word}</td>
          <td class="px-4 py-2 border-b">${word.meaning}</td>
          <td class="px-4 py-2 border-b">${word.romanization}</td>
        `;
        wordlistBody.appendChild(row);
      });
      wordlistModal.classList.remove("hidden");
    });
    closeWordlist.addEventListener("click", () => {
      wordlistModal.classList.add("hidden");
    });

    // 40音表
    hangulBtn.addEventListener("click", () => {
      hangulModal.classList.remove("hidden");
    });
    closeHangul.addEventListener("click", () => {
      hangulModal.classList.add("hidden");
    });

    // 測驗按鈕
    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !submitBtn.classList.contains('hidden')) checkAnswer();
    });
    nextQuestionBtn.addEventListener('click', () => {
      if (nextQuestionBtn.textContent === "重新測驗") resetQuiz();
      else setupQuiz();
    });
  }


  // 6. 應用程式邏輯函式 (保持不變)
  
  // ⭐ 新增：儲存進度到 localStorage
  function saveProgress() {
    try {
      const progress = {
        category: categorySelect.value,
        index: currentIndex
      };
      localStorage.setItem('koreanVocabProgress', JSON.stringify(progress));
    } catch (e) {
      console.error("無法儲存進度到 localStorage:", e);
    }
  }

  // ⭐ 新增：讀取進度或設定預設值
  function loadProgressOrDefault() {
    let savedCategory = 'people'; // 預設分類
    let savedIndex = 0;           // 預設索引
    
    try {
      const savedProgressJSON = localStorage.getItem('koreanVocabProgress');
      if (savedProgressJSON) {
        const savedProgress = JSON.parse(savedProgressJSON);
        // 檢查儲存的分類是否仍然存在於資料庫中
        if (wordDatabase[savedProgress.category]) {
          savedCategory = savedProgress.category;
          savedIndex = parseInt(savedProgress.index, 10) || 0;
        }
      }
    } catch (e) {
      console.error("無法讀取儲存的進度:", e);
      localStorage.removeItem('koreanVocabProgress'); // 如果解析失敗，清除壞資料
    }

    // 將讀取到的（或預設的）值設定到 UI 和狀態
    categorySelect.value = savedCategory;
    words = wordDatabase[savedCategory];
    
    // 檢查索引是否在目前分類的範圍內
    if (savedIndex >= 0 && words && savedIndex < words.length) {
      currentIndex = savedIndex;
    } else {
      currentIndex = 0; // 如果索引無效，重設為 0
    }

    // 最後，更新畫面
    updateWord();
  }


  // 語音初始化
  function initializeSpeech() {
    if ('speechSynthesis' in window) {
      synth = window.speechSynthesis;
      const loadVoices = () => {
        const voices = synth.getVoices();
        koreanVoice = voices.find(voice => voice.lang === 'ko-KR');
        if (!koreanVoice) {
          setTimeout(() => {
            const voices = synth.getVoices();
            koreanVoice = voices.find(voice => voice.lang === 'ko-KR');
            if (!koreanVoice) disableSpeakButton();
          }, 200);
        }
      };
      loadVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    } else {
      disableSpeakButton();
    }
  }

  // 禁用語音按鈕
  function disableSpeakButton() {
    if (!speakBtn) return;
    speakBtn.disabled = true;
    speakBtn.style.opacity = '0.5';
    speakBtn.style.cursor = 'not-allowed';
    speakBtn.title = '您的瀏覽器不支援語音，建議使用 Chrome 或 Safari 開啟。';
  }

  // 更新學習卡片
  function updateWord() {
    if (!words || words.length === 0) {
        // 處理分類沒有單字的情況
        koreanWordEl.textContent = "N/A";
        romanizationEl.textContent = "---";
        chineseWordEl.textContent = "這個分類沒有單字";
        return;
    }
    const word = words[currentIndex];
    koreanWordEl.textContent = word.word;
    romanizationEl.textContent = word.romanization;
    chineseWordEl.textContent = word.meaning;
  }

  // 設定測驗題目
  function setupQuiz() {
    if (quizTotal >= quizLimit) {
      questionEl.textContent = "🎉 測驗完成！";
      answerInput.disabled = true;
      submitBtn.classList.add("hidden");
      nextQuestionBtn.classList.remove("hidden");
      nextQuestionBtn.textContent = "重新測驗";
      feedbackEl.textContent = "";
      numberOfQuizEl.textContent = `進度: ${quizLimit} / ${quizLimit}`;
      scoreEl.textContent = `最終分數: ${quizCorrect}`;
      return;
    }
    nextQuestionBtn.textContent = "下一題";
    const selectedCategory = categorySelect.value;
    words = wordDatabase[selectedCategory] || []; // 從 wordDatabase 讀取
    
    if (words.length === 0) {
        questionEl.textContent = "這個分類沒有單字可測驗";
        answerInput.disabled = true;
        submitBtn.classList.add("hidden");
        return;
    }

    answerInput.value = '';
    feedbackEl.textContent = '';
    answerInput.disabled = false;
    answerInput.classList.remove('border-green-500', 'border-red-500');
    submitBtn.classList.remove('hidden');
    nextQuestionBtn.classList.add('hidden');
    currentQuizWord = words[Math.floor(Math.random() * words.length)];
    if (Math.random() > 0.5) {
      quizType = 'chinese';
      questionEl.textContent = currentQuizWord.word;
      answerInput.lang = 'zh-Hant';
    } else {
      quizType = 'korean';
      questionEl.textContent = currentQuizWord.meaning;
      answerInput.lang = 'ko';
    }
    numberOfQuizEl.textContent = `進度: ${quizTotal + 1} / ${quizLimit}`;
    scoreEl.textContent = `分數: ${quizCorrect}`;
  }

  // 重設測驗
  function resetQuiz() {
    quizCorrect = 0;
    quizTotal = 0;
    setupQuiz();
  }

  // 檢查答案
  function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (!userAnswer) return;
    const correctAnswer = quizType === 'chinese' ? currentQuizWord.meaning : currentQuizWord.word;
    if (userAnswer === correctAnswer) {
      feedbackEl.textContent = '正確！';
      feedbackEl.className = 'mt-3 text-lg font-semibold text-green-500';
      answerInput.classList.add('border-green-500');
      quizCorrect++;
    } else {
      feedbackEl.innerHTML = `錯誤！正確答案是：<span class="font-bold text-indigo-600">${correctAnswer}</span>`;
      feedbackEl.className = 'mt-3 text-lg font-semibold text-red-500';
      answerInput.classList.add('border-red-500');
    }
    quizTotal++;
    numberOfQuizEl.textContent = `進度: ${quizTotal} / ${quizLimit}`;
    scoreEl.textContent = `分數: ${quizCorrect}`;
    answerInput.disabled = true;
    submitBtn.classList.add('hidden');
    nextQuestionBtn.classList.remove('hidden');
  }

  // --- 7. 啟動 App ---
  initializeApp();

});