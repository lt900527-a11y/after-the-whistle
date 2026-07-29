"use client";

import { useEffect, useMemo, useState } from "react";
import { annualChapters } from "./annual-chapters";

type Phase = "setup" | "career" | "ending";
type Position = "ST" | "LW" | "CAM" | "CM" | "CB";
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
  ovr: number;
  energy: number;
  morale: number;
  trust: number;
  value: number;
  apps: number;
  goals: number;
  assists: number;
  reputation: number;
  trophies: string[];
  history: { age: number; title: string; note: string }[];
};

const origins = [
  {
    id: "街头",
    mark: "01",
    title: "街头野球",
    copy: "球感是天生的，战术纪律得慢慢补。",
    bonus: "技术 +3 · 名气 +4",
  },
  {
    id: "青训",
    mark: "02",
    title: "职业青训",
    copy: "你熟悉体系，也习惯每周都被淘汰一次。",
    bonus: "能力 +2 · 信任 +8",
  },
  {
    id: "校园",
    mark: "03",
    title: "校园联赛",
    copy: "没人替你铺路，但你很会在逆风里踢球。",
    bonus: "体能 +8 · 士气 +6",
  },
];

const positions: { id: Position; name: string; hint: string }[] = [
  { id: "ST", name: "中锋", hint: "终结比赛" },
  { id: "LW", name: "左边锋", hint: "速度突破" },
  { id: "CAM", name: "前腰", hint: "创造机会" },
  { id: "CM", name: "中场", hint: "控制节奏" },
  { id: "CB", name: "中卫", hint: "守住底线" },
];

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

const baseState: GameState = {
  phase: "setup",
  chapter: 0,
  name: "林拓",
  position: "CAM",
  origin: "青训",
  club: "自由球员",
  ovr: 44,
  energy: 78,
  morale: 72,
  trust: 32,
  value: 10,
  apps: 0,
  goals: 0,
  assists: 0,
  reputation: 4,
  trophies: [],
  history: [],
};

const clamp = (value: number, min = 0, max = 99) =>
  Math.min(max, Math.max(min, value));

