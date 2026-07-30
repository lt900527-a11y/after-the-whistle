export type Confederation =
  | "UEFA"
  | "AFC"
  | "CAF"
  | "CONMEBOL"
  | "CONCACAF"
  | "OFC";

export type ClubLevel =
  | "世界豪门"
  | "洲际强队"
  | "国内争冠"
  | "联赛中游"
  | "保级挑战";

export type ClubProfile = {
  id: string;
  name: string;
  localName: string;
  wiki: string;
  level: ClubLevel;
};

export type LeagueProfile = {
  id: string;
  name: string;
  country: string;
  confederation: Confederation;
  band: string;
  weight: number;
  continentalCup: string;
  clubs: ClubProfile[];
};

const club = (
  id: string,
  name: string,
  localName: string,
  wiki: string,
  level: ClubLevel,
): ClubProfile => ({ id, name, localName, wiki, level });

const league = (
  id: string,
  name: string,
  country: string,
  confederation: Confederation,
  band: string,
  weight: number,
  continentalCup: string,
  clubs: ClubProfile[],
): LeagueProfile => ({
  id,
  name,
  country,
  confederation,
  band,
  weight,
  continentalCup,
  clubs,
});

export const confederations: {
  id: Confederation;
  name: string;
  region: string;
}[] = [
  { id: "UEFA", name: "欧洲足联", region: "欧洲" },
  { id: "AFC", name: "亚洲足联", region: "亚洲" },
  { id: "CONMEBOL", name: "南美足联", region: "南美洲" },
  { id: "CONCACAF", name: "中北美及加勒比足联", region: "中北美洲" },
  { id: "CAF", name: "非洲足联", region: "非洲" },
  { id: "OFC", name: "大洋洲足联", region: "大洋洲" },
];

export const nationalTeams: {
  name: string;
  confederation: Confederation;
  flag: string;
}[] = [
  { name: "中国", confederation: "AFC", flag: "🇨🇳" },
  { name: "日本", confederation: "AFC", flag: "🇯🇵" },
  { name: "韩国", confederation: "AFC", flag: "🇰🇷" },
  { name: "澳大利亚", confederation: "AFC", flag: "🇦🇺" },
  { name: "沙特阿拉伯", confederation: "AFC", flag: "🇸🇦" },
  { name: "英格兰", confederation: "UEFA", flag: "🏴" },
  { name: "法国", confederation: "UEFA", flag: "🇫🇷" },
  { name: "德国", confederation: "UEFA", flag: "🇩🇪" },
  { name: "西班牙", confederation: "UEFA", flag: "🇪🇸" },
  { name: "意大利", confederation: "UEFA", flag: "🇮🇹" },
  { name: "葡萄牙", confederation: "UEFA", flag: "🇵🇹" },
  { name: "荷兰", confederation: "UEFA", flag: "🇳🇱" },
  { name: "巴西", confederation: "CONMEBOL", flag: "🇧🇷" },
  { name: "阿根廷", confederation: "CONMEBOL", flag: "🇦🇷" },
  { name: "乌拉圭", confederation: "CONMEBOL", flag: "🇺🇾" },
  { name: "哥伦比亚", confederation: "CONMEBOL", flag: "🇨🇴" },
  { name: "美国", confederation: "CONCACAF", flag: "🇺🇸" },
  { name: "墨西哥", confederation: "CONCACAF", flag: "🇲🇽" },
  { name: "加拿大", confederation: "CONCACAF", flag: "🇨🇦" },
  { name: "哥斯达黎加", confederation: "CONCACAF", flag: "🇨🇷" },
  { name: "摩洛哥", confederation: "CAF", flag: "🇲🇦" },
  { name: "埃及", confederation: "CAF", flag: "🇪🇬" },
  { name: "尼日利亚", confederation: "CAF", flag: "🇳🇬" },
  { name: "南非", confederation: "CAF", flag: "🇿🇦" },
  { name: "新西兰", confederation: "OFC", flag: "🇳🇿" },
  { name: "斐济", confederation: "OFC", flag: "🇫🇯" },
];

