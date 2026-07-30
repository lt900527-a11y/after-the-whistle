"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { annualChapters } from "./annual-chapters";
import {
  findRealWorldEvent,
  findRealWorldEventForCareer,
  type CameoChoice,
} from "./real-world-events";
import {
  allClubs,
  evaluateSeasonAwards,
  findClub,
  nationalTeams,
  type ClubProfile,
  type Confederation,
} from "./world-football";
import { crestData } from "./crest-data";

type Phase = "setup" | "career" | "ending";
type Position =
  | "LW"
  | "ST"
  | "RW"
  | "LM"
  | "CAM"
  | "RM"
  | "LB"
  | "CM"
  | "RB"
  | "CDM"
  | "CB"
  | "GK";
type AttributeKey =
  | "technique"
  | "pace"
  | "iq"
  | "height"
  | "eq"
  | "luck";
type AttributeMap = Record<AttributeKey, number>;
type StatKey =
  | "ovr"
  | "energy"
  | "morale"
  | "trust"
  | "value"
  | "apps"
  | "goals"
  | "assists"
  | "reputation";

type Choice = {
  eyebrow: string;
  title: string;
  copy: string;
  impact: string;
  effects: Partial<Record<StatKey, number>>;
  club?: string;
  trophy?: string;
  note: string;
};

type Chapter = {
  year: string;
  age: number;
  kicker: string;
  title: string;
  story: string;
  choices: Choice[];
};

type GameState = {
  phase: Phase;
  chapter: number;
  name: string;
  position: Position;
  origin: string;
  club: string;
  clubId: string;
  leagueId: string;
  nationality: string;
  nationalConfederation: Confederation;
  ovr: number;
  energy: number;
  morale: number;
  trust: number;
  value: number;
  apps: number;
  goals: number;
  assists: number;
  reputation: number;
  rating: number;
  peakOvr: number;
  injuryLoad: number;
  injuries: { age: number; label: string; severity: InjurySeverity }[];
  retiredAge: number | null;
  retirementReason: string;
  careerSeed: number;
  build: AttributeMap;
  attributes: AttributeMap;
  trophies: string[];
  seasonAwards: { age: number; year: number; items: string[] }[];
  pendingCameoId?: string | null;
  history: { age: number; title: string; note: string }[];
};

type InjurySeverity = "none" | "minor" | "major" | "critical";

type InjuryOutcome = {
  severity: InjurySeverity;
  label: string;
  description: string;
  load: number;
  appsLost: number;
  ovrPenalty: number;
  careerEnding: boolean;
};

type ContractOffer = {
  id: string;
  clubId: string;
  kind: "stay" | "starter" | "money" | "contender" | "project";
  label: string;
  headline: string;
  role: string;
  salary: string;
  risk: string;
  copy: string;
  effects: Partial<Record<StatKey, number>>;
};

type Resolution = {
  kind: "season" | "contract";
  title: string;
  note: string;
  beforeOvr: number;
  afterOvr: number;
  rating: number;
  statDeltas: Pick<
    Record<StatKey, number>,
    "apps" | "goals" | "assists" | "value" | "reputation"
  >;
  attributeDeltas: Partial<AttributeMap>;
  offerAfter: boolean;
  advanceAfter: boolean;
  goalBurst: boolean;
  awards: string[];
  injury?: InjuryOutcome;
  retireAfter?: boolean;
  retirementReason?: string;
};

const origins = [
  {
    id: "街头",
    mark: "01",
    icon: "⚡",
    title: "街头野球",
    copy: "球感是天生的，战术纪律得慢慢补。",
    bonus: "技术 +3 · 名气 +4",
  },
  {
    id: "青训",
    mark: "02",
    icon: "◆",
    title: "职业青训",
    copy: "你熟悉体系，也习惯每周都被淘汰一次。",
    bonus: "能力 +2 · 信任 +8",
  },
  {
    id: "校园",
    mark: "03",
    icon: "▲",
    title: "校园联赛",
    copy: "没人替你铺路，但你很会在逆风里踢球。",
    bonus: "体能 +8 · 士气 +6",
  },
];

const positions: { id: Position; name: string; zone: string; number: string }[] = [
  { id: "LW", name: "左边锋", zone: "锋线", number: "11" },
  { id: "ST", name: "中锋", zone: "锋线", number: "9" },
  { id: "RW", name: "右边锋", zone: "锋线", number: "7" },
  { id: "LM", name: "左前卫", zone: "中场", number: "17" },
  { id: "CAM", name: "前腰", zone: "中场", number: "10" },
  { id: "RM", name: "右前卫", zone: "中场", number: "19" },
  { id: "LB", name: "左边卫", zone: "后场", number: "3" },
  { id: "CM", name: "中前卫", zone: "中场", number: "8" },
  { id: "RB", name: "右边卫", zone: "后场", number: "2" },
  { id: "CDM", name: "后腰", zone: "中场", number: "6" },
  { id: "CB", name: "中后卫", zone: "后场", number: "4" },
  { id: "GK", name: "门将", zone: "门前", number: "1" },
];

const attributes: {
  id: AttributeKey;
  label: string;
  short: string;
  icon: string;
}[] = [
  { id: "technique", label: "技术", short: "TEC", icon: "◎" },
  { id: "pace", label: "速度", short: "PAC", icon: "»" },
  { id: "iq", label: "球商", short: "IQ", icon: "◇" },
  { id: "height", label: "身体", short: "PHY", icon: "▲" },
  { id: "eq", label: "情商", short: "EQ", icon: "◉" },
  { id: "luck", label: "幸运", short: "LUK", icon: "✦" },
];

const emptyBuild: AttributeMap = {
  technique: 0,
  pace: 0,
  iq: 0,
  height: 0,
  eq: 0,
  luck: 0,
};

const baseAttributes: AttributeMap = {
  technique: 44,
  pace: 44,
  iq: 44,
  height: 44,
  eq: 44,
  luck: 44,
};

