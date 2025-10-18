document.addEventListener("DOMContentLoaded", () => {
  // --- DOM 元素選擇 (統一管理以避免錯誤) ---
  const koreanWordEl = document.getElementById("korean-word");
  const romanizationEl = document.getElementById("romanization");
  const chineseWordEl = document.getElementById("chinese-word");
  const speakBtn = document.getElementById("speak-btn");
  const categorySelect = document.getElementById("category-select");

  const learnModeBtn = document.getElementById("learn-mode-btn");
  const quizModeBtn = document.getElementById("quiz-mode-btn");
  const cardView = document.getElementById("card-view");
  const navButtons = document.getElementById("nav-buttons");
  const quizView = document.getElementById("quiz-view");
  const hangulBtn = document.getElementById("toggle-hangul");
  const wordlistBtn = document.getElementById("toggle-wordlist");

  const wordlistModal = document.getElementById("wordlist-modal");
  const closeWordlist = document.getElementById("close-wordlist");
  const wordlistBody = document.getElementById("wordlist-body");

  const questionEl = document.getElementById('question');
  const answerInput = document.getElementById('answer-input');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const submitBtn = document.getElementById('submit-btn');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const numberOfQuizEl = document.getElementById('number-of-quiz');



  // --- 狀態與資料 ---
  let currentIndex = 0;
  let synth = window.speechSynthesis;
  let voices = [];

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

let emotionWords = [
  { word: "기쁘다", romanization: "gippeuda", meaning: "高興" },
  { word: "슬프다", romanization: "seulpeuda", meaning: "悲傷" },
  { word: "화나다", romanization: "hwanada", meaning: "生氣" },
  { word: "걱정하다", romanization: "geokjeonghada", meaning: "擔心" },
  { word: "편하다", romanization: "pyeonhada", meaning: "舒適" },
  { word: "불편하다", romanization: "bulpyeonhada", meaning: "不方便" },
  { word: "심심하다", romanization: "simsimhada", meaning: "無聊" },
  { word: "부끄럽다", romanization: "bukkeureopda", meaning: "害羞" },
  { word: "자랑스럽다", romanization: "jarangseureopda", meaning: "驕傲" },
  { word: "후회하다", romanization: "huhoehada", meaning: "後悔" },
  { word: "당황하다", romanization: "danghwanghada", meaning: "慌張" },
  { word: "놀라다", romanization: "nollada", meaning: "驚訝" },
  { word: "편안하다", romanization: "pyeonanada", meaning: "安心" },
  { word: "용감하다", romanization: "yonggamhada", meaning: "勇敢" },
  { word: "부러워하다", romanization: "bureowohada", meaning: "羨慕" },
  { word: "짜증나다", romanization: "jjajeungnada", meaning: "惱怒" },
  { word: "감사하다", romanization: "gamsahada", meaning: "感謝" },
  { word: "사랑하다", romanization: "saranghada", meaning: "愛" },
  { word: "싫어하다", romanization: "silheohada", meaning: "討厭" },
  { word: "걱정되다", romanization: "geokjeongdoeda", meaning: "擔心(被動)" }
];

let colorWords = [
  { word: "빨간색", romanization: "ppalgansek", meaning: "紅色" },
  { word: "파란색", romanization: "paransaek", meaning: "藍色" },
  { word: "노란색", romanization: "nolaransaek", meaning: "黃色" },
  { word: "초록색", romanization: "choroksaek", meaning: "綠色" },
  { word: "검정색", romanization: "geomjeongsaek", meaning: "黑色" },
  { word: "하얀색", romanization: "hayansek", meaning: "白色" },
  { word: "분홍색", romanization: "bunhongsaek", meaning: "粉紅色" },
  { word: "주황색", romanization: "juhwangsaek", meaning: "橘色" },
  { word: "회색", romanization: "hoesaek", meaning: "灰色" },
  { word: "갈색", romanization: "galsaek", meaning: "棕色" }
];

let numberWords = [
  { word: "하나", romanization: "hana", meaning: "一" },
  { word: "둘", romanization: "dul", meaning: "二" },
  { word: "셋", romanization: "set", meaning: "三" },
  { word: "넷", romanization: "net", meaning: "四" },
  { word: "다섯", romanization: "daseot", meaning: "五" },
  { word: "여섯", romanization: "yeoseot", meaning: "六" },
  { word: "일곱", romanization: "ilgop", meaning: "七" },
  { word: "여덟", romanization: "yeodeol", meaning: "八" },
  { word: "아홉", romanization: "ahop", meaning: "九" },
  { word: "열", romanization: "yeol", meaning: "十" },
  { word: "백", romanization: "baek", meaning: "百" },
  { word: "천", romanization: "cheon", meaning: "千" },
  { word: "만", romanization: "man", meaning: "萬" },
  { word: "몇", romanization: "myeot", meaning: "多少" },
  { word: "몇 개", romanization: "myeot gae", meaning: "幾個" }
];

let bodyWords = [
  { word: "머리", romanization: "meori", meaning: "頭" },
  { word: "눈", romanization: "nun", meaning: "眼睛" },
  { word: "코", romanization: "ko", meaning: "鼻子" },
  { word: "입", romanization: "ip", meaning: "嘴巴" },
  { word: "귀", romanization: "gwi", meaning: "耳朵" },
  { word: "목", romanization: "mok", meaning: "脖子" },
  { word: "어깨", romanization: "eokkae", meaning: "肩膀" },
  { word: "가슴", romanization: "gaseum", meaning: "胸" },
  { word: "배", romanization: "bae", meaning: "肚子" },
  { word: "손", romanization: "son", meaning: "手" },
  { word: "발", romanization: "bal", meaning: "腳" },
  { word: "다리", romanization: "dari", meaning: "腿" },
  { word: "손가락", romanization: "songarak", meaning: "手指" },
  { word: "발가락", romanization: "balgarak", meaning: "腳趾" },
  { word: "허리", romanization: "heori", meaning: "腰" },
  { word: "피부", romanization: "pibu", meaning: "皮膚" },
  { word: "이", romanization: "i", meaning: "牙齒" },
  { word: "눈썹", romanization: "nunssup", meaning: "眉毛" },
  { word: "혀", romanization: "hyeo", meaning: "舌頭" },
  { word: "목소리", romanization: "moksori", meaning: "聲音" }
];

let weatherWords = [
  { word: "비", romanization: "bi", meaning: "雨" },
  { word: "눈", romanization: "nun", meaning: "雪" },
  { word: "구름", romanization: "gureum", meaning: "雲" },
  { word: "바람", romanization: "baram", meaning: "風" },
  { word: "맑다", romanization: "makda", meaning: "晴朗" },
  { word: "흐리다", romanization: "heurida", meaning: "陰天" },
  { word: "춥다", romanization: "chupda", meaning: "冷" },
  { word: "덥다", romanization: "deopda", meaning: "熱" },
  { word: "습하다", romanization: "seuphada", meaning: "潮濕" },
  { word: "건조하다", romanization: "geonjohada", meaning: "乾燥" }
];

let schoolWords = [
  { word: "시험", romanization: "siheom", meaning: "考試" },
  { word: "공부", romanization: "gongbu", meaning: "學習" },
  { word: "수업", romanization: "sueop", meaning: "課程" },
  { word: "교실", romanization: "gyosil", meaning: "教室" },
  { word: "교수", romanization: "gyosu", meaning: "教授" },
  { word: "교재", romanization: "gyojae", meaning: "教材" },
  { word: "숙제", romanization: "sukje", meaning: "作業" },
  { word: "동아리", romanization: "dongari", meaning: "社團" },
  { word: "입학", romanization: "iphak", meaning: "入學" },
  { word: "졸업", romanization: "joreop", meaning: "畢業" },
  { word: "학기", romanization: "hakgi", meaning: "學期" },
  { word: "학년", romanization: "haknyeon", meaning: "年級" },
  { word: "장학금", romanization: "janghakgeum", meaning: "獎學金" },
  { word: "강의", romanization: "gangui", meaning: "講義/授課" },
  { word: "교과서", romanization: "gyogwaseo", meaning: "教科書" }
];

let shoppingWords = [
  { word: "가격", romanization: "gagyeok", meaning: "價格" },
  { word: "할인", romanization: "harin", meaning: "折扣" },
  { word: "가게", romanization: "gage", meaning: "商店" },
  { word: "시장", romanization: "sijang", meaning: "市場" },
  { word: "계산", romanization: "gyesan", meaning: "結帳" },
  { word: "영수증", romanization: "yeongsujeung", meaning: "收據" },
  { word: "카드", romanization: "kadeu", meaning: "信用卡" },
  { word: "현금", romanization: "hyeongeum", meaning: "現金" },
  { word: "환불", romanization: "hwanbul", meaning: "退貨/退款" },
  { word: "교환", romanization: "gyohwan", meaning: "交換" },
  { word: "쇼핑", romanization: "syoping", meaning: "購物" },
  { word: "상품", romanization: "sangpum", meaning: "商品" },
  { word: "영업시간", romanization: "yeongeubsigan", meaning: "營業時間" }
];

let adverbWords = [
  { word: "아주", romanization: "aju", meaning: "非常" },
  { word: "매우", romanization: "maeu", meaning: "很" },
  { word: "조금", romanization: "jogeum", meaning: "一點" },
  { word: "별로", romanization: "byeollo", meaning: "不太" },
  { word: "가끔", romanization: "gakkeum", meaning: "有時" },
  { word: "항상", romanization: "hangsang", meaning: "總是" },
  { word: "절대", romanization: "jeoldae", meaning: "絕對" },
  { word: "빨리", romanization: "ppalli", meaning: "快地" },
  { word: "천천히", romanization: "cheoncheonhi", meaning: "慢慢地" },
  { word: "곧", romanization: "got", meaning: "很快/不久" }
];

let questionWords = [
  { word: "뭐", romanization: "mwo", meaning: "什麼" },
  { word: "누구", romanization: "nugu", meaning: "誰" },
  { word: "언제", romanization: "eonje", meaning: "何時" },
  { word: "어디", romanization: "eodi", meaning: "哪裡" },
  { word: "왜", romanization: "wae", meaning: "為什麼" },
  { word: "어떻게", romanization: "eotteoke", meaning: "如何" },
  { word: "얼마", romanization: "eolma", meaning: "多少(價格)" },
  { word: "몇", romanization: "myeot", meaning: "幾(數量)" }
];

let natureWords = [
  { word: "산", romanization: "san", meaning: "山" },
  { word: "바다", romanization: "bada", meaning: "海" },
  { word: "강", romanization: "gang", meaning: "河" },
  { word: "호수", romanization: "hosu", meaning: "湖" },
  { word: "숲", romanization: "sup", meaning: "森林" },
  { word: "들", romanization: "deul", meaning: "田野" },
  { word: "계곡", romanization: "gyegok", meaning: "溪谷" },
  { word: "섬", romanization: "seom", meaning: "島" },
  { word: "사막", romanization: "samak", meaning: "沙漠" },
  { word: "절벽", romanization: "jeolbyeok", meaning: "懸崖" }
];



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
    grammar: grammarWords, 
    emotion: emotionWords,
    color: colorWords,
    number: numberWords,
    body: bodyWords,
    weather: weatherWords,
    school: schoolWords, 
    shopping: shoppingWords, 
    adverb: adverbWords, 
    question: questionWords, 
    nature: natureWords, 
    
  };

  // 預設載入人物類
  let words = peopleWords;

  // Quiz State
  let quizLimit = 10;
  let quizCorrect = 0;
  let quizTotal = 0;
  let currentQuizWord = null;
  let quizType = '';


  // --- 函式 ---
  function populateVoiceList() {
    voices = synth.getVoices().filter(voice => voice.lang.startsWith("ko"));
  }

  function updateWord() {
    const word = words[currentIndex];
    koreanWordEl.textContent = word.word;
    romanizationEl.textContent = word.romanization;
    chineseWordEl.textContent = word.meaning;
  }

  function setupQuiz() {
    if (quizTotal >= quizLimit) {
      questionEl.textContent = "🎉 測驗完成！";
      answerInput.disabled = true;
      submitBtn.classList.add("hidden");
      nextQuestionBtn.classList.add("hidden");
      feedbackEl.textContent = "";
      numberOfQuizEl.textContent = `進度: ${quizLimit} / ${quizLimit}`;
      scoreEl.textContent = `分數: ${quizCorrect}/${quizLimit}`;
    
      return;
    }

    const selectedCategory = categorySelect.value;
    words = wordDatabase[selectedCategory] || peopleWords;

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
    scoreEl.textContent = `分數: ${quizCorrect}/${quizLimit}`;
  }

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
    scoreEl.textContent = `分數: ${quizCorrect}/${quizLimit}`;
    answerInput.disabled = true;
    submitBtn.classList.add('hidden');
    nextQuestionBtn.classList.remove('hidden');
  }


  // --- 事件監聽器 ---
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
    words = wordDatabase[category];
    currentIndex = 0;
    updateWord();

    if (!quizView.classList.contains("hidden")) {
      quizCorrect = 0;
      quizTotal = 0;
      setupQuiz();
    }
  });

  learnModeBtn.addEventListener("click", () => {
    quizView.classList.add("hidden");
    cardView.classList.remove("hidden");
    navButtons.classList.remove("hidden");
    hangulBtn.classList.remove("hidden");
    wordlistBtn.classList.remove("hidden");

    learnModeBtn.classList.add("bg-indigo-500", "text-white");
    learnModeBtn.classList.remove("text-gray-700");
    quizModeBtn.classList.add("text-gray-700");
    quizModeBtn.classList.remove("bg-indigo-500", "text-white");
  });

  quizModeBtn.addEventListener("click", () => {
    cardView.classList.add("hidden");
    navButtons.classList.add("hidden");
    hangulBtn.classList.add("hidden");
    wordlistBtn.classList.add("hidden");
    quizView.classList.remove("hidden");
    quizCorrect = 0;
    quizTotal = 0;
    quizLimit = 10;
    setupQuiz();

    quizModeBtn.classList.add("bg-indigo-500", "text-white");
    quizModeBtn.classList.remove("text-gray-700");
    learnModeBtn.classList.add("text-gray-700");
    learnModeBtn.classList.remove("bg-indigo-500", "text-white");
  });

  wordlistBtn.addEventListener("click", () => {
    const selectedCategory = categorySelect.value;
    const wordsToShow = wordDatabase[selectedCategory] || [];
    wordlistBody.innerHTML = "";

    wordsToShow.forEach(word => {
      const row = document.createElement("tr");
      row.className = "hover:bg-indigo-50 cursor-pointer";
      row.onclick = () => {
        const selectedIndex = words.findIndex(w => w.word === word.word);
        if (selectedIndex !== -1) {
            currentIndex = selectedIndex;
            updateWord();
        }
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

  submitBtn.addEventListener('click', checkAnswer);
  answerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !submitBtn.classList.contains('hidden')) {
      checkAnswer();
    }
  });
  nextQuestionBtn.addEventListener('click', setupQuiz);

  // --- 初始化 ---
  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  // 預設進入學習模式
  quizView.classList.add("hidden");
  cardView.classList.remove("hidden");
  navButtons.classList.remove("hidden");

  // ✅ **問題修復處：** 載入頁面後，立刻更新一次單字卡內容
  updateWord();
});
