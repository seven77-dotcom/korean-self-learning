const koreanWordEl = document.getElementById("korean-word");
const romanizationEl = document.getElementById("romanization");
const chineseWordEl = document.getElementById("chinese-word");
const speakBtn = document.getElementById("speak-btn");
const categorySelect = document.getElementById("category-select");

let currentIndex = 0;
let synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().filter(voice => voice.lang.startsWith("ko"));
}
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// 🧠 所有分類陣列（只展示部分，請補上完整內容）
let peopleWords = [
  { word: "학생", romanization: "haksaeng", meaning: "學生" },
  { word: "선생님", romanization: "seonsaengnim", meaning: "老師" },
  { word: "의사", romanization: "uisa", meaning: "醫生" },
  { word: "간호사", romanization: "ganhosa", meaning: "護士" },
  { word: "경찰", romanization: "gyeongchal", meaning: "警察" },
  { word: "회사원", romanization: "hoesawon", meaning: "上班族" },
  { word: "요리사", romanization: "yorisa", meaning: "廚師" },
  { word: "운전사", romanization: "unjeonsa", meaning: "司機" },
  { word: "가수", romanization: "gasu", meaning: "歌手" },
  { word: "배우", romanization: "baeu", meaning: "演員" },
  { word: "친구", romanization: "chingu", meaning: "朋友" },
  { word: "아버지", romanization: "abeoji", meaning: "父親" },
  { word: "어머니", romanization: "eomeoni", meaning: "母親" },
  { word: "형", romanization: "hyeong", meaning: "哥哥（男用）" },
  { word: "누나", romanization: "nuna", meaning: "姊姊（男用）" },
  { word: "오빠", romanization: "oppa", meaning: "哥哥（女用）" },
  { word: "언니", romanization: "eonni", meaning: "姊姊（女用）" },
  { word: "동생", romanization: "dongsaeng", meaning: "弟妹" },
  { word: "아이", romanization: "ai", meaning: "小孩" },
  { word: "사람", romanization: "saram", meaning: "人" },

];
let placeWords = [

  { word: "집", romanization: "jip", meaning: "家" },
  { word: "학교", romanization: "hakgyo", meaning: "學校" },
  { word: "병원", romanization: "byeongwon", meaning: "醫院" },
  { word: "회사", romanization: "hoesa", meaning: "公司" },
  { word: "공원", romanization: "gongwon", meaning: "公園" },
  { word: "도서관", romanization: "doseogwan", meaning: "圖書館" },
  { word: "식당", romanization: "sikdang", meaning: "餐廳" },
  { word: "카페", romanization: "kape", meaning: "咖啡廳" },
  { word: "시장", romanization: "sijang", meaning: "市場" },
  { word: "백화점", romanization: "baekhwajeom", meaning: "百貨公司" },
  { word: "은행", romanization: "eunhaeng", meaning: "銀行" },
  { word: "우체국", romanization: "ucheguk", meaning: "郵局" },
  { word: "지하철역", romanization: "jihacheolyeok", meaning: "地鐵站" },
  { word: "버스정류장", romanization: "beoseu jeongnyujang", meaning: "公車站" },
  { word: "공항", romanization: "gonghang", meaning: "機場" },
  { word: "화장실", romanization: "hwajangsil", meaning: "廁所" },
  { word: "교실", romanization: "gyosil", meaning: "教室" },
  { word: "서점", romanization: "seojeom", meaning: "書店" },
  { word: "극장", romanization: "geukjang", meaning: "電影院" },
  { word: "놀이터", romanization: "noriteo", meaning: "遊樂場" },

];
let foodWords = [
  
   { word: "사과", romanization: "sagwa", meaning: "蘋果" },
  { word: "바나나", romanization: "banana", meaning: "香蕉" },
  { word: "포도", romanization: "podo", meaning: "葡萄" },
  { word: "딸기", romanization: "ttalgi", meaning: "草莓" },
  { word: "수박", romanization: "subak", meaning: "西瓜" },
  { word: "오렌지", romanization: "orenji", meaning: "橘子" },
  { word: "빵", romanization: "ppang", meaning: "麵包" },
  { word: "밥", romanization: "bap", meaning: "飯" },
  { word: "국", romanization: "guk", meaning: "湯" },
  { word: "김치", romanization: "gimchi", meaning: "泡菜" },
  { word: "고기", romanization: "gogi", meaning: "肉" },
  { word: "생선", romanization: "saengseon", meaning: "魚" },
  { word: "계란", romanization: "gyeran", meaning: "雞蛋" },
  { word: "우유", romanization: "uyu", meaning: "牛奶" },
  { word: "커피", romanization: "keopi", meaning: "咖啡" },
  { word: "차", romanization: "cha", meaning: "茶" },
  { word: "물", romanization: "mul", meaning: "水" },
  { word: "주스", romanization: "juseu", meaning: "果汁" },
  { word: "맥주", romanization: "maekju", meaning: "啤酒" },
  { word: "과자", romanization: "gwaja", meaning: "零食" }

];