const legacyChapters: Chapter[] = [
  {
    year: "2026 / 27",
    age: 16,
    kicker: "第一次有人记住你的名字",
    title: "青年杯，最后十分钟",
    story:
      "场边站着三名球探。比分 1:1，教练让你热身，却只交代了一句：别犯错。你听见看台上有人在喊你的名字。",
    choices: [
      {
        eyebrow: "稳妥",
        title: "按战术跑位",
        copy: "不抢镜，把每一次接应都做对。",
        impact: "能力 ↑↑ · 教练信任 ↑",
        effects: { ovr: 5, trust: 10, apps: 3, assists: 2, value: 20 },
        note: "你没有上集锦，却被教练写进了下周首发名单。",
      },
      {
        eyebrow: "冒险",
        title: "要球，过掉他",
        copy: "一次机会足够改变所有人的印象。",
        impact: "名气 ↑↑ · 体能 ↓",
        effects: {
          ovr: 3,
          energy: -8,
          reputation: 12,
          apps: 3,
          goals: 3,
          value: 35,
        },
        note: "你在禁区角上兜出一记弧线。第二天，视频有了十万播放。",
      },
      {
        eyebrow: "团队",
        title: "把球做给队友",
        copy: "所有人都盯着你，空当恰好在另一边。",
        impact: "助攻 ↑ · 士气 ↑↑",
        effects: { ovr: 4, morale: 10, trust: 5, apps: 3, assists: 4, value: 25 },
        note: "绝杀属于队友，但他冲过来第一个抱住了你。",
      },
    ],
  },
  {
    year: "2028 / 29",
    age: 18,
    kicker: "第一份职业合同",
    title: "三封报价，同时抵达",
    story:
      "一家愿意立刻给你比赛，一家有最好的训练设施，还有一家来自遥远的海岸。经纪人把合同排在桌面上：别只看数字。",
    choices: [
      {
        eyebrow: "稳定出场",
        title: "加盟「江城航运」",
        copy: "国内顶级联赛中游队，保证轮换位置。",
        impact: "出场 ↑↑ · 身价 ↑",
        effects: { ovr: 5, apps: 44, goals: 13, assists: 8, value: 180 },
        club: "江城航运",
        note: "你穿上 27 号球衣，从替补席一步步挤进首发。",
      },
      {
        eyebrow: "精英路径",
        title: "加盟「申湾竞技」",
        copy: "豪门梯队，训练顶级，但没人承诺上场。",
        impact: "能力 ↑↑↑ · 士气 ↓",
        effects: { ovr: 8, morale: -8, trust: 5, apps: 23, goals: 8, assists: 5, value: 240 },
        club: "申湾竞技",
        note: "你在训练里追赶国脚。半年后，终于得到第一次联赛首发。",
      },
      {
        eyebrow: "孤注一掷",
        title: "远赴「北海联队」",
        copy: "陌生语言、低级别联赛，以及一张单程票。",
        impact: "名气 ↑ · 能力 ↑↑",
        effects: { ovr: 7, energy: -5, reputation: 15, apps: 37, goals: 16, assists: 7, value: 300 },
        club: "北海联队",
        note: "第一个冬天很难熬。春天来时，你已经是当地球迷最会念的中国名字。",
      },
    ],
  },
  {
    year: "2031 / 32",
    age: 21,
    kicker: "杯赛决赛 · 87 分钟",
    title: "点球点前，没有退路",
    story:
      "比分仍是 0:0。队长把球塞进你怀里，主罚手却站在两米外看着你。四万人的嘘声压下来，像一阵低空雷暴。",
    choices: [
      {
        eyebrow: "担当",
        title: "亲自主罚",
        copy: "把所有后果都留给自己。",
        impact: "名气 ↑↑↑ · 压力 ↑",
        effects: { ovr: 4, energy: -8, reputation: 20, goals: 10, apps: 39, value: 520 },
        trophy: "海峡杯",
        note: "球贴着立柱入网。你滑跪到角旗区，记住了那一秒的声音。",
      },
      {
        eyebrow: "冷静",
        title: "交给队长",
        copy: "职责比英雄叙事更重要。",
        impact: "信任 ↑↑ · 士气 ↑",
        effects: { ovr: 3, trust: 15, morale: 8, apps: 40, goals: 6, assists: 10, value: 380 },
        trophy: "海峡杯",
        note: "队长罚进后第一个指向你。更衣室知道是谁让球队没有内耗。",
      },
      {
        eyebrow: "诡计",
        title: "快速开出任意球",
        copy: "趁对手还在围住裁判争论。",
        impact: "创造力 ↑↑↑",
        effects: { ovr: 6, reputation: 10, apps: 38, goals: 7, assists: 14, value: 480 },
        trophy: "海峡杯",
        note: "一脚贴地传中撕开了防线。赛后，所有战术节目都在复盘你的决定。",
      },
    ],
  },
  {
    year: "2034 / 35",
    age: 24,
    kicker: "生涯十字路口",
    title: "豪门来电",
    story:
      "你的身价来到高点。冠军球队「王冠城」送来报价，但要求你改踢不熟悉的位置；老东家则愿意围绕你建队。",
    choices: [
      {
        eyebrow: "最高舞台",
        title: "签约「王冠城」",
        copy: "竞争最残酷，但每周都可能争夺冠军。",
        impact: "能力 ↑↑ · 出场风险",
        effects: { ovr: 7, morale: -5, apps: 36, goals: 14, assists: 11, value: 1200, reputation: 20 },
        club: "王冠城",
        trophy: "全国联赛冠军",
        note: "你学会了在聚光灯下生存，并在五月捧起第一座联赛奖杯。",
      },
      {
        eyebrow: "成为核心",
        title: "留队，接过 10 号",
        copy: "没有捷径，但球队会把进攻交给你。",
        impact: "信任 ↑↑↑ · 数据 ↑↑",
        effects: { ovr: 5, trust: 18, morale: 10, apps: 45, goals: 21, assists: 16, value: 850 },
        note: "你的照片挂上主场外墙。孩子们开始穿着你的号码训练。",
      },
      {
        eyebrow: "未知大陆",
        title: "转会「蓝岸 1908」",
        copy: "新的联赛、新的语言，以及完全不同的足球。",
        impact: "名气 ↑↑ · 体能 ↓",
        effects: { ovr: 6, energy: -10, reputation: 28, apps: 40, goals: 17, assists: 12, value: 1050 },
        club: "蓝岸 1908",
        trophy: "联盟杯",
        note: "你用一个赛季赢下了挑剔的南方看台，也赢下一座欧洲奖杯。",
      },
    ],
  },
  {
    year: "2038 / 39",
    age: 28,
    kicker: "检查室的白灯",
    title: "膝盖发出警告",
    story:
      "医生把片子推到你面前：可以保守治疗赶上争冠，也可以手术，休息整整九个月。教练和经纪人给出了相反的建议。",
    choices: [
      {
        eyebrow: "长期主义",
        title: "接受手术",
        copy: "错过一个赛季，换取更长的职业生命。",
        impact: "体能 ↑↑ · 名气 ↓",
        effects: { energy: 18, morale: -8, reputation: -8, apps: 12, goals: 4, assists: 3, value: -180 },
        note: "漫长的康复像一场没有观众的比赛。你还是赢了。",
      },
      {
        eyebrow: "争冠窗口",
        title: "打封闭上场",
        copy: "这个赛季的机会，也许不会再来。",
        impact: "冠军机会 · 体能 ↓↓↓",
        effects: { ovr: 2, energy: -24, reputation: 12, apps: 35, goals: 13, assists: 9, value: 260 },
        trophy: "全国联赛冠军",
        note: "你撑过最后八轮并捧杯。庆典之后，走下楼梯都需要人扶。",
      },
      {
        eyebrow: "重新定义",
        title: "后撤改踢组织者",
        copy: "少冲刺，用视野延长自己的黄金期。",
        impact: "能力 ↑ · 助攻 ↑↑",
        effects: { ovr: 4, energy: -7, trust: 10, apps: 31, goals: 5, assists: 18, value: 120 },
        note: "你失去了速度，却第一次看清了整片球场。",
      },
    ],
  },
  {
    year: "2042 / 43",
    age: 32,
    kicker: "队长袖标",
    title: "更衣室需要一个声音",
    story:
      "年轻核心公开质疑教练，球队在关键战前分成两派。所有人都等着你表态——你已经不能只做一名球员。",
    choices: [
      {
        eyebrow: "守护团队",
        title: "关起门来调停",
        copy: "让争论留在更衣室，把结果带上球场。",
        impact: "信任 ↑↑↑ · 士气 ↑",
        effects: { trust: 20, morale: 14, apps: 36, goals: 7, assists: 13, value: 90 },
        trophy: "足总杯",
        note: "你们在决赛逆转。年轻人捧杯时，把队长袖标套回你手臂。",
      },
      {
        eyebrow: "公开立场",
        title: "支持年轻球员",
        copy: "有些改变，必须有人先站出来。",
        impact: "名气 ↑↑ · 信任风险",
        effects: { reputation: 22, trust: -10, morale: 8, apps: 32, goals: 9, assists: 10, value: 70 },
        note: "教练离任，你成了改革的象征，也第一次感到权力的重量。",
      },
      {
        eyebrow: "职业边界",
        title: "只在球场回应",
        copy: "不参加阵营，周末用表现说话。",
        impact: "能力 ↑ · 数据 ↑",
        effects: { ovr: 3, energy: -9, apps: 38, goals: 12, assists: 12, value: 120 },
        note: "你没赢下争论，却用一记远射赢下了德比。",
      },
    ],
  },
  {
    year: "2046 / 47",
    age: 36,
    kicker: "最后一份合同",
    title: "终场哨响之前",
    story:
      "身体告诉你时间到了。母队邀请你回去踢最后一年，海外俱乐部开出丰厚合同，电视台也为你准备好了演播室。",
    choices: [
      {
        eyebrow: "落叶归根",
        title: "回到起点",
        copy: "穿上家乡球队的球衣，把最后一场留给最初的看台。",
        impact: "传奇度 ↑↑↑",
        effects: { morale: 18, reputation: 25, apps: 24, goals: 6, assists: 8, value: -100 },
        club: "故乡竞技",
        note: "第 88 分钟，全场起立。你慢慢走过边线，像走完了一整条河。",
      },
      {
        eyebrow: "最后远征",
        title: "再去一片新大陆",
        copy: "把职业生涯最后一页写在陌生城市。",
        impact: "财富 ↑ · 名气 ↑",
        effects: { energy: -12, reputation: 18, apps: 28, goals: 10, assists: 7, value: 160 },
        club: "太平洋星队",
        note: "你在海风里踢完最后一个赛季，也把足球带给了一群新球迷。",
      },
      {
        eyebrow: "体面谢幕",
        title: "就此退役",
        copy: "不等替补席替你做决定。",
        impact: "健康 ↑↑ · 传奇定格",
        effects: { energy: 12, trust: 10, reputation: 12 },
        note: "发布会结束时，你把球鞋放在椅子上。第二天，没有训练闹钟。",
      },
    ],
  },
];

const chapters: Chapter[] = annualChapters;

const positionAttributeBonus: Record<Position, Partial<AttributeMap>> = {
  LW: { pace: 7, technique: 5 },
  ST: { technique: 6, pace: 3, height: 3 },
  RW: { pace: 7, technique: 5 },
  LM: { pace: 4, iq: 3, eq: 2 },
  CAM: { technique: 5, iq: 6 },
  RM: { pace: 4, iq: 3, eq: 2 },
  LB: { pace: 4, height: 4, iq: 2 },
  CM: { technique: 3, iq: 5, eq: 3 },
  RB: { pace: 4, height: 4, iq: 2 },
  CDM: { iq: 6, height: 5 },
  CB: { height: 7, iq: 4 },
  GK: { height: 7, iq: 5, eq: 2 },
};

const wildEvents: Omit<Chapter, "year" | "age">[] = [
  {
    kicker: "更衣室爆炸 · 群聊截图冲上热搜",
    title: "队长在群里骂你像短视频球员",
    story:
      "匿名账号放出更衣室群聊截图。队长说你只会在镜头前努力，经纪人建议立刻开直播回击；教练则要求全队装作什么都没发生。",
    choices: [
      {
        eyebrow: "直播开战",
        title: "把训练数据一页页甩出来",
        copy: "让全网当陪审团，也让队长没有退路。",
        impact: "名气 ↑↑ · 情商 ↓",
        effects: { reputation: 15, trust: -12, morale: 6, ovr: 2 },
        note: "直播同时在线突破百万。你赢了舆论，却输掉了三个月的更衣室沉默。",
      },
      {
        eyebrow: "关门解决",
        title: "把手机扔桌上，和队长单独谈",
        copy: "不发声明，只要求他当面说完。",
        impact: "信任 ↑↑ · 名气 ↓",
        effects: { trust: 16, reputation: -3, morale: 8, ovr: 2 },
        note: "你们差点动手，最后却一起加练到深夜。第二天，队长公开为你送上助攻。",
      },
      {
        eyebrow: "制造反转",
        title: "穿印着那句话的T恤入场",
        copy: "把攻击变成自己的新外号。",
        impact: "名气 ↑↑↑ · 风险 ↑",
        effects: { reputation: 20, trust: -4, value: 45, ovr: 1 },
        note: "球迷把T恤买到断货。队长看到看台上的巨幅标语，只能摇头笑了。",
      },
    ],
  },
  {
    kicker: "凌晨两点 · 经纪人连打十三通电话",
    title: "假官宣把你送进了死敌更衣室",
    story:
      "一个高仿俱乐部账号宣布你加盟死敌，甚至伪造了签字照。旧主球迷烧掉你的球衣，新球队却真的打来电话：既然全世界都信了，不如把它变成真的。",
    choices: [
      {
        eyebrow: "顺水推舟",
        title: "要求对方今晚就传真合同",
        copy: "让假新闻成为职业生涯最疯狂的转会。",
        impact: "身价 ↑↑ · 信任 ↓↓",
        effects: { value: 90, reputation: 16, trust: -16, ovr: 2 },
        note: "天亮前，假官宣变成真官宣。你的第一场客场比赛需要三层安保。",
      },
      {
        eyebrow: "忠诚声明",
        title: "穿旧主球衣拍一镜到底",
        copy: "不解释技术细节，只告诉球迷你还在。",
        impact: "信任 ↑↑↑ · 报价消失",
        effects: { trust: 20, morale: 7, value: -20, ovr: 1 },
        note: "死敌撤回正式报价。旧主球迷在下一场比赛整整唱了九十分钟你的名字。",
      },
      {
        eyebrow: "黑色幽默",
        title: "转发假照片：至少把我修高一点",
        copy: "让一场公关灾难变成全网笑话。",
        impact: "情商 ↑↑ · 名气 ↑",
        effects: { reputation: 13, morale: 11, trust: 5, value: 25 },
        note: "两家俱乐部一起发了笑哭表情。那张假图后来成了年度最佳足球梗。",
      },
    ],
  },
  {
    kicker: "赛前热身 · 球鞋离奇失踪",
    title: "你的定制战靴被挂上二手平台",
    story:
      "开赛前四十分钟，球鞋柜只剩一张写着“祝你好运”的纸条。有人已经在二手平台开价十万，替补门将承认他知道是谁干的，但要你答应一个条件。",
    choices: [
      {
        eyebrow: "赤脚复仇",
        title: "借青年队球鞋直接上场",
        copy: "号码不合脚，也比错过比赛更体面。",
        impact: "能力 ↑↑ · 受伤风险",
        effects: { ovr: 3, energy: -10, reputation: 12, goals: 2 },
        note: "你脚后跟磨出血，却打进制胜球。那双借来的鞋被永久放进俱乐部展柜。",
      },
      {
        eyebrow: "交换秘密",
        title: "答应替补门将的神秘条件",
        copy: "先拿回球鞋，代价以后再说。",
        impact: "幸运 ↑↑ · 后患未知",
        effects: { reputation: 9, morale: 5, value: -10, ovr: 1 },
        note: "球鞋回来了。一个月后，门将要求你在点球大战故意把第五罚留给他。",
      },
      {
        eyebrow: "全队搜查",
        title: "锁上更衣室，谁都不准走",
        copy: "比赛可以晚开，规矩不能被偷走。",
        impact: "信任 ↓ · 威望 ↑",
        effects: { trust: -9, reputation: 10, morale: -5, ovr: 1 },
        note: "球鞋在按摩床下被找到。没人承认是谁放的，但从此没人再碰你的柜子。",
      },
    ],
  },
  {
    kicker: "商业活动 · 赞助商突然加码",
    title: "进一个球，老板送你一座海岛",
    story:
      "赞助商老板在直播中承诺：德比进球就送你一座私人海岛。足协警告这可能破坏比赛形象，队友却已经开始讨论岛上该修几个球场。",
    choices: [
      {
        eyebrow: "接受挑战",
        title: "对镜头说：准备好地契",
        copy: "把荒唐承诺变成全城赌局。",
        impact: "进球欲望 ↑↑↑ · 压力 ↑",
        effects: { reputation: 18, morale: 8, goals: 3, energy: -7, value: 70 },
        note: "你在第88分钟头球绝杀。老板真的交出钥匙，但那座“岛”退潮时可以走过去。",
      },
      {
        eyebrow: "团队优先",
        title: "要求把海岛换成青训基地",
        copy: "把个人奖励变成俱乐部未来。",
        impact: "信任 ↑↑↑ · 情商 ↑",
        effects: { trust: 18, reputation: 10, assists: 3, morale: 10 },
        note: "你没有进球，却送出两次助攻。青训基地后来以你的名字命名。",
      },
      {
        eyebrow: "拒绝噱头",
        title: "公开要求赞助商停止炒作",
        copy: "德比不需要私人海岛才能重要。",
        impact: "专注 ↑↑ · 商业价值 ↓",
        effects: { ovr: 3, trust: 7, value: -35, reputation: 4 },
        note: "赞助商撤下广告。你踢出了赛季评分最高的一场比赛。",
      },
    ],
  },
  {
    kicker: "训练基地 · 新帅第一堂课",
    title: "教练要把你改造成完全陌生的位置",
    story:
      "新教练说你的老位置已经过时，要你在六周内完成改造。经纪人认为这是逼你离队，数据分析师却偷偷告诉你：模型预测你会因此多踢五年。",
    choices: [
      {
        eyebrow: "彻底重塑",
        title: "每天加练两小时新位置",
        copy: "短期失去数据，换长期上限。",
        impact: "能力 ↑↑↑ · 体能 ↓↓",
        effects: { ovr: 5, energy: -14, goals: -2, assists: 4, trust: 9 },
        note: "前五场你像个迷路的人，第六场却用新位置完成了职业生涯第一次帽子戏法。",
      },
      {
        eyebrow: "位置战争",
        title: "公开告诉教练：我不会改",
        copy: "用过去的数据守住自己的地盘。",
        impact: "名气 ↑ · 信任 ↓↓↓",
        effects: { reputation: 12, trust: -18, morale: 5, ovr: 1 },
        note: "球迷站在你这边，教练却连续三场把你按在替补席。第四场，他因成绩下课。",
      },
      {
        eyebrow: "秘密双修",
        title: "训练踢新位置，比赛回到老位置",
        copy: "不争论，用两套能力逼教练重新计算。",
        impact: "球商 ↑↑ · 体能 ↓",
        effects: { ovr: 4, energy: -8, trust: 12, assists: 3 },
        note: "你成了阵型切换的开关。转播镜头每场都在猜你下一分钟会出现在哪里。",
      },
    ],
  },
];