export const worldLeagues: LeagueProfile[] = [
  league("eng-pl", "英格兰足球超级联赛", "英格兰", "UEFA", "世界顶级", 1, "欧洲冠军联赛", [
    club("man-city", "Manchester City", "曼城", "Manchester_City_F.C.", "世界豪门"),
    club("arsenal", "Arsenal", "阿森纳", "Arsenal_F.C.", "世界豪门"),
    club("liverpool", "Liverpool", "利物浦", "Liverpool_F.C.", "世界豪门"),
  ]),
  league("esp-la-liga", "西班牙足球甲级联赛", "西班牙", "UEFA", "世界顶级", 1, "欧洲冠军联赛", [
    club("real-madrid", "Real Madrid", "皇家马德里", "Real_Madrid_CF", "世界豪门"),
    club("barcelona", "Barcelona", "巴塞罗那", "FC_Barcelona", "世界豪门"),
    club("atletico", "Atlético Madrid", "马德里竞技", "Atl%C3%A9tico_Madrid", "洲际强队"),
  ]),
  league("ger-bundesliga", "德国足球甲级联赛", "德国", "UEFA", "世界顶级", 0.96, "欧洲冠军联赛", [
    club("bayern", "Bayern Munich", "拜仁慕尼黑", "FC_Bayern_Munich", "世界豪门"),
    club("dortmund", "Borussia Dortmund", "多特蒙德", "Borussia_Dortmund", "洲际强队"),
    club("leverkusen", "Bayer Leverkusen", "勒沃库森", "Bayer_04_Leverkusen", "洲际强队"),
  ]),
  league("ita-serie-a", "意大利足球甲级联赛", "意大利", "UEFA", "世界顶级", 0.96, "欧洲冠军联赛", [
    club("inter", "Inter Milan", "国际米兰", "Inter_Milan", "世界豪门"),
    club("milan", "AC Milan", "AC米兰", "AC_Milan", "世界豪门"),
    club("juventus", "Juventus", "尤文图斯", "Juventus_FC", "世界豪门"),
  ]),
  league("fra-ligue-1", "法国足球甲级联赛", "法国", "UEFA", "欧洲一线", 0.92, "欧洲冠军联赛", [
    club("psg", "Paris Saint-Germain", "巴黎圣日耳曼", "Paris_Saint-Germain_F.C.", "世界豪门"),
    club("marseille", "Olympique Marseille", "马赛", "Olympique_de_Marseille", "国内争冠"),
    club("lyon", "Olympique Lyonnais", "里昂", "Olympique_Lyonnais", "联赛中游"),
  ]),
  league("por-primeira", "葡萄牙足球超级联赛", "葡萄牙", "UEFA", "欧洲二线", 0.82, "欧洲冠军联赛", [
    club("benfica", "Benfica", "本菲卡", "S.L._Benfica", "洲际强队"),
    club("porto", "Porto", "波尔图", "FC_Porto", "洲际强队"),
    club("sporting", "Sporting CP", "葡萄牙体育", "Sporting_CP", "国内争冠"),
  ]),
  league("ned-eredivisie", "荷兰足球甲级联赛", "荷兰", "UEFA", "欧洲二线", 0.8, "欧洲冠军联赛", [
    club("ajax", "Ajax", "阿贾克斯", "AFC_Ajax", "洲际强队"),
    club("psv", "PSV Eindhoven", "埃因霍温", "PSV_Eindhoven", "国内争冠"),
    club("feyenoord", "Feyenoord", "费耶诺德", "Feyenoord", "国内争冠"),
  ]),
  league("tur-super-lig", "土耳其足球超级联赛", "土耳其", "UEFA", "欧洲区域强联赛", 0.72, "欧洲冠军联赛", [
    club("galatasaray", "Galatasaray", "加拉塔萨雷", "Galatasaray_S.K._(football)", "国内争冠"),
    club("fenerbahce", "Fenerbahçe", "费内巴切", "Fenerbah%C3%A7e_S.K._(football)", "国内争冠"),
    club("besiktas", "Beşiktaş", "贝西克塔斯", "Be%C5%9Fikta%C5%9F_J.K.", "联赛中游"),
  ]),
  league("sco-premiership", "苏格兰足球超级联赛", "苏格兰", "UEFA", "欧洲区域联赛", 0.68, "欧洲冠军联赛", [
    club("celtic", "Celtic", "凯尔特人", "Celtic_F.C.", "国内争冠"),
    club("rangers", "Rangers", "格拉斯哥流浪者", "Rangers_F.C.", "国内争冠"),
    club("aberdeen", "Aberdeen", "阿伯丁", "Aberdeen_F.C.", "联赛中游"),
  ]),

  league("chn-csl", "中国足球超级联赛", "中国", "AFC", "亚洲区域强联赛", 0.58, "亚足联冠军精英联赛", [
    club("shandong", "Shandong Taishan", "山东泰山（鲁能）", "Shandong_Taishan_F.C.", "联赛中游"),
    club("shanghai-port", "Shanghai Port", "上海海港", "Shanghai_Port_F.C.", "国内争冠"),
    club("beijing-guoan", "Beijing Guoan", "北京国安", "Beijing_Guoan_F.C.", "联赛中游"),
  ]),
  league("jpn-j1", "日本职业足球甲级联赛", "日本", "AFC", "亚洲一线", 0.68, "亚足联冠军精英联赛", [
    club("kashima", "Kashima Antlers", "鹿岛鹿角", "Kashima_Antlers", "洲际强队"),
    club("urawa", "Urawa Red Diamonds", "浦和红钻", "Urawa_Red_Diamonds", "洲际强队"),
    club("yokohama-fm", "Yokohama F. Marinos", "横滨水手", "Yokohama_F._Marinos", "国内争冠"),
  ]),
  league("kor-k1", "韩国职业足球K联赛1", "韩国", "AFC", "亚洲一线", 0.66, "亚足联冠军精英联赛", [
    club("ulsan", "Ulsan HD", "蔚山HD", "Ulsan_HD_FC", "洲际强队"),
    club("jeonbuk", "Jeonbuk Hyundai Motors", "全北现代", "Jeonbuk_Hyundai_Motors_FC", "洲际强队"),
    club("fc-seoul", "FC Seoul", "首尔FC", "FC_Seoul", "联赛中游"),
  ]),
  league("ksa-pro", "沙特职业足球联赛", "沙特阿拉伯", "AFC", "亚洲一线", 0.72, "亚足联冠军精英联赛", [
    club("al-hilal", "Al Hilal", "利雅得新月", "Al_Hilal_SFC", "洲际强队"),
    club("al-nassr", "Al Nassr", "利雅得胜利", "Al_Nassr_FC", "国内争冠"),
    club("al-ittihad", "Al-Ittihad", "吉达联合", "Al-Ittihad_Club_(Jeddah)", "国内争冠"),
  ]),
  league("qat-stars", "卡塔尔星级足球联赛", "卡塔尔", "AFC", "亚洲区域联赛", 0.55, "亚足联冠军精英联赛", [
    club("al-sadd", "Al Sadd", "萨德", "Al_Sadd_SC", "洲际强队"),
    club("al-duhail", "Al-Duhail", "杜海勒", "Al-Duhail_SC", "国内争冠"),
    club("al-rayyan", "Al-Rayyan", "赖扬", "Al-Rayyan_SC", "联赛中游"),
  ]),
  league("aus-aleague", "澳大利亚职业足球联赛", "澳大利亚", "AFC", "亚洲区域联赛", 0.54, "亚洲冠军联赛二级联赛", [
    club("sydney", "Sydney FC", "悉尼FC", "Sydney_FC", "国内争冠"),
    club("melbourne-victory", "Melbourne Victory", "墨尔本胜利", "Melbourne_Victory_FC", "国内争冠"),
    club("central-coast", "Central Coast Mariners", "中央海岸水手", "Central_Coast_Mariners_FC", "联赛中游"),
  ]),
  league("tha-league-1", "泰国足球甲级联赛", "泰国", "AFC", "亚洲发展联赛", 0.46, "亚洲冠军联赛二级联赛", [
    club("buriram", "Buriram United", "武里南联", "Buriram_United_F.C.", "洲际强队"),
    club("bg-pathum", "BG Pathum United", "巴吞联", "BG_Pathum_United_F.C.", "国内争冠"),
    club("muangthong", "Muangthong United", "蒙通联", "Muangthong_United_F.C.", "联赛中游"),
  ]),
  league("ind-isl", "印度超级联赛", "印度", "AFC", "亚洲发展联赛", 0.42, "亚洲冠军联赛二级联赛", [
    club("mohun-bagan", "Mohun Bagan Super Giant", "莫亨巴根", "Mohun_Bagan_Super_Giant", "国内争冠"),
    club("mumbai-city", "Mumbai City", "孟买城", "Mumbai_City_FC", "国内争冠"),
    club("bengaluru", "Bengaluru FC", "班加罗尔", "Bengaluru_FC", "联赛中游"),
  ]),

  league("bra-serie-a", "巴西足球甲级联赛", "巴西", "CONMEBOL", "南美顶级", 0.88, "南美解放者杯", [
    club("flamengo", "Flamengo", "弗拉门戈", "CR_Flamengo", "洲际强队"),
    club("palmeiras", "Palmeiras", "帕尔梅拉斯", "SE_Palmeiras", "洲际强队"),
    club("corinthians", "Corinthians", "科林蒂安", "Sport_Club_Corinthians_Paulista", "国内争冠"),
  ]),
  league("arg-primera", "阿根廷足球甲级联赛", "阿根廷", "CONMEBOL", "南美顶级", 0.86, "南美解放者杯", [
    club("river-plate", "River Plate", "河床", "Club_Atl%C3%A9tico_River_Plate", "洲际强队"),
    club("boca", "Boca Juniors", "博卡青年", "Boca_Juniors", "洲际强队"),
    club("racing", "Racing Club", "竞技俱乐部", "Racing_Club_de_Avellaneda", "国内争冠"),
  ]),
  league("uru-primera", "乌拉圭足球甲级联赛", "乌拉圭", "CONMEBOL", "南美区域强联赛", 0.68, "南美解放者杯", [
    club("penarol", "Peñarol", "佩纳罗尔", "Pe%C3%B1arol", "洲际强队"),
    club("nacional", "Nacional", "乌拉圭民族", "Club_Nacional_de_Football", "洲际强队"),
    club("liverpool-mvd", "Liverpool Montevideo", "蒙得维的亚利物浦", "Liverpool_F.C._(Montevideo)", "联赛中游"),
  ]),
  league("col-primera-a", "哥伦比亚足球甲级联赛", "哥伦比亚", "CONMEBOL", "南美区域强联赛", 0.68, "南美解放者杯", [
    club("atletico-nacional", "Atlético Nacional", "国民竞技", "Atl%C3%A9tico_Nacional", "洲际强队"),
    club("millonarios", "Millonarios", "百万富翁", "Millonarios_F.C.", "国内争冠"),
    club("junior", "Junior", "巴兰基亚青年", "Atl%C3%A9tico_Junior", "联赛中游"),
  ]),
  league("chi-primera", "智利足球甲级联赛", "智利", "CONMEBOL", "南美区域联赛", 0.62, "南美解放者杯", [
    club("colo-colo", "Colo-Colo", "科洛科洛", "Colo-Colo", "洲际强队"),
    club("u-chile", "Universidad de Chile", "智利大学", "Club_Universidad_de_Chile", "国内争冠"),
    club("u-catolica", "Universidad Católica", "天主教大学", "Club_Deportivo_Universidad_Cat%C3%B3lica", "国内争冠"),
  ]),
  league("ecu-serie-a", "厄瓜多尔足球甲级联赛", "厄瓜多尔", "CONMEBOL", "南美区域联赛", 0.62, "南美解放者杯", [
    club("ldu-quito", "LDU Quito", "基多大学", "L.D.U._Quito", "洲际强队"),
    club("idv", "Independiente del Valle", "山谷独立", "Independiente_del_Valle", "洲际强队"),
    club("barcelona-sc", "Barcelona SC", "巴塞罗那竞技", "Barcelona_S.C.", "国内争冠"),
  ]),

  league("usa-mls", "美国职业足球大联盟", "美国 / 加拿大", "CONCACAF", "中北美一线", 0.7, "中北美及加勒比冠军杯", [
    club("inter-miami", "Inter Miami", "迈阿密国际", "Inter_Miami_CF", "国内争冠"),
    club("lafc", "Los Angeles FC", "洛杉矶FC", "Los_Angeles_FC", "洲际强队"),
    club("seattle", "Seattle Sounders", "西雅图海湾人", "Seattle_Sounders_FC", "洲际强队"),
  ]),
  league("mex-liga-mx", "墨西哥足球超级联赛", "墨西哥", "CONCACAF", "中北美一线", 0.74, "中北美及加勒比冠军杯", [
    club("club-america", "Club América", "墨西哥美洲", "Club_Am%C3%A9rica", "洲际强队"),
    club("monterrey", "Monterrey", "蒙特雷", "C.F._Monterrey", "洲际强队"),
    club("tigres", "Tigres UANL", "新莱昂自治大学老虎", "Tigres_UANL", "国内争冠"),
  ]),
  league("crc-primera", "哥斯达黎加足球甲级联赛", "哥斯达黎加", "CONCACAF", "中北美区域强联赛", 0.54, "中北美及加勒比冠军杯", [
    club("saprissa", "Saprissa", "萨普里萨", "Deportivo_Saprissa", "洲际强队"),
    club("alajuelense", "Alajuelense", "阿拉胡埃伦斯", "Liga_Deportiva_Alajuelense", "洲际强队"),
    club("herediano", "Herediano", "埃雷迪亚诺", "C.S._Herediano", "国内争冠"),
  ]),
  league("can-cpl", "加拿大超级足球联赛", "加拿大", "CONCACAF", "中北美发展联赛", 0.44, "中北美及加勒比冠军杯", [
    club("forge", "Forge FC", "锻造者", "Forge_FC", "国内争冠"),
    club("cavalry", "Cavalry FC", "骑兵队", "Cavalry_FC", "国内争冠"),
    club("atletico-ottawa", "Atlético Ottawa", "渥太华竞技", "Atl%C3%A9tico_Ottawa", "联赛中游"),
  ]),

  league("egy-premier", "埃及足球超级联赛", "埃及", "CAF", "非洲一线", 0.7, "非洲冠军联赛", [
    club("al-ahly", "Al Ahly", "开罗国民", "Al_Ahly_SC", "洲际强队"),
    club("zamalek", "Zamalek", "扎马雷克", "Zamalek_SC", "洲际强队"),
    club("pyramids", "Pyramids FC", "金字塔", "Pyramids_FC", "国内争冠"),
  ]),
  league("mar-botola", "摩洛哥足球甲级联赛", "摩洛哥", "CAF", "非洲一线", 0.68, "非洲冠军联赛", [
    club("wydad", "Wydad AC", "卡萨布兰卡维达德", "Wydad_AC", "洲际强队"),
    club("raja", "Raja CA", "卡萨布兰卡拉贾", "Raja_CA", "洲际强队"),
    club("far-rabat", "AS FAR", "拉巴特皇家武装", "AS_FAR", "国内争冠"),
  ]),
  league("rsa-premiership", "南非足球超级联赛", "南非", "CAF", "非洲一线", 0.66, "非洲冠军联赛", [
    club("sundowns", "Mamelodi Sundowns", "马梅洛迪日落", "Mamelodi_Sundowns_F.C.", "洲际强队"),
    club("orlando-pirates", "Orlando Pirates", "奥兰多海盗", "Orlando_Pirates_F.C.", "国内争冠"),
    club("kaizer-chiefs", "Kaizer Chiefs", "凯泽酋长", "Kaizer_Chiefs_F.C.", "联赛中游"),
  ]),
  league("tun-ligue-1", "突尼斯足球甲级联赛", "突尼斯", "CAF", "非洲区域强联赛", 0.6, "非洲冠军联赛", [
    club("esperance", "Espérance de Tunis", "突尼斯希望", "Esp%C3%A9rance_Sportive_de_Tunis", "洲际强队"),
    club("etoile", "Étoile du Sahel", "萨赫勒之星", "%C3%89toile_Sportive_du_Sahel", "洲际强队"),
    club("club-africain", "Club Africain", "非洲人", "Club_Africain", "国内争冠"),
  ]),
  league("nga-npfl", "尼日利亚职业足球联赛", "尼日利亚", "CAF", "非洲区域联赛", 0.5, "非洲冠军联赛", [
    club("enyimba", "Enyimba", "安耶巴", "Enyimba_F.C.", "洲际强队"),
    club("remo-stars", "Remo Stars", "雷莫之星", "Remo_Stars_F.C.", "国内争冠"),
    club("rivers-united", "Rivers United", "河流联", "Rivers_United_F.C.", "联赛中游"),
  ]),

  league("nzl-national", "新西兰全国足球联赛", "新西兰", "OFC", "大洋洲一线", 0.42, "大洋洲冠军联赛", [
    club("auckland-city", "Auckland City", "奥克兰城", "Auckland_City_FC", "洲际强队"),
    club("wellington-olympic", "Wellington Olympic", "惠灵顿奥林匹克", "Wellington_Olympic_AFC", "国内争冠"),
    club("christchurch", "Christchurch United", "基督城联", "Christchurch_United", "联赛中游"),
  ]),
  league("fij-premier", "斐济足球超级联赛", "斐济", "OFC", "大洋洲区域联赛", 0.34, "大洋洲冠军联赛", [
    club("ba-fc", "Ba FC", "巴FC", "Ba_F.C.", "洲际强队"),
    club("lautoka", "Lautoka", "劳托卡", "Lautoka_F.C.", "国内争冠"),
    club("rewa", "Rewa", "雷瓦", "Rewa_F.C.", "国内争冠"),
  ]),
];