let verbWords = [
  
  { word: "가다", romanization: "gada", meaning: "去" },
  { word: "오다", romanization: "oda", meaning: "來" },
  { word: "하다", romanization: "hada", meaning: "做" },
  { word: "먹다", romanization: "meokda", meaning: "吃" },
  { word: "마시다", romanization: "masida", meaning: "喝" },
  { word: "보다", romanization: "boda", meaning: "看" },
  { word: "듣다", romanization: "deutda", meaning: "聽" },
  { word: "말하다", romanization: "malhada", meaning: "說" },
  { word: "읽다", romanization: "ikda", meaning: "讀" },
  { word: "쓰다", romanization: "sseuda", meaning: "寫" },
  { word: "일하다", romanization: "ilhada", meaning: "工作" },
  { word: "공부하다", romanization: "gongbuhada", meaning: "學習" },
  { word: "운동하다", romanization: "undonghada", meaning: "運動" },
  { word: "자다", romanization: "jada", meaning: "睡覺" },
  { word: "일어나다", romanization: "ireonada", meaning: "起床" },
  { word: "앉다", romanization: "anjda", meaning: "坐下" },
  { word: "서다", romanization: "seoda", meaning: "站立" },
  { word: "걷다", romanization: "geotda", meaning: "走路" },
  { word: "달리다", romanization: "dallida", meaning: "跑步" },
  { word: "춤추다", romanization: "chumchuda", meaning: "跳舞" }
  
  ];
  
let adjWords = [
  
  { word: "예쁘다", romanization: "yeppeuda", meaning: "漂亮" },
  { word: "잘생기다", romanization: "jalsaenggida", meaning: "帥氣" },
  { word: "귀엽다", romanization: "gwiyeopda", meaning: "可愛" },
  { word: "크다", romanization: "keuda", meaning: "大" },
  { word: "작다", romanization: "jakda", meaning: "小" },
  { word: "길다", romanization: "gilda", meaning: "長" },
  { word: "짧다", romanization: "jjalbda", meaning: "短" },
  { word: "좋다", romanization: "jota", meaning: "好" },
  { word: "나쁘다", romanization: "nappeuda", meaning: "不好" },
  { word: "빠르다", romanization: "ppareuda", meaning: "快" },
  { word: "느리다", romanization: "neurida", meaning: "慢" },
  { word: "덥다", romanization: "deopda", meaning: "熱" },
  { word: "춥다", romanization: "chupda", meaning: "冷" },
  { word: "비싸다", romanization: "bissada", meaning: "貴" },
  { word: "싸다", romanization: "ssada", meaning: "便宜" },
  { word: "깨끗하다", romanization: "kkaekkeuthada", meaning: "乾淨" },
  { word: "더럽다", romanization: "deoreopda", meaning: "髒" },
  { word: "행복하다", romanization: "haengbokhada", meaning: "幸福" },
  { word: "슬프다", romanization: "seulpeuda", meaning: "悲傷" },
  { word: "피곤하다", romanization: "pigonhada", meaning: "疲倦" }
  
  ];
  