function hashCareer(value: string) {
  return [...value].reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) % 1000003,
    7,
  );
}

function getCareerChapter(
  base: Chapter | undefined,
  seed: number,
  chapterIndex: number,
) {
  if (!base || base.age <= 14) return base;
  const roll = (seed + chapterIndex * 37) % 5;
  if (roll > 1) return base;
  const twist = wildEvents[(seed + chapterIndex * 11) % wildEvents.length];
  return { ...twist, age: base.age, year: base.year } as Chapter;
}

function buildAttributes(position: Position, build: AttributeMap) {
  const bonus = positionAttributeBonus[position];
  return attributes.reduce(
    (result, attribute) => {
      result[attribute.id] = clamp(
        baseAttributes[attribute.id] +
          (bonus[attribute.id] ?? 0) +
          build[attribute.id] * 3,
      );
      return result;
    },
    { ...baseAttributes },
  );
}

function calculateOvr(values: AttributeMap) {
  return Math.round(
    values.technique * 0.25 +
      values.pace * 0.17 +
      values.iq * 0.22 +
      values.height * 0.12 +
      values.eq * 0.12 +
      values.luck * 0.12,
  );
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const noInjury: InjuryOutcome = {
  severity: "none",
  label: "身体无碍",
  description: "完整参加了本赛季。",
  load: 0,
  appsLost: 0,
  ovrPenalty: 0,
  careerEnding: false,
};

function rollSeasonInjury(
  game: GameState,
  choice: Choice,
  currentAge: number,
): InjuryOutcome {
  const energyCost = Math.max(0, -(choice.effects.energy ?? 0));
  const riskLanguage = `${choice.eyebrow}${choice.title}${choice.copy}${choice.impact}`;
  const riskyChoice = /冒险|加练|豪赌|硬撑|带伤|拼命|孤注一掷|冲撞|拒绝休息/.test(
    riskLanguage,
  );
  const probability = Math.min(
    0.68,
    0.055 +
      energyCost * 0.012 +
      (riskyChoice ? 0.075 : 0) +
      Math.max(0, 55 - game.energy) * 0.004 +
      game.injuryLoad * 0.0022 +
      Math.max(0, currentAge - 29) * 0.014,
  );
  if (Math.random() >= probability) return noInjury;

  const severityRoll =
    Math.random() +
    Math.max(0, currentAge - 31) * 0.012 +
    game.injuryLoad * 0.0015;
  if (severityRoll < 0.61) {
    return {
      severity: "minor",
      label: "肌肉拉伤",
      description: "缺席数周，赛季节奏被打断。",
      load: 12,
      appsLost: randomBetween(2, 5),
      ovrPenalty: -1,
      careerEnding: false,
    };
  }
  if (severityRoll < 0.91) {
    return {
      severity: "major",
      label: "韧带重伤",
      description: "长期缺阵，恢复后的爆发力受到影响。",
      load: 30,
      appsLost: randomBetween(9, 17),
      ovrPenalty: -2,
      careerEnding: false,
    };
  }
  const careerEndingChance = Math.min(
    0.82,
    0.28 + Math.max(0, currentAge - 25) * 0.025 + game.injuryLoad * 0.004,
  );
  const careerEnding = Math.random() < careerEndingChance;
  return {
    severity: "critical",
    label: careerEnding ? "生涯终结性重伤" : "严重复合伤",
    description: careerEnding
      ? "医疗团队确认身体已无法继续承受职业比赛。"
      : "赛季提前结束，职业寿命遭到重创。",
    load: 55,
    appsLost: 28,
    ovrPenalty: -4,
    careerEnding,
  };
}

function calculateSeasonGrowth({
  age: currentAge,
  game,
  choice,
  goals,
  assists,
  goalMax,
  assistMax,
}: {
  age: number;
  game: GameState;
  choice: Choice;
  goals: number;
  assists: number;
  goalMax: number;
  assistMax: number;
}) {
  const choiceSignal = choice.effects.ovr ?? 0;
  const performance =
    goals / Math.max(1, goalMax) + assists / Math.max(1, assistMax);
  const eliteSeason = performance >= 1.25;
  const roll = Math.random();

  if (currentAge < 28) {
    if (roll < 0.7) {
      const ceiling = eliteSeason ? 4 : 3;
      return Math.min(
        game.ovr >= 92 ? 1 : ceiling,
        randomBetween(1, eliteSeason ? 3 : 2) +
          (choiceSignal >= 4 ? 1 : 0),
      );
    }
    return -randomBetween(1, choiceSignal < 0 ? 3 : 2);
  }

  const growthChance =
    (currentAge <= 30 ? 0.12 : currentAge <= 33 ? 0.07 : 0.025) +
    (eliteSeason ? 0.055 : 0) +
    (choiceSignal >= 4 ? 0.02 : 0);
  const flatChance = currentAge <= 31 ? 0.28 : currentAge <= 34 ? 0.2 : 0.12;
  if (roll < growthChance) {
    return eliteSeason && currentAge <= 30 ? randomBetween(1, 2) : 1;
  }
  if (roll < growthChance + flatChance) return 0;
  return -randomBetween(1, currentAge >= 34 ? 3 : 2);
}

function evaluateRetirement(
  currentAge: number,
  afterOvr: number,
  injury: InjuryOutcome,
) {
  if (injury.careerEnding) {
    return {
      retire: true,
      reason: `${injury.label}迫使你在 ${currentAge} 岁立即挂靴。`,
    };
  }
  if (currentAge >= 42) {
    return {
      retire: true,
      reason: "身体已经完成最后一个完整赛季，你选择在掌声中退役。",
    };
  }
  if (currentAge < 33) return { retire: false, reason: "" };

  const yearsPast33 = currentAge - 33;
  const baseChance =
    afterOvr < 65
      ? 0.72
      : afterOvr < 80
        ? 0.48
        : afterOvr < 85
          ? 0.09
          : 0.025;
  const yearlyRise =
    afterOvr < 80 ? yearsPast33 * 0.13 : yearsPast33 * 0.055;
  if (Math.random() < Math.min(0.96, baseChance + yearlyRise)) {
    return {
      retire: true,
      reason:
        afterOvr < 80
          ? `${currentAge} 岁时，竞技水平与恢复速度已不足以支撑下一个赛季。`
          : `${currentAge} 岁时，你判断身体已无法继续保持顶级输出。`,
    };
  }
  return { retire: false, reason: "" };
}

function getMedicalStatus(injuryLoad: number) {
  if (injuryLoad >= 75) return { label: "高危", tone: "critical" };
  if (injuryLoad >= 45) return { label: "脆弱", tone: "major" };
  if (injuryLoad >= 20) return { label: "观察", tone: "minor" };
  return { label: "健康", tone: "fit" };
}

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createContractOffers(game: GameState, initial = false) {
  const eligible = allClubs.filter(({ team, league }) => {
    if (team.id === game.clubId) return false;
    if (initial) return league.weight <= 0.88 || Math.random() > 0.72;
    if (game.ovr < 66) return league.weight <= 0.72;
    if (game.ovr < 76) return league.weight <= 0.88;
    if (game.ovr < 84) return league.weight <= 0.98;
    return true;
  });
  const picks = shuffled(eligible).slice(0, initial ? 3 : 3);
  const strategies: Omit<ContractOffer, "id" | "clubId">[] = [
    {
      kind: "starter",
      label: "保证主力",
      headline: "把球队交给你",
      role: "核心首发",
      salary: "薪资 ×1.4",
      risk: "舞台较小",
      copy: "出场时间写进合同，球队水平普通，但你能连续踢满整个赛季。",
      effects: { ovr: 2, trust: 14, morale: 8, reputation: 2, value: 35 },
    },
    {
      kind: "money",
      label: "超级合同",
      headline: "钱很多，位置没有",
      role: "轮换 / 替补",
      salary: "薪资 ×3.2",
      risk: "不保证首发",
      copy: "签字费足以改变家庭生活，但教练只承诺给你公平竞争的机会。",
      effects: { ovr: -1, trust: -5, morale: 9, reputation: 7, value: 95 },
    },
    {
      kind: "contender",
      label: "争冠豪赌",
      headline: "冠军窗口只开一次",
      role: "激烈竞争",
      salary: "薪资 ×1.8",
      risk: "能力要求极高",
      copy: "训练质量和冠军机会都在顶层，代价是每次失误都可能让你失去位置。",
      effects: { ovr: 4, energy: -10, trust: -7, reputation: 13, value: 70 },
    },
  ];
  const offers = picks.map(({ team }, index) => ({
    ...strategies[index % strategies.length],
    id: `${team.id}-${Date.now()}-${index}`,
    clubId: team.id,
  }));
  if (!initial && game.clubId) {
    offers.unshift({
      id: `stay-${game.clubId}-${Date.now()}`,
      clubId: game.clubId,
      kind: "stay",
      label: "留队续约",
      headline: "熟悉的城市，新的核心条款",
      role: "稳定首发",
      salary: "薪资 ×1.2",
      risk: "上限可见",
      copy: "俱乐部承诺围绕你建队，冠军概率不高，但所有人都知道该把球交给谁。",
      effects: { ovr: 1, trust: 12, morale: 6, reputation: 4, value: 25 },
    });
  }
  return offers;
}

const baseState: GameState = {
  phase: "setup",
  chapter: 0,
  name: "林拓",
  position: "CAM",
  origin: "青训",
  club: "等待报价",
  clubId: "",
  leagueId: "",
  nationality: "中国",
  nationalConfederation: "AFC",
  ovr: 46,
  energy: 78,
  morale: 72,
  trust: 32,
  value: 10,
  apps: 0,
  goals: 0,
  assists: 0,
  reputation: 4,
  rating: 6.5,
  peakOvr: 46,
  injuryLoad: 0,
  injuries: [],
  retiredAge: null,
  retirementReason: "",
  careerSeed: 2026,
  build: { ...emptyBuild },
  attributes: { ...baseAttributes },
  trophies: [],
  seasonAwards: [],
  pendingCameoId: null,
  history: [],
};

const clamp = (value: number, min = 0, max = 99) =>
  Math.min(max, Math.max(min, value));

export default function Home() {
  const [game, setGame] = useState<GameState>(baseState);
  const [loaded, setLoaded] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [pendingOffers, setPendingOffers] = useState<ContractOffer[]>([]);
  const [offerContext, setOfferContext] = useState<"initial" | "season">(
    "initial",
  );
  const [queuedCameoId, setQueuedCameoId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("after90-career-v5");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<GameState>;
          setGame({
            ...baseState,
            ...parsed,
            build: { ...baseState.build, ...parsed.build },
            attributes: { ...baseState.attributes, ...parsed.attributes },
            careerSeed:
              parsed.careerSeed ?? Math.floor(Math.random() * 1000000),
          });
        } catch {
          window.localStorage.removeItem("after90-career-v5");
        }
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem("after90-career-v5", JSON.stringify(game));
    }
  }, [game, loaded]);

  const current = useMemo(
    () => getCareerChapter(chapters[game.chapter], game.careerSeed, game.chapter),
    [game.chapter, game.careerSeed],
  );
  const finalAge = game.retiredAge ?? chapters.at(-1)?.age ?? 42;
  const age = game.phase === "ending" ? finalAge : current?.age ?? 14;
  const progress =
    game.phase === "setup"
      ? 0
      : game.phase === "ending"
        ? 100
        : Math.round((game.chapter / chapters.length) * 100);
  const currentClub = useMemo(() => findClub(game.clubId), [game.clubId]);
  const realWorldContext = {
    age: current?.age ?? 14,
    nationality: game.nationality,
    clubId: game.clubId,
    leagueId: game.leagueId,
    careerSeed: game.careerSeed,
  };
  const activeCameo = findRealWorldEvent(
    game.pendingCameoId,
    realWorldContext,
  );
  const upcomingCameo = current
    ? findRealWorldEventForCareer(realWorldContext)
    : undefined;
  const usedBuildPoints = Object.values(game.build).reduce(
    (total, value) => total + value,
    0,
  );

  const ending = useMemo(() => {
    const score =
      game.ovr +
      game.reputation * 0.25 +
      game.trophies.length * 5 +
      game.goals * 0.015 +
      game.assists * 0.02 +
      game.trust * 0.1;
    if (game.retirementReason.includes("重伤"))
      return {
        label: "命运吹响终场哨",
        copy: "伤病提前结束了比赛，却带不走你已经留下的进球、掌声和名字。",
      };
    if (score >= 165)
      return {
        label: "世界级传奇",
        copy: "你把一段职业生涯踢成了一个时代。后来的人谈起那几年，总会先提到你的名字。",
      };
    if (score >= 142)
      return {
        label: "国家英雄",
        copy: "你没有走过最容易的路，却成了无数孩子第一次认真看球的理由。",
      };
    if (score >= 118)
      return {
        label: "联赛名宿",
        copy: "你赢得过重要比赛，也守住了漫长职业生涯里最难得的尊重。",
      };
    return {
      label: "无悔职业人",
      copy: "不是每个人都会登上封面。但你靠双脚生活了近三十年，这已经是一场漂亮的胜利。",
    };
  }, [game]);

  const adjustBuild = (key: AttributeKey, amount: number) => {
    setGame((prev) => {
      const used = Object.values(prev.build).reduce(
        (total, value) => total + value,
        0,
      );
      const nextValue = prev.build[key] + amount;
      if (nextValue < 0 || nextValue > 10 || (amount > 0 && used >= 10)) {
        return prev;
      }
      return { ...prev, build: { ...prev.build, [key]: nextValue } };
    });
  };

  const advanceCareer = () => {
    setGame((prev) =>
      prev.chapter === chapters.length - 1
        ? { ...prev, phase: "ending", pendingCameoId: null }
        : { ...prev, chapter: prev.chapter + 1, pendingCameoId: null },
    );
  };

  const startCareer = () => {
    if (!game.name.trim() || usedBuildPoints !== 10) return;
    const origin = origins.find((item) => item.id === game.origin);
    const nextAttributes = buildAttributes(game.position, game.build);
    if (game.origin === "街头") {
      nextAttributes.technique = clamp(nextAttributes.technique + 4);
      nextAttributes.luck = clamp(nextAttributes.luck + 2);
    } else if (game.origin === "校园") {
      nextAttributes.pace = clamp(nextAttributes.pace + 3);
      nextAttributes.height = clamp(nextAttributes.height + 3);
    } else {
      nextAttributes.iq = clamp(nextAttributes.iq + 4);
      nextAttributes.eq = clamp(nextAttributes.eq + 2);
    }
    const startingOvr = calculateOvr(nextAttributes);
    const nextState: GameState = {
      ...game,
      phase: "career",
      club: "等待报价",
      clubId: "",
      leagueId: "",
      attributes: nextAttributes,
      ovr: startingOvr,
      peakOvr: startingOvr,
      injuryLoad: 0,
      injuries: [],
      retiredAge: null,
      retirementReason: "",
      careerSeed:
        Math.floor(Math.random() * 1000000) +
        hashCareer(`${game.name}-${game.position}`),
      history: [
        {
          age: 13,
          title: `${origin?.title ?? "无名少年"}出身`,
          note: `你以${positions.find((item) => item.id === game.position)?.name ?? game.position}身份进入职业足球，十点天赋决定了第一条成长路线。`,
        },
      ],
    };
    setGame(nextState);
    setOfferContext("initial");
    setPendingOffers(createContractOffers(nextState, true));
  };

  const choose = (choice: Choice) => {
    if (!current || resolution) return;
    const attackingGoalRange: Record<Position, [number, number]> = {
      ST: [9, 25],
      LW: [6, 18],
      RW: [6, 18],
      CAM: [4, 13],
      LM: [3, 10],
      RM: [3, 10],
      CM: [2, 8],
      CDM: [0, 5],
      LB: [0, 4],
      RB: [0, 4],
      CB: [0, 4],
      GK: [0, 1],
    };
    const assistRange: Record<Position, [number, number]> = {
      ST: [2, 9],
      LW: [5, 15],
      RW: [5, 15],
      CAM: [7, 18],
      LM: [5, 14],
      RM: [5, 14],
      CM: [5, 14],
      CDM: [2, 9],
      LB: [3, 11],
      RB: [3, 11],
      CB: [0, 4],
      GK: [0, 2],
    };
    const scheduledApps =
      current.age < 16
        ? Math.max(choice.effects.apps ?? 0, randomBetween(3, 10))
        : Math.max(choice.effects.apps ?? 0, randomBetween(18, 40));
    const [goalMin, goalMax] = attackingGoalRange[game.position];
    const [assistMin, assistMax] = assistRange[game.position];
    const scheduledGoals = Math.max(
      choice.effects.goals ?? 0,
      randomBetween(goalMin, goalMax) +
        Math.floor((game.attributes.luck - 50) / 18),
    );
    const scheduledAssists = Math.max(
      choice.effects.assists ?? 0,
      randomBetween(assistMin, assistMax) +
        Math.floor((game.attributes.iq - 50) / 20),
    );
    const injury = rollSeasonInjury(game, choice, current.age);
    const availability = Math.max(
      0,
      (scheduledApps - injury.appsLost) / Math.max(1, scheduledApps),
    );
    const apps = Math.max(0, scheduledApps - injury.appsLost);
    const goals = Math.max(0, Math.round(scheduledGoals * availability));
    const assists = Math.max(0, Math.round(scheduledAssists * availability));
    const formDelta = calculateSeasonGrowth({
      age: current.age,
      game,
      choice,
      goals,
      assists,
      goalMax,
      assistMax,
    });
    const ovrDelta = Math.max(
      -6,
      Math.min(4, formDelta + injury.ovrPenalty),
    );
    const firstAttribute =
      attributes[
        (choice.title.length + game.chapter + game.careerSeed) %
          attributes.length
      ].id;
    const secondAttribute =
      attributes[
        (choice.copy.length + game.chapter * 3 + game.careerSeed) %
          attributes.length
      ].id;
    const attributeDeltas: Partial<AttributeMap> =
      ovrDelta > 0
        ? {
            [firstAttribute]: randomBetween(1, Math.min(2, ovrDelta)),
            [secondAttribute]: 1,
          }
        : ovrDelta < 0
          ? {
              [firstAttribute]: -randomBetween(
                1,
                Math.min(2, Math.abs(ovrDelta)),
              ),
              [secondAttribute]: injury.severity === "critical" ? -2 : -1,
            }
          : {};
    const rating = Math.min(
      10,
      Math.max(
        5,
        Number(
          (
            6.1 +
            goals * 0.08 +
            assists * 0.07 +
            ovrDelta * 0.16 +
            randomBetween(-4, 8) / 10 -
            (injury.severity === "major"
              ? 0.6
              : injury.severity === "critical"
                ? 1.2
                : 0)
          ).toFixed(1),
        ),
      ),
    );
    const statEffects: Partial<Record<StatKey, number>> = {
      ...choice.effects,
      apps,
      goals,
      assists,
      ovr: ovrDelta,
    };
    const beforeOvr = game.ovr;
    const afterOvr = clamp(beforeOvr + ovrDelta);
    const nextInjuryLoad = clamp(
      game.injuryLoad +
        injury.load -
        (injury.severity === "none" ? randomBetween(8, 15) : 0),
    );
    const retirement = evaluateRetirement(current.age, afterOvr, injury);
    const seasonYear = Number.parseInt(current.year.slice(0, 4), 10);
    const awards = evaluateSeasonAwards({
      age: current.age,
      year: seasonYear,
      ovr: afterOvr,
      reputation: clamp(
        game.reputation + (choice.effects.reputation ?? 0),
      ),
      morale: clamp(game.morale + (choice.effects.morale ?? 0)),
      clubId: game.clubId,
      nationality: game.nationality,
      nationalConfederation: game.nationalConfederation,
      seasonApps: apps,
      seasonGoals: goals,
      seasonAssists: assists,
    });
    const earned = [...(choice.trophy ? [choice.trophy] : []), ...awards];
    setGame((prev) => {
      const next = {
        ...prev,
        attributes: { ...prev.attributes },
      } as GameState;
      Object.entries(statEffects).forEach(([key, amount]) => {
        const stat = key as StatKey;
        const currentValue = next[stat] as number;
        const raw = currentValue + (amount ?? 0);
        next[stat] =
          (["energy", "morale", "trust", "ovr", "reputation"].includes(stat)
            ? clamp(raw)
            : Math.max(0, raw)) as never;
      });
      Object.entries(attributeDeltas).forEach(([key, amount]) => {
        const attribute = key as AttributeKey;
        next.attributes[attribute] = clamp(
          next.attributes[attribute] + (amount ?? 0),
        );
      });
      next.rating = rating;
      next.peakOvr = Math.max(next.peakOvr, next.ovr);
      next.injuryLoad = nextInjuryLoad;
      if (injury.severity !== "none") {
        next.injuries = [
          ...next.injuries,
          {
            age: current.age,
            label: injury.label,
            severity: injury.severity,
          },
        ];
      }
      if (retirement.retire) {
        next.retiredAge = current.age;
        next.retirementReason = retirement.reason;
      }
      if (earned.length) next.trophies = [...next.trophies, ...earned];
      next.seasonAwards = [
        ...next.seasonAwards,
        { age: current.age, year: seasonYear, items: awards },
      ];
      next.history = [
        ...next.history,
        {
          age: current.age,
          title: retirement.retire
            ? `${choice.title} · 宣布退役`
            : injury.severity !== "none"
              ? `${choice.title} · ${injury.label}`
              : choice.title,
          note: `${choice.note}${
            injury.severity !== "none" ? ` ${injury.description}` : ""
          }${awards.length ? ` 赛季荣誉：${awards.join("、")}。` : ""}${
            retirement.retire ? ` ${retirement.reason}` : ""
          }`,
        },
      ];
      return next;
    });
    setQueuedCameoId(retirement.retire ? null : upcomingCameo?.id ?? null);
    setResolution({
      kind: "season",
      title: retirement.retire
        ? injury.careerEnding
          ? "重伤退役"
          : "终场哨响"
        : injury.severity === "critical" || injury.severity === "major"
          ? "伤病警报"
          : earned.length
            ? "荣誉解锁"
            : ovrDelta > 0
              ? "能力成长"
              : ovrDelta < 0
                ? "状态下滑"
                : "赛季结算",
      note:
        injury.severity !== "none"
          ? `${injury.description}${retirement.retire ? ` ${retirement.reason}` : ""}`
          : choice.note,
      beforeOvr,
      afterOvr,
      rating,
      statDeltas: {
        apps,
        goals,
        assists,
        value: choice.effects.value ?? 0,
        reputation: choice.effects.reputation ?? 0,
      },
      attributeDeltas,
      offerAfter:
        !retirement.retire &&
        current.age >= 16 &&
        current.age <= 38 &&
        (current.age % 2 === 0 ||
          (game.careerSeed + current.age * 17) % 100 < 22),
      advanceAfter: true,
      goalBurst: goals > 0,
      awards: earned,
      injury,
      retireAfter: retirement.retire,
      retirementReason: retirement.reason,
    });
  };

  const chooseContract = (offer: ContractOffer) => {
    const found = findClub(offer.clubId);
    if (!found || resolution) return;
    const beforeOvr = game.ovr;
    const quotedOvrDelta = offer.effects.ovr ?? 0;
    const ovrDelta =
      age >= 28 && quotedOvrDelta > 0
        ? game.rating >= 8.5 &&
          hashCareer(`${game.careerSeed}-${age}-${offer.id}`) % 100 < 8
          ? 1
          : 0
        : quotedOvrDelta;
    const effectiveEffects = { ...offer.effects, ovr: ovrDelta };
    setPendingOffers([]);
    setGame((prev) => {
      const next = { ...prev };
      Object.entries(effectiveEffects).forEach(([key, amount]) => {
        const stat = key as StatKey;
        const raw = (next[stat] as number) + (amount ?? 0);
        next[stat] =
          (["energy", "morale", "trust", "ovr", "reputation"].includes(stat)
            ? clamp(raw)
            : Math.max(0, raw)) as never;
      });
      next.club = found.team.localName;
      next.clubId = found.team.id;
      next.leagueId = found.league.id;
      next.peakOvr = Math.max(next.peakOvr, next.ovr);
      next.history = [
        ...next.history,
        {
          age,
          title:
            offer.kind === "stay"
              ? `与 ${found.team.localName} 续约`
              : `加盟 ${found.team.localName}`,
          note: `${offer.label}：${offer.role}，${offer.salary}。${found.league.country}${found.league.name}，${found.team.level}。`,
        },
      ];
      return next;
    });
    setResolution({
      kind: "contract",
      title: offer.kind === "stay" ? "续约完成" : "HERE WE GO",
      note: `${found.team.localName} · ${found.league.country} · ${found.league.name}`,
      beforeOvr,
      afterOvr: clamp(beforeOvr + ovrDelta),
      rating: game.rating,
      statDeltas: {
        apps: 0,
        goals: 0,
        assists: 0,
        value: offer.effects.value ?? 0,
        reputation: offer.effects.reputation ?? 0,
      },
      attributeDeltas: {},
      offerAfter: false,
      advanceAfter: offerContext === "season",
      goalBurst: false,
      awards: [],
    });
  };

  const continueResolution = () => {
    if (!resolution) return;
    const resolved = resolution;
    setResolution(null);
    if (resolved.retireAfter) {
      setPendingOffers([]);
      setQueuedCameoId(null);
      setGame((prev) => ({
        ...prev,
        phase: "ending",
        pendingCameoId: null,
        retiredAge: prev.retiredAge ?? age,
        retirementReason:
          prev.retirementReason ||
          resolved.retirementReason ||
          `${age} 岁时结束职业生涯。`,
      }));
      return;
    }
    if (resolved.offerAfter) {
      setOfferContext("season");
      setPendingOffers(createContractOffers(game));
      return;
    }
    if (!resolved.advanceAfter) return;
    if (queuedCameoId) {
      setGame((prev) => ({ ...prev, pendingCameoId: queuedCameoId }));
      setQueuedCameoId(null);
      return;
    }
    advanceCareer();
  };

  useEffect(() => {
    if (!resolution) return;
    const timer = window.setTimeout(continueResolution, 1000);
    return () => window.clearTimeout(timer);
  }, [resolution]);

  const chooseCameo = (choice: CameoChoice) => {
    if (!activeCameo || resolution) return;
    const beforeOvr = game.ovr;
    const quotedOvrDelta = choice.effects.ovr ?? 0;
    const ovrDelta =
      age >= 28 && quotedOvrDelta > 0
        ? game.rating >= 8.7 &&
          hashCareer(`${game.careerSeed}-${age}-${choice.title}`) % 100 < 8
          ? 1
          : 0
        : quotedOvrDelta;
    const effectiveEffects = { ...choice.effects, ovr: ovrDelta };
    setGame((prev) => {
      const next = { ...prev } as GameState;
      Object.entries(effectiveEffects).forEach(([key, amount]) => {
        const stat = key as StatKey;
        const raw = (next[stat] as number) + (amount ?? 0);
        next[stat] =
          (["energy", "morale", "trust", "ovr", "reputation"].includes(stat)
            ? clamp(raw)
            : Math.max(0, raw)) as never;
      });
      next.pendingCameoId = null;
      next.peakOvr = Math.max(next.peakOvr, next.ovr);
      next.history = [
        ...next.history,
        {
          age: activeCameo.age,
          title: `${activeCameo.star}：${choice.title}`,
          note: choice.note,
        },
      ];
      return next;
    });
    setQueuedCameoId(null);
    setResolution({
      kind: "season",
      title: "突发事件结算",
      note: choice.note,
      beforeOvr,
      afterOvr: clamp(beforeOvr + ovrDelta),
      rating: game.rating,
      statDeltas: {
        apps: choice.effects.apps ?? 0,
        goals: choice.effects.goals ?? 0,
        assists: choice.effects.assists ?? 0,
        value: choice.effects.value ?? 0,
        reputation: choice.effects.reputation ?? 0,
      },
      attributeDeltas: {},
      offerAfter: false,
      advanceAfter: true,
      goalBurst: (choice.effects.goals ?? 0) > 0,
      awards: [],
    });
  };

  const resetGame = () => {
    window.localStorage.removeItem("after90-career-v5");
    setGame({ ...baseState, build: { ...emptyBuild }, attributes: { ...baseAttributes } });
    setPendingOffers([]);
    setResolution(null);
    setQueuedCameoId(null);
    setShowReset(false);
  };

  if (!loaded) {
    return (
      <main className="loading-screen">
        <span className="ball-mark">90</span>
        <p>正在系紧鞋带…</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => game.phase !== "setup" && setShowReset(true)}
          aria-label="九十分钟后，返回新游戏"
        >
          <span className="brand-ball">90</span>
          <span>
            <strong>九十分钟后</strong>
            <small>AFTER THE WHISTLE</small>
          </span>
        </button>
        <div className="season-progress" aria-label={`生涯进度 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <nav className="top-actions" aria-label="游戏操作">
          {game.phase !== "setup" && (
            <button onClick={() => setShowReset(true)}>
              <span aria-hidden="true">↺</span> 新生涯
            </button>
          )}
        </nav>
      </header>

      {game.phase === "setup" && (
        <main className="setup-page">
          <section className="setup-intro">
            <div className="hero-status">
              <span />
              PLAYER CAREER
            </div>
            <h1>
              踢出
              <span>你的时代</span>
            </h1>
            <div className="career-range">
              <strong>14</strong>
              <i />
              <strong>42</strong>
              <span>岁</span>
            </div>
            <div className="kit-showcase prospect-showcase" aria-label="新秀球衣">
              <div className="prospect-shirt">
                <span>
                  {positions.find((item) => item.id === game.position)?.number}
                </span>
                <b>{game.name.slice(0, 6) || "PLAYER"}</b>
              </div>
              <div className="showcase-club">
                <span>ROOKIE DRAFT</span>
                <strong>{game.position} · 待签约新秀</strong>
                <small>开局后随机收到三份俱乐部报价</small>
              </div>
            </div>
          </section>

          <section className="setup-card" aria-label="创建球员">
            <div className="setup-heading">
              <div>
                <span>创建球员</span>
                <small>NEW PLAYER</small>
              </div>
              <strong>01</strong>
            </div>
            <div className="setup-row name-row">
              <span className="row-icon">ID</span>
              <label htmlFor="player-name">姓名</label>
              <input
                id="player-name"
                data-testid="player-name"
                className="name-input"
                value={game.name}
                maxLength={8}
                onChange={(event) =>
                  setGame((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="输入姓名"
              />
            </div>

            <div className="setup-block">
              <div className="block-title">
                <span className="row-icon">POS</span>
                <strong>位置</strong>
              </div>
              <div className="position-grid">
                {positions.map((position) => (
                  <button
                    key={position.id}
                    className={game.position === position.id ? "selected" : ""}
                    onClick={() =>
                      setGame((prev) => ({ ...prev, position: position.id }))
                    }
                    aria-pressed={game.position === position.id}
                  >
                    <b>{position.number}</b>
                    <strong>{position.id}</strong>
                    <span>{position.name}</span>
                    <em>{position.zone}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-block">
              <div className="block-title">
                <span className="row-icon">DNA</span>
                <strong>出身</strong>
              </div>
              <div className="origin-grid">
                {origins.map((origin) => (
                  <button
                    key={origin.id}
                    className={`origin-option ${game.origin === origin.id ? "selected" : ""}`}
                    onClick={() =>
                      setGame((prev) => ({ ...prev, origin: origin.id }))
                    }
                    aria-pressed={game.origin === origin.id}
                  >
                    <span className="origin-symbol">{origin.icon}</span>
                    <strong>{origin.title}</strong>
                    <em>{origin.bonus.replace(" · ", "  ")}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-block attribute-build-block">
              <div className="block-title attribute-block-title">
                <span className="row-icon">APT</span>
                <strong>天赋加点</strong>
                <b className={usedBuildPoints === 10 ? "complete" : ""}>
                  剩余 {10 - usedBuildPoints}
                </b>
              </div>
              <div className="attribute-builder">
                {attributes.map((attribute) => {
                  const preview = buildAttributes(game.position, game.build)[
                    attribute.id
                  ];
                  return (
                    <div className="attribute-stepper" key={attribute.id}>
                      <span className="attribute-icon">{attribute.icon}</span>
                      <span className="attribute-name">
                        <strong>{attribute.label}</strong>
                        <small>{attribute.short}</small>
                      </span>
                      <button
                        onClick={() => adjustBuild(attribute.id, -1)}
                        disabled={game.build[attribute.id] === 0}
                        aria-label={`${attribute.label}减一点`}
                      >
                        −
                      </button>
                      <strong className="attribute-preview">{preview}</strong>
                      <button
                        onClick={() => adjustBuild(attribute.id, 1)}
                        disabled={usedBuildPoints >= 10}
                        aria-label={`${attribute.label}加一点`}
                      >
                        +
                      </button>
                      <em>+{game.build[attribute.id]}</em>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="setup-split">
              <label className="quick-select" htmlFor="national-team">
                <span>国家队</span>
                <select
                  id="national-team"
                  className="national-team-select"
                  value={game.nationality}
                  onChange={(event) => {
                    const nation = nationalTeams.find(
                      (item) => item.name === event.target.value,
                    );
                    if (!nation) return;
                    setGame((prev) => ({
                      ...prev,
                      nationality: nation.name,
                      nationalConfederation: nation.confederation,
                    }));
                  }}
                >
                  {nationalTeams.map((nation) => (
                    <option value={nation.name} key={nation.name}>
                      {nation.flag} {nation.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="club-picker-button random-offer-hint">
                <span className="random-dice">⚄</span>
                <span>
                  <small>第一站</small>
                  <strong>随机俱乐部报价</strong>
                </span>
                <b aria-hidden="true">›</b>
              </div>
            </div>

            <button
              className="primary-button"
              data-testid="start-career"
              onClick={startCareer}
              disabled={!game.name.trim() || usedBuildPoints !== 10}
            >
              <span>
                {usedBuildPoints === 10
                  ? "抽取三份报价"
                  : `还需分配 ${10 - usedBuildPoints} 点`}
              </span>
              <span aria-hidden="true">▶</span>
            </button>
          </section>
        </main>
      )}

      {game.phase === "career" && current && (
        <main className="career-page">
          <section className="matchday-strip">
            <div>
              <span>CAREER FILE</span>
              <strong>{current.year}</strong>
            </div>
            <p>{current.kicker}</p>
            <div className="live-badge">
              <span /> 生涯进行中
            </div>
          </section>

          <section className="mobile-career-summary" aria-label="球员快速状态">
            <div className="mobile-player-id">
              {currentClub ? (
                <TeamKit club={currentClub.team} variant="mini" />
              ) : (
                <div className="mobile-position">{game.position}</div>
              )}
              <div>
                <span>{game.nationality} · {age} 岁</span>
                <strong>{game.name}</strong>
                <small>
                  {currentClub ? getClubShortName(currentClub.team) : game.club}
                </small>
              </div>
            </div>
            <div className="mobile-quick-stats">
              <div className="mobile-ovr-stat">
                <span>OVR</span>
                <strong>{game.ovr}</strong>
              </div>
              <div>
                <span>出场</span>
                <strong>{game.apps}</strong>
              </div>
              <div>
                <span>进球</span>
                <strong>{game.goals}</strong>
              </div>
              <div>
                <span>助攻</span>
                <strong>{game.assists}</strong>
              </div>
            </div>
            <div className="mobile-rating">
              <span>赛季评分</span>
              <strong>{game.rating.toFixed(1)}</strong>
            </div>
          </section>

          <div className="career-grid">
            <aside className="player-panel">
              {currentClub && (
                <div className="player-kit-card">
                  <TeamKit club={currentClub.team} variant="card" />
                  <TeamCrest club={currentClub.team} size={54} />
                </div>
              )}
              <div className="player-identity">
                {currentClub ? (
                  <TeamCrest club={currentClub.team} size={58} />
                ) : (
                  <div className="shirt-number">{game.position}</div>
                )}
                <div>
                  <span>{game.nationality}国家队 · {game.origin}出身</span>
                  <h2>{game.name}</h2>
                  <p>
                    {currentClub ? getClubShortName(currentClub.team) : game.club} ·{" "}
                    {age} 岁
                  </p>
                </div>
              </div>

              {currentClub && (
                <div className="club-status-card">
                  <span>{currentClub.league.confederation}</span>
                  <strong>{currentClub.league.country}</strong>
                  <p>{currentClub.league.name}</p>
                  <div>
                    <b>{currentClub.league.band}</b>
                    <b>{currentClub.team.level}</b>
                  </div>
                  <small>转会机会由赛季表现随机触发</small>
                </div>
              )}

              <div className="ovr-block">
                <span>OVERALL RATING</span>
                <strong>{game.ovr}</strong>
                <b className="peak-ovr">巅峰 {game.peakOvr}</b>
                <div className="ovr-track">
                  <i style={{ width: `${game.ovr}%` }} />
                </div>
              </div>

              <div className="attribute-dashboard">
                {attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <span>{attribute.short}</span>
                    <strong>{game.attributes[attribute.id]}</strong>
                    <small>{attribute.label}</small>
                  </div>
                ))}
              </div>

              <div className="form-strip">
                <div>
                  <span>评分</span>
                  <strong>{game.rating.toFixed(1)}</strong>
                </div>
                <Meter label="体能" value={game.energy} />
                <Meter label="士气" value={game.morale} />
              </div>

              <div
                className={`medical-card medical-${getMedicalStatus(game.injuryLoad).tone}`}
              >
                <span>MED</span>
                <strong>{100 - game.injuryLoad}</strong>
                <small>{getMedicalStatus(game.injuryLoad).label}</small>
                <b>{game.injuries.length} 次伤病</b>
              </div>

              <div className="market-card">
                <span>当前身价</span>
                <strong>
                  {game.value >= 1000
                    ? `${(game.value / 1000).toFixed(1)} 亿`
                    : `${game.value} 万`}
                </strong>
                <small>虚构货币单位</small>
              </div>
            </aside>

            <section className="story-panel" data-testid="story-panel">
              <div className="story-index">
                <span>CHAPTER {String(game.chapter + 1).padStart(2, "0")}</span>
                <strong>{current.age}</strong>
                <small>岁</small>
              </div>
              <p className="story-kicker">{current.kicker}</p>
              <h1>{current.title}</h1>
              <p className="story-copy">{current.story}</p>
              {upcomingCameo && (
                <div className="reality-teaser">
                  <span>MATCH CONTEXT</span>
                  <strong>{upcomingCameo.tag}</strong>
                  <p>{upcomingCameo.star}</p>
                </div>
              )}
              <div className="decision-rule">
                <span>你会怎么做？</span>
                <i />
              </div>
              <div className="choice-list">
                {current.choices.map((choice, index) => (
                  <button
                    key={choice.title}
                    className="choice-card"
                    data-testid={`choice-${index}`}
                    onClick={() => choose(choice)}
                  >
                    <span className="choice-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="choice-body">
                      <small>{choice.eyebrow}</small>
                      <strong>{choice.title}</strong>
                      <span>{choice.copy}</span>
                    </span>
                    <em>{choice.impact}</em>
                    <b aria-hidden="true">↗</b>
                  </button>
                ))}
              </div>
            </section>

            <aside className="season-panel">
              <div className="panel-title">
                <span>生涯数据</span>
                <small>实时</small>
              </div>
              <div className="big-stats">
                <div className="career-stat-primary">
                  <strong>{game.apps}</strong>
                  <span>出场</span>
                </div>
                <div className="career-stat-goals">
                  <strong>{game.goals}</strong>
                  <span>进球</span>
                </div>
                <div className="career-stat-assists">
                  <strong>{game.assists}</strong>
                  <span>助攻</span>
                </div>
              </div>
              <div className="career-score-card">
                <span>当前赛季评分</span>
                <strong>{game.rating.toFixed(1)}</strong>
                <i style={{ width: `${game.rating * 10}%` }} />
              </div>
              <div className="trophy-box">
                <span>荣誉室</span>
                {game.trophies.length ? (
                  <ul>
                    {game.trophies.slice(-7).reverse().map((trophy, index) => (
                      <li key={`${trophy}-${index}`}>
                        <b>◆</b> {trophy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>空着的位置，正在等你填满。</p>
                )}
                {game.trophies.length > 7 && (
                  <small>另有 {game.trophies.length - 7} 项荣誉已归档</small>
                )}
              </div>
              <div className="award-window">
                <span>最近赛季评选</span>
                {game.seasonAwards.at(-1)?.items.length ? (
                  <>
                    <strong>
                      {game.seasonAwards.at(-1)?.year} ·{" "}
                      {game.seasonAwards.at(-1)?.age} 岁
                    </strong>
                    <p>{game.seasonAwards.at(-1)?.items.join(" / ")}</p>
                  </>
                ) : (
                  <p>完成本赛季后，联赛、洲际和世界奖项将在这里揭晓。</p>
                )}
              </div>
              <div className="last-event">
                <span>上一章</span>
                {game.history.length > 1 ? (
                  <>
                    <strong>{game.history.at(-1)?.title}</strong>
                    <p>{game.history.at(-1)?.note}</p>
                  </>
                ) : (
                  <p>你的故事才刚刚开始。</p>
                )}
              </div>
            </aside>
          </div>

          <section className="timeline" aria-label="生涯时间线">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.age}
                className={
                  index < game.chapter
                    ? "done"
                    : index === game.chapter
                      ? "current"
                      : ""
                }
              >
                <span>{chapter.age}</span>
                <i />
                <small>{index < game.chapter ? "已完成" : chapter.year}</small>
              </div>
            ))}
          </section>
        </main>
      )}

      {game.phase === "ending" && (
        <main className="ending-page">
          <section className="ending-hero">
            <p className="overline">FINAL WHISTLE · 生涯档案已封存</p>
            <span className="ending-age">{finalAge}</span>
            <h1>{ending.label}</h1>
            <p>{ending.copy}</p>
            <strong className="retirement-reason">
              {finalAge} 岁退役 · {game.retirementReason}
            </strong>
          </section>

          <section className="career-record" data-testid="career-record">
            <div className="record-head">
              <div>
                <span>PLAYER No. {game.position}</span>
                <h2>{game.name}</h2>
                <p>
                  {game.nationality}国家队 · {game.origin}出身 · 最后一站 {game.club}
                </p>
              </div>
              <div className="final-ovr">
                <span>PEAK OVR</span>
                <strong>{game.peakOvr}</strong>
              </div>
            </div>
            <div className="record-stats">
              <div>
                <span>出场</span>
                <strong>{game.apps}</strong>
              </div>
              <div>
                <span>进球</span>
                <strong>{game.goals}</strong>
              </div>
              <div>
                <span>助攻</span>
                <strong>{game.assists}</strong>
              </div>
              <div>
                <span>冠军</span>
                <strong>{game.trophies.length}</strong>
              </div>
              <div>
                <span>最高身价</span>
                <strong>{Math.max(game.value, 0)} 万</strong>
              </div>
              <div>
                <span>生涯评分</span>
                <strong>{game.rating.toFixed(1)}</strong>
              </div>
            </div>
            <div className="record-body">
              <div className="record-timeline">
                <h3>{Math.max(1, game.history.length - 1)} 个决定，一整段人生</h3>
                {game.history.map((item, index) => (
                  <article key={`${item.age}-${index}`}>
                    <span>{item.age} 岁</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.note}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="record-honours">
                <h3>荣誉册</h3>
                {game.trophies.length ? (
                  game.trophies.map((trophy, index) => (
                    <div key={`${trophy}-${index}`}>
                      <span>◆</span>
                      <strong>{trophy}</strong>
                    </div>
                  ))
                ) : (
                  <p>没有奖杯，但有一段完整的职业生涯。</p>
                )}
              </div>
            </div>
            <div className="record-footer">
              <span>AFTER THE WHISTLE · CAREER ARCHIVE</span>
              <strong>{new Date().getFullYear()}</strong>
            </div>
          </section>

          <div className="ending-actions">
            <button className="primary-button" onClick={() => setShowReset(true)}>
              再活一次 <span>↻</span>
            </button>
            <button
              className="secondary-button"
              onClick={() => window.print()}
            >
              打印生涯档案
            </button>
          </div>
        </main>
      )}

      <footer className="site-footer">
        <strong>90′</strong>
        <span>AFTER THE WHISTLE</span>
      </footer>

      {activeCameo && (
        <div className="modal-backdrop cameo-backdrop" role="presentation">
          <section
            className="modal cameo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cameo-title"
          >
            <header className="cameo-head">
              <div>
                <p className="overline">{activeCameo.tag}</p>
                <span>EXTRA TIME / 突发互动</span>
              </div>
              <strong>{activeCameo.age}</strong>
            </header>
            <p className="cameo-star">{activeCameo.star}</p>
            <h2 id="cameo-title">{activeCameo.headline}</h2>
            <p className="cameo-story">{activeCameo.story}</p>
            <div className="cameo-choice-list">
              {activeCameo.choices.map((choice, index) => (
                <button
                  key={choice.title}
                  onClick={() => chooseCameo(choice)}
                >
                  <span className="choice-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>
                    <small>{choice.eyebrow}</small>
                    <strong>{choice.title}</strong>
                    <p>{choice.copy}</p>
                  </span>
                  <em>{choice.impact}</em>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {pendingOffers.length > 0 && (
        <div className="modal-backdrop offer-backdrop" role="presentation">
          <section
            className="modal offer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-title"
          >
            <header className="offer-modal-head">
              <div>
                <p className="overline">
                  {offerContext === "initial"
                    ? "ROOKIE CONTRACTS"
                    : "TRANSFER WINDOW"}
                </p>
                <h2 id="offer-title">
                  {offerContext === "initial"
                    ? "三家俱乐部发来报价"
                    : "市场为你的表现开价"}
                </h2>
              </div>
              <div className="offer-player-score">
                <span>OVR</span>
                <strong>{game.ovr}</strong>
              </div>
            </header>
            <div className="offer-grid">
              {pendingOffers.map((offer) => {
                const found = findClub(offer.clubId);
                if (!found) return null;
                const ovrChange = offer.effects.ovr ?? 0;
                const lateCareerGrowth = age >= 28 && ovrChange > 0;
                return (
                  <button
                    key={offer.id}
                    className={`contract-offer offer-${offer.kind}`}
                    onClick={() => chooseContract(offer)}
                  >
                    <span className="offer-type">{offer.label}</span>
                    <div className="offer-club-visual">
                      <TeamKit club={found.team} variant="card" />
                      <TeamCrest club={found.team} size={58} />
                    </div>
                    <span className="offer-league">
                      {found.league.country} · {found.league.name}
                    </span>
                    <strong className="offer-club-name">
                      {getClubShortName(found.team)}
                    </strong>
                    <span className="offer-level">
                      {found.team.level} · {found.league.band}
                    </span>
                    <h3>{offer.headline}</h3>
                    <p>{offer.copy}</p>
                    <div className="offer-terms">
                      <span>
                        <small>定位</small>
                        <b>{offer.role}</b>
                      </span>
                      <span>
                        <small>合同</small>
                        <b>{offer.salary}</b>
                      </span>
                    </div>
                    <div className="offer-impact">
                      <strong className={ovrChange >= 0 ? "positive" : "negative"}>
                        {lateCareerGrowth
                          ? "OVR 小概率 +1"
                          : `OVR ${ovrChange >= 0 ? "+" : ""}${ovrChange}`}
                      </strong>
                      <span>{offer.risk}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {resolution && (
        <div
          className={`modal-backdrop resolution-backdrop ${
            resolution.goalBurst ? "has-goals" : ""
          }`}
          role="presentation"
        >
          <section
            className="modal resolution-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resolution-title"
          >
            {resolution.goalBurst && (
              <div className="goal-celebration" aria-hidden="true">
                <span>GOAL</span>
                <i>✦</i>
                <i>✦</i>
                <i>✦</i>
              </div>
            )}
            <p className="overline">
              {resolution.kind === "contract"
                ? "CONTRACT COMPLETE"
                : resolution.awards.length
                  ? "HONOUR UNLOCKED"
                  : "SEASON COMPLETE"}
            </p>
            <h2 id="resolution-title">{resolution.title}</h2>
            {resolution.awards.length > 0 && (
              <div className="resolution-awards" aria-label="新获得的荣誉">
                <span aria-hidden="true">◆</span>
                <div>
                  <small>新荣誉</small>
                  <strong>{resolution.awards.slice(0, 2).join(" · ")}</strong>
                </div>
              </div>
            )}
            {resolution.injury && resolution.injury.severity !== "none" && (
              <div
                className={`resolution-injury injury-${resolution.injury.severity}`}
                aria-label="伤病通报"
              >
                <span aria-hidden="true">✚</span>
                <div>
                  <small>
                    {resolution.retireAfter ? "CAREER ENDING" : "MEDICAL REPORT"}
                  </small>
                  <strong>{resolution.injury.label}</strong>
                </div>
              </div>
            )}
            <div className="resolution-ovr">
              <div>
                <span>此前</span>
                <strong>{resolution.beforeOvr}</strong>
              </div>
              <b className={resolution.afterOvr >= resolution.beforeOvr ? "up" : "down"}>
                {resolution.afterOvr >= resolution.beforeOvr ? "▲" : "▼"}
                {Math.abs(resolution.afterOvr - resolution.beforeOvr)}
              </b>
              <div className="new-ovr">
                <span>当前 OVR</span>
                <strong>{resolution.afterOvr}</strong>
              </div>
            </div>
            {resolution.kind === "season" && (
              <>
                <div className="resolution-rating">
                  <span>赛季评分</span>
                  <strong>{resolution.rating.toFixed(1)}</strong>
                  <i style={{ width: `${resolution.rating * 10}%` }} />
                </div>
                <div className="resolution-stats">
                  <div>
                    <span>出场</span>
                    <strong>+{resolution.statDeltas.apps}</strong>
                  </div>
                  <div className="goals">
                    <span>进球</span>
                    <strong>+{resolution.statDeltas.goals}</strong>
                  </div>
                  <div>
                    <span>助攻</span>
                    <strong>+{resolution.statDeltas.assists}</strong>
                  </div>
                </div>
                <div className="attribute-gains">
                  {Object.entries(resolution.attributeDeltas).map(
                    ([key, value]) => {
                      const attribute = attributes.find(
                        (item) => item.id === key,
                      );
                      if (!attribute || !value) return null;
                      return (
                        <span
                          className={value > 0 ? "positive" : "negative"}
                          key={key}
                        >
                          {attribute.label} {value > 0 ? "+" : ""}
                          {value}
                        </span>
                      );
                    },
                  )}
                </div>
              </>
            )}
            <p className="resolution-note">{resolution.note}</p>
            <i className="auto-dismiss-track" aria-hidden="true" />
          </section>
        </div>
      )}

      {showReset && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal reset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <p className="overline">NEW CAREER</p>
            <h2 id="reset-title">要重新开始吗？</h2>
            <p>当前生涯会被清除，新的故事将从 14 岁开始。</p>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowReset(false)}>
                保留当前生涯
              </button>
              <button className="danger-button" onClick={resetGame}>
                确认重新开档
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const crestCache = new Map<string, string>();

const clubShortNames: Record<string, string> = {
  shandong: "泰山",
  "shanghai-port": "海港",
  "beijing-guoan": "国安",
  "man-city": "曼城",
  arsenal: "阿森纳",
  liverpool: "利物浦",
  "real-madrid": "皇马",
  barcelona: "巴萨",
  atletico: "马竞",
  bayern: "拜仁",
  dortmund: "多特",
  leverkusen: "药厂",
  inter: "国米",
  milan: "米兰",
  juventus: "尤文",
  psg: "巴黎",
  marseille: "马赛",
  lyon: "里昂",
  sporting: "葡体",
  psv: "PSV",
  feyenoord: "费耶诺德",
  galatasaray: "加拉塔萨雷",
  fenerbahce: "费内巴切",
  besiktas: "贝西克塔斯",
  rangers: "流浪者",
  "yokohama-fm": "横滨水手",
  jeonbuk: "全北现代",
  "al-hilal": "新月",
  "al-nassr": "胜利",
  "al-ittihad": "联合",
  "river-plate": "河床",
  boca: "博卡",
  "inter-miami": "迈阿密",
  "club-america": "美洲",
  "orlando-pirates": "海盗",
  "kaizer-chiefs": "酋长",
  "auckland-city": "奥克兰城",
};

function getClubShortName(club: ClubProfile) {
  return (
    clubShortNames[club.id] ??
    club.localName.replace(/[（(].*?[）)]/g, "").slice(0, 6)
  );
}

type KitPattern =
  | "solid"
  | "sleeves"
  | "stripes"
  | "hoops"
  | "sash"
  | "halves"
  | "band"
  | "pinstripes";

type KitSpec = {
  primary: string;
  secondary: string;
  accent: string;
  pattern: KitPattern;
};

const kitSpecs: Record<string, KitSpec> = {
  shandong: { primary: "#f05a35", secondary: "#ffffff", accent: "#153d85", pattern: "solid" },
  "shanghai-port": { primary: "#d71e2b", secondary: "#ffffff", accent: "#111111", pattern: "solid" },
  "beijing-guoan": { primary: "#18a551", secondary: "#dfff2f", accent: "#111111", pattern: "solid" },
  "man-city": { primary: "#73c9ed", secondary: "#ffffff", accent: "#253a64", pattern: "solid" },
  arsenal: { primary: "#e30613", secondary: "#ffffff", accent: "#152b58", pattern: "sleeves" },
  liverpool: { primary: "#c8102e", secondary: "#ffffff", accent: "#00b2a9", pattern: "solid" },
  "real-madrid": { primary: "#faf9f3", secondary: "#173c35", accent: "#e64142", pattern: "solid" },
  barcelona: { primary: "#153b8d", secondary: "#a71945", accent: "#f0bb20", pattern: "stripes" },
  atletico: { primary: "#d7193f", secondary: "#ffffff", accent: "#153b72", pattern: "stripes" },
  bayern: { primary: "#dc1738", secondary: "#ffffff", accent: "#173a86", pattern: "solid" },
  dortmund: { primary: "#f5dd18", secondary: "#111111", accent: "#ffffff", pattern: "solid" },
  leverkusen: { primary: "#d71f2b", secondary: "#111111", accent: "#ffffff", pattern: "stripes" },
  inter: { primary: "#1464d2", secondary: "#111111", accent: "#ffffff", pattern: "stripes" },
  milan: { primary: "#d71939", secondary: "#111111", accent: "#ffffff", pattern: "stripes" },
  juventus: { primary: "#fafafa", secondary: "#111111", accent: "#d5aa52", pattern: "stripes" },
  psg: { primary: "#16294e", secondary: "#e73445", accent: "#ffffff", pattern: "band" },
  marseille: { primary: "#ffffff", secondary: "#56c4e9", accent: "#173a70", pattern: "solid" },
  lyon: { primary: "#ffffff", secondary: "#1c4ba3", accent: "#e5243f", pattern: "band" },
  benfica: { primary: "#e21e2b", secondary: "#ffffff", accent: "#d4af37", pattern: "solid" },
  porto: { primary: "#1768b3", secondary: "#ffffff", accent: "#d92238", pattern: "stripes" },
  sporting: { primary: "#148046", secondary: "#ffffff", accent: "#111111", pattern: "hoops" },
  ajax: { primary: "#ffffff", secondary: "#d7192d", accent: "#111111", pattern: "band" },
  psv: { primary: "#e32231", secondary: "#ffffff", accent: "#111111", pattern: "stripes" },
  feyenoord: { primary: "#e31b2d", secondary: "#ffffff", accent: "#111111", pattern: "halves" },
  galatasaray: { primary: "#f4b51c", secondary: "#a71930", accent: "#ffffff", pattern: "halves" },
  fenerbahce: { primary: "#f4da23", secondary: "#132c73", accent: "#ffffff", pattern: "stripes" },
  besiktas: { primary: "#ffffff", secondary: "#111111", accent: "#e32231", pattern: "stripes" },
  celtic: { primary: "#138247", secondary: "#ffffff", accent: "#111111", pattern: "hoops" },
  rangers: { primary: "#1b4b9a", secondary: "#ffffff", accent: "#d72331", pattern: "solid" },
  boca: { primary: "#163c83", secondary: "#f2ca2e", accent: "#ffffff", pattern: "band" },
  "river-plate": { primary: "#fafafa", secondary: "#d9263e", accent: "#111111", pattern: "sash" },
  flamengo: { primary: "#d71939", secondary: "#111111", accent: "#ffffff", pattern: "hoops" },
  palmeiras: { primary: "#147548", secondary: "#ffffff", accent: "#d2a94e", pattern: "solid" },
  corinthians: { primary: "#fafafa", secondary: "#111111", accent: "#d51f2b", pattern: "solid" },
  "inter-miami": { primary: "#f6a5bd", secondary: "#161616", accent: "#ffffff", pattern: "pinstripes" },
  lafc: { primary: "#111111", secondary: "#c8a96a", accent: "#ffffff", pattern: "solid" },
  "club-america": { primary: "#f5df39", secondary: "#142e74", accent: "#d92439", pattern: "solid" },
  "al-hilal": { primary: "#2358c7", secondary: "#ffffff", accent: "#1bb8dd", pattern: "solid" },
  "al-nassr": { primary: "#f3df22", secondary: "#1c55a1", accent: "#ffffff", pattern: "halves" },
  "al-ittihad": { primary: "#111111", secondary: "#f3d528", accent: "#ffffff", pattern: "stripes" },
  "kashima": { primary: "#d81f35", secondary: "#172d5a", accent: "#ffffff", pattern: "solid" },
  urawa: { primary: "#e51e32", secondary: "#111111", accent: "#ffffff", pattern: "solid" },
  "yokohama-fm": { primary: "#1a63b5", secondary: "#ffffff", accent: "#e11d36", pattern: "stripes" },
  ulsan: { primary: "#1868bf", secondary: "#f1c324", accent: "#ffffff", pattern: "solid" },
  jeonbuk: { primary: "#16804c", secondary: "#ffffff", accent: "#d4c43c", pattern: "solid" },
  "fc-seoul": { primary: "#d92431", secondary: "#111111", accent: "#ffffff", pattern: "stripes" },
  "al-ahly": { primary: "#d91e2b", secondary: "#ffffff", accent: "#d7b14c", pattern: "solid" },
  zamalek: { primary: "#ffffff", secondary: "#d91e2b", accent: "#111111", pattern: "band" },
  sundowns: { primary: "#f4d328", secondary: "#1c5f35", accent: "#2853a0", pattern: "solid" },
};

const kitFallbacks: KitSpec[] = [
  { primary: "#1d5cb5", secondary: "#ffffff", accent: "#d62336", pattern: "solid" },
  { primary: "#d92338", secondary: "#ffffff", accent: "#162b59", pattern: "solid" },
  { primary: "#168057", secondary: "#ffffff", accent: "#d9b52e", pattern: "solid" },
  { primary: "#f4d32a", secondary: "#142c6e", accent: "#ffffff", pattern: "solid" },
  { primary: "#ffffff", secondary: "#111111", accent: "#d82338", pattern: "pinstripes" },
];

function getKitSpec(club: ClubProfile) {
  if (kitSpecs[club.id]) return kitSpecs[club.id];
  const score = [...club.id].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return kitFallbacks[score % kitFallbacks.length];
}

function getKitBackground(spec: KitSpec) {
  switch (spec.pattern) {
    case "stripes":
      return `repeating-linear-gradient(90deg, ${spec.primary} 0 18%, ${spec.secondary} 18% 36%)`;
    case "pinstripes":
      return `repeating-linear-gradient(90deg, ${spec.primary} 0 20%, ${spec.secondary} 20% 23%)`;
    case "hoops":
      return `repeating-linear-gradient(0deg, ${spec.primary} 0 15%, ${spec.secondary} 15% 30%)`;
    case "halves":
      return `linear-gradient(90deg, ${spec.primary} 0 50%, ${spec.secondary} 50%)`;
    case "band":
      return `linear-gradient(90deg, ${spec.primary} 0 34%, ${spec.secondary} 34% 66%, ${spec.primary} 66%)`;
    case "sash":
      return `linear-gradient(120deg, ${spec.primary} 0 39%, ${spec.secondary} 40% 57%, ${spec.primary} 58%)`;
    case "sleeves":
      return `linear-gradient(90deg, ${spec.secondary} 0 19%, ${spec.primary} 19% 81%, ${spec.secondary} 81%)`;
    default:
      return `linear-gradient(145deg, ${spec.primary}, color-mix(in srgb, ${spec.primary} 82%, #000))`;
  }
}

function TeamKit({
  club,
  variant = "mini",
}: {
  club: ClubProfile;
  variant?: "mini" | "card" | "hero";
}) {
  const spec = getKitSpec(club);
  const style = {
    "--kit-primary": spec.primary,
    "--kit-secondary": spec.secondary,
    "--kit-accent": spec.accent,
    "--kit-background": getKitBackground(spec),
  } as CSSProperties;

  return (
    <span
      className={`team-kit team-kit-${variant}`}
      style={style}
      aria-label={`${club.localName}球衣`}
    >
      <i className="kit-shirt">
        <b>{getClubShortName(club).slice(0, 1)}</b>
      </i>
    </span>
  );
}

const crestSlugOverrides: Record<string, string> = {
  "man-city": "manchester-city",
  barcelona: "fc-barcelona",
  bayern: "bayern-munich",
  dortmund: "borussia-dortmund",
  leverkusen: "bayer-leverkusen",
  inter: "inter-milan",
  milan: "ac-milan",
  psg: "paris-saint-germain",
  marseille: "olympique-marseille",
  lyon: "olympique-lyon",
  sporting: "sporting-cp",
  psv: "psv-eindhoven",
  rangers: "rangers-fc",
  shandong: "shandong-taishan",
  "shanghai-port": "shanghai-port-fc",
  "beijing-guoan": "beijing-guoan-fc",
  kashima: "kashima-antlers",
  urawa: "urawa-red-diamonds",
  "yokohama-fm": "yokohama-f-marinos",
  jeonbuk: "jeonbuk-hyundai-motors",
  "fc-seoul": "fc-seoul",
  "al-hilal": "al-hilal",
  "al-nassr": "al-nassr",
  "al-ittihad": "al-ittihad",
  "river-plate": "river-plate",
  boca: "boca-juniors",
  "inter-miami": "inter-miami",
  "club-america": "club-america",
  "al-ahly": "al-ahly",
};

function localCrest(club: ClubProfile) {
  return crestData[club.id] ?? "";
}

function footyLogosCrest(club: ClubProfile) {
  const slug = crestSlugOverrides[club.id] ?? club.id;
  return `https://pub-3bd35431294c47068cbf31a95d572166.r2.dev/logos/${slug}/${slug}-logo-footylogos.png`;
}

function TeamCrest({ club, size = 48 }: { club: ClubProfile; size?: number }) {
  const [source, setSource] = useState(
    () =>
      crestCache.get(club.id) ??
      (localCrest(club) || footyLogosCrest(club)),
  );
  const [remoteRequested, setRemoteRequested] = useState(false);
  const [fallbackRequested, setFallbackRequested] = useState(false);

  useEffect(() => {
    let active = true;
    const cached = crestCache.get(club.id);
    Promise.resolve().then(() => {
      if (!active) return;
      setRemoteRequested(false);
      setFallbackRequested(false);
      setSource(cached ?? (localCrest(club) || footyLogosCrest(club)));
    });
    return () => {
      active = false;
    };
  }, [club.id]);

  const requestWikipediaFallback = () => {
    if (localCrest(club) && !remoteRequested) {
      setRemoteRequested(true);
      setSource(footyLogosCrest(club));
      return;
    }
    if (fallbackRequested) {
      setSource("");
      return;
    }
    setFallbackRequested(true);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${club.wiki}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        const image = data.thumbnail?.source ?? data.originalimage?.source;
        if (image) {
          crestCache.set(club.id, image);
          setSource(image);
        } else {
          setSource("");
        }
      })
      .catch(() => setSource(""));
  };

  return (
    <span
      className="team-crest"
      style={{ width: size, height: size }}
      aria-label={`${club.localName}队徽`}
    >
      {source ? (
        <img
          src={source}
          alt={`${club.localName}队徽`}
          onLoad={() => crestCache.set(club.id, source)}
          onError={requestWikipediaFallback}
        />
      ) : (
        <b>{getClubShortName(club).slice(0, 2)}</b>
      )}
    </span>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <i>
        <b style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}
