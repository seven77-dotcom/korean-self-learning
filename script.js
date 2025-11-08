document.addEventListener("DOMContentLoaded", () => {
  // --- DOM 元素選擇 (統一管理) ---
  const koreanWordEl = document.getElementById("korean-word");
  const romanizationEl = document.getElementById("romanization");
  const chineseWordEl = document.getElementById("chinese-word");
  const speakBtn = document.getElementById("speak-btn");
  const categorySelect = document.getElementById("category-select");

  // 模式切換
  const learnModeBtn = document.getElementById("learn-mode-btn");
  const quizModeBtn = document.getElementById("quiz-mode-btn");
  const cardView = document.getElementById("card-view");
  const navButtons = document.getElementById("nav-buttons");
  const quizView = document.getElementById("quiz-view");

  // 控制區元件
  const learnModeControls = document.getElementById("learn-mode-controls");
  const quizModeDescription = document.getElementById("quiz-mode-description");

  // 彈窗: 40音表
  const hangulBtn = document.getElementById("toggle-hangul");
  const hangulModal = document.getElementById("hangul-modal");
  const closeHangul = document.getElementById("close-hangul");

  // 彈窗: 單字總覽
  const wordlistBtn = document.getElementById("toggle-wordlist");
  const wordlistModal = document.getElementById("wordlist-modal");
  const closeWordlist = document.getElementById("close-wordlist");
  const wordlistBody = document.getElementById("wordlist-body");

  // 測驗區塊
  const questionEl = document.getElementById('question');
  const answerInput = document.getElementById('answer-input');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const submitBtn = document.getElementById('submit-btn');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const numberOfQuizEl = document.getElementById('number-of-quiz');

  // --- 狀態與資料 ---
  let currentIndex = 0;
  let synth = null;
  let koreanVoice = null;
    

let peopleWords=[
{word:"학생",romanization:"haksaeng",meaning:"學生"},
{word:"선생님",romanization:"seonsaengnim",meaning:"老師"},
{word:"의사",romanization:"uisa",meaning:"醫生"},
{word:"간호사",romanization:"ganhosa",meaning:"護士"},
{word:"경찰",romanization:"gyeongchal",meaning:"警察"},
{word:"소방관",romanization:"sobang-gwan",meaning:"消防員"},
{word:"운전사",romanization:"unjeonsa",meaning:"司機"},
{word:"회사원",romanization:"hoesawon",meaning:"上班族"},
{word:"사장",romanization:"sajang",meaning:"社長"},
{word:"직원",romanization:"jigwon",meaning:"職員"},
{word:"요리사",romanization:"yorisa",meaning:"廚師"},
{word:"가수",romanization:"gasu",meaning:"歌手"},
{word:"배우",romanization:"baeu",meaning:"演員"},
{word:"기자",romanization:"gija",meaning:"記者"},
{word:"운동선수",romanization:"undongseonsu",meaning:"運動員"},
{word:"화가",romanization:"hwaga",meaning:"畫家"},
{word:"작가",romanization:"jakga",meaning:"作家"},
{word:"학생회",romanization:"haksaenghoe",meaning:"學生會"},
{word:"친구",romanization:"chingu",meaning:"朋友"},
{word:"가족",romanization:"gajok",meaning:"家人"},
{word:"어머니",romanization:"eomeoni",meaning:"母親"},
{word:"아버지",romanization:"abeoji",meaning:"父親"},
{word:"형",romanization:"hyeong",meaning:"哥哥"},
{word:"누나",romanization:"nuna",meaning:"姊姊"},
{word:"동생",romanization:"dongsaeng",meaning:"弟妹"},
{word:"남편",romanization:"nampyeon",meaning:"丈夫"},
{word:"아내",romanization:"anae",meaning:"妻子"},
{word:"아이",romanization:"ai",meaning:"孩子"},
{word:"손님",romanization:"sonnim",meaning:"客人"},
{word:"고객",romanization:"gogaek",meaning:"顧客"},
{word:"사람",romanization:"saram",meaning:"人"},
{word:"친척",romanization:"chincheok",meaning:"親戚"},
{word:"직장동료",romanization:"jikjangdongnyo",meaning:"同事"},
{word:"상사",romanization:"sangsa",meaning:"上司"},
{word:"후배",romanization:"hubae",meaning:"學弟妹"},
{word:"선배",romanization:"seonbae",meaning:"學長姐"}
];

let placeWords=[
{word:"학교",romanization:"hakgyo",meaning:"學校"},
{word:"병원",romanization:"byeongwon",meaning:"醫院"},
{word:"도서관",romanization:"doseogwan",meaning:"圖書館"},
{word:"식당",romanization:"sikdang",meaning:"餐廳"},
{word:"회사",romanization:"hoesa",meaning:"公司"},
{word:"은행",romanization:"eunhaeng",meaning:"銀行"},
{word:"공원",romanization:"gongwon",meaning:"公園"},
{word:"시장",romanization:"sijang",meaning:"市場"},
{word:"편의점",romanization:"pyeonuijeom",meaning:"便利商店"},
{word:"백화점",romanization:"baekhwajeom",meaning:"百貨公司"},
{word:"지하철역",romanization:"jihacheolyeok",meaning:"捷運站"},
{word:"버스정류장",romanization:"beoseu-jeongnyujang",meaning:"公車站"},
{word:"공항",romanization:"gonghang",meaning:"機場"},
{word:"극장",romanization:"geukjang",meaning:"電影院"},
{word:"박물관",romanization:"bakmulgwan",meaning:"博物館"},
{word:"미술관",romanization:"misulgwan",meaning:"美術館"},
{word:"카페",romanization:"kape",meaning:"咖啡廳"},
{word:"서점",romanization:"seojeom",meaning:"書店"},
{word:"호텔",romanization:"hotel",meaning:"飯店"},
{word:"기숙사",romanization:"gisuksa",meaning:"宿舍"},
{word:"화장실",romanization:"hwajangsil",meaning:"廁所"},
{word:"우체국",romanization:"ucheguk",meaning:"郵局"},
{word:"경찰서",romanization:"gyeongchalseo",meaning:"警察局"},
{word:"소방서",romanization:"sobangseo",meaning:"消防局"},
{word:"교회",romanization:"gyohoe",meaning:"教會"},
{word:"산",romanization:"san",meaning:"山"},
{word:"바다",romanization:"bada",meaning:"海"},
{word:"도시",romanization:"dosi",meaning:"城市"},
{word:"시골",romanization:"sigol",meaning:"鄉下"}
];

let foodWords=[
{word:"밥",romanization:"bap",meaning:"飯"},
{word:"물",romanization:"mul",meaning:"水"},
{word:"커피",romanization:"keopi",meaning:"咖啡"},
{word:"차",romanization:"cha",meaning:"茶"},
{word:"빵",romanization:"ppang",meaning:"麵包"},
{word:"과일",romanization:"gwail",meaning:"水果"},
{word:"사과",romanization:"sagwa",meaning:"蘋果"},
{word:"포도",romanization:"podo",meaning:"葡萄"},
{word:"바나나",romanization:"banana",meaning:"香蕉"},
{word:"딸기",romanization:"ttalgi",meaning:"草莓"},
{word:"고기",romanization:"gogi",meaning:"肉"},
{word:"닭고기",romanization:"dalgogi",meaning:"雞肉"},
{word:"소고기",romanization:"sogogi",meaning:"牛肉"},
{word:"돼지고기",romanization:"dwaejigogi",meaning:"豬肉"},
{word:"생선",romanization:"saengseon",meaning:"魚"},
{word:"야채",romanization:"yachae",meaning:"蔬菜"},
{word:"김치",romanization:"gimchi",meaning:"泡菜"},
{word:"라면",romanization:"ramyeon",meaning:"泡麵"},
{word:"불고기",romanization:"bulgogi",meaning:"烤肉"},
{word:"비빔밥",romanization:"bibimbap",meaning:"拌飯"},
{word:"된장찌개",romanization:"doenjangjjigae",meaning:"大醬湯"},
{word:"떡볶이",romanization:"tteokbokki",meaning:"辣炒年糕"},
{word:"김밥",romanization:"gimbap",meaning:"紫菜飯捲"},
{word:"주스",romanization:"juseu",meaning:"果汁"},
{word:"맥주",romanization:"maekju",meaning:"啤酒"},
{word:"소주",romanization:"soju",meaning:"燒酒"}
];

let verbWords=[
{word:"가다",romanization:"gada",meaning:"去"},
{word:"오다",romanization:"oda",meaning:"來"},
{word:"보다",romanization:"boda",meaning:"看"},
{word:"먹다",romanization:"meokda",meaning:"吃"},
{word:"마시다",romanization:"masida",meaning:"喝"},
{word:"자다",romanization:"jada",meaning:"睡覺"},
{word:"일하다",romanization:"ilhada",meaning:"工作"},
{word:"공부하다",romanization:"gongbuhada",meaning:"學習"},
{word:"운동하다",romanization:"undonghada",meaning:"運動"},
{word:"청소하다",romanization:"cheongsohada",meaning:"打掃"},
{word:"요리하다",romanization:"yorihada",meaning:"做菜"},
{word:"만나다",romanization:"mannada",meaning:"見面"},
{word:"주다",romanization:"juda",meaning:"給"},
{word:"받다",romanization:"batda",meaning:"收"},
{word:"쓰다",romanization:"sseuda",meaning:"寫"},
{word:"읽다",romanization:"ikda",meaning:"讀"},
{word:"듣다",romanization:"deutda",meaning:"聽"},
{word:"말하다",romanization:"malhada",meaning:"說"},
{word:"걷다",romanization:"geotda",meaning:"走"},
{word:"달리다",romanization:"dallida",meaning:"跑"},
{word:"앉다",romanization:"anjda",meaning:"坐"},
{word:"일어나다",romanization:"ireonada",meaning:"起來"},
{word:"열다",romanization:"yeolda",meaning:"打開"},
{word:"닫다",romanization:"datda",meaning:"關上"},
{word:"만들다",romanization:"mandeulda",meaning:"製作"},
{word:"생각하다",romanization:"saenggakhada",meaning:"思考"},
{word:"기다리다",romanization:"gidarida",meaning:"等待"},
{word:"사랑하다",romanization:"saranghada",meaning:"愛"},
{word:"좋아하다",romanization:"joahada",meaning:"喜歡"},
{word:"싫어하다",romanization:"silheohada",meaning:"討厭"}
];

let adjWords=[
{word:"크다",romanization:"keuda",meaning:"大"},
{word:"작다",romanization:"jakda",meaning:"小"},
{word:"길다",romanization:"gilda",meaning:"長"},
{word:"짧다",romanization:"jjalda",meaning:"短"},
{word:"빠르다",romanization:"ppareuda",meaning:"快"},
{word:"느리다",romanization:"neurida",meaning:"慢"},
{word:"춥다",romanization:"chupda",meaning:"冷"},
{word:"덥다",romanization:"deopda",meaning:"熱"},
{word:"비싸다",romanization:"bissada",meaning:"貴"},
{word:"싸다",romanization:"ssada",meaning:"便宜"},
{word:"좋다",romanization:"jota",meaning:"好"},
{word:"나쁘다",romanization:"nappeuda",meaning:"壞"},
{word:"예쁘다",romanization:"yeppeuda",meaning:"漂亮"},
{word:"귀엽다",romanization:"gwiyeopda",meaning:"可愛"},
{word:"맛있다",romanization:"masitda",meaning:"好吃"},
{word:"재미있다",romanization:"jaemiitda",meaning:"有趣"},
{word:"피곤하다",romanization:"pigonhada",meaning:"疲倦"},
{word:"깨끗하다",romanization:"kkaekkeuthada",meaning:"乾淨"},
{word:"더럽다",romanization:"deoreopda",meaning:"髒"},
{word:"조용하다",romanization:"joyonghada",meaning:"安靜"},
{word:"시끄럽다",romanization:"sikkeureopda",meaning:"吵"},
{word:"아프다",romanization:"apeuda",meaning:"痛"},
{word:"건강하다",romanization:"geonganghada",meaning:"健康"},
{word:"행복하다",romanization:"haengbokhada",meaning:"幸福"},
{word:"슬프다",romanization:"seulpeuda",meaning:"悲傷"}
];

let timeWords=[
{word:"오늘",romanization:"oneul",meaning:"今天"},
{word:"어제",romanization:"eoje",meaning:"昨天"},
{word:"내일",romanization:"naeil",meaning:"明天"},
{word:"지금",romanization:"jigeum",meaning:"現在"},
{word:"어젯밤",romanization:"eojetbam",meaning:"昨晚"},
{word:"이번주",romanization:"ibeonju",meaning:"這週"},
{word:"다음주",romanization:"daeumju",meaning:"下週"},
{word:"지난주",romanization:"jinanju",meaning:"上週"},
{word:"이번달",romanization:"ibeondal",meaning:"這個月"},
{word:"작년",romanization:"jangnyeon",meaning:"去年"},
{word:"내년",romanization:"naenyeon",meaning:"明年"},
{word:"봄",romanization:"bom",meaning:"春天"},
{word:"여름",romanization:"yeoreum",meaning:"夏天"},
{word:"가을",romanization:"gaeul",meaning:"秋天"},
{word:"겨울",romanization:"gyeoul",meaning:"冬天"},
{word:"아침",romanization:"achim",meaning:"早上"},
{word:"점심",romanization:"jeomsim",meaning:"中午"},
{word:"저녁",romanization:"jeonyeok",meaning:"晚上"},
{word:"시간",romanization:"sigan",meaning:"時間"},
{word:"시계",romanization:"sigye",meaning:"時鐘"}
];


let directionWords=[
{word:"위",romanization:"wi",meaning:"上面"},
{word:"아래",romanization:"arae",meaning:"下面"},
{word:"앞",romanization:"ap",meaning:"前面"},
{word:"뒤",romanization:"dwi",meaning:"後面"},
{word:"왼쪽",romanization:"oenjjok",meaning:"左邊"},
{word:"오른쪽",romanization:"oreunjjok",meaning:"右邊"},
{word:"가운데",romanization:"gaunde",meaning:"中間"},
{word:"옆",romanization:"yeop",meaning:"旁邊"},
{word:"안",romanization:"an",meaning:"裡面"},
{word:"밖",romanization:"bak",meaning:"外面"},
{word:"동쪽",romanization:"dongjjok",meaning:"東邊"},
{word:"서쪽",romanization:"seojjok",meaning:"西邊"},
{word:"남쪽",romanization:"namjjok",meaning:"南邊"},
{word:"북쪽",romanization:"bukjjok",meaning:"北邊"},
{word:"근처",romanization:"geuncheo",meaning:"附近"},
{word:"멀다",romanization:"meolda",meaning:"遠"},
{word:"가깝다",romanization:"gakkapda",meaning:"近"},
{word:"방향",romanization:"banghyang",meaning:"方向"},
{word:"쪽",romanization:"jjok",meaning:"那邊"},
{word:"옆길",romanization:"yeopgil",meaning:"旁路"}
];


let transportWords=[
{word:"자동차",romanization:"jadongcha",meaning:"汽車"},
{word:"버스",romanization:"beoseu",meaning:"公車"},
{word:"택시",romanization:"taegsi",meaning:"計程車"},
{word:"기차",romanization:"gicha",meaning:"火車"},
{wordData:"지하철",romanization:"jihacheol",meaning:"地鐵"},
{word:"비행기",romanization:"bihaenggi",meaning:"飛機"},
{word:"배",romanization:"bae",meaning:"船"},
{word:"자전거",romanization:"jajeongeo",meaning:"腳踏車"},
{word:"오토바이",romanization:"otobai",meaning:"摩托車"},
{word:"운전하다",romanization:"unjeonhada",meaning:"開車"},
{word:"출발하다",romanization:"chulbalhada",meaning:"出發"},
{word:"도착하다",romanization:"dochakhada",meaning:"到達"},
{word:"길",romanization:"gil",meaning:"道路"},
{word:"교통",romanization:"gyotong",meaning:"交通"},
{word:"표",romanization:"pyo",meaning:"票"},
{word:"비행장",romanization:"bihaengjang",meaning:"機場"},
{word:"운전면허",romanization:"unjeonmyeonheo",meaning:"駕照"},
{word:"기름",romanization:"gireum",meaning:"汽油"},
{word:"속도",romanization:"sokdo",meaning:"速度"},
{word:"사고",romanization:"sago",meaning:"事故"}
];


let lifeWords=[
{word:"집",romanization:"jip",meaning:"家"},
{word:"방",romanization:"bang",meaning:"房間"},
{word:"문",romanization:"mun",meaning:"門"},
{word:"창문",romanization:"changmun",meaning:"窗戶"},
{word:"의자",romanization:"uija",meaning:"椅子"},
{word:"책상",romanization:"chaeksang",meaning:"書桌"},
{word:"침대",romanization:"chimdae",meaning:"床"},
{word:"옷",romanization:"ot",meaning:"衣服"},
{word:"신발",romanization:"sinbal",meaning:"鞋子"},
{word:"가방",romanization:"gabang",meaning:"包包"},
{word:"안경",romanization:"angyeong",meaning:"眼鏡"},
{word:"시계",romanization:"sigye",meaning:"手錶"},
{word:"전화기",romanization:"jeonhwagi",meaning:"電話"},
{word:"텔레비전",romanization:"tellebijeon",meaning:"電視"},
{word:"냉장고",romanization:"naengjanggo",meaning:"冰箱"},
{word:"세탁기",romanization:"setakgi",meaning:"洗衣機"},
{word:"컴퓨터",romanization:"keompyuteo",meaning:"電腦"},
{word:"책",romanization:"chaek",meaning:"書"},
{word:"신문",romanization:"sinmun",meaning:"報紙"},
{word:"우산",romanization:"usan",meaning:"雨傘"}
];


let grammarwords=[
{word:"왜",romanization:"wae",meaning:"為什麼"},
{word:"어디",romanization:"eodi",meaning:"哪裡"},
{word:"무엇",romanization:"mueot",meaning:"什麼"},
{word:"누구",romanization:"nugu",meaning:"誰"},
{word:"언제",romanization:"eonje",meaning:"何時"},
{word:"어떻게",romanization:"eotteoke",meaning:"怎麼"},
{word:"그리고",romanization:"geurigo",meaning:"而且、然後"},
{word:"하지만",romanization:"hajiman",meaning:"但是"},
{word:"그래서",romanization:"geuraeseo",meaning:"所以"},
{word:"그러나",romanization:"geureona",meaning:"然而"},
{word:"때문에",romanization:"ttaemune",meaning:"因為"},
{word:"먼저",romanization:"meonjeo",meaning:"首先"},
{word:"아직",romanization:"ajik",meaning:"還沒"},
{word:"이미",romanization:"imi",meaning:"已經"},
{word:"다시",romanization:"dasi",meaning:"再一次"},
{word:"항상",romanization:"hangsang",meaning:"總是"},
{word:"보통",romanization:"botong",meaning:"通常"},
{word:"자주",romanization:"jaju",meaning:"常常"},
{word:"가끔",romanization:"gakkeum",G:"有時"},
{word:"언제나",romanization:"eonjena",meaning:"永遠"}
];

let emotionWords=[
{word:"기쁘다",romanization:"gippeuda",meaning:"高興"},
{word:"즐겁다",romanization:"jeulgeopda",meaning:"愉快"},
{word:"행복하다",romanization:"haengbokhada",meaning:"幸福"},
{word:"슬프다",romanization:"seulpeuda",meaning:"悲傷"},
{word:"화나다",romanization:"hwanada",meaning:"生氣"},
{word:"무섭다",romanization:"museopda",meaning:"害怕"},
{word:"걱정하다",romanization:"geokjeonghada",meaning:"擔心"},
{word:"놀라다",romanization:"nollada",meaning:"驚訝"},
{word:"심심하다",romanization:"simsimhada",meaning:"無聊"},
{word:"부끄럽다",romanization:"bukkeureopda",meaning:"害羞"},
{word:"자랑스럽다",romanization:"jarangseureopda",meaning:"驕傲"},
{word:"창피하다",romanization:"changpihada",meaning:"丟臉"},
{word:"미안하다",romanization:"mianhada",meaning:"抱歉"},
{word:"고맙다",romanization:"gomapda",meaning:"感謝"},
{word:"감사하다",romanization:"gamsahada",meaning:"感謝"},
{word:"편하다",romanization:"pyeonhada",meaning:"舒服"},
{word:"불편하다",romanization:"bulpyeonhada",meaning:"不舒服"},
{word:"지루하다",romanization:"jiruhada",meaning:"無趣"},
{word:"외롭다",romanization:"oeropda",meaning:"寂寞"},
{word:"짜증나다",romanization:"jjajeungnada",meaning:"煩躁"}
];

let colorWords=[
{word:"빨간색",romanization:"ppalgansaek",meaning:"紅色"},
{word:"파란색",romanization:"paransaek",meaning:"藍色"},
{word:"노란색",romanization:"noransaek",meaning:"黃色"},
{word:"초록색",romanization:"choroksaek",meaning:"綠色"},
{wordWords:"하얀색",romanization:"hayansaek",meaning:"白色"},
{word:"검정색",romanization:"geomjeongsaek",meaning:"黑色"},
{word:"회색",romanization:"hoesaek",meaning:"灰色"},
{word:"갈색",romanization:"galsaek",meaning:"咖啡色"},
{word:"분홍색",romanization:"bunhongsaek",meaning:"粉紅色"},
{word:"주황색",romanization:"juhwangsaek",meaning:"橘色"}
];

let numberWords=[
{word:"하나",romanization:"hana",meaning:"一"},
{word:"둘",romanization:"dul",meaning:"二"},
{word:"셋",romanization:"set",meaning:"三"},
{word:"넷",romanization:"net",meaning:"四"},
{word:"다섯",romanization:"daseot",meaning:"五"},
{word:"여섯",romanization:"yeoseot",meaning:"六"},
{word:"일곱",romanization:"ilgop",meaning:"七"},
{word:"여덟",romanization:"yeodeol",meaning:"八"},
{word:"아홉",romanization:"ahop",meaning:"九"},
{word:"열",romanization:"yeol",meaning:"十"},
{word:"스물",romanization:"seumul",meaning:"二十"},
{word:"서른",romanization:"seoreun",meaning:"三十"},
{word:"마흔",romanization:"maheun",meaning:"四十"},
{word:"쉰",romanization:"swin",meaning:"五十"},
{word:"백",romanization:"baek",meaning:"一百"},
{word:"천",romanization:"cheon",meaning:"一千"},
{word:"만",romanization:"man",meaning:"一萬"},
{word:"첫째",romanization:"cheotjjae",meaning:"第一"},
{word:"둘째",romanization:"duljjae",meaning:"第二"},
{word:"셋째",romanization:"setjjae",meaning:"第三"}
];

let bodyWords=[
{word:"머리",romanization:"meori",meaning:"頭"},
{word:"얼굴",romanization:"eolgul",meaning:"臉"},
{word:"눈",romanization:"nun",meaning:"眼睛"},
{word:"코",romanization:"ko",meaning:"鼻子"},
{word:"입",romanization:"ip",meaning:"嘴"},
{word:"귀",romanization:"gwi",meaning:"耳朵"},
{word:"손",romanization:"son",meaning:"手"},
{word:"발",romanization:"bal",meaning:"腳"},
{word:"다리",romanization:"dari",meaning:"腿"},
{word:"팔",romanization:"pal",meaning:"手臂"},
{word:"배",romanization:"bae",meaning:"肚子"},
{word:"등",romanization:"deung",meaning:"背"},
{word:"허리",romanization:"heori",meaning:"腰"},
{word:"피",romanization:"pi",meaning:"血"},
{word:"뼈",romanization:"ppyeo",meaning:"骨頭"},
{word:"심장",romanization:"simjang",meaning:"心臟"},
{word:"몸",romanization:"mom",meaning:"身體"},
{word:"건강",romanization:"geongang",meaning:"健康"},
{word:"감기",romanization:"gamgi",meaning:"感冒"},
{word:"병원",romanization:"byeongwon",meaning:"醫院"}
];

let weatherWords=[
{word:"날씨",romanization:"nalssi",meaning:"天氣"},
{word:"비",romanization:"bi",meaning:"雨"},
{word:"눈",romanization:"nun",meaning:"雪"},
{word:"바람",romanization:"baram",meaning:"風"},
{word:"해",romanization:"hae",meaning:"太陽"},
{word:"구름",romanization:"gureum",meaning:"雲"},
{word:"번개",romanization:"beongae",meaning:"閃電"},
{word:"천둥",romanization:"cheondung",meaning:"雷"},
{word:"기온",romanization:"gion",meaning:"氣溫"},
{word:"습도",romanization:"seupdo",meaning:"濕度"},
{word:"맑다",romanization:"makda",meaning:"晴朗"},
{word:"흐리다",romanization:"heurida",meaning:"陰天"},
{word:"덥다",romanization:"deopda",meaning:"炎熱"},
{word:"춥다",romanization:"chupda",meaning:"寒冷"},
{word:"시원하다",romanization:"siwonhada",meaning:"涼快"},
{word:"따뜻하다",romanization:"ttatteuthada",meaning:"溫暖"},
{word:"건조하다",romanization:"geonjohada",meaning:"乾燥"},
{word:"젖다",romanization:"jeotda",meaning:"濕"},
{word:"폭풍",romanization:"pokpung",meaning:"暴風"},
{word:"태풍",romanization:"taepung",meaning:"颱風"}
];

let schoolWords=[
{word:"학교",romanization:"hakgyo",meaning:"學校"},
{word:"교실",romanization:"gyosil",meaning:"教室"},
{word:"칠판",romanization:"chilpan",meaning:"黑板"},
{word:"책상",romanization:"chaeksang",meaning:"書桌"},
{word:"연필",romanization:"yeonpil",meaning:"鉛筆"},
{word:"지우개",romanization:"jiugae",meaning:"橡皮擦"},
{word:"공책",romanization:"gongchaek",meaning:"筆記本"},
{word:"교과서",romanization:"gyogwaseo",meaning:"教科書"},
{word:"숙제",romanization:"sukje",meaning:"作業"},
{word:"시험",romanization:"siheom",meaning:"考試"},
{word:"점수",romanization:"jeomsu",meaning:"分數"},
{word:"학생",romanization:"haksaeng",meaning:"學生"},
{word:"선생님",romanization:"seonsaengnim",meaning:"老師"},
{word:"공부",romanization:"gongbu",meaning:"學習"},
{word:"연습",romanization:"yeonseup",meaning:"練習"},
{word:"도서관",romanization:"doseogwan",meaning:"圖書館"},
{word:"급식",romanization:"geupsik",meaning:"學餐"},
{word:"방학",romanization:"banghak",meaning:"放假"},
{word:"교장",romanization:"gyojang",meaning:"校長"},
{word:"졸업",romanization:"joreop",meaning:"畢業"}
];


let shoppingWords=[
{word:"가게",romanization:"gage",meaning:"商店"},
{word:"시장",romanization:"sijang",meaning:"市場"},
{word:"마트",romanization:"mateu",meaning:"超市"},
{word:"백화점",romanization:"baekhwajeom",meaning:"百貨公司"},
{word:"쇼핑하다",romanization:"syopinghada",meaning:"購物"},
{word:"물건",romanization:"mulgeon",meaning:"物品"},
{word:"가격",romanization:"gagyeok",meaning:"價格"},
{word:"세일",romanization:"seil",meaning:"打折"},
{word:"할인",romanization:"harin",meaning:"折扣"},
{word:"영수증",romanization:"yeongsujeung",meaning:"收據"},
{word:"지불하다",romanization:"jibulhada",meaning:"支付"},
{word:"계산하다",romanization:"gyesanhada",meaning:"結帳"},
{word:"돈",romanization:"don",meaning:"錢"},
{word:"지갑",romanization:"jigap",meaning:"錢包"},
{word:"현금",romanization:"hyeongeum",meaning:"現金"},
{word:"카드",romanization:"kadeu",meaning:"信用卡"},
{word:"값",romanization:"gap",meaning:"價值"},
{word:"비싸다",romanization:"bissada",meaning:"昂貴"},
{word:"싸다",romanization:"ssada",meaning:"便宜"},
{word:"선물",romanization:"seonmul",meaning:"禮物"}
];

let natureWords=[
{word:"산",romanization:"san",meaning:"山"},
{word:"바다",romanization:"bada",meaning:"海"},
{word:"강",romanization:"gang",meaning:"河"},
{word:"호수",romanization:"hosu",meaning:"湖"},
{word:"섬",romanization:"seom",meaning:"島"},
{word:"나무",romanization:"namu",meaning:"樹"},
{word:"꽃",romanization:"kkot",meaning:"花"},
{word:"풀",romanization:"pul",meaning:"草"},
{word:"돌",romanization:"dol",meaning:"石頭"},
{word:"흙",romanization:"heuk",meaning:"土"},
{word:"하늘",romanization:"haneul",meaning:"天空"},
{word:"별",romanization:"byeol",meaning:"星星"},
{word:"달",romanization:"dal",meaning:"月亮"},
{word:"태양",romanization:"taeyang",meaning:"太陽"},
{word:"공기",romanization:"gonggi",meaning:"空氣"},
{word:"물",romanization:"mul",meaning:"水"},
{word:"불",romanization:"bul",meaning:"火"},
{word:"바람",romanization:"baram",meaning:"風"},
{word:"지진",romanization:"jijin",meaning:"地震"},
{word:"자연",romanization:"jayeon",meaning:"自然"}
];

let workWords=[
{word:"회사",romanization:"hoesa",meaning:"公司"},
{word:"직장",romanization:"jikjang",meaning:"職場"},
{word:"직원",romanization:"jigwon",meaning:"職員"},
{word:"사장",romanization:"sajang",meaning:"社長"},
{word:"부장",romanization:"bujang",meaning:"部長"},
{word:"회의",romanization:"hoeui",meaning:"會議"},
{word:"보고서",romanization:"bogoseo",meaning:"報告"},
{word:"프로젝트",romanization:"peurojekteu",meaning:"專案"},
{word:"출근하다",romanization:"chulgeunhada",meaning:"上班"},
{word:"퇴근하다",romanization:"toegeunhada",meaning:"下班"},
{word:"야근",romanization:"yageun",meaning:"加班"},
{word:"월급",romanization:"wolgeup",meaning:"薪水"},
{word:"연봉",romanization:"yeonbong",meaning:"年薪"},
{word:"계약",romanization:"gyeyak",meaning:"合約"},
{word:"면접",romanization:"myeonjeop",meaning:"面試"},
{word:"회의실",romanization:"hoeuisil",meaning:"會議室"},
{word:"서류",romanization:"seoryu",meaning:"文件"},
{word:"복사하다",romanization:"boksahada",meaning:"影印"},
{word:"메일",romanization:"meil",meaning:"電子郵件"},
{word:"출근",romanization:"chulgeun",meaning:"上班"}
];

let healthWords=[
{word:"건강",romanization:"geongang",meaning:"健康"},
{word:"병원",romanization:"byeongwon",meaning:"醫院"},
{word:"의사",romanization:"uisa",meaning:"醫生"},
{word:"간호사",romanization:"ganhosa",meaning:"護士"},
{word:"약국",romanization:"yakguk",meaning:"藥局"},
{word:"약",romanization:"yak",meaning:"藥"},
{word:"감기",romanization:"gamgi",meaning:"感冒"},
{word:"두통",romanization:"dutong",meaning:"頭痛"},
{word:"열",romanization:"yeol",meaning:"發燒"},
{word:"기침",romanization:"gichim",meaning:"咳嗽"},
{word:"배고프다",romanization:"baegopeuda",meaning:"餓"},
{word:"아프다",romanization:"apeuda",meaning:"痛"},
{word:"피곤하다",romanization:"pigonhada",meaning:"疲倦"},
{word:"운동하다",romanization:"undonghada",meaning:"運動"},
{word:"체온",romanization:"che-on",meaning:"體溫"},
{word:"진찰",romanization:"jinchal",meaning:"診察"},
{word:"주사",romanization:"jusa",meaning:"打針"},
{word:"치료",romanization:"chilyo",meaning:"治療"},
{word:"수술",romanization:"susul",meaning:"手術"},
{word:"건강하다",romanization:"geonganghada",meaning:"健康"}
];

let cultureWords=[
{word:"문화",romanization:"munhwa",meaning:"文化"},
{word:"역사",romanization:"yeoksa",meaning:"歷史"},
{word:"전통",romanization:"jeontong",meaning:"傳統"},
{word:"예술",romanization:"yesul",meaning:"藝術"},
{word:"공연",romanization:"gongyeon",meaning:"表演"},
{word:"영화",romanization:"yeonghwa",meaning:"電影"},
{word:"음악",romanization:"eumak",meaning:"音樂"},
{word:"노래",romanization:"norae",meaning:"歌曲"},
{word:"춤",romanization:"chum",meaning:"舞蹈"},
{word:"전시회",romanization:"jeonsihoe",meaning:"展覽"},
{word:"박물관",romanization:"bakmulgwan",meaning:"博物館"},
{word:"미술관",romanization:"misulgwan",meaning:"美術館"},
{word:"축제",romanization:"chukje",meaning:"節慶"},
{word:"명절",romanization:"myeongjeol",meaning:"節日"},
{word:"설날",romanization:"seollal",meaning:"新年"},
{word:"추석",romanization:"chuseok",meaning:"中秋節"},
{word:"연극",romanization:"yeongeuk",meaning:"戲劇"},
{word:"드라마",romanization:"deurama",meaning:"電視劇"},
{word:"소설",romanization:"soseol",meaning:"小說"},
{word:"시",romanization:"si",meaning:"詩"}
];

let emotionVerbWords=[
{word:"웃다",romanization:"utda",meaning:"笑"},
{word:"울다",romanization:"ulda",meaning:"哭"},
{word:"사랑하다",romanization:"saranghada",meaning:"愛"},
{word:"좋아하다",romanization:"joahada",meaning:"喜歡"},
{word:"싫어하다",romanization:"silheohada",meaning:"討厭"},
{word:"미워하다",romanization:"miwohada",meaning:"憎恨"},
{word:"걱정하다",romanization:"geokjeonghada",meaning:"擔心"},
{word:"기뻐하다",romanization:"gippeohada",meaning:"高興"},
{word:"놀라다",romanization:"nollada",meaning:"驚訝"},
{word:"화나다",romanization:"hwanada",meaning:"生氣"},
{word:"용서하다",romanization:"yongseohada",meaning:"原諒"},
{word:"믿다",romanization:"mitda",meaning:"相信"},
{word:"원하다",romanization:"wonhada",meaning:"想要"},
{word:"바라다",romanization:"barada",meaning:"希望"},
{word:"실망하다",romanization:"silmanghada",meaning:"失望"},
{word:"후회하다",romanization:"huhoehada",meaning:"後悔"},
{word:"자랑하다",romanization:"jaranghada",meaning:"驕傲"},
{word:"기대하다",romanization:"gidaehada",meaning:"期待"},
{word:"느끼다",romanization:"neukkida",meaning:"感覺"},
{word:"생각하다",romanization:"saenggakhada",meaning:"思考"}
];

let objectWords=[
{word:"열쇠",romanization:"yeolsoe",meaning:"鑰匙"},
{word:"휴대폰",romanization:"hyudaepon",meaning:"手機"},
{word:"컴퓨터",romanization:"keompyuteo",meaning:"電腦"},
{word:"텔레비전",romanization:"tellebijeon",meaning:"電視"},
{word:"냉장고",romanization:"naengjanggo",meaning:"冰箱"},
{word:"세탁기",romanization:"setakgi",meaning:"洗衣機"},
{word:"청소기",romanization:"cheongsogi",meaning:"吸塵器"},
{word:"책",romanization:"chaek",meaning:"書"},
{word:"공",romanization:"gong",meaning:"球"},
{word:"필통",romanization:"piltong",meaning:"筆袋"},
{word:"우산",romanization:"usan",meaning:"雨傘"},
{word:"컵",romanization:"keop",meaning:"杯子"},
{word:"접시",romanization:"jeopsi",meaning:"盤子"},
{word:"숟가락",romanization:"sutgarak",meaning:"湯匙"},
{word:"젓가락",romanization:"jeotgarak",meaning:"筷子"},
{word:"포크",romanization:"pokeu",meaning:"叉子"},
{word:"칼",romanization:"kal",meaning:"刀"},
{word:"가위",romanization:"gawi",meaning:"剪刀"},
{word:"빗",romanization:"bit",meaning:"梳子"},
{word:"거울",romanization:"geoul",meaning:"鏡子"}
];

let extraCommonWords=[
{word:"왜",romanization:"wae",meaning:"為什麼"},
{word:"어디",romanization:"eodi",meaning:"哪裡"},
{word:"무엇",romanization:"mueot",meaning:"什麼"},
{word:"누구",romanization:"nugu",meaning:"誰"},
{word:"언제",romanization:"eonje",meaning:"何時"},
{word:"어떻게",romanization:"eotteoke",meaning:"怎麼"},
{word:"그리고",romanization:"geurigo",meaning:"而且"},
{word:"하지만",romanization:"hajiman",meaning:"但是"},
{word:"그래서",romanization:"geuraeseo",meaning:"所以"},
{word:"그러나",romanization:"geureona",meaning:"然而"},
{word:"때문에",romanization:"ttaemune",meaning:"因為"},
{word:"먼저",romanization:"meonjeo",meaning:"首先"},
{word:"아직",romanization:"ajik",meaning:"還沒"},
{word:"이미",romanization:"imi",meaning:"已經"},
{word:"다시",romanization:"dasi",meaning:"再一次"},
{word:"항상",romanization:"hangsang",meaning:"總是"},
{word:"보통",romanization:"botong",meaning:"通常"},
{word:"자주",romanization:"jaju",meaning:"常常"},
{word:"가끔",romanization:"gakkeum",meaning:"有時"},
{word:"언제나",romanization:"eonjena",meaning:"永遠"}
];



  const wordDatabase = {
    people: peopleWords, place: placeWords, food: foodWords, verb: verbWords, adj: adjWords, time: timeWords, direction: directionWords, transport: transportWords, life: lifeWords, grammar: grammarwords, emotion: emotionWords, color: colorWords, number: numberWords, body: bodyWords, weather: weatherWords, school: schoolWords, shopping: shoppingWords, nature: natureWords, work: workWords, health: healthWords, culture: cultureWords, emotionVerb: emotionVerbWords, object: objectWords, extraCommon: extraCommonWords, // 修正 1: 原本是 grammarWords (W大寫)，已改為 grammarwords (w小寫)
  };

  let words = peopleWords; // 預設載入人物類

  // Quiz State
  let quizLimit = 10;
  let quizCorrect = 0;
  let quizTotal = 0;
  let currentQuizWord = null;
  let quizType = '';


  // --- 函式 ---

  // ✅ **更新後的語音初始化函式**
  function initializeSpeech() {
    if ('speechSynthesis' in window) {
      synth = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synth.getVoices();
        koreanVoice = voices.find(voice => voice.lang === 'ko-KR');

        if (!koreanVoice) {
            // 再次嘗試尋找，某些瀏覽器需要延遲
             setTimeout(() => {
                const voices = synth.getVoices();
                koreanVoice = voices.find(voice => voice.lang === 'ko-KR');
                if(!koreanVoice) {
                    disableSpeakButton();
                }
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

  // ✅ **新的函式：禁用語音按鈕並提供提示**
  function disableSpeakButton() {
      speakBtn.disabled = true;
      speakBtn.style.opacity = '0.5';
      speakBtn.style.cursor = 'not-allowed';
      speakBtn.title = '您的瀏覽器不支援語音，建議使用 Chrome 或 Safari 開啟。';
  }


  function updateWord() {
    if (!words || words.length === 0) return;
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
      nextQuestionBtn.classList.remove("hidden"); 
      nextQuestionBtn.textContent = "重新測驗";
      feedbackEl.textContent = "";
      numberOfQuizEl.textContent = `進度: ${quizLimit} / ${quizLimit}`;
      scoreEl.textContent = `最終分數: ${quizCorrect}`;
      return;
    }

    nextQuestionBtn.textContent = "下一題";
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
    scoreEl.textContent = `分數: ${quizCorrect}`;
  }
  
  function resetQuiz() {
      quizCorrect = 0;
      quizTotal = 0;
      setupQuiz();
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
    scoreEl.textContent = `分數: ${quizCorrect}`;
    answerInput.disabled = true;
    submitBtn.classList.add('hidden');
    nextQuestionBtn.classList.remove('hidden');
  }


  // --- 事件監聽器 ---
  
  // 上/下一字
  document.getElementById("next-btn").addEventListener("click", () => {
    if (!words || words.length === 0) return;
    currentIndex = (currentIndex + 1) % words.length;
    updateWord();
  });
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (!words || words.length === 0) return;
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateWord();
  });

  // 發音
  speakBtn.addEventListener("click", () => {
    if (!synth || !words || words.length === 0) return;
    const word = words[currentIndex].word;
    const utter = new SpeechSynthesisUtterance(word);
    
    utter.lang = "ko-KR";
    if (koreanVoice) {
      utter.voice = koreanVoice;
    }
    utter.pitch = 1;
    utter.rate = 0.9;
    synth.speak(utter);
  });

  // 分類切換
  categorySelect.addEventListener("change", (e) => {
    const category = e.target.value;
    words = wordDatabase[category];
    currentIndex = 0;
    updateWord();

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
        if (selectedIndex !== -1) {
            currentIndex = selectedIndex;
            updateWord();
        }
        wordlistModal.classList.add("hidden");
        if(!quizView.classList.contains("hidden")) {
            learnModeBtn.click();
        }
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
    if (e.key === 'Enter' && !submitBtn.classList.contains('hidden')) {
      checkAnswer();
    }
  });
  nextQuestionBtn.addEventListener('click', () => {
      if(nextQuestionBtn.textContent === "重新測驗") {
          resetQuiz();
      } else {
          setupQuiz();
      }
  });

  // --- 初始化 ---
  initializeSpeech(); // ✅ **改用新的初始化函式**
  updateWord();
});