export default function Home() {
  const [game, setGame] = useState<GameState>(baseState);
  const [loaded, setLoaded] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("after90-career-v3");
    if (saved) {
      try {
        setGame(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("after90-career-v3");
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem("after90-career-v3", JSON.stringify(game));
    }
  }, [game, loaded]);

  const current = chapters[game.chapter];
  const age = game.phase === "ending" ? 43 : current?.age ?? 14;
  const progress =
    game.phase === "setup"
      ? 0
      : game.phase === "ending"
        ? 100
        : Math.round((game.chapter / chapters.length) * 100);

  const ending = useMemo(() => {
    const score =
      game.ovr +
      game.reputation * 0.25 +
      game.trophies.length * 5 +
      game.goals * 0.015 +
      game.assists * 0.02 +
      game.trust * 0.1;
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

  const startCareer = () => {
    const origin = origins.find((item) => item.id === game.origin);
    const boosts: Partial<Record<StatKey, number>> =
      origin?.id === "街头"
        ? { ovr: 3, reputation: 8 }
        : origin?.id === "校园"
          ? { energy: 8, morale: 6 }
          : { ovr: 2, trust: 8 };
    setGame((prev) => ({
      ...prev,
      ovr: prev.ovr + (boosts.ovr ?? 0),
      energy: prev.energy + (boosts.energy ?? 0),
      morale: prev.morale + (boosts.morale ?? 0),
      trust: prev.trust + (boosts.trust ?? 0),
      reputation: prev.reputation + (boosts.reputation ?? 0),
      phase: "career",
      history: [
        {
          age: 13,
          title: `${origin?.title ?? "无名少年"}出身`,
          note: "你决定认真试一试，看看足球能把自己带到多远。",
        },
      ],
    }));
  };

  const choose = (choice: Choice) => {
    setGame((prev) => {
      const next = { ...prev } as GameState;
      Object.entries(choice.effects).forEach(([key, amount]) => {
        const stat = key as StatKey;
        const currentValue = next[stat] as number;
        const raw = currentValue + (amount ?? 0);
        next[stat] =
          (["energy", "morale", "trust", "ovr", "reputation"].includes(stat)
            ? clamp(raw)
            : Math.max(0, raw)) as never;
      });
      if (choice.club) next.club = choice.club;
      if (choice.trophy) next.trophies = [...next.trophies, choice.trophy];
      next.history = [
        ...next.history,
        { age: current.age, title: choice.title, note: choice.note },
      ];
      if (prev.chapter === chapters.length - 1) {
        next.phase = "ending";
      } else {
        next.chapter += 1;
      }
      return next;
    });
  };

  const resetGame = () => {
    window.localStorage.removeItem("after90-career-v3");
    setGame(baseState);
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
            <button onClick={() => setShowReset(true)}>重新开档</button>
          )}
          <button onClick={() => setShowRules(true)}>玩法说明</button>
        </nav>
      </header>

      {game.phase === "setup" && (
        <main className="setup-page">
          <section className="setup-intro">
            <p className="overline">一款关于选择的足球生涯文字游戏</p>
            <h1>
              你只有一条命，
              <br />
              和一双球鞋。
            </h1>
            <p className="intro-copy">
              从无人认识的 14 岁开始，一直到 42 岁，每一年都必须做出一次选择。它会改变能力、信任、名气，以及你最终成为什么样的球员。
            </p>
            <div className="quote-card">
              <span>更衣室墙上的字</span>
              <blockquote>“天赋让你被看见，选择决定你被如何记住。”</blockquote>
            </div>
          </section>

          <section className="setup-card" aria-label="创建球员">
            <div className="paper-corner">PLAYER FILE / 001</div>
            <div className="setup-heading">
              <span>创建球员</span>
              <strong>01</strong>
            </div>
            <label className="field-label" htmlFor="player-name">
              你的名字
            </label>
            <input
              id="player-name"
              data-testid="player-name"
              className="name-input"
              value={game.name}
              maxLength={8}
              onChange={(event) =>
                setGame((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="输入球员姓名"
            />

            <p className="field-label">足球出身</p>
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
                  <span className="origin-num">{origin.mark}</span>
                  <strong>{origin.title}</strong>
                  <small>{origin.copy}</small>
                  <em>{origin.bonus}</em>
                </button>
              ))}
            </div>

            <p className="field-label">场上位置</p>
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
                  <strong>{position.id}</strong>
                  <span>{position.name}</span>
                  <small>{position.hint}</small>
                </button>
              ))}
            </div>

            <button
              className="primary-button"
              data-testid="start-career"
              onClick={startCareer}
              disabled={!game.name.trim()}
            >
              <span>开始职业生涯</span>
              <span aria-hidden="true">→</span>
            </button>
            <p className="save-note">
              <span className="pulse-dot" /> 进度会自动保存在这台设备
            </p>
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

          <div className="career-grid">
            <aside className="player-panel">
              <div className="player-identity">
                <div className="shirt-number">{game.position}</div>
                <div>
                  <span>{game.origin}出身</span>
                  <h2>{game.name}</h2>
                  <p>
                    {game.club} · {age} 岁
                  </p>
                </div>
              </div>

              <div className="ovr-block">
                <span>综合能力</span>
                <strong>{game.ovr}</strong>
                <div className="ovr-track">
                  <i style={{ width: `${game.ovr}%` }} />
                </div>
              </div>

              <div className="stat-list">
                <Meter label="体能" value={game.energy} />
                <Meter label="士气" value={game.morale} />
                <Meter label="信任" value={game.trust} />
                <Meter label="名气" value={game.reputation} />
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
                <div>
                  <strong>{game.apps}</strong>
                  <span>出场</span>
                </div>
                <div>
                  <strong>{game.goals}</strong>
                  <span>进球</span>
                </div>
                <div>
                  <strong>{game.assists}</strong>
                  <span>助攻</span>
                </div>
              </div>
              <div className="trophy-box">
                <span>荣誉室</span>
                {game.trophies.length ? (
                  <ul>
                    {game.trophies.map((trophy, index) => (
                      <li key={`${trophy}-${index}`}>
                        <b>◆</b> {trophy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>空着的位置，正在等你填满。</p>
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
            <span className="ending-age">43</span>
            <h1>{ending.label}</h1>
            <p>{ending.copy}</p>
          </section>

          <section className="career-record" data-testid="career-record">
            <div className="record-head">
              <div>
                <span>PLAYER No. {game.position}</span>
                <h2>{game.name}</h2>
                <p>
                  {game.origin}出身 · 最后一站 {game.club}
                </p>
              </div>
              <div className="final-ovr">
                <span>PEAK OVR</span>
                <strong>{game.ovr}</strong>
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
            </div>
            <div className="record-body">
              <div className="record-timeline">
                <h3>二十九个决定，一整段人生</h3>
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
        <p>九十分钟后 · 原创足球文字生涯游戏</p>
        <p>所有俱乐部、人物与数值均为虚构</p>
      </footer>

      {showRules && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
          >
            <button
              className="modal-close"
              onClick={() => setShowRules(false)}
              aria-label="关闭玩法说明"
            >
              ×
            </button>
            <p className="overline">HOW TO PLAY</p>
            <h2 id="rules-title">一年一选择，二十九年生涯</h2>
            <ol>
              <li>
                <span>01</span>
                <p>
                  <strong>创建你的球员</strong>
                  出身和位置会决定不同的开局优势。
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  <strong>每年处理一次关键时刻</strong>
                  从 14 岁到 42 岁，每个选项都会改变能力、体能、信任、名气与数据。
                </p>
              </li>
              <li>
                <span>03</span>
                <p>
                  <strong>接受你的结局</strong>
                  没有标准答案，只有属于你的生涯档案。
                </p>
              </li>
            </ol>
            <button
              className="primary-button"
              onClick={() => setShowRules(false)}
            >
              明白，回到比赛 <span>→</span>
            </button>
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