let timeWords = [ 
  
  { word: "오늘", romanization: "oneul", meaning: "今天" },
  { word: "내일", romanization: "naeil", meaning: "明天" },
  { word: "어제", romanization: "eoje", meaning: "昨天" },
  { word: "지금", romanization: "jigeum", meaning: "現在" },
  { word: "이따가", romanization: "ittaga", meaning: "等一下" },
  { word: "방금", romanization: "banggeum", meaning: "剛剛" },
  { word: "언제", romanization: "eonje", meaning: "什麼時候" },
  { word: "아침", romanization: "achim", meaning: "早上" },
  { word: "점심", romanization: "jeomsim", meaning: "中午" },
  { word: "저녁", romanization: "jeonyeok", meaning: "晚上" },
  { word: "밤", romanization: "bam", meaning: "夜晚" },
  { word: "날", romanization: "nal", meaning: "日子" },
  { word: "시간", romanization: "sigan", meaning: "時間" },
  { word: "요일", romanization: "yoil", meaning: "星期" },
  { word: "월요일", romanization: "woryoil", meaning: "星期一" },
  { word: "화요일", romanization: "hwayoil", meaning: "星期二" },
  { word: "수요일", romanization: "suyoil", meaning: "星期三" },
  { word: "목요일", romanization: "mogyoil", meaning: "星期四" },
  { word: "금요일", romanization: "geumyoil", meaning: "星期五" },
  { word: "주말", romanization: "jumal", meaning: "週末" }
  
  ];
  
let directionWords = [ 
  
  { word: "위", romanization: "wi", meaning: "上面" },
  { word: "아래", romanization: "arae", meaning: "下面" },
  { word: "앞", romanization: "ap", meaning: "前面" },
  { word: "뒤", romanization: "dwi", meaning: "後面" },
  { word: "옆", romanization: "yeop", meaning: "旁邊" },
  { word: "안", romanization: "an", meaning: "裡面" },
  { word: "밖", romanization: "bak", meaning: "外面" },
  { word: "오른쪽", romanization: "oreunjjok", meaning: "右邊" },
  { word: "왼쪽", romanization: "oenjjok", meaning: "左邊" },
  { word: "가운데", romanization: "gaunde", meaning: "中間" },
  { word: "근처", romanization: "geuncheo", meaning: "附近" },
  { word: "맞은편", romanization: "maj-eunpyeon", meaning: "對面" },
  { word: "이쪽", romanization: "ijjok", meaning: "這邊" },
  { word: "저쪽", romanization: "jeojjok", meaning: "那邊" },
  { word: "여기", romanization: "yeogi", meaning: "這裡" },
  { word: "거기", romanization: "geogi", meaning: "那裡" },
  { word: "저기", romanization: "jeogi", meaning: "遠處那裡" },
  { word: "사이", romanization: "sai", meaning: "之間" },
  { word: "주변", romanization: "jubyeon", meaning: "周圍" },
  { word: "중간", romanization: "junggan", meaning: "中段" },
  
  ];
  
let transportWords = [
  
  { word: "자동차", romanization: "jadongcha", meaning: "汽車" },
  { word: "버스", romanization: "beoseu", meaning: "公車" },
  { word: "지하철", romanization: "jihacheol", meaning: "地鐵" },
  { word: "기차", romanization: "gicha", meaning: "火車" },
  { word: "비행기", romanization: "bihaenggi", meaning: "飛機" },
  { word: "자전거", romanization: "jajeongeo", meaning: "腳踏車" },
  { word: "택시", romanization: "taeksi", meaning: "計程車" },
  { word: "오토바이", romanization: "otobai", meaning: "摩托車" },
  { word: "배", romanization: "bae", meaning: "船" },
  { word: "트럭", romanization: "teureok", meaning: "卡車" },
  { word: "헬리콥터", romanization: "hellikopeuteo", meaning: "直升機" },
  { word: "유람선", romanization: "yuramseon", meaning: "遊輪" },
  { word: "스쿠터", romanization: "seukuteo", meaning: "速克達" },
  { word: "승용차", romanization: "seungyongcha", meaning: "轎車" },
  { word: "버스정류장", romanization: "beoseu jeongnyujang", meaning: "公車站" },
  { word: "지하철역", romanization: "jihacheolyeok", meaning: "地鐵站" },
  { word: "공항", romanization: "gonghang", meaning: "機場" },
  { word: "주차장", romanization: "juchajang", meaning: "停車場" },
  { word: "도로", romanization: "doro", meaning: "道路" },
  { word: "고속도로", romanization: "gosokdoro", meaning: "高速公路" },
  
  ];
  
