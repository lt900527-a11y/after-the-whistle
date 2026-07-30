export type CameoStatKey =
  | "ovr"
  | "energy"
  | "morale"
  | "trust"
  | "value"
  | "apps"
  | "goals"
  | "assists"
  | "reputation";

export type CameoChoice = {
  eyebrow: string;
  title: string;
  copy: string;
  impact: string;
  effects: Partial<Record<CameoStatKey, number>>;
  note: string;
};

export type RealWorldEvent = {
  id: string;
  age: number;
  star: string;
  tag: string;
  headline: string;
  story: string;
  choices: CameoChoice[];
};

export type RealWorldContext = {
  age: number;
  nationality: string;
  clubId: string;
  leagueId: string;
  careerSeed: number;
};

type NationReference = {
  star: string;
  role: string;
  comparison: string;
  match: string;
};

const nationReferences: Record<string, NationReference> = {
  巴西: {
    star: "Vinícius Júnior",
    role: "巴西边路新核心",
    comparison: "你的每次加速都被拿去和维尼修斯逐帧比较",
    match: "国家队训练赛",
  },
  阿根廷: {
    star: "Lionel Messi",
    role: "阿根廷十号传统",
    comparison: "国内媒体开始讨论你是否接得住梅西留下的期待",
    match: "国家队集训",
  },
  法国: {
    star: "Kylian Mbappé",
    role: "法国锋线标尺",
    comparison: "法国记者把你的启动、射门和姆巴佩放进同一张雷达图",
    match: "国家队对抗赛",
  },
  英格兰: {
    star: "Jude Bellingham",
    role: "英格兰中场门面",
    comparison: "英格兰媒体开始用贝林厄姆的比赛影响力衡量你",
    match: "国家队集训",
  },
  葡萄牙: {
    star: "Cristiano Ronaldo",
    role: "葡萄牙进球标准",
    comparison: "任何一脚射门都会被放进C罗的国家队纪录叙事里",
    match: "国家队公开训练",
  },
  西班牙: {
    star: "Lamine Yamal",
    role: "西班牙新世代",
    comparison: "同龄话题让你和亚马尔被反复放在一起讨论",
    match: "国家队训练赛",
  },
  日本: {
    star: "Takefusa Kubo",
    role: "旅欧技术标尺",
    comparison: "日本媒体拿你的持球选择和久保建英做比较",
    match: "国家队集训",
  },
  韩国: {
    star: "Son Heung-min",
    role: "韩国旅欧标尺",
    comparison: "韩国媒体开始追问你能否复制孙兴慜的欧洲轨迹",
    match: "国家队集训",
  },
  埃及: {
    star: "Mohamed Salah",
    role: "埃及足球门面",
    comparison: "埃及记者用萨拉赫的效率要求每一个进攻球员",
    match: "国家队集训",
  },
  摩洛哥: {
    star: "Achraf Hakimi",
    role: "摩洛哥速度标尺",
    comparison: "摩洛哥媒体把你的推进能力和阿什拉夫放在一起",
    match: "国家队训练赛",
  },
};

type Rivalry = {
  id: string;
  clubs: string[];
  name: string;
  rival: string;
  star: string;
  venue: string;
};

const rivalries: Rivalry[] = [
  {
    id: "el-clasico",
    clubs: ["real-madrid", "barcelona"],
    name: "国家德比",
    rival: "皇家马德里与巴塞罗那",
    star: "Mbappé × Lamine Yamal",
    venue: "伯纳乌与蒙锥克之间",
  },
  {
    id: "madrid-derby",
    clubs: ["real-madrid", "atletico"],
    name: "马德里德比",
    rival: "皇马与马竞",
    star: "Madrid Derby",
    venue: "马德里城",
  },
  {
    id: "english-title",
    clubs: ["man-city", "arsenal", "liverpool"],
    name: "英超争冠死敌",
    rival: "曼城、阿森纳与利物浦",
    star: "Haaland × Saka",
    venue: "英格兰争冠夜",
  },
  {
    id: "derby-della-madonnina",
    clubs: ["inter", "milan"],
    name: "米兰德比",
    rival: "国际米兰与AC米兰",
    star: "Derby della Madonnina",
    venue: "圣西罗",
  },
  {
    id: "der-klassiker",
    clubs: ["bayern", "dortmund"],
    name: "德国国家德比",
    rival: "拜仁与多特蒙德",
    star: "Der Klassiker",
    venue: "德甲争冠舞台",
  },
  {
    id: "de-klassieker",
    clubs: ["ajax", "feyenoord"],
    name: "荷兰国家德比",
    rival: "阿贾克斯与费耶诺德",
    star: "De Klassieker",
    venue: "阿姆斯特丹与鹿特丹之间",
  },
  {
    id: "old-firm",
    clubs: ["celtic", "rangers"],
    name: "老字号德比",
    rival: "凯尔特人与流浪者",
    star: "Old Firm",
    venue: "格拉斯哥",
  },
  {
    id: "portugal-classic",
    clubs: ["benfica", "porto", "sporting"],
    name: "葡超三强内战",
    rival: "本菲卡、波尔图与葡萄牙体育",
    star: "O Clássico",
    venue: "里斯本与波尔图之间",
  },
  {
    id: "istanbul-derby",
    clubs: ["galatasaray", "fenerbahce", "besiktas"],
    name: "伊斯坦布尔德比",
    rival: "加拉塔萨雷、费内巴切与贝西克塔斯",
    star: "Intercontinental Derby",
    venue: "博斯普鲁斯海峡两岸",
  },
];

