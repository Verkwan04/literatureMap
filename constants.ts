import { CityData } from './types';

export const INITIAL_CITIES: Record<string, CityData> = {
  london: {
    name: { en: 'London', zh: '伦敦' },
    lat: 51.5074,
    lng: -0.1278,
    locations: [
      {
        id: 'l1',
        name: { en: '221B Baker Street', zh: '贝克街221B' },
        lat: 51.5237,
        lng: -0.1585,
        bookTitle: { en: 'Sherlock Holmes', zh: '福尔摩斯探案集' },
        author: { en: 'Arthur Conan Doyle', zh: '阿瑟·柯南·道尔' },
        quote: { en: "The game is afoot.", zh: "游戏开始了。" },
        travelerNote: { en: "Now a museum dedicated to the detective.", zh: "现在是致力于这位大侦探的博物馆。" },
        coverUrl: "https://picsum.photos/200/300?random=1"
      },
      {
        id: 'l2',
        name: { en: 'The British Museum', zh: '大英博物馆' },
        lat: 51.5194,
        lng: -0.1270,
        bookTitle: { en: 'Maurice', zh: '莫里斯' },
        author: { en: 'E.M. Forster', zh: 'E.M. 福斯特' },
        quote: { en: "You can't get away from tradition in England.", zh: "在英国，你无法摆脱传统。" },
        travelerNote: { en: "The Reading Room is where many literary giants studied.", zh: "阅览室曾是许多文学巨匠学习的地方。" },
        coverUrl: "https://picsum.photos/200/300?random=2"
      }
    ]
  },
  florence: {
    name: { en: 'Florence', zh: '佛罗伦萨' },
    lat: 43.7696,
    lng: 11.2558,
    locations: [
      {
        id: 'f1',
        name: { en: 'Casa di Dante', zh: '但丁故居' },
        lat: 43.7705,
        lng: 11.2568,
        bookTitle: { en: 'The Divine Comedy', zh: '神曲' },
        author: { en: 'Dante Alighieri', zh: '但丁·阿利吉耶里' },
        quote: { 
          en: "Midway upon the journey of our life I found myself within a forest dark.", 
          zh: "在人生的旅途过半时，我发现自己步入一片幽暗的树林，因为正确的道路已经模糊不清。" 
        },
        travelerNote: { 
          en: "Visit the narrow streets where the poet once glimpsed Beatrice.", 
          zh: "造访狭窄的小巷，寻找诗人曾凝望贝阿特丽切的身影。" 
        },
        coverUrl: "https://picsum.photos/200/300?random=10"
      },
      {
        id: 'f2',
        name: { en: 'Ponte alle Grazie', zh: '恩宠桥' },
        lat: 43.7663,
        lng: 11.2582,
        bookTitle: { en: 'A Room with a View', zh: '看得见风景的房间' },
        author: { en: 'E.M. Forster', zh: 'E.M. 福斯特' },
        quote: { 
          en: "This is the Arno, this is the room with the view.", 
          zh: "这就是阿诺河，这就是那个有着如此惊人风景的房间。" 
        },
        travelerNote: { 
          en: "Look for the Tuscan sunlight that charmed Lucy.", 
          zh: "前往阿诺河边，寻找福斯特笔下那抹让露西心动的托斯卡纳阳光。" 
        },
        coverUrl: "https://picsum.photos/200/300?random=11"
      }
    ]
  },
  venice: {
    name: { en: 'Venice', zh: '威尼斯' },
    lat: 45.4408,
    lng: 12.3155,
    locations: [
      {
        id: 'v1',
        name: { en: 'Lido', zh: '丽都岛' },
        lat: 45.4168,
        lng: 12.3734,
        bookTitle: { en: 'Death in Venice', zh: '威尼斯之死' },
        author: { en: 'Thomas Mann', zh: '托马斯·曼' },
        quote: { 
          en: "He sat there... facing the sea... Venice, this flattering and suspect beauty.", 
          zh: "他坐在那里，那是一个有着玻璃屋顶的凉台，面对着大海……威尼斯，这诱人而又令人生疑的国家。" 
        },
        travelerNote: { 
          en: "Take the Vaporetto to the beach where the film festival is held.", 
          zh: "搭乘水上巴士前往丽都岛，在电影节举办地的沙滩上感受那份凄美的忧郁。" 
        },
        coverUrl: "https://picsum.photos/200/300?random=12"
      }
    ]
  },
  rome: {
    name: { en: 'Rome', zh: '罗马' },
    lat: 41.8902,
    lng: 12.4922,
    locations: [
      {
        id: 'r1',
        name: { en: 'Antico Caffè Greco', zh: '古希腊咖啡馆' },
        lat: 41.9059,
        lng: 12.4813,
        bookTitle: { en: 'Italian Journey', zh: '意大利游记' },
        author: { en: 'Johann Wolfgang von Goethe', zh: '歌德' },
        quote: { 
          en: "Yes, I have finally arrived at this capital of the world!", 
          zh: "是的，我终于到达了这个世界的首都！" 
        },
        travelerNote: { 
          en: "A haunt for Goethe, Byron and Keats on Via Condotti.", 
          zh: "去康多提街的古希腊咖啡馆，这里曾是歌德、拜伦和济慈最爱的聚集地。" 
        },
        coverUrl: "https://picsum.photos/200/300?random=13"
      }
    ]
  },
  naples: {
    name: { en: 'Naples', zh: '那不勒斯' },
    lat: 40.8518,
    lng: 14.2681,
    locations: [
      {
        id: 'n1',
        name: { en: 'Rione Luzzatti', zh: '卢扎蒂区' },
        lat: 40.8560,
        lng: 14.2880, // Approx
        bookTitle: { en: 'My Brilliant Friend', zh: '我的天才女友' },
        author: { en: 'Elena Ferrante', zh: '埃莱娜·费兰特' },
        quote: { 
          en: "In Naples, it felt like the whole city was trying to push you away and hold you tight.", 
          zh: "在那不勒斯，那种感觉就像是整个城市都在努力推开你，又在死死拽住你。" 
        },
        travelerNote: { 
          en: "Walk the paths of Lila and Elena's childhood in the old neighborhood.", 
          zh: "避开繁华大道，去老城区的平民区，寻找莉拉和埃莱娜童年奔跑的足迹。" 
        },
        coverUrl: "https://picsum.photos/200/300?random=14"
      }
    ]
  }
};