let lifeWords = [ 
  
  { word: "옷", romanization: "ot", meaning: "衣服" },
  { word: "신발", romanization: "sinbal", meaning: "鞋子" },
  { word: "가방", romanization: "gabang", meaning: "包包" },
  { word: "모자", romanization: "moja", meaning: "帽子" },
  { word: "우산", romanization: "usan", meaning: "雨傘" },
  { word: "안경", romanization: "angyeong", meaning: "眼鏡" },
  { word: "핸드폰", romanization: "haendeupon", meaning: "手機" },
  { word: "컴퓨터", romanization: "keompyuteo", meaning: "電腦" },
  { word: "텔레비전", romanization: "tellebijeon", meaning: "電視" },
  { word: "냉장고", romanization: "naengjanggo", meaning: "冰箱" },
  { word: "세탁기", romanization: "setakgi", meaning: "洗衣機" },
  { word: "책", romanization: "chaek", meaning: "書" },
  { word: "신문", romanization: "sinmun", meaning: "報紙" },
  { word: "잡지", romanization: "japji", meaning: "雜誌" },
  { word: "열쇠", romanization: "yeolsoe", meaning: "鑰匙" },
  { word: "돈", romanization: "don", meaning: "錢" },
  { word: "지갑", romanization: "jigap", meaning: "錢包" },
  { word: "시계", romanization: "sigye", meaning: "手錶" },
  { word: "거울", romanization: "geoul", meaning: "鏡子" },
  { word: "칫솔", romanization: "chitsol", meaning: "牙刷" }
  
  ];
  
let grammarWords = [
  
  { word: "그리고", romanization: "geurigo", meaning: "而且、然後" },
  { word: "하지만", romanization: "hajiman", meaning: "但是" },
  { word: "그래서", romanization: "geuraeseo", meaning: "所以" },
  { word: "그러나", romanization: "geureona", meaning: "然而" },
  { word: "그러면", romanization: "geureomyeon", meaning: "那麼" },
  { word: "그런데", romanization: "geureonde", meaning: "不過、可是" },
  { word: "또", romanization: "tto", meaning: "又、再" },
  { word: "먼저", romanization: "meonjeo", meaning: "首先" },
  { word: "나중에", romanization: "najunge", meaning: "之後" },
  { word: "항상", romanization: "hangsang", meaning: "總是" },
  { word: "자주", romanization: "jaju", meaning: "常常" },
  { word: "가끔", romanization: "gakkeum", meaning: "偶爾" },
  { word: "때때로", romanization: "ttaettaero", meaning: "有時候" },
  { word: "보통", romanization: "botong", meaning: "通常" },
  { word: "절대", romanization: "jeoldae", meaning: "絕對（不）" },
  { word: "항상", romanization: "hangsang", meaning: "一直、總是" },
  { word: "만", romanization: "man", meaning: "只（助詞）" },
  { word: "도", romanization: "do", meaning: "也（助詞）" },
  { word: "은/는", romanization: "eun/neun", meaning: "主題助詞" },
  { word: "이/가", romanization: "i/ga", meaning: "主語助詞" },
  { word: "을/를", romanization: "eul/reul", meaning: "受詞助詞" },
  { word: "-고", romanization: "-go", meaning: "並列動作（…而且）" },
  { word: "-지만", romanization: "-jiman", meaning: "雖然…但是" },
  { word: "-거나", romanization: "-geona", meaning: "或是…" },
  { word: "-아/어서", romanization: "-a/eoseo", meaning: "因為…" },
  { word: "-기 때문에", romanization: "-gi ttaemune", meaning: "因為…" },
  { word: "-(으)니까", romanization: "-(eu)nikka", meaning: "因為…" },
  { word: "-고 싶다", romanization: "-go sipda", meaning: "想要…" },
  { word: "-지 않다", romanization: "-ji anta", meaning: "不…" },
  { word: "-고 있다", romanization: "-go itda", meaning: "正在…" },
  { word: "-(으)ㄹ 수 있다", romanization: "-(eu)l su itda", meaning: "能夠…" },
  { word: "-(으)ㄹ 수 없다", romanization: "-(eu)l su eopda", meaning: "不能…" },
  { word: "-아/어야 하다", romanization: "-a/eoya hada", meaning: "必須…" },
  { word: "-지 마세요", romanization: "-ji maseyo", meaning: "請不要…" },
  { word: "-아/어 주세요", romanization: "-a/eo juseyo", meaning: "請…" },
  { word: "-아/어도 돼요", romanization: "-a/eodo dwaeyo", meaning: "可以…" },
  { word: "-지 못하다", romanization: "-ji mothada", meaning: "無法…" },
  { word: "-(으)려고 하다", romanization: "-(eu)ryeogo hada", meaning: "打算…" },
  { word: "-기 위해서", romanization: "-gi wihaeseo", meaning: "為了…" }
  ];
  
  
  