export const allClubs = worldLeagues.flatMap((item) =>
  item.clubs.map((team) => ({ team, league: item })),
);

export function findClub(clubId: string) {
  return allClubs.find(({ team }) => team.id === clubId);
}

export function describeClub(clubId: string) {
  const found = findClub(clubId);
  if (!found) return "未知联赛";
  return `${found.team.localName} · ${found.league.country} · ${found.league.name} · ${found.team.level}`;
}

export type AwardInput = {
  age: number;
  year: number;
  ovr: number;
  reputation: number;
  morale: number;
  clubId: string;
  nationality: string;
  nationalConfederation: Confederation;
  seasonApps: number;
  seasonGoals: number;
  seasonAssists: number;
};

export function evaluateSeasonAwards(input: AwardInput) {
  const found = findClub(input.clubId);
  if (!found) return [] as string[];

  const { league: competition, team } = found;
  const attack =
    input.seasonGoals * 2.5 +
    input.seasonAssists * 1.6 +
    input.seasonApps * 0.25;
  const quality =
    input.ovr * 0.48 +
    input.reputation * 0.22 +
    input.morale * 0.08 +
    competition.weight * 18 +
    attack;
  const honours: string[] = [];

  if (input.seasonApps >= 12 && quality >= 58)
    honours.push(`${competition.name}赛季最佳阵容`);
  if (input.seasonGoals >= 10)
    honours.push(`${competition.name}金靴`);
  if (input.seasonAssists >= 9)
    honours.push(`${competition.name}助攻王`);
  if (quality >= 82)
    honours.push(`${competition.name}赛季最佳球员`);

  const titleGate =
    team.level === "世界豪门" || team.level === "洲际强队"
      ? 68
      : team.level === "国内争冠"
        ? 72
        : 82;
  if (quality >= titleGate && (input.year + input.clubId.length) % 3 !== 1)
    honours.push(`${competition.name}冠军`);
  if (quality >= titleGate - 5 && (input.year + input.clubId.length) % 4 === 0)
    honours.push(`${competition.country}国内杯赛冠军`);

  const continentalGate = 84 + competition.weight * 7;
  if (
    quality >= continentalGate &&
    (input.year + input.clubId.length) % 4 === 1
  )
    honours.push(`${competition.continentalCup}冠军`);

  if (input.age <= 21 && quality >= 72)
    honours.push(
      input.nationalConfederation === "UEFA"
        ? "欧洲金童奖"
        : `${input.nationalConfederation}年度最佳年轻球员`,
    );
  if (
    input.seasonGoals >= 8 &&
    (input.year + input.seasonGoals + input.seasonAssists) % 7 === 0
  )
    honours.push("国际足联普斯卡什奖");

  const globalScore =
    input.ovr * 0.56 +
    input.reputation * 0.3 +
    attack * 0.7 +
    competition.weight * 12 +
    (honours.includes(`${competition.continentalCup}冠军`) ? 12 : 0);
  if (globalScore >= 92) {
    honours.push("金球奖");
    honours.push("国际足联年度最佳球员");
  } else if (globalScore >= 80) {
    honours.push("金球奖候选名单");
  }

  const isWorldCupYear = input.year >= 2026 && (input.year - 2026) % 4 === 0;
  if (isWorldCupYear && input.ovr >= 68 && input.reputation >= 35) {
    honours.push(`${input.nationality} · ${input.year} 世界杯参赛`);
    if (globalScore >= 88 && (input.year + input.clubId.length) % 3 !== 0)
      honours.push(`${input.nationality} · ${input.year} 世界杯冠军`);
    if (globalScore >= 96) honours.push(`${input.year} 世界杯金球奖`);
    if (input.seasonGoals >= 9) honours.push(`${input.year} 世界杯金靴`);
  }

  const confederationCup =
    input.nationalConfederation === "UEFA"
      ? "欧洲杯"
      : input.nationalConfederation === "AFC"
        ? "亚洲杯"
        : input.nationalConfederation === "CAF"
          ? "非洲国家杯"
          : input.nationalConfederation === "CONMEBOL"
            ? "美洲杯"
            : input.nationalConfederation === "CONCACAF"
              ? "中北美及加勒比金杯"
              : "大洋洲国家杯";
  if (!isWorldCupYear && input.year % 4 === 3 && input.reputation >= 42)
    honours.push(`${input.nationality} · ${confederationCup}参赛`);

  return [...new Set(honours)];
}