function buildNationEvent(context: RealWorldContext) {
  const reference = nationReferences[context.nationality];
  if (!reference || context.age !== 17) return undefined;
  return {
    id: `nation-${context.nationality}`,
    age: context.age,
    star: reference.star,
    tag: `国家队坐标 · ${reference.role}`,
    headline: `${reference.comparison}`,
    story: `${reference.match}前，教练把你安排在主力组。记者的问题却全都围绕${reference.star}：相同国籍、相近位置，就意味着你必须面对同一把尺子。比较无法取消，但你可以决定如何回应。`,
    choices: [
      {
        eyebrow: "接受比较",
        title: "把他的比赛当成录像课",
        copy: "拆解跑位和处理球，而不是模仿庆祝动作。",
        impact: "OVR +2 · 球商 +",
        effects: { ovr: 2, trust: 6, reputation: 4 },
        note: `你没有躲开${reference.star}这个名字，而是把比较变成了训练计划。`,
      },
      {
        eyebrow: "球场回答",
        title: "要求在对抗赛直接对位",
        copy: "用一次真实交锋代替十篇比较文章。",
        impact: "OVR +3 · 体能 -",
        effects: { ovr: 3, energy: -8, reputation: 8 },
        note: "你没有赢下所有回合，但让国家队教练记住了你的竞争欲。",
      },
      {
        eyebrow: "建立自己",
        title: "公开拒绝“下一位”标签",
        copy: "尊重前辈，但你的路线必须有自己的名字。",
        impact: "信任 + · 名气 +",
        effects: { trust: 10, morale: 8, reputation: 5 },
        note: "标题终于不再写“某某接班人”，而是第一次只写了你的名字。",
      },
    ],
  } satisfies RealWorldEvent;
}

function buildRivalryEvent(context: RealWorldContext) {
  if (!context.clubId || context.leagueId === "") return undefined;
  const rivalry = rivalries.find((item) => item.clubs.includes(context.clubId));
  if (!rivalry) return undefined;
  const triggerAges = [23, 28, 33];
  const triggerAge =
    triggerAges[(context.careerSeed + rivalry.id.length) % triggerAges.length];
  if (context.age !== triggerAge) return undefined;
  return {
    id: `rivalry-${rivalry.id}`,
    age: context.age,
    star: rivalry.star,
    tag: `豪门恩怨 · ${rivalry.name}`,
    headline: `${rivalry.venue}，一场比赛足以改变整个赛季`,
    story: `${rivalry.rival}的恩怨不需要额外包装。赛前发布会里，对手拿你最近的状态做文章；球迷则只接受胜利。你面对的不是一次品牌活动，而是一场会被反复播放很多年的比赛。`,
    choices: [
      {
        eyebrow: "正面接战",
        title: "主动要求承担关键球",
        copy: "点球、任意球和最后一次进攻都交给你。",
        impact: "进球 + · 压力 +",
        effects: { goals: 2, reputation: 12, energy: -8, ovr: 2 },
        note: `你在${rivalry.name}留下了决定性镜头，敌对看台第一次完整记住你的名字。`,
      },
      {
        eyebrow: "服从体系",
        title: "牺牲数据封住对方核心",
        copy: "德比不只属于进球者，也属于让对手消失的人。",
        impact: "信任 +++ · 助攻 +",
        effects: { assists: 2, trust: 16, ovr: 1, reputation: 5 },
        note: "你的名字没有占据头条，但战术复盘把你列为胜负手。",
      },
      {
        eyebrow: "制造火药味",
        title: "赛前直接点名对手",
        copy: "把所有压力提前拉到自己身上。",
        impact: "名气 ++ · 士气风险",
        effects: { reputation: 16, morale: -5, trust: -3, ovr: 2 },
        note: "整座城市讨论了三天。比赛开始后，每次触球都像决赛。",
      },
    ],
  } satisfies RealWorldEvent;
}

function getContextualEvents(context: RealWorldContext) {
  return [buildNationEvent(context), buildRivalryEvent(context)].filter(
    (event): event is RealWorldEvent => Boolean(event),
  );
}

export function findRealWorldEvent(
  eventId: string | null | undefined,
  context: RealWorldContext,
) {
  return getContextualEvents(context).find((event) => event.id === eventId);
}

export function findRealWorldEventForCareer(context: RealWorldContext) {
  return getContextualEvents(context)[0];
}