// 單字總覽
const wordDatabase = {
  people: peopleWords,
  place: placeWords,
  food: foodWords,
  verb: verbWords,
  adj: adjWords,
  time: timeWords,
  direction: directionWords,
  transport: transportWords,
  life: lifeWords,
  grammar: grammarWords
};


// ✅ 預設載入人物類
let words = peopleWords;

function updateWord() {
  const word = words[currentIndex];
  koreanWordEl.textContent = word.word;
  romanizationEl.textContent = word.romanization;
  chineseWordEl.textContent = word.meaning;
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % words.length;
  updateWord();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  updateWord();
});

speakBtn.addEventListener("click", () => {
  const word = words[currentIndex].word;
  const utter = new SpeechSynthesisUtterance(word);
  const koreanVoice = voices.find(v => v.lang === "ko-KR");
  if (koreanVoice) utter.voice = koreanVoice;
  utter.lang = "ko-KR";
  utter.pitch = 1;
  utter.rate = 0.9;
  synth.speak(utter);
});

categorySelect.addEventListener("change", (e) => {
  const category = e.target.value;
  switch (category) {
    case "people": words = peopleWords; break;
    case "place": words = placeWords; break;
    case "food": words = foodWords; break;
    case "verb": words = verbWords; break;
    case "adj": words = adjWords; break;
    case "time": words = timeWords; break;
    case "direction": words = directionWords; break;
    case "transport": words = transportWords; break;
    case "life": words = lifeWords; break;
    case "grammar": words = grammarWords; break;
  }
  currentIndex = 0;
  updateWord();
});

document.addEventListener("DOMContentLoaded", () => {
  updateWord();
});

//新增單字總覽彈窗功能
const wordlistBtn = document.getElementById("toggle-wordlist");
const wordlistModal = document.getElementById("wordlist-modal");
const closeWordlist = document.getElementById("close-wordlist");
const wordlistBody = document.getElementById("wordlist-body");

wordlistBtn.addEventListener("click", () => {
  const selectedCategory = categorySelect.value;
  const wordsToShow = wordDatabase[selectedCategory] || [];
  wordlistBody.innerHTML = "";

  wordsToShow.forEach(word => {
    const row = document.createElement("tr");
    row.className = "hover:bg-indigo-50 cursor-pointer";
    row.onclick = () => {
      koreanWordEl.textContent = word.word;
      romanizationEl.textContent = word.romanization;
      chineseWordEl.textContent = word.meaning;
      wordlistModal.classList.add("hidden");
      koreanWordEl.scrollIntoView({ behavior: "smooth", block: "center" });
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

