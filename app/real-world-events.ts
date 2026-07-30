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
  reality: string;
  sourceLabel: string;
  sourceUrl: string;
  choices: CameoChoice[];
};

export const realWorldEvents: RealWorldEvent[] = [
  {
    id: "cold-palmer-clinic",
    age: 15,
    star: "Cole Palmer",
    tag: "现实梗联动 · COLD",
    headline: "帕尔默看见你发抖：你是真的冷，还是在学我？",
    story:
      "品牌训练营安排你和科尔·帕尔默拍一条短视频。空调开得像冬窗，你下意识搓了搓胳膊，镜头却刚好捕捉到这一幕。十分钟后，社媒已经在争论：你是在致敬，还是在碰瓷他的“Cold”庆祝？以下互动为游戏虚构。",
    reality:
      "现实原型：帕尔默在2025世俱杯决赛梅开二度，并以标志性的“Cold”动作庆祝，最终获得赛事金球奖。",
    sourceLabel: "FIFA · 2025世俱杯决赛",
    sourceUrl:
      "https://www.fifa.com/en/tournaments/mens/club-world-cup/usa-2025/articles/the-fifa-club-world-cup-final-in-images",
    choices: [
      {
        eyebrow: "顺势玩梗",
        title: "和他一起拍“双倍寒冷”",
        copy: "把争议变成合作，让互联网自己加字幕。",
        impact: "名气 ↑↑ · 商业价值 ↑",
        effects: { reputation: 12, value: 45, morale: 5 },
        note: "视频播放量爆炸。帕尔默只留下一枚冰块表情，你却第一次登上全球热搜。",
      },
      {
        eyebrow: "球场回答",
        title: "拒绝摆拍，邀请他单挑三次",
        copy: "庆祝动作会过时，第一脚触球不会。",
        impact: "能力 ↑↑ · 体能 ↓",
        effects: { ovr: 3, energy: -6, reputation: 5 },
        note: "你输掉两次，却在最后一次穿裆成功。帕尔默笑着要求摄影师把那段删掉。",
      },
      {
        eyebrow: "自创人设",
        title: "发明一个完全相反的“烫手”庆祝",
        copy: "进球后假装皮球太烫，谁碰谁倒霉。",
        impact: "名气 ↑↑↑ · 被群嘲风险",
        effects: { reputation: 16, trust: -4, morale: 7 },
        note: "第一周所有人都说尴尬；第二周，青训孩子已经开始模仿。",
      },
    ],
  },
  {
    id: "haaland-photobomb",
    age: 16,
    star: "Erling Haaland",
    tag: "现实梗联动 · 反差萌",
    headline: "哈兰德抢走你的手机，给全世界发了一张怪脸自拍",
    story:
      "国家队商业活动后台，你正准备录制严肃的赛前宣言，哈兰德突然从画面后方探头，用夸张滤镜拍下合照，并按下了发布。你的经纪人脸色惨白，评论区却第一次挤满了不看球的人。以下互动为游戏虚构。",
    reality:
      "现实原型：2026世界杯期间，哈兰德强悍的比赛形象与轻松自嘲的社媒风格形成反差，成为跨圈层网络热点。",
    sourceLabel: "AP · 哈兰德的世界杯网络热潮",
    sourceUrl:
      "https://apnews.com/article/2b0eb9a162a020e83de02323fe2d774e",
    choices: [
      {
        eyebrow: "加入混乱",
        title: "把头像也换成同款怪脸",
        copy: "既然控制不了热搜，就坐到热搜驾驶座上。",
        impact: "名气 ↑↑↑ · 士气 ↑",
        effects: { reputation: 18, morale: 10, value: 35 },
        note: "品牌方临时改变脚本。你们没说一句足球，却让第二天的比赛收视率上涨。",
      },
      {
        eyebrow: "认真足球",
        title: "删掉自拍，上传训练录像",
        copy: "你希望别人先记住你的跑位，而不是滤镜。",
        impact: "能力 ↑ · 信任 ↑",
        effects: { ovr: 2, trust: 10, reputation: -2 },
        note: "哈兰德没有介意，只在训练视频下面评论：这个冲刺还可以更快。",
      },
      {
        eyebrow: "制造赌局",
        title: "约他比拼横梁挑战",
        copy: "输家必须保留怪脸头像一个月。",
        impact: "名气 ↑↑ · 压力 ↑",
        effects: { reputation: 13, ovr: 1, energy: -5, morale: 6 },
        note: "你最后一脚击中横梁。哈兰德盯着镜头沉默三秒，然后非常认真地要求重赛。",
      },
    ],
  },
  {
    id: "casemiro-six-seven",
    age: 17,
    star: "Casemiro",
    tag: "现实梗联动 · 6—7",
    headline: "卡塞米罗比了个“6—7”，记者却以为那是你的新工资",
    story:
      "慈善赛进球后，卡塞米罗邀请你一起做最近流行的“six-seven”手势。转播镜头切得太快，财经记者把画面解读成：你的团队正在索要六到七倍涨薪。俱乐部主席连夜打来电话。以下互动为游戏虚构。",
    reality:
      "现实原型：卡塞米罗在2025/26赛季把由儿子启发的“six-seven”手势带进英超赛场。",
    sourceLabel: "Premier League · 6—7庆祝由来",
    sourceUrl:
      "https://www.premierleague.com/en/news/4677219/explained-casemiros-six-seven-celebration",
    choices: [
      {
        eyebrow: "让梗继续",
        title: "只回复：7比6更接近冠军",
        copy: "不解释数字，让所有节目再讨论一天。",
        impact: "名气 ↑↑↑ · 信任 ↓",
        effects: { reputation: 17, trust: -8, value: 25 },
        note: "转会记者逐字分析你的回复。卡塞米罗发来语音，笑到一句话也没说完整。",
      },
      {
        eyebrow: "危机公关",
        title: "和主席直播解释手势",
        copy: "把误会拆开，也把谈判桌搬到公众面前。",
        impact: "信任 ↑↑ · 商业价值 ↑",
        effects: { trust: 14, reputation: 8, value: 40 },
        note: "直播最后，主席也被迫做了一遍手势。更衣室把那张截图挂在战术板上。",
      },
      {
        eyebrow: "借题发挥",
        title: "真的要求首发六场、至少踢七十分钟",
        copy: "梗是假的，诉求可以是真的。",
        impact: "出场 ↑ · 管理层压力",
        effects: { apps: 6, trust: -5, morale: 10, ovr: 2 },
        note: "主席沉默许久后答应。你第一次发现，荒唐新闻也能成为谈判筹码。",
      },
    ],
  },
  {
    id: "bellingham-arms",
    age: 18,
    star: "Jude Bellingham",
    tag: "现实梗联动 · 张开双臂",
    headline: "你和贝林厄姆同时张开双臂，照片却只裁掉了队友",
    story:
      "全明星赛结束，你和贝林厄姆在看台前做了相似的张臂庆祝。一张被裁切的照片开始疯传，看起来像你们无视全队、正在争夺“谁才是主角”。队友群聊突然安静。以下互动为游戏虚构。",
    reality:
      "现实原型：贝林厄姆表示，他很高兴看到孩子们在学校模仿他的张臂庆祝动作。",
    sourceLabel: "Real Madrid · 贝林厄姆谈庆祝",
    sourceUrl:
      "https://www.realmadrid.com/en-US/news/football/first-team/latest-news/bellingham-whenever-i-put-on-this-shirt-i-always-try-to-do-my-best",
    choices: [
      {
        eyebrow: "把队友放回来",
        title: "发布未经裁切的全队合照",
        copy: "主角不是姿势，而是站在画面里的所有人。",
        impact: "信任 ↑↑↑ · 名气 ↑",
        effects: { trust: 18, reputation: 6, morale: 8 },
        note: "贝林厄转发了原图。更衣室里最沉默的替补，第一次主动坐到你身边。",
      },
      {
        eyebrow: "流量对决",
        title: "约他下一场用进球决定谁能继续摆",
        copy: "互联网想看战争，那就给它一场只发生在球场上的。",
        impact: "进球 ↑↑ · 压力 ↑",
        effects: { goals: 5, reputation: 15, energy: -7 },
        note: "你们都进球了，也都摆了同一个动作。网络宣布这场战争没有赢家。",
      },
      {
        eyebrow: "反向拆台",
        title: "下次进球后只站军姿",
        copy: "拒绝所有动作，让沉默成为新表情包。",
        impact: "名气 ↑↑ · 士气 ↑",
        effects: { reputation: 11, morale: 9, trust: 4 },
        note: "静止三秒的画面比任何庆祝都传播得更快。贝林厄评价：这确实很难模仿。",
      },
    ],
  },
  {
    id: "mbappe-scooter",
    age: 19,
    star: "Kylian Mbappé",
    tag: "现实梗联动 · 小电驴速度",
    headline: "姆巴佩约你冲刺，偷拍视频却被传成“他骑了小电驴”",
    story:
      "品牌活动结束后，姆巴佩临时提出从中线冲刺到底线。你勉强跟住前三十米，工作人员偷拍视频流出，评论区重新翻出“像骑小电驴”的老梗。问题是：视频最后，你似乎追上了。以下互动为游戏虚构。",
    reality:
      "现实原型：FIFA回顾姆巴佩2018世界杯爆发时，队友曾用“像骑着小电驴”形容他的高速推进。",
    sourceLabel: "FIFA · 姆巴佩速度名场面",
    sourceUrl:
      "https://www.fifa.com/en/tournaments/mens/worldcup/articles/kylian-mbappe-highlights-performance-france-argentina",
    choices: [
      {
        eyebrow: "挑战速度",
        title: "公开完整视频，要求正式重赛",
        copy: "别让剪辑决定谁更快。",
        impact: "能力 ↑↑ · 体能 ↓↓",
        effects: { ovr: 3, energy: -12, reputation: 12 },
        note: "完整视频证明你没有追上，但差距比想象中小。姆巴佩答应下次让你先跑两米。",
      },
      {
        eyebrow: "承认现实",
        title: "回复：我追的是尾灯，不是人",
        copy: "自嘲比强行解释更快。",
        impact: "名气 ↑↑↑ · 士气 ↑",
        effects: { reputation: 18, morale: 10 },
        note: "姆巴佩回复一辆踏板车表情。你们的评论区成了当天最大的足球广场。",
      },
      {
        eyebrow: "战术脑筋",
        title: "请他教你第一步启动，而不是再比一次",
        copy: "输掉热搜，赢下一堂私人训练课。",
        impact: "能力 ↑↑↑ · 名气 ↓",
        effects: { ovr: 5, reputation: -3, trust: 6 },
        note: "一个小时后，你的启动姿势完全改变。没有镜头记录，但下一场的边后卫会知道。",
      },
    ],
  },
  {
    id: "messi-mbappe-shirts",
    age: 20,
    star: "Lionel Messi × Kylian Mbappé",
    tag: "现实梗联动 · 世代之争",
    headline: "梅西和姆巴佩同时递来球衣，所有镜头都在等你先接哪一件",
    story:
      "颁奖礼后台，两位巨星先后把签名球衣递给你。摄影师突然围上来，直播评论区立刻分成两派。你知道，先伸向哪边都会被剪成一段“站队”视频。以下互动为游戏虚构。",
    reality:
      "现实原型：梅西与姆巴佩在世界杯进球纪录上持续追逐，同时公开表达过对彼此能力的尊重。",
    sourceLabel: "FIFA · 梅西与姆巴佩的纪录竞逐",
    sourceUrl:
      "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/messi-mbappe-goals-rivalry",
    choices: [
      {
        eyebrow: "同时接住",
        title: "让两人各拿球衣一角",
        copy: "把站队题改造成三人合影题。",
        impact: "名气 ↑↑ · 外交 ↑↑",
        effects: { reputation: 15, trust: 12, value: 35 },
        note: "照片被命名为“过去、现在和下一位”。你假装没看见最后四个字。",
      },
      {
        eyebrow: "尊重前辈",
        title: "先接梅西，再向姆巴佩解释",
        copy: "先后顺序不是实力排名，只是你童年的答案。",
        impact: "士气 ↑↑ · 舆论分裂",
        effects: { morale: 15, reputation: 10, trust: -3 },
        note: "姆巴佩笑着拥抱你。真正吵了一夜的，只有互联网上互不认识的人。",
      },
      {
        eyebrow: "拒绝二选一",
        title: "拿出自己的球衣，请他们先签",
        copy: "你不是来收藏历史的，你想进入历史。",
        impact: "野心 ↑↑↑ · 名气 ↑",
        effects: { ovr: 3, reputation: 14, morale: 8 },
        note: "两人都签了。梅西写得很小，姆巴佩在号码旁加了一句：下一次换你的。",
      },
    ],
  },
  {
    id: "ronaldo-siu-delay",
    age: 21,
    star: "Cristiano Ronaldo",
    tag: "现实梗联动 · SIUUU",
    headline: "C罗邀请你一起“SIU”，你却慢了整整半拍",
    story:
      "纪念赛里，你为C罗送出助攻。他冲向角旗区并回头示意你跟上。你跳早了半拍、转晚了半拍，落地时全场的“SIU”已经结束。那段错拍视频迅速成为新的反应表情。以下互动为游戏虚构。",
    reality:
      "现实原型：C罗从2013年开始使用“SIU”庆祝，后来被不同项目的运动员广泛模仿。",
    sourceLabel: "FIFA · C罗40岁生涯回顾",
    sourceUrl:
      "https://www.fifa.com/en/news/articles/cristiano-ronaldo-portugal-tribute-40th-birthday",
    choices: [
      {
        eyebrow: "再来一次",
        title: "赛后请他单独教你落地节奏",
        copy: "传奇动作也有技术细节。",
        impact: "能力 ↑ · 名气 ↑↑",
        effects: { ovr: 2, reputation: 13, morale: 8 },
        note: "C罗纠正了你的起跳角度。第二次完全同步，却因为没有直播而没人相信。",
      },
      {
        eyebrow: "拥抱表情包",
        title: "把错拍瞬间做成个人头像",
        copy: "笑话只有在你拒绝笑时才会伤人。",
        impact: "名气 ↑↑↑ · 商业价值 ↑",
        effects: { reputation: 19, value: 55, trust: 3 },
        note: "C罗也换上了同款头像一天。你的经纪人第一次感谢一次失误。",
      },
      {
        eyebrow: "团队优先",
        title: "发布助攻路线，不谈庆祝失误",
        copy: "真正决定进球的是那条反向跑动。",
        impact: "信任 ↑↑↑ · 名气 ↓",
        effects: { trust: 18, assists: 4, reputation: -2 },
        note: "C罗转发战术图并写下：这才是重点。教练组把截图贴进会议室。",
      },
    ],
  },
  {
    id: "ronaldo-decoy-lesson",
    age: 24,
    star: "Cristiano Ronaldo",
    tag: "现实故事联动 · 诱饵任意球",
    headline: "所有人都等C罗罚任意球，他却把真正的主罚权交给了你",
    story:
      "商业赛最后一分钟，球摆在禁区弧顶。整座球场都开始等待熟悉的助跑，C罗却低声让你站到球后：门将只会看他。执行前一秒，队长质疑你凭什么抢走传奇的镜头。以下互动为游戏虚构。",
    reality:
      "现实原型：2026世界杯对阵乌兹别克斯坦时，C罗曾主动充当任意球诱饵，让努诺·门德斯完成出其不意的射门。",
    sourceLabel: "FIFA · C罗把团队放在个人镜头之前",
    sourceUrl:
      "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/cristiano-ronaldo-portugal-silences-critics",
    choices: [
      {
        eyebrow: "相信骗局",
        title: "在全场注视C罗时直接爆射",
        copy: "最大的掩护，就是所有人心中的剧本。",
        impact: "进球 ↑↑ · 名气 ↑↑↑",
        effects: { goals: 5, reputation: 18, ovr: 2 },
        note: "门将真的向C罗一侧移动。球入网后，他第一个冲过来指向你。",
      },
      {
        eyebrow: "尊重秩序",
        title: "把球交回队长",
        copy: "不让一次商业赛撕裂自己的更衣室。",
        impact: "信任 ↑↑ · 错失镜头",
        effects: { trust: 16, morale: 7, reputation: -3 },
        note: "队长罚失了。C罗没有责怪你，只说：下一次，要相信已经看见答案的自己。",
      },
      {
        eyebrow: "三重欺骗",
        title: "假射后传给后插上的队友",
        copy: "如果所有人都在猜两个人，那就让第三个人终结。",
        impact: "助攻 ↑↑↑ · 战术声望 ↑",
        effects: { assists: 7, reputation: 13, trust: 12, ovr: 3 },
        note: "进球属于无名替补。赛后战术节目把你的停顿拆成了二十七帧。",
      },
    ],
  },
  {
    id: "haaland-vlog-transfer",
    age: 28,
    star: "Erling Haaland",
    tag: "未来联动 · 游戏虚构",
    headline: "哈兰德在vlog里说“下赛季见”，转会市场当场失控",
    story:
      "你参加哈兰德的慈善训练营。告别时，他对镜头随口说了一句“下赛季见”。十二分钟后，三家媒体宣称你们即将成为队友，两支俱乐部的股价开始波动，你的体育总监要求立刻澄清。整段互动为游戏虚构，借用了他轻松玩梗的公开形象。",
    reality:
      "现实原型：哈兰德长期以轻松、自嘲的公开视频和社媒互动，形成与球场“进球机器”不同的网络形象。",
    sourceLabel: "AP · 哈兰德的球场与网络反差",
    sourceUrl:
      "https://apnews.com/article/2b0eb9a162a020e83de02323fe2d774e",
    choices: [
      {
        eyebrow: "马上灭火",
        title: "公布完整上下文",
        copy: "所谓“下赛季”，只是下一届慈善赛。",
        impact: "信任 ↑↑ · 流量 ↓",
        effects: { trust: 17, reputation: -4, morale: 5 },
        note: "传闻迅速降温。体育总监满意了，营销总监却在办公室叹了一整天。",
      },
      {
        eyebrow: "暧昧到底",
        title: "回复：他知道一些你们不知道的事",
        copy: "转会窗从来不奖励诚实。",
        impact: "身价 ↑↑↑ · 信任 ↓↓",
        effects: { value: 220, reputation: 17, trust: -14 },
        note: "报价真的来了，尽管没有一份来自哈兰德所在的球队。",
      },
      {
        eyebrow: "反向玩梗",
        title: "宣布签约他的vlog，担任一期摄影师",
        copy: "把足球转会新闻变成内容行业新闻。",
        impact: "名气 ↑↑ · 士气 ↑↑",
        effects: { reputation: 13, morale: 14, value: 70 },
        note: "你拍糊了最关键的进球，却完整记录下他赛后寻找发圈的十分钟。",
      },
    ],
  },
  {
    id: "bellingham-podcast-crop",
    age: 32,
    star: "Jude Bellingham",
    tag: "未来联动 · 游戏虚构",
    headline: "贝林厄姆夸了你九分钟，节目只剪出一句“他很难共事”",
    story:
      "退役球星播客邀请贝林厄评价你的生涯。他先谈领导力、关键进球和训练态度，最后笑着补充：你输了队内游戏时确实很难共事。节目预告只保留了最后半句。以下互动为游戏虚构。",
    reality:
      "现实原型：短视频时代，球星采访中的一句话常会脱离完整语境传播；贝林厄的庆祝动作本身也长期是网络模仿对象。",
    sourceLabel: "Real Madrid · 贝林厄姆公开采访",
    sourceUrl:
      "https://www.realmadrid.com/en-US/news/football/first-team/latest-news/bellingham-whenever-i-put-on-this-shirt-i-always-try-to-do-my-best",
    choices: [
      {
        eyebrow: "公开完整版",
        title: "上传九分钟原片",
        copy: "让语境和热搜打一场耐力赛。",
        impact: "信任 ↑↑ · 名气 ↑",
        effects: { trust: 15, reputation: 7, morale: 5 },
        note: "完整版播放量没有预告高，但队友都看完了。你决定这已经足够。",
      },
      {
        eyebrow: "加入表演",
        title: "回复：他说得对，我现在就很难共事",
        copy: "用一句更短的话抢走断章取义的方向盘。",
        impact: "名气 ↑↑↑ · 争议 ↑",
        effects: { reputation: 18, trust: -5, value: 45 },
        note: "贝林厄在评论区张开双臂。互联网宣布你们正式和好，尽管你们从未吵架。",
      },
      {
        eyebrow: "彻底沉默",
        title: "不回应，第二天照常训练",
        copy: "让下一场比赛覆盖上一条视频。",
        impact: "能力 ↑↑ · 名气 ↓",
        effects: { ovr: 3, energy: -5, reputation: -4, trust: 8 },
        note: "四十八小时后，新的争议出现了。你第一次感谢互联网记忆短暂。",
      },
    ],
  },
  {
    id: "palmer-coach-emoji",
    age: 36,
    star: "Cole Palmer",
    tag: "未来联动 · 游戏虚构",
    headline: "帕尔默只发来一个冰块表情，你的续约谈判被冻住了",
    story:
      "已经转型教练的帕尔默看完你的比赛，只在公开动态下留下一枚冰块。媒体把它解释成邀请、嘲讽、认可和拒绝四种意思。你的俱乐部担心你准备离队，提前撤回了口头续约。以下互动为游戏虚构。",
    reality:
      "现实原型：帕尔默的“Cold”庆祝已成为高度可识别的个人符号，并在2025世俱杯冠军之路上被再次放大。",
    sourceLabel: "FIFA · 帕尔默的世俱杯金球表现",
    sourceUrl:
      "https://www.fifa.com/en/tournaments/mens/club-world-cup/usa-2025/articles/the-fifa-club-world-cup-final-in-images",
    choices: [
      {
        eyebrow: "直接问本人",
        title: "给帕尔默打电话开免提",
        copy: "让一个表情回到它原本的意思。",
        impact: "信任 ↑↑↑ · 戏剧终结",
        effects: { trust: 22, morale: 8, reputation: 4 },
        note: "他的解释只有一句：你那场踢得很冷静。会议室里没有人敢先说话。",
      },
      {
        eyebrow: "将错就错",
        title: "带着冰块参加续约会议",
        copy: "既然所有人都爱隐喻，那就把桌面摆满。",
        impact: "身价 ↑↑ · 名气 ↑↑",
        effects: { value: 160, reputation: 14, trust: -5 },
        note: "你把冰块倒进杯中，说合同融化前必须签完。主席居然笑了，也真的签了。",
      },
      {
        eyebrow: "开启新章",
        title: "公开感谢“未来主帅”的邀请",
        copy: "不存在的邀请，也可以变成真实的出口。",
        impact: "转会热度 ↑↑↑ · 信任 ↓↓",
        effects: { reputation: 19, trust: -16, value: 210 },
        note: "帕尔默没有否认。三天后，你收到了一份此前根本不存在的正式报价。",
      },
    ],
  },
  {
    id: "legends-last-photo",
    age: 40,
    star: "Messi × Ronaldo",
    tag: "传奇联动 · 游戏虚构",
    headline: "梅西和C罗的最后一张合照，摄影师把你叫到了中间",
    story:
      "全球慈善赛结束，两位时代传奇准备合影。摄影师突然招手让你站到中间，说需要一个“连接两个时代的人”。看台开始同时呼喊两个名字，没有人喊你的名字。以下互动为游戏虚构。",
    reality:
      "现实原型：梅西与C罗跨越多年塑造了足球史上最持久的双雄叙事，而两人对后辈和团队价值也都有大量公开表达。",
    sourceLabel: "FIFA · C罗生涯与标志性庆祝",
    sourceUrl:
      "https://www.fifa.com/en/news/articles/cristiano-ronaldo-portugal-tribute-40th-birthday",
    choices: [
      {
        eyebrow: "站进历史",
        title: "走到两人中间",
        copy: "不是因为你等同于他们，而是你也走完了自己的时代。",
        impact: "传奇声望 ↑↑↑ · 士气 ↑",
        effects: { reputation: 24, morale: 18, trust: 8 },
        note: "快门按下前，两个人同时把手搭在你肩上。照片后来成为你退役档案的封面。",
      },
      {
        eyebrow: "把位置让出",
        title: "请队里最年轻的孩子站过去",
        copy: "连接时代的人，应该还有时间创造下一个时代。",
        impact: "信任 ↑↑↑ · 个人镜头 ↓",
        effects: { trust: 28, reputation: 9, morale: 14 },
        note: "那个孩子紧张得闭上了眼。二十年后，他仍会说是你把他推进了历史。",
      },
      {
        eyebrow: "拒绝比较",
        title: "站在镜头后替他们按下快门",
        copy: "有些历史不需要第三个人证明自己的存在。",
        impact: "士气 ↑↑ · 尊重 ↑↑",
        effects: { morale: 22, trust: 18, reputation: 5 },
        note: "照片没有你，但照片背后的故事后来被两位传奇都提起过。",
      },
    ],
  },
];

export function findRealWorldEvent(eventId?: string | null) {
  return realWorldEvents.find((event) => event.id === eventId);
}

export function findRealWorldEventByAge(age: number) {
  return realWorldEvents.find((event) => event.age === age);
}
