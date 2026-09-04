import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ---------- Design tokens ----------
   Palette: navy (#123C69), deep navy (#0A2540), teal (#2A9D8F),
   light teal (#6FC7BA), dark teal (#146C64), white (#FFFFFF)
   Display face: Fraunces (trophy/clubhouse plaque feel)
   Body/data face: Inter
   Numerals/phone face: IBM Plex Mono (scoreboard digit feel)
------------------------------------ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');`;

const INITIAL_LADDER = [{"id": "1-Donnelly-Bobby", "surname": "Donnelly", "name": "Bobby", "cell": "082 923 5967", "grade": "Skip", "hcap": 0, "years": 16.9}, {"id": "2-Barnard-Richard", "surname": "Barnard", "name": "Richard", "cell": "082 875 6641", "grade": "Skip", "hcap": 1, "years": 16.9}, {"id": "3-Smith-Ryan", "surname": "Smith", "name": "Ryan", "cell": "064) 652 3802", "grade": "Skip", "hcap": 1, "years": 15.8}, {"id": "4-Strover-Roy", "surname": "Strover", "name": "Roy", "cell": "", "grade": "Skip", "hcap": 1, "years": 16.9}, {"id": "5-Stafford-Laurie", "surname": "Stafford", "name": "Laurie", "cell": "082 308 8471", "grade": "Skip", "hcap": 1, "years": 15.8}, {"id": "6-Celliers-Kevin", "surname": "Celliers", "name": "Kevin", "cell": "082 588 1511", "grade": "Skip", "hcap": 1, "years": 16.9}, {"id": "7-Harrison-Bev", "surname": "Harrison", "name": "Bev", "cell": "072 065 2700", "grade": "Skip", "hcap": 1, "years": 16.9}, {"id": "8-Gagliardi-Roberto", "surname": "Gagliardi", "name": "Roberto", "cell": "083 262 4995", "grade": "Skip", "hcap": 1, "years": 14.4}, {"id": "9-Turner-Ray", "surname": "Turner", "name": "Ray", "cell": "083 629 8718", "grade": "Skip", "hcap": 1, "years": 13.0}, {"id": "10-Turner-Trent", "surname": "Turner", "name": "Trent", "cell": "071 670 9647", "grade": "Skip", "hcap": 1, "years": 13.0}, {"id": "11-Smith-Dave", "surname": "Smith", "name": "Dave", "cell": "072 606 0827", "grade": "Skip", "hcap": 2, "years": 16.9}, {"id": "12-Coetzee-Les", "surname": "Coetzee", "name": "Les", "cell": "082 771 9579", "grade": "Skip", "hcap": 2, "years": 3.9}, {"id": "13-Fenn-Gareth", "surname": "Fenn", "name": "Gareth", "cell": "083 360 0897", "grade": "Skip", "hcap": 2, "years": 16.9}, {"id": "14-Kramer-Xavian", "surname": "Kramer", "name": "Xavian", "cell": "063 179 9390", "grade": "Skip", "hcap": 2, "years": 10.7}, {"id": "15-Prinsloo-Jan", "surname": "Prinsloo", "name": "Jan", "cell": "079 018 8372", "grade": "Skip", "hcap": 3, "years": 14.1}, {"id": "16-du_Plessis-Mornè", "surname": "du Plessis", "name": "Mornè", "cell": "074 321 1979", "grade": "Skip", "hcap": 2, "years": 9.9}, {"id": "17-Banda-Justice", "surname": "Banda", "name": "Justice", "cell": "083 944 1386", "grade": "Skip", "hcap": 3, "years": 16.9}, {"id": "18-Rix-Alan", "surname": "Rix", "name": "Alan", "cell": "082 806 5775", "grade": "Skip", "hcap": 3, "years": 16.9}, {"id": "19-Smith-Richard", "surname": "Smith", "name": "Richard", "cell": "083 701 7342", "grade": "Skip", "hcap": 3, "years": 16.9}, {"id": "20-Cook-Stuart", "surname": "Cook", "name": "Stuart", "cell": "083 656 3069", "grade": "Skip", "hcap": 3, "years": 14.8}, {"id": "21-v_d_Westhuizen-Danny", "surname": "v d Westhuizen", "name": "Danny", "cell": "083 408 1748", "grade": "3rd+", "hcap": 3, "years": 14.1}, {"id": "22-van_der_Walt-Jesse", "surname": "van der Walt", "name": "Jesse", "cell": "072 637 3008", "grade": "Skip", "hcap": 3, "years": 5.5}, {"id": "23-Malan-Mark", "surname": "Malan", "name": "Mark", "cell": "082 356 1705", "grade": "Skip", "hcap": 3, "years": 12.7}, {"id": "24-Vrugtman-Bruno", "surname": "Vrugtman", "name": "Bruno", "cell": "083 564 2036", "grade": "Skip", "hcap": 3, "years": 11.9}, {"id": "25-Hughes-David", "surname": "Hughes", "name": "David", "cell": "082 412 6665", "grade": "2nd+", "hcap": 4, "years": 4.5}, {"id": "26-Hugo-Corne", "surname": "Hugo", "name": "Corne", "cell": "082 823 9756", "grade": "3rd", "hcap": 3, "years": 4.6}, {"id": "27-van_Niekerk-Michiel", "surname": "van Niekerk", "name": "Michiel", "cell": "084 555 6361", "grade": "3rd+", "hcap": 3, "years": 2.3}, {"id": "28-Naughton-Mark", "surname": "Naughton", "name": "Mark", "cell": "082 463 4162", "grade": "3rd+", "hcap": 4, "years": 13.8}, {"id": "29-Woolfe-Jonathan", "surname": "Woolfe", "name": "Jonathan", "cell": "082 452 3497", "grade": "3rd", "hcap": 4, "years": 11.1}, {"id": "30-Mentz-Deon", "surname": "Mentz", "name": "Deon", "cell": "082 978 4999", "grade": "3rd+", "hcap": 4, "years": 8.3}, {"id": "31-Krul-Willem", "surname": "Krul", "name": "Willem", "cell": "083 285 0803", "grade": "2nd+", "hcap": 4, "years": 8.1}, {"id": "32-Nelson-Rheece", "surname": "Nelson", "name": "Rheece", "cell": "062 731 2356", "grade": "3rd", "hcap": 4, "years": 6.9}, {"id": "33-Nelson-Ethan", "surname": "Nelson", "name": "Ethan", "cell": "069 370 9486", "grade": "Lead", "hcap": 4, "years": 4.6}, {"id": "34-O'Connell-Jason", "surname": "O'Connell", "name": "Jason", "cell": "082 956 3042", "grade": "Lead", "hcap": 4, "years": 4.3}, {"id": "35-Nelson-Craig", "surname": "Nelson", "name": "Craig", "cell": "083 611 6625", "grade": "2nd+", "hcap": 4, "years": 3.9}, {"id": "36-Harrison-Gordon", "surname": "Harrison", "name": "Gordon", "cell": "082 441 9006", "grade": "", "hcap": 5, "years": 16.9}, {"id": "37-Harker-Gordon", "surname": "Harker", "name": "Gordon", "cell": "083 260 6212", "grade": "Skip", "hcap": 5, "years": 13.1}, {"id": "38-Schourie-Sean", "surname": "Schourie", "name": "Sean", "cell": "082 090 2008", "grade": "2nd+", "hcap": 6, "years": 10.3}, {"id": "39-Penfold-Brian", "surname": "Penfold", "name": "Brian", "cell": "083 278 4332", "grade": "3rd", "hcap": 5, "years": 11.7}, {"id": "40-Alford-Smith-John", "surname": "Alford-Smith", "name": "John", "cell": "082 735 5017", "grade": "3rd", "hcap": 5, "years": 11.1}, {"id": "41-Cronje-Luan", "surname": "Cronje", "name": "Luan", "cell": "074 717 1783", "grade": "2nd", "hcap": 5, "years": 10.8}, {"id": "42-Brice-Mike", "surname": "Brice", "name": "Mike", "cell": "072 291 0573", "grade": "3rd", "hcap": 5, "years": 10.4}, {"id": "43-Adams-Mike", "surname": "Adams", "name": "Mike", "cell": "083 450 1519", "grade": "3rd", "hcap": 5, "years": 9.8}, {"id": "44-Mkhonza-Sandile", "surname": "Mkhonza", "name": "Sandile", "cell": "074 838 2033", "grade": "3rd", "hcap": 5, "years": 8.4}, {"id": "45-Ramnarain-Denver", "surname": "Ramnarain", "name": "Denver", "cell": "083 701 9222", "grade": "3rd+", "hcap": 5, "years": 4.5}, {"id": "46-Tillier-Andrew", "surname": "Tillier", "name": "Andrew", "cell": "082 514 5497", "grade": "3rd+", "hcap": 5, "years": 7.5}, {"id": "47-Hancox-Simon", "surname": "Hancox", "name": "Simon", "cell": "082 855 0370", "grade": "3rd+", "hcap": 5, "years": 7.0}, {"id": "48-Suttie-Douglas", "surname": "Suttie", "name": "Douglas", "cell": "082 557 2232", "grade": "2nd+", "hcap": 5, "years": 6.4}, {"id": "49-la_Grange-Gerhard", "surname": "la Grange", "name": "Gerhard", "cell": "082 927 4509", "grade": "2nd+", "hcap": 5, "years": 2.7}, {"id": "50-Erasmus-Mark", "surname": "Erasmus", "name": "Mark", "cell": "083 307 1410", "grade": "2nd+", "hcap": 5, "years": 2.2}, {"id": "51-Clark-Mike", "surname": "Clark", "name": "Mike", "cell": "082 785 9221", "grade": "Skip", "hcap": 6, "years": 16.9}, {"id": "52-Coetzee-Wynand", "surname": "Coetzee", "name": "Wynand", "cell": "082 551 7907", "grade": "2nd", "hcap": 6, "years": 15.1}, {"id": "53-Kruger-Walter", "surname": "Kruger", "name": "Walter", "cell": "083 258 0048", "grade": "Lead+", "hcap": 6, "years": 9.6}, {"id": "54-Goode-Ian", "surname": "Goode", "name": "Ian", "cell": "083 280 5689", "grade": "2nd", "hcap": 6, "years": 9.0}, {"id": "55-Ludick-Thinus", "surname": "Ludick", "name": "Thinus", "cell": "082 371 9924", "grade": "Lead", "hcap": 6, "years": 6.5}, {"id": "56-Galanakis-George", "surname": "Galanakis", "name": "George", "cell": "071 673 5185", "grade": "2nd", "hcap": 6, "years": 4.0}, {"id": "57-Kennedy-Jack", "surname": "Kennedy", "name": "Jack", "cell": "083 653 4050", "grade": "2nd", "hcap": 6, "years": 3.5}, {"id": "58-Spence-Ross-Caiden", "surname": "Spence-Ross", "name": "Caiden", "cell": "071 608 0389", "grade": "2nd", "hcap": 6, "years": 3.5}, {"id": "59-Guthrie-Shaun", "surname": "Guthrie", "name": "Shaun", "cell": "071 608 0389", "grade": "2nd", "hcap": 6, "years": 3.5}, {"id": "60-Mathibela-Tebogo", "surname": "Mathibela", "name": "Tebogo", "cell": "083 581 9659", "grade": "Lead", "hcap": 6, "years": 3.5}, {"id": "61-Snyman-Etienne", "surname": "Snyman", "name": "Etienne", "cell": "082 445 1356", "grade": "2nd", "hcap": 6, "years": 2.8}, {"id": "62-Potgieter-Nathan", "surname": "Potgieter", "name": "Nathan", "cell": "079 876 3050", "grade": "2nd", "hcap": 6, "years": 2.7}, {"id": "63-Andreadakis-Laki", "surname": "Andreadakis", "name": "Laki", "cell": "082 923 3104", "grade": "3rd", "hcap": 7, "years": 16.6}, {"id": "64-Cook-Gary", "surname": "Cook", "name": "Gary", "cell": "082 881 0081", "grade": "Lead", "hcap": 7, "years": 14.1}, {"id": "65-Locke-Diann", "surname": "Locke", "name": "Diann", "cell": "074 741 0246", "grade": "2nd", "hcap": 7, "years": 7.5}, {"id": "66-Wallder-Malcolm", "surname": "Wallder", "name": "Malcolm", "cell": "083 302 0818", "grade": "3rd", "hcap": 7, "years": 5.7}, {"id": "67-Strydom-Shaan", "surname": "Strydom", "name": "Shaan", "cell": "060 997 6764", "grade": "2nd", "hcap": 7, "years": 2.7}, {"id": "68-Robinson-Jean-Pierre", "surname": "Robinson", "name": "Jean-Pierre", "cell": "082 998 5114", "grade": "2nd", "hcap": 7, "years": 2.4}, {"id": "69-Rossouw-Leon", "surname": "Rossouw", "name": "Leon", "cell": "082 456 3954", "grade": "Lead", "hcap": 8, "years": 5.7}, {"id": "70-Ekron-Mervyn", "surname": "Ekron", "name": "Mervyn", "cell": "082 852 2754", "grade": "Lead", "hcap": 8, "years": 2.0}, {"id": "71-Botes-Schalk", "surname": "Botes", "name": "Schalk", "cell": "082 569 1955", "grade": "Lead", "hcap": 8, "years": 5.7}, {"id": "72-Poyurs-Peter", "surname": "Poyurs", "name": "Peter", "cell": "079 493 1732", "grade": "Lead", "hcap": 8, "years": 3.7}, {"id": "73-Morgan-Ken", "surname": "Morgan", "name": "Ken", "cell": "083 677 7099", "grade": "2nd", "hcap": 8, "years": 3.4}, {"id": "74-Anderson-Don", "surname": "Anderson", "name": "Don", "cell": "083 459 4525", "grade": "Lead", "hcap": 8, "years": 2.6}, {"id": "75-Laing-Errol", "surname": "Laing", "name": "Errol", "cell": "082 497 2468", "grade": "", "hcap": 8, "years": 2.5}, {"id": "76-Swartz-Robert", "surname": "Swartz", "name": "Robert", "cell": "082 565 8343", "grade": "Lead", "hcap": 9, "years": 2.3}, {"id": "77-Bell-Gordon", "surname": "Bell", "name": "Gordon", "cell": "083 212 9755", "grade": "Lead", "hcap": 9, "years": 2.1}, {"id": "78-Spaull-Marc", "surname": "Spaull", "name": "Marc", "cell": "082 453 4866", "grade": "Lead", "hcap": 9, "years": 2.1}, {"id": "79-Pretorius-Ed", "surname": "Pretorius", "name": "Ed", "cell": "062 429 8810", "grade": "Lead", "hcap": 10, "years": 1.2}, {"id": "80-Boesch-Tony", "surname": "Boesch", "name": "Tony", "cell": "083 283 5881", "grade": "Lead", "hcap": 9, "years": 2.1}, {"id": "81-Hugo-Liam", "surname": "Hugo", "name": "Liam", "cell": "082 823 9756", "grade": "Lead", "hcap": 10, "years": 3.5}, {"id": "82-Kennedy-Ryan", "surname": "Kennedy", "name": "Ryan", "cell": "083 653 4050", "grade": "Lead", "hcap": 10, "years": 3.4}, {"id": "83-Swanepoel-Lance", "surname": "Swanepoel", "name": "Lance", "cell": "079 932 1592", "grade": "Lead", "hcap": 10, "years": 2.8}, {"id": "84-Duncan-Taylon", "surname": "Duncan", "name": "Taylon", "cell": "072 876 7188", "grade": "Lead", "hcap": 10, "years": 1.2}, {"id": "85-Singh-Tanveer", "surname": "Singh", "name": "Tanveer", "cell": "072 330 3060", "grade": "Lead", "hcap": 10, "years": 1.2}, {"id": "86-Singh-Deeps", "surname": "Singh", "name": "Deeps", "cell": "082 490 9718", "grade": "Lead", "hcap": 10, "years": 1.2}, {"id": "87-Ramsay-Iain", "surname": "Ramsay", "name": "Iain", "cell": "083 252 6757", "grade": "Lead", "hcap": 10, "years": 1.0}, {"id": "88-Roddy-Mark", "surname": "Roddy", "name": "Mark", "cell": "072 403 7365", "grade": "Lead", "hcap": 10, "years": 1.0}, {"id": "89-Smith-Craig", "surname": "Smith", "name": "Craig", "cell": "", "grade": "Lead", "hcap": 10, "years": 0.8}, {"id": "90-Marnewick-Johann", "surname": "Marnewick", "name": "Johann", "cell": "082 497 5423", "grade": "Lead", "hcap": 10, "years": 0.8}, {"id": "91-van_Rooyen-Sean", "surname": "van Rooyen", "name": "Sean", "cell": "082 920 5546", "grade": "Lead", "hcap": 10, "years": 0.7}, {"id": "92-van_Rooyen-Mike", "surname": "van Rooyen", "name": "Mike", "cell": "082 448 6927", "grade": "Lead", "hcap": 10, "years": 0.7}, {"id": "93-Mkanse-William", "surname": "Mkanse", "name": "William", "cell": "076 628 2031", "grade": "Lead", "hcap": 10, "years": 0.6}, {"id": "94-Kruger-Anton", "surname": "Kruger", "name": "Anton", "cell": "082 787 0710", "grade": "Lead", "hcap": 10, "years": 0.6}, {"id": "95-Liguori-Joe", "surname": "Liguori", "name": "Joe", "cell": "082 444 9260", "grade": "Lead", "hcap": 10, "years": 0.4}, {"id": "96-Wilkinson-Grahame", "surname": "Wilkinson", "name": "Grahame", "cell": "083 263 9079", "grade": "Lead", "hcap": 10, "years": 0.5}, {"id": "97-Robertson-Michael", "surname": "Robertson", "name": "Michael", "cell": "083 658 2332", "grade": "Lead", "hcap": 10, "years": 0.5}, {"id": "98-Butow-Dereck", "surname": "Butow", "name": "Dereck", "cell": "082 348 9238", "grade": "Lead", "hcap": 10, "years": 0.4}, {"id": "99-Lochmann-Willy", "surname": "Lochmann", "name": "Willy", "cell": "082 452 0560", "grade": "Lead", "hcap": 10, "years": 0.4}, {"id": "100-Koekemoer-Neels", "surname": "Koekemoer", "name": "Neels", "cell": "079 895 0778", "grade": "Lead", "hcap": 10, "years": 0.3}, {"id": "101-Ramnarain-Liam", "surname": "Ramnarain", "name": "Liam", "cell": "069 924 4583", "grade": "Lead", "hcap": 10, "years": 0.2}, {"id": "102-Bouwer-Louis", "surname": "Bouwer", "name": "Louis", "cell": "082 533 7399", "grade": "Lead", "hcap": 10, "years": 0.2}, {"id": "103-Janse_v_Vuuren-Shawn", "surname": "Janse v Vuuren", "name": "Shawn", "cell": "076 816 3515", "grade": "Lead", "hcap": 10, "years": 0.1}, {"id": "104-Matthews-Tony", "surname": "Matthews", "name": "Tony", "cell": "082 783 8701", "grade": "Lead", "hcap": 10, "years": 0.1}, {"id": "105-Shankland-Lindsay", "surname": "Shankland", "name": "Lindsay", "cell": "066 290 0024", "grade": "Lead", "hcap": 10, "years": 0.1}, {"id": "106-Pearman-White-Mark", "surname": "Pearman-White", "name": "Mark", "cell": "082 456 0333", "grade": "Lead", "hcap": 10, "years": 0.1}, {"id": "107-Hawkins-Bella", "surname": "Hawkins", "name": "Bella", "cell": "083 227 3579", "grade": "Lead", "hcap": 10, "years": 0.1}];

const DEFAULT_SETTINGS = {
  topThreshold: 10,
  topLimit: 1,
  standardLimit: 5,
  oomChallengePoints: 1,
  oomWinPoints: 3,
  oomLosePoints: 1,
  oomInactivityDays: 45,
  oomInactivityPenalty: -5,
};
const ADMIN_PASSCODE = "RCB2026";
const LOGO_SRC = "data:image/png;base64,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";

const COLORS = {
  lawn: "#123C69",
  lawnDark: "#0A2540",
  rail: "#081B30",
  parchment: "#FFFFFF",
  parchmentDeep: "#D9EDEA",
  brass: "#2A9D8F",
  brassLight: "#6FC7BA",
  ink: "#0B2545",
  clay: "#146C64",
  clayLight: "#DDF3F0",
  slate: "#4C6B7A",
};

function displayName(b) {
  return `${b.name} ${b.surname}`;
}

function formatDateTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) +
    ", " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function gradeLabel(g) {
  return g && g.trim() ? g : "\u2014";
}

function eligibleOpponentIndexes(position /* 1-indexed */, settings = DEFAULT_SETTINGS) {
  if (position <= 1) return [];
  const { topThreshold, topLimit, standardLimit } = settings;
  const limit = position <= topThreshold ? topLimit : standardLimit;
  const from = Math.max(1, position - limit);
  const to = position - 1;
  const idxs = [];
  for (let p = to; p >= from; p--) idxs.push(p - 1); // convert to 0-index
  return idxs;
}

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function defaultTimeHHMM() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toTimeString().slice(0, 5);
}

function formatDateNice(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function formatTimeNice(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Parses a handful of common date shapes an admin might paste: YYYY-MM-DD,
// DD/MM/YYYY, or DD-MM-YYYY. Returns an ISO (YYYY-MM-DD) string or null.
function parseFlexibleDate(text) {
  if (!text) return null;
  const s = text.trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return null;
}

function computeYearsMonthsActive(joinDateISO) {
  const start = new Date(`${joinDateISO}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return { years: 0, months: 0 };
  return { years, months };
}

// Shows real elapsed time since registration when we have a join date,
// otherwise falls back to the old manually-maintained decimal "years" field.
function formatYearsActive(bowler) {
  if (bowler.joinDate) {
    const r = computeYearsMonthsActive(bowler.joinDate);
    if (r) {
      const yPart = r.years > 0 ? `${r.years}y` : "";
      const mPart = r.months > 0 ? `${r.months}m` : "";
      if (!yPart && !mPart) return "<1m";
      return [yPart, mPart].filter(Boolean).join(" ");
    }
  }
  return `${bowler.years}y`;
}

// Parses pasted registration-date rows. Accepts a name (in any word order,
// comma or space separated) followed by a date in YYYY-MM-DD or DD/MM/YYYY,
// one bowler per line, e.g.:
//   Donnelly Bobby, 2009-03-14
//   Bobby Donnelly 14/03/2009
function parseRegistrationDatesText(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows = [];
  const problems = [];
  for (const line of lines) {
    const tokens = line.replace(/,/g, " ").split(/\s+/).filter(Boolean);
    if (tokens.length < 2) {
      problems.push(`Couldn't read line: "${line}"`);
      continue;
    }
    const dateISO = parseFlexibleDate(tokens[tokens.length - 1]);
    if (!dateISO) {
      problems.push(`Couldn't read a date on: "${line}"`);
      continue;
    }
    rows.push({ nameTokens: tokens.slice(0, -1), dateISO, raw: line });
  }
  return { rows, problems };
}

function nameTokenKey(tokens) {
  return tokens.map((t) => t.toLowerCase()).sort().join(" ");
}

// Matches parsed rows against the ladder by comparing name word-sets
// (order-independent, so "Donnelly Bobby" and "Bobby Donnelly" both match).
function matchRegistrationDates(ladder, rows) {
  const byKey = new Map();
  ladder.forEach((b) => {
    const tokens = `${b.surname} ${b.name}`.split(/\s+/).filter(Boolean);
    byKey.set(nameTokenKey(tokens), b.id);
  });
  const matched = [];
  const unmatched = [];
  for (const row of rows) {
    const id = byKey.get(nameTokenKey(row.nameTokens));
    if (id) matched.push({ id, dateISO: row.dateISO, raw: row.raw });
    else unmatched.push(row.raw);
  }
  return { matched, unmatched };
}

function toWhatsAppNumber(cell) {
  if (!cell) return null;
  let digits = cell.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) digits = "27" + digits.slice(1);
  else if (!digits.startsWith("27")) digits = "27" + digits;
  return digits;
}

function buildChallengeWhatsAppMessage({ meBowler, opponentBowler, myPosition, opponentPosition, dateISO, time }) {
  const dateBit = dateISO ? ` on ${formatDateNice(dateISO)}` : "";
  const timeBit = time ? ` at ${formatTimeNice(time)}` : "";
  return `Hi ${opponentBowler.name}, it's ${meBowler.name} ${meBowler.surname} from the RCB ladder. I'm #${myPosition} and you're #${opponentPosition} \u2014 I'd like to challenge you. Are you free to play${dateBit}${timeBit}? Let me know if that works, or suggest another time. Cheers!`;
}

function buildReminderWhatsAppMessage({ meBowler, otherBowler, dateISO, time }) {
  const dateBit = dateISO ? ` on ${formatDateNice(dateISO)}` : "";
  const timeBit = time ? ` at ${formatTimeNice(time)}` : "";
  return `Hi ${otherBowler.name}, just following up on our RCB ladder challenge${dateBit}${timeBit}. Let me know if that still suits. \u2014 ${meBowler.name}`;
}

const GRADE_RE = /^(Skip|Lead\+?|\d+(st|nd|rd|th)\+?)$/;
const DIGIT_RE = /^\(?\d{2,4}\)?$/;

function normKey(surname, name) {
  return `${surname.trim().toLowerCase()}|${name.trim().toLowerCase()}`;
}

// Parses lines shaped like the club's ranking PDF export:
// "<rank> <surname words...> <name> [<cell tokens>] [<grade>] <hcap> <years>"
function parseLadderText(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows = [];
  const problems = [];

  for (const line of lines) {
    const tokens = line.split(/\s+/);
    if (tokens.length < 4 || !/^\d+$/.test(tokens[0])) {
      problems.push(`Couldn't read line: "${line}"`);
      continue;
    }
    const rank = parseInt(tokens[0], 10);
    let rest = tokens.slice(1);

    const years = parseFloat(rest[rest.length - 1]);
    const hcap = parseInt(rest[rest.length - 2], 10);
    if (Number.isNaN(years) || Number.isNaN(hcap)) {
      problems.push(`Couldn't read handicap/years on: "${line}"`);
      continue;
    }
    rest = rest.slice(0, -2);

    let grade = "";
    if (rest.length && GRADE_RE.test(rest[rest.length - 1])) {
      grade = rest[rest.length - 1];
      rest = rest.slice(0, -1);
    }

    const cellTokens = [];
    while (rest.length && DIGIT_RE.test(rest[rest.length - 1])) {
      cellTokens.unshift(rest.pop());
    }
    const cell = cellTokens.join(" ");

    if (rest.length < 1) {
      problems.push(`Couldn't find a name on: "${line}"`);
      continue;
    }
    const name = rest[rest.length - 1];
    const surname = rest.slice(0, -1).join(" ") || name;

    rows.push({ rank, surname, name, cell, grade, hcap, years });
  }

  return { rows, problems };
}

// Merges a freshly parsed official list into the live ladder, keeping stable
// ids (and therefore "who am I" + history links) for anyone matched by name.
function mergeImportedLadder(currentLadder, parsedRows) {
  const oldByKey = new Map();
  currentLadder.forEach((b, i) => {
    oldByKey.set(normKey(b.surname, b.name), { bowler: b, position: i + 1 });
  });

  const sorted = [...parsedRows].sort((a, b) => a.rank - b.rank);
  const usedKeys = new Set();
  const nextLadder = sorted.map((row, i) => {
    const key = normKey(row.surname, row.name);
    usedKeys.add(key);
    const match = oldByKey.get(key);
    const newPosition = i + 1;
    let movement = null;
    if (match) {
      if (match.position > newPosition) movement = "up";
      else if (match.position < newPosition) movement = "down";
    }
    return {
      id: match ? match.bowler.id : `imp-${Date.now()}-${i}-${row.surname}-${row.name}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
      name: row.name,
      surname: row.surname,
      cell: row.cell,
      grade: row.grade,
      hcap: row.hcap,
      years: row.years,
      movement,
    };
  });

  const removed = currentLadder.filter((b) => !usedKeys.has(normKey(b.surname, b.name)));
  const added = sorted.filter((row) => !oldByKey.has(normKey(row.surname, row.name)));
  const reordered = nextLadder.filter((b) => b.movement).length;

  return { nextLadder, removed, added, reordered };
}

function usePersisted() {
  const [ladder, setLadder] = useState(null);
  const [challenges, setChallenges] = useState(null);
  const [myId, setMyId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [oomLedger, setOomLedger] = useState(null);
  const [oomTracking, setOomTracking] = useState(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  const loadAll = useCallback(async () => {
    setErr(null);
    // Ladder (shared)
    let ladderVal = null;
    try {
      const res = await window.storage.get("ladder", true);
      ladderVal = res ? JSON.parse(res.value) : null;
    } catch {
      ladderVal = null;
    }
    if (!ladderVal) {
      ladderVal = INITIAL_LADDER;
      try {
        await window.storage.set("ladder", JSON.stringify(ladderVal), true);
      } catch (e) {
        setErr("Could not initialise the shared ladder. Try refreshing.");
      }
    }
    setLadder(ladderVal);

    // Challenges (shared)
    let chVal = null;
    try {
      const res = await window.storage.get("challenges", true);
      chVal = res ? JSON.parse(res.value) : null;
    } catch {
      chVal = null;
    }
    if (!chVal) chVal = [];
    setChallenges(chVal);

    // My identity (personal)
    let idVal = null;
    try {
      const res = await window.storage.get("my-bowler-id", false);
      idVal = res ? JSON.parse(res.value) : null;
    } catch {
      idVal = null;
    }
    setMyId(idVal);

    // Admin unlock (personal, remembered on this device)
    let adminVal = false;
    try {
      const res = await window.storage.get("rcb-admin-unlocked", false);
      adminVal = res ? JSON.parse(res.value) : false;
    } catch {
      adminVal = false;
    }
    setIsAdmin(!!adminVal);

    // Challenge rule settings (shared)
    let settingsVal = null;
    try {
      const res = await window.storage.get("rcb-settings", true);
      settingsVal = res ? JSON.parse(res.value) : null;
    } catch {
      settingsVal = null;
    }
    setSettings(settingsVal ? { ...DEFAULT_SETTINGS, ...settingsVal } : DEFAULT_SETTINGS);

    // Order of Merit ledger + activity tracking (shared)
    let ledgerVal = null;
    try {
      const res = await window.storage.get("oom-ledger", true);
      ledgerVal = res ? JSON.parse(res.value) : null;
    } catch {
      ledgerVal = null;
    }
    setOomLedger(ledgerVal || []);

    let trackingVal = null;
    try {
      const res = await window.storage.get("oom-tracking", true);
      trackingVal = res ? JSON.parse(res.value) : null;
    } catch {
      trackingVal = null;
    }
    setOomTracking(trackingVal || {});

    setReady(true);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const persistLadder = useCallback(async (next) => {
    setLadder(next);
    try {
      await window.storage.set("ladder", JSON.stringify(next), true);
    } catch {
      setErr("Couldn't save the ladder update. Please try again.");
    }
  }, []);

  const persistChallenges = useCallback(async (next) => {
    setChallenges(next);
    try {
      await window.storage.set("challenges", JSON.stringify(next), true);
    } catch {
      setErr("Couldn't save the challenge update. Please try again.");
    }
  }, []);

  const persistMyId = useCallback(async (id) => {
    setMyId(id);
    try {
      await window.storage.set("my-bowler-id", JSON.stringify(id), false);
    } catch {
      setErr("Couldn't remember who you are on this device.");
    }
  }, []);

  const persistIsAdmin = useCallback(async (val) => {
    setIsAdmin(val);
    try {
      await window.storage.set("rcb-admin-unlocked", JSON.stringify(val), false);
    } catch {
      setErr("Couldn't remember admin access on this device.");
    }
  }, []);

  const persistSettings = useCallback(async (next) => {
    setSettings(next);
    try {
      await window.storage.set("rcb-settings", JSON.stringify(next), true);
    } catch {
      setErr("Couldn't save the challenge rule settings. Please try again.");
    }
  }, []);

  const persistOomLedger = useCallback(async (next) => {
    setOomLedger(next);
    try {
      await window.storage.set("oom-ledger", JSON.stringify(next), true);
    } catch {
      setErr("Couldn't save Order of Merit points. Please try again.");
    }
  }, []);

  const persistOomTracking = useCallback(async (next) => {
    setOomTracking(next);
    try {
      await window.storage.set("oom-tracking", JSON.stringify(next), true);
    } catch {
      setErr("Couldn't save Order of Merit activity tracking. Please try again.");
    }
  }, []);

  return {
    ladder, challenges, myId, isAdmin, settings, oomLedger, oomTracking, ready, err, setErr,
    loadAll, persistLadder, persistChallenges, persistMyId, persistIsAdmin, persistSettings,
    persistOomLedger, persistOomTracking,
  };
}

function BallBadge({ position, highlight }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        fontSize: 14,
        color: highlight ? COLORS.lawnDark : COLORS.parchment,
        background: highlight
          ? `radial-gradient(circle at 32% 28%, ${COLORS.brassLight}, ${COLORS.brass} 60%)`
          : `radial-gradient(circle at 32% 28%, #2E5E86, ${COLORS.lawnDark} 70%)`,
        border: `2px solid ${highlight ? COLORS.brass : COLORS.rail}`,
        boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      {position}
    </div>
  );
}

function MoveArrow({ movement }) {
  if (movement === "up") {
    return (
      <span title="Moved up" style={{ color: "#1E8E3E", fontWeight: 700, fontSize: 13 }}>
        ▲
      </span>
    );
  }
  if (movement === "down") {
    return (
      <span title="Moved down" style={{ color: "#C0392B", fontWeight: 700, fontSize: 13 }}>
        ▼
      </span>
    );
  }
  return null;
}

function GradeTag({ grade }) {
  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        padding: "2px 8px",
        borderRadius: 999,
        color: COLORS.lawnDark,
        background: "rgba(184,135,74,0.18)",
        border: `1px solid rgba(184,135,74,0.45)`,
        whiteSpace: "nowrap",
      }}
    >
      {gradeLabel(grade)}
    </span>
  );
}

function PhoneLink({ cell }) {
  if (!cell) {
    return (
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: COLORS.slate }}>
        no number
      </span>
    );
  }
  const tel = cell.replace(/[^\d+]/g, "");
  return (
    <a
      href={`tel:${tel}`}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12.5,
        color: COLORS.lawnDark,
        textDecoration: "none",
        borderBottom: `1px dotted ${COLORS.brass}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      ☎ {cell}
    </a>
  );
}

function Toast({ message, kind, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  const bg = kind === "error" ? COLORS.clay : COLORS.lawnDark;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        background: bg,
        color: COLORS.parchment,
        padding: "10px 18px",
        borderRadius: 10,
        fontFamily: "'Inter', sans-serif",
        fontSize: 13.5,
        fontWeight: 500,
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        zIndex: 100,
        maxWidth: "88%",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

function IdentityPicker({ ladder, onPick, onCancel, cancelable }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ladder.slice(0, 25);
    return ladder.filter((b) =>
      `${b.name} ${b.surname}`.toLowerCase().includes(s)
    );
  }, [q, ladder]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,44,34,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 16,
      }}
    >
      <div
        style={{
          background: COLORS.parchment,
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          border: `3px solid ${COLORS.brass}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ padding: "20px 22px 14px" }}>
          <img src={LOGO_SRC} alt="RCB logo" style={{ width: 36, height: 36, marginBottom: 8 }} />
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: COLORS.lawnDark,
              marginBottom: 4,
            }}
          >
            Who are you on the ladder?
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: COLORS.slate }}>
            Pick your name so this phone can challenge on your behalf.
          </div>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your surname..."
            style={{
              marginTop: 12,
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: 9,
              border: `1.5px solid ${COLORS.parchmentDeep}`,
              background: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: COLORS.ink,
              outline: "none",
            }}
          />
        </div>
        <div style={{ overflowY: "auto", padding: "0 10px 10px" }}>
          {filtered.map((b, i) => {
            const pos = ladder.findIndex((x) => x.id === b.id) + 1;
            return (
              <button
                key={b.id}
                onClick={() => onPick(b.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderRadius: 8,
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: COLORS.brass,
                    width: 28,
                    flexShrink: 0,
                  }}
                >
                  #{pos}
                </span>
                <span style={{ fontSize: 14.5, color: COLORS.ink, fontWeight: 500 }}>
                  {displayName(b)}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: COLORS.slate, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              No one matches that search.
            </div>
          )}
        </div>
        {cancelable && (
          <div style={{ padding: 14, borderTop: `1px solid ${COLORS.parchmentDeep}` }}>
            <button
              onClick={onCancel}
              style={{
                width: "100%",
                padding: "9px 0",
                background: "transparent",
                border: `1px solid ${COLORS.parchmentDeep}`,
                borderRadius: 8,
                color: COLORS.slate,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeComposer({ meBowler, opponentBowler, myPosition, opponentPosition, onCancel, onConfirm }) {
  const [dateISO, setDateISO] = useState(todayISO());
  const [time, setTime] = useState(defaultTimeHHMM());
  const hasWhatsApp = !!toWhatsAppNumber(opponentBowler.cell);

  const message = buildChallengeWhatsAppMessage({
    meBowler, opponentBowler, myPosition, opponentPosition, dateISO, time,
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,37,64,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 16,
      }}
    >
      <div
        style={{
          background: COLORS.parchment,
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          maxHeight: "88vh",
          overflowY: "auto",
          border: `3px solid ${COLORS.brass}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          padding: "20px 22px 18px",
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontSize: 21,
            color: COLORS.lawnDark,
            marginBottom: 4,
          }}
        >
          Challenge {displayName(opponentBowler)}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: COLORS.slate, marginBottom: 16 }}>
          You're #{myPosition}, they're #{opponentPosition}. Pick a date and time to propose.
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <label style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.ink }}>
            Date
            <input
              type="date"
              value={dateISO}
              min={todayISO()}
              onChange={(e) => setDateISO(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1.5px solid ${COLORS.parchmentDeep}`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: COLORS.ink,
                boxSizing: "border-box",
              }}
            />
          </label>
          <label style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.ink }}>
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1.5px solid ${COLORS.parchmentDeep}`,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: COLORS.ink,
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>

        <div
          style={{
            background: COLORS.parchmentDeep,
            borderRadius: 10,
            padding: "10px 12px",
            fontFamily: "'Inter', sans-serif",
            fontSize: 12.5,
            color: COLORS.ink,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        {!hasWhatsApp && (
          <div style={{ fontSize: 12, color: COLORS.clay, marginBottom: 12 }}>
            No cell number on file for this bowler — you can still log the challenge, but WhatsApp isn't available.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            disabled={!hasWhatsApp}
            onClick={() => onConfirm({ dateISO, time, sendWhatsApp: true, message })}
            style={{
              padding: "11px 0",
              borderRadius: 9,
              border: "none",
              background: hasWhatsApp ? "#25D366" : COLORS.parchmentDeep,
              color: hasWhatsApp ? "#0B2545" : COLORS.slate,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: hasWhatsApp ? "pointer" : "not-allowed",
            }}
          >
            Send via WhatsApp
          </button>
          <button
            onClick={() => onConfirm({ dateISO, time, sendWhatsApp: false, message })}
            style={{
              padding: "10px 0",
              borderRadius: 9,
              border: `1px solid ${COLORS.lawn}`,
              background: "transparent",
              color: COLORS.lawnDark,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Just log the challenge
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              background: "transparent",
              color: COLORS.slate,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onUnlock, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (pin === ADMIN_PASSCODE) {
      onUnlock();
    } else {
      setError("That passcode isn't right.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,37,64,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 16,
      }}
    >
      <div
        style={{
          background: COLORS.parchment,
          borderRadius: 16,
          width: "100%",
          maxWidth: 340,
          border: `3px solid ${COLORS.brass}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          padding: "22px 22px 18px",
        }}
      >
        <img src={LOGO_SRC} alt="RCB logo" style={{ width: 36, height: 36, marginBottom: 8 }} />
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontSize: 21,
            color: COLORS.lawnDark,
            marginBottom: 10,
          }}
        >
          Admin access
        </div>
        <input
          autoFocus
          type="password"
          inputMode="text"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter passcode"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: 9,
            border: `1.5px solid ${COLORS.parchmentDeep}`,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            marginBottom: 8,
          }}
        />
        {error && (
          <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={submit}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 8,
              border: "none",
              background: COLORS.lawn,
              color: COLORS.parchment,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Unlock
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 8,
              border: `1px solid ${COLORS.parchmentDeep}`,
              background: "transparent",
              color: COLORS.slate,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ ladder, settings, oomLedger, onAdd, onDelete, onEdit, onImport, onImportJoinDates, onSaveSettings, onMove, onAwardBonus, onDeleteOomEntry, onClose, onLock }) {
  const [form, setForm] = useState({
    name: "", surname: "", cell: "", grade: "", hcap: "", years: "", position: "", joinDate: "",
  });
  const [formError, setFormError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [moveDrafts, setMoveDrafts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", surname: "", cell: "", grade: "", hcap: "", years: "", joinDate: "" });
  const [editError, setEditError] = useState("");
  const [showSync, setShowSync] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState(null);
  const [syncError, setSyncError] = useState("");
  const [showJoinDates, setShowJoinDates] = useState(false);
  const [joinDatesText, setJoinDatesText] = useState("");
  const [joinDatesPreview, setJoinDatesPreview] = useState(null);
  const [joinDatesError, setJoinDatesError] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [rulesForm, setRulesForm] = useState({
    topThreshold: String(settings.topThreshold),
    topLimit: String(settings.topLimit),
    standardLimit: String(settings.standardLimit),
  });
  const [rulesError, setRulesError] = useState("");
  const [rulesSaved, setRulesSaved] = useState(false);

  const saveRules = () => {
    const topThreshold = parseInt(rulesForm.topThreshold, 10);
    const topLimit = parseInt(rulesForm.topLimit, 10);
    const standardLimit = parseInt(rulesForm.standardLimit, 10);
    if (
      !Number.isFinite(topThreshold) || topThreshold < 0 ||
      !Number.isFinite(topLimit) || topLimit < 1 ||
      !Number.isFinite(standardLimit) || standardLimit < 1
    ) {
      setRulesError("Please enter valid positive numbers for all three fields.");
      setRulesSaved(false);
      return;
    }
    setRulesError("");
    onSaveSettings({ ...settings, topThreshold, topLimit, standardLimit });
    setRulesSaved(true);
    setTimeout(() => setRulesSaved(false), 2500);
  };

  const [showOomRules, setShowOomRules] = useState(false);
  const [oomRulesForm, setOomRulesForm] = useState({
    oomChallengePoints: String(settings.oomChallengePoints),
    oomWinPoints: String(settings.oomWinPoints),
    oomLosePoints: String(settings.oomLosePoints),
    oomInactivityDays: String(settings.oomInactivityDays),
    oomInactivityPenalty: String(settings.oomInactivityPenalty),
  });
  const [oomRulesError, setOomRulesError] = useState("");
  const [oomRulesSaved, setOomRulesSaved] = useState(false);
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [bonusForm, setBonusForm] = useState({ bowlerId: "", points: "", note: "" });
  const [bonusError, setBonusError] = useState("");
  const [bonusSearch, setBonusSearch] = useState("");
  const [confirmDeleteOomId, setConfirmDeleteOomId] = useState(null);

  const saveOomRules = () => {
    const oomChallengePoints = Number(oomRulesForm.oomChallengePoints);
    const oomWinPoints = Number(oomRulesForm.oomWinPoints);
    const oomLosePoints = Number(oomRulesForm.oomLosePoints);
    const oomInactivityDays = parseInt(oomRulesForm.oomInactivityDays, 10);
    const oomInactivityPenalty = Number(oomRulesForm.oomInactivityPenalty);
    if (
      !Number.isFinite(oomChallengePoints) ||
      !Number.isFinite(oomWinPoints) ||
      !Number.isFinite(oomLosePoints) ||
      !Number.isFinite(oomInactivityDays) || oomInactivityDays < 1 ||
      !Number.isFinite(oomInactivityPenalty)
    ) {
      setOomRulesError("Please enter valid numbers for all fields.");
      setOomRulesSaved(false);
      return;
    }
    setOomRulesError("");
    onSaveSettings({
      ...settings,
      oomChallengePoints, oomWinPoints, oomLosePoints, oomInactivityDays, oomInactivityPenalty,
    });
    setOomRulesSaved(true);
    setTimeout(() => setOomRulesSaved(false), 2500);
  };

  const submitBonus = () => {
    const points = Number(bonusForm.points);
    if (!bonusForm.bowlerId) {
      setBonusError("Pick a bowler first.");
      return;
    }
    if (!Number.isFinite(points) || points === 0) {
      setBonusError("Enter a non-zero number of points (negative is allowed).");
      return;
    }
    setBonusError("");
    onAwardBonus(bonusForm.bowlerId, points, bonusForm.note.trim());
    setBonusForm({ bowlerId: "", points: "", note: "" });
  };

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submitAdd = () => {
    if (!form.name.trim() || !form.surname.trim()) {
      setFormError("Name and surname are required.");
      return;
    }
    setFormError("");
    onAdd({
      name: form.name.trim(),
      surname: form.surname.trim(),
      cell: form.cell.trim(),
      grade: form.grade.trim(),
      hcap: form.hcap === "" ? 0 : Number(form.hcap),
      years: form.years === "" ? 0 : Number(form.years),
      position: form.position === "" ? null : Number(form.position),
      joinDate: form.joinDate || null,
    });
    setForm({ name: "", surname: "", cell: "", grade: "", hcap: "", years: "", position: "", joinDate: "" });
  };

  const startEdit = (b) => {
    setConfirmDeleteId(null);
    setEditingId(b.id);
    setEditError("");
    setEditForm({
      name: b.name,
      surname: b.surname,
      cell: b.cell || "",
      grade: b.grade || "",
      hcap: String(b.hcap),
      years: String(b.years),
      joinDate: b.joinDate || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const saveEdit = (id) => {
    if (!editForm.name.trim() || !editForm.surname.trim()) {
      setEditError("Name and surname are required.");
      return;
    }
    onEdit(id, {
      name: editForm.name.trim(),
      surname: editForm.surname.trim(),
      cell: editForm.cell.trim(),
      grade: editForm.grade.trim(),
      hcap: editForm.hcap === "" ? 0 : Number(editForm.hcap),
      years: editForm.years === "" ? 0 : Number(editForm.years),
      joinDate: editForm.joinDate || null,
    });
    setEditingId(null);
    setEditError("");
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    borderRadius: 8,
    border: `1.5px solid ${COLORS.parchmentDeep}`,
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: COLORS.ink,
  };

  const tableInputStyle = {
    width: "100%",
    minWidth: 60,
    boxSizing: "border-box",
    padding: "4px 6px",
    borderRadius: 5,
    border: `1px solid ${COLORS.brass}`,
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: COLORS.ink,
  };

  const runPreview = () => {
    setSyncError("");
    setPreview(null);
    const { rows, problems } = parseLadderText(pasteText);
    if (rows.length === 0) {
      setSyncError("Couldn't find any valid rows in that text. Paste the ranking list exactly as exported.");
      return;
    }
    const merged = mergeImportedLadder(ladder, rows);
    setPreview({ ...merged, rowCount: rows.length, problems });
  };

  const applyImport = () => {
    if (!preview) return;
    onImport(preview.nextLadder);
    setPreview(null);
    setPasteText("");
    setShowSync(false);
  };

  const runJoinDatesPreview = () => {
    setJoinDatesError("");
    setJoinDatesPreview(null);
    const { rows, problems } = parseRegistrationDatesText(joinDatesText);
    if (rows.length === 0) {
      setJoinDatesError("Couldn't find any valid rows. Each line needs a name and a date.");
      return;
    }
    const { matched, unmatched } = matchRegistrationDates(ladder, rows);
    setJoinDatesPreview({ matched, unmatched, problems });
  };

  const applyJoinDates = () => {
    if (!joinDatesPreview || joinDatesPreview.matched.length === 0) return;
    onImportJoinDates(joinDatesPreview.matched);
    setJoinDatesPreview(null);
    setJoinDatesText("");
    setShowJoinDates(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,37,64,0.85)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px 10px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: COLORS.parchment,
          borderRadius: 16,
          width: "100%",
          maxWidth: 620,
          border: `3px solid ${COLORS.brass}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          padding: "20px 18px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 22, color: COLORS.lawnDark }}>
            Manage players
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", color: COLORS.slate,
              fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
          Add a new bowler to the foot of the ladder, or remove someone who's left the club.{" "}
          <button
            onClick={onLock}
            style={{ background: "none", border: "none", color: COLORS.clay, textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0 }}
          >
            Lock admin access
          </button>
        </div>

        {/* Challenge rules */}
        <div style={{ marginBottom: 18 }}>
          <button
            onClick={() => setShowRules((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${COLORS.brass}`,
              background: "rgba(42,157,143,0.08)",
              color: COLORS.lawnDark,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <span>Challenge rules</span>
            <span style={{ fontSize: 12, color: COLORS.brass }}>{showRules ? "Hide \u25B4" : "Show \u25BE"}</span>
          </button>

          {showRules && (
            <div style={{ marginTop: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 10, lineHeight: 1.5 }}>
                Controls how many places a bowler may challenge upward. Applies to every
                phone using this ladder as soon as it's saved.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 10 }}>
                <label style={{ fontSize: 12.5, color: COLORS.ink }}>
                  Top-of-ladder zone (positions 1 to this number)
                  <input
                    type="number"
                    min="0"
                    value={rulesForm.topThreshold}
                    onChange={(e) => setRulesForm((f) => ({ ...f, topThreshold: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12.5, color: COLORS.ink }}>
                  Places a top-zone bowler may challenge above
                  <input
                    type="number"
                    min="1"
                    value={rulesForm.topLimit}
                    onChange={(e) => setRulesForm((f) => ({ ...f, topLimit: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12.5, color: COLORS.ink }}>
                  Places everyone else may challenge above
                  <input
                    type="number"
                    min="1"
                    value={rulesForm.standardLimit}
                    onChange={(e) => setRulesForm((f) => ({ ...f, standardLimit: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
              </div>
              {rulesError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{rulesError}</div>}
              {rulesSaved && <div style={{ color: COLORS.lawnDark, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Saved — the new rule applies immediately.</div>}
              <button
                onClick={saveRules}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 8,
                  border: "none",
                  background: COLORS.lawn,
                  color: COLORS.parchment,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Save challenge rules
              </button>
            </div>
          )}
        </div>

        {/* Order of Merit rules */}
        <div style={{ marginBottom: 18 }}>
          <button
            onClick={() => setShowOomRules((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${COLORS.brass}`,
              background: "rgba(42,157,143,0.08)",
              color: COLORS.lawnDark,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <span>Order of Merit rules</span>
            <span style={{ fontSize: 12, color: COLORS.brass }}>{showOomRules ? "Hide \u25B4" : "Show \u25BE"}</span>
          </button>

          {showOomRules && (
            <div style={{ marginTop: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 10, lineHeight: 1.5 }}>
                Point values for the separate Order of Merit table. Applies to every phone
                using this ladder as soon as it's saved.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: COLORS.ink }}>
                  Points for issuing a challenge
                  <input
                    type="number"
                    value={oomRulesForm.oomChallengePoints}
                    onChange={(e) => setOomRulesForm((f) => ({ ...f, oomChallengePoints: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12, color: COLORS.ink }}>
                  Points for a win
                  <input
                    type="number"
                    value={oomRulesForm.oomWinPoints}
                    onChange={(e) => setOomRulesForm((f) => ({ ...f, oomWinPoints: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12, color: COLORS.ink }}>
                  Points for a loss
                  <input
                    type="number"
                    value={oomRulesForm.oomLosePoints}
                    onChange={(e) => setOomRulesForm((f) => ({ ...f, oomLosePoints: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12, color: COLORS.ink }}>
                  Inactivity threshold (days)
                  <input
                    type="number"
                    min="1"
                    value={oomRulesForm.oomInactivityDays}
                    onChange={(e) => setOomRulesForm((f) => ({ ...f, oomInactivityDays: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
                <label style={{ fontSize: 12, color: COLORS.ink, gridColumn: "1 / -1" }}>
                  Inactivity penalty (usually negative, e.g. -5)
                  <input
                    type="number"
                    value={oomRulesForm.oomInactivityPenalty}
                    onChange={(e) => setOomRulesForm((f) => ({ ...f, oomInactivityPenalty: e.target.value }))}
                    style={{ display: "block", width: "100%", marginTop: 4, boxSizing: "border-box", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${COLORS.parchment}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
                  />
                </label>
              </div>
              <div style={{ fontSize: 11, color: COLORS.slate, marginBottom: 10, lineHeight: 1.5 }}>
                The inactivity check runs automatically once a day on the server — it's not
                something that needs anyone to have the app open.
              </div>
              {oomRulesError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{oomRulesError}</div>}
              {oomRulesSaved && <div style={{ color: COLORS.lawnDark, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Saved.</div>}
              <button
                onClick={saveOomRules}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 8,
                  border: "none",
                  background: COLORS.lawn,
                  color: COLORS.parchment,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Save Order of Merit rules
              </button>
            </div>
          )}
        </div>

        {/* Award bonus points */}
        <div style={{ marginBottom: 18 }}>
          <button
            onClick={() => setShowBonusForm((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${COLORS.brass}`,
              background: "rgba(42,157,143,0.08)",
              color: COLORS.lawnDark,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <span>Award bonus points</span>
            <span style={{ fontSize: 12, color: COLORS.brass }}>{showBonusForm ? "Hide \u25B4" : "Show \u25BE"}</span>
          </button>

          {showBonusForm && (
            <div style={{ marginTop: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: 14 }}>
              <input
                placeholder="Search bowler by name..."
                value={bonusSearch}
                onChange={(e) => setBonusSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: 8 }}
              />
              <select
                value={bonusForm.bowlerId}
                onChange={(e) => setBonusForm((f) => ({ ...f, bowlerId: e.target.value }))}
                style={{ ...inputStyle, marginBottom: 8 }}
              >
                <option value="">Select a bowler...</option>
                {ladder
                  .filter((b) => displayName(b).toLowerCase().includes(bonusSearch.trim().toLowerCase()))
                  .map((b) => (
                    <option key={b.id} value={b.id}>{displayName(b)}</option>
                  ))}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginBottom: 8 }}>
                <input
                  type="number"
                  placeholder="Points (+/-)"
                  value={bonusForm.points}
                  onChange={(e) => setBonusForm((f) => ({ ...f, points: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  placeholder="Reason (optional)"
                  value={bonusForm.note}
                  onChange={(e) => setBonusForm((f) => ({ ...f, note: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              {bonusError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{bonusError}</div>}
              <button
                onClick={submitBonus}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 8,
                  border: "none",
                  background: COLORS.lawn,
                  color: COLORS.parchment,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Award points
              </button>
            </div>
          )}
        </div>

        {/* Order of Merit ledger */}
        {oomLedger && oomLedger.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: COLORS.lawnDark, marginBottom: 8 }}>
              Recent Order of Merit entries
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
              {[...oomLedger].sort((a, b) => b.at - a.at).slice(0, 25).map((e) => {
                const bowler = ladder.find((b) => b.id === e.bowlerId);
                return (
                  <div
                    key={e.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      background: COLORS.parchmentDeep,
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 11.5,
                    }}
                  >
                    <span>
                      {bowler ? displayName(bowler) : "Unknown bowler"} — {e.type}
                      {e.note ? ` (${e.note})` : ""}
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, marginLeft: 6 }}>
                        {e.points > 0 ? "+" : ""}{e.points}
                      </span>
                    </span>
                    {confirmDeleteOomId === e.id ? (
                      <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <button
                          onClick={() => { onDeleteOomEntry(e.id); setConfirmDeleteOomId(null); }}
                          style={{ background: COLORS.clay, color: "#fff", border: "none", borderRadius: 6, padding: "3px 6px", fontSize: 10.5, cursor: "pointer" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteOomId(null)}
                          style={{ background: "transparent", color: COLORS.slate, border: `1px solid ${COLORS.parchment}`, borderRadius: 6, padding: "3px 6px", fontSize: 10.5, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteOomId(e.id)}
                        style={{ background: "transparent", color: COLORS.clay, border: `1px solid ${COLORS.clay}`, borderRadius: 6, padding: "3px 6px", fontSize: 10.5, cursor: "pointer", flexShrink: 0 }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add player form */}
        <div
          style={{
            background: COLORS.parchmentDeep,
            borderRadius: 12,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: COLORS.lawnDark, marginBottom: 10 }}>
            Add a player
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input placeholder="First name" value={form.name} onChange={(e) => updateField("name", e.target.value)} style={inputStyle} />
            <input placeholder="Surname" value={form.surname} onChange={(e) => updateField("surname", e.target.value)} style={inputStyle} />
            <input placeholder="Cell number" value={form.cell} onChange={(e) => updateField("cell", e.target.value)} style={inputStyle} />
            <input placeholder="Grade (e.g. Skip, 2nd+)" value={form.grade} onChange={(e) => updateField("grade", e.target.value)} style={inputStyle} />
            <input placeholder="Handicap" type="number" value={form.hcap} onChange={(e) => updateField("hcap", e.target.value)} style={inputStyle} />
            <input placeholder="Years playing (only used if no registration date)" type="number" step="0.1" value={form.years} onChange={(e) => updateField("years", e.target.value)} style={inputStyle} />
          </div>
          <label style={{ display: "block", fontSize: 11.5, color: COLORS.slate, marginBottom: 8 }}>
            Registration date (if set, "years active" is calculated from this instead of the manual number above)
            <input
              type="date"
              value={form.joinDate}
              onChange={(e) => updateField("joinDate", e.target.value)}
              style={{ ...inputStyle, marginTop: 4 }}
            />
          </label>
          <input
            placeholder={`Insert at position (blank = add at #${ladder.length + 1}, bottom)`}
            type="number"
            min="1"
            max={ladder.length + 1}
            value={form.position}
            onChange={(e) => updateField("position", e.target.value)}
            style={{ ...inputStyle, marginBottom: 10 }}
          />
          {formError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{formError}</div>}
          <button
            onClick={submitAdd}
            style={{
              width: "100%",
              padding: "9px 0",
              borderRadius: 8,
              border: "none",
              background: COLORS.lawn,
              color: COLORS.parchment,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Add to ladder
          </button>
        </div>

        {/* Sync from official list */}
        <div style={{ marginBottom: 18 }}>
          <button
            onClick={() => setShowSync((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${COLORS.brass}`,
              background: "rgba(42,157,143,0.08)",
              color: COLORS.lawnDark,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <span>Sync from official ranking list</span>
            <span style={{ fontSize: 12, color: COLORS.brass }}>{showSync ? "Hide ▴" : "Show ▾"}</span>
          </button>

          {showSync && (
            <div style={{ marginTop: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 8, lineHeight: 1.5 }}>
                Paste the club's ranking export exactly as it comes out (one bowler per line:
                rank, surname, first name, cell, grade, handicap, years). This replaces the whole
                ladder with the pasted order, matching bowlers by name so their history and
                "who am I" links carry over.
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => { setPasteText(e.target.value); setPreview(null); setSyncError(""); }}
                placeholder="1 Donnelly Bobby 082 923 5967 Skip 0 16.9&#10;2 Barnard Richard 082 875 6641 Skip 1 16.9&#10;..."
                rows={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.parchment}`,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11.5,
                  marginBottom: 10,
                  resize: "vertical",
                }}
              />
              {syncError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{syncError}</div>}

              {!preview ? (
                <button
                  onClick={runPreview}
                  disabled={!pasteText.trim()}
                  style={{
                    width: "100%",
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "none",
                    background: pasteText.trim() ? COLORS.lawn : COLORS.parchment,
                    color: pasteText.trim() ? COLORS.parchment : COLORS.slate,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: pasteText.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Preview changes
                </button>
              ) : (
                <div>
                  <div
                    style={{
                      background: COLORS.parchment,
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 12.5,
                      color: COLORS.ink,
                      marginBottom: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    Parsed <strong>{preview.rowCount}</strong> bowlers.{" "}
                    <strong>{preview.reordered}</strong> will show a movement arrow.
                    {preview.added.length > 0 && (
                      <div>
                        <strong>{preview.added.length} new:</strong>{" "}
                        {preview.added.map((r) => `${r.name} ${r.surname}`).join(", ")}
                      </div>
                    )}
                    {preview.removed.length > 0 && (
                      <div>
                        <strong>{preview.removed.length} will be removed</strong> (not in the pasted list):{" "}
                        {preview.removed.map((b) => displayName(b)).join(", ")}
                      </div>
                    )}
                    {preview.problems.length > 0 && (
                      <div style={{ color: COLORS.clay, marginTop: 6 }}>
                        {preview.problems.length} line(s) couldn't be read and were skipped.
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={applyImport}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 8,
                        border: "none",
                        background: COLORS.clay,
                        color: "#fff",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: "pointer",
                      }}
                    >
                      Apply this update
                    </button>
                    <button
                      onClick={() => setPreview(null)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.slate}`,
                        background: "transparent",
                        color: COLORS.slate,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Import registration dates */}
        <div style={{ marginBottom: 18 }}>
          <button
            onClick={() => setShowJoinDates((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              border: `1px solid ${COLORS.brass}`,
              background: "rgba(42,157,143,0.08)",
              color: COLORS.lawnDark,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <span>Import registration dates</span>
            <span style={{ fontSize: 12, color: COLORS.brass }}>{showJoinDates ? "Hide ▴" : "Show ▾"}</span>
          </button>

          {showJoinDates && (
            <div style={{ marginTop: 10, background: COLORS.parchmentDeep, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 8, lineHeight: 1.5 }}>
                Paste one bowler per line: a name (either word order works) followed by their
                registration date, e.g. <code>Donnelly Bobby 2009-03-14</code> or{" "}
                <code>Bobby Donnelly, 14/03/2009</code>. Once set, "years active" is calculated
                from this date automatically instead of the old manually-typed number.
              </div>
              <textarea
                value={joinDatesText}
                onChange={(e) => { setJoinDatesText(e.target.value); setJoinDatesPreview(null); setJoinDatesError(""); }}
                placeholder={"Donnelly Bobby 2009-03-14\nBarnard Richard 12/06/2010\n..."}
                rows={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.parchment}`,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11.5,
                  marginBottom: 10,
                  resize: "vertical",
                }}
              />
              {joinDatesError && <div style={{ color: COLORS.clay, fontSize: 12, marginBottom: 8 }}>{joinDatesError}</div>}

              {!joinDatesPreview ? (
                <button
                  onClick={runJoinDatesPreview}
                  disabled={!joinDatesText.trim()}
                  style={{
                    width: "100%",
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "none",
                    background: joinDatesText.trim() ? COLORS.lawn : COLORS.parchment,
                    color: joinDatesText.trim() ? COLORS.parchment : COLORS.slate,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: joinDatesText.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Preview matches
                </button>
              ) : (
                <div>
                  <div
                    style={{
                      background: COLORS.parchment,
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 12.5,
                      color: COLORS.ink,
                      marginBottom: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>{joinDatesPreview.matched.length}</strong> matched to a bowler on the ladder.
                    {joinDatesPreview.unmatched.length > 0 && (
                      <div style={{ color: COLORS.clay, marginTop: 6 }}>
                        {joinDatesPreview.unmatched.length} line(s) didn't match anyone by name:
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginTop: 4 }}>
                          {joinDatesPreview.unmatched.join(" · ")}
                        </div>
                      </div>
                    )}
                    {joinDatesPreview.problems.length > 0 && (
                      <div style={{ color: COLORS.clay, marginTop: 6 }}>
                        {joinDatesPreview.problems.length} line(s) couldn't be read at all.
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={applyJoinDates}
                      disabled={joinDatesPreview.matched.length === 0}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 8,
                        border: "none",
                        background: joinDatesPreview.matched.length > 0 ? COLORS.lawn : COLORS.parchment,
                        color: joinDatesPreview.matched.length > 0 ? COLORS.parchment : COLORS.slate,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: joinDatesPreview.matched.length > 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      Apply {joinDatesPreview.matched.length} date{joinDatesPreview.matched.length === 1 ? "" : "s"}
                    </button>
                    <button
                      onClick={() => setJoinDatesPreview(null)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.slate}`,
                        background: "transparent",
                        color: COLORS.slate,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Players table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif", fontSize: 12.5 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.lawn}` }}>
                <th style={{ padding: "6px 6px" }}>#</th>
                <th style={{ padding: "6px 6px" }}>Name</th>
                <th style={{ padding: "6px 6px" }}>Cell</th>
                <th style={{ padding: "6px 6px" }}>Grade</th>
                <th style={{ padding: "6px 6px" }}>Hcap</th>
                <th style={{ padding: "6px 6px" }}>Years</th>
                <th style={{ padding: "6px 6px" }}>Move</th>
                <th style={{ padding: "6px 6px" }}></th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((b, i) => {
                const isEditing = editingId === b.id;
                return (
                <tr key={b.id} style={{ borderBottom: `1px solid ${COLORS.parchmentDeep}`, background: isEditing ? "rgba(42,157,143,0.08)" : "transparent" }}>
                  <td style={{ padding: "6px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}</td>
                  {isEditing ? (
                    <>
                      <td style={{ padding: "6px 6px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 110 }}>
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="First name"
                            style={tableInputStyle}
                          />
                          <input
                            value={editForm.surname}
                            onChange={(e) => setEditForm((f) => ({ ...f, surname: e.target.value }))}
                            placeholder="Surname"
                            style={tableInputStyle}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "6px 6px" }}>
                        <input
                          value={editForm.cell}
                          onChange={(e) => setEditForm((f) => ({ ...f, cell: e.target.value }))}
                          placeholder="Cell"
                          style={tableInputStyle}
                        />
                      </td>
                      <td style={{ padding: "6px 6px" }}>
                        <input
                          value={editForm.grade}
                          onChange={(e) => setEditForm((f) => ({ ...f, grade: e.target.value }))}
                          placeholder="Grade"
                          style={tableInputStyle}
                        />
                      </td>
                      <td style={{ padding: "6px 6px" }}>
                        <input
                          type="number"
                          value={editForm.hcap}
                          onChange={(e) => setEditForm((f) => ({ ...f, hcap: e.target.value }))}
                          style={{ ...tableInputStyle, width: 48 }}
                        />
                      </td>
                      <td style={{ padding: "6px 6px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 100 }}>
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.years}
                            onChange={(e) => setEditForm((f) => ({ ...f, years: e.target.value }))}
                            placeholder="Manual years"
                            style={{ ...tableInputStyle, width: 90 }}
                          />
                          <input
                            type="date"
                            value={editForm.joinDate}
                            onChange={(e) => setEditForm((f) => ({ ...f, joinDate: e.target.value }))}
                            title="Registration date (overrides manual years if set)"
                            style={{ ...tableInputStyle, width: 130 }}
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "6px 6px" }}>{displayName(b)}</td>
                      <td style={{ padding: "6px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{b.cell || "\u2014"}</td>
                      <td style={{ padding: "6px 6px" }}>{gradeLabel(b.grade)}</td>
                      <td style={{ padding: "6px 6px" }}>{b.hcap}</td>
                      <td style={{ padding: "6px 6px" }}>{formatYearsActive(b)}</td>
                    </>
                  )}
                  <td style={{ padding: "6px 6px", whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <span style={{ fontSize: 11, color: COLORS.slate }}>—</span>
                    ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <button
                        disabled={i === 0}
                        onClick={() => onMove(b.id, i)}
                        title="Move up one"
                        style={{
                          background: "transparent",
                          border: `1px solid ${COLORS.parchmentDeep}`,
                          borderRadius: 5,
                          padding: "3px 6px",
                          fontSize: 11,
                          cursor: i === 0 ? "not-allowed" : "pointer",
                          opacity: i === 0 ? 0.4 : 1,
                          color: COLORS.ink,
                        }}
                      >
                        ▲
                      </button>
                      <button
                        disabled={i === ladder.length - 1}
                        onClick={() => onMove(b.id, i + 2)}
                        title="Move down one"
                        style={{
                          background: "transparent",
                          border: `1px solid ${COLORS.parchmentDeep}`,
                          borderRadius: 5,
                          padding: "3px 6px",
                          fontSize: 11,
                          cursor: i === ladder.length - 1 ? "not-allowed" : "pointer",
                          opacity: i === ladder.length - 1 ? 0.4 : 1,
                          color: COLORS.ink,
                        }}
                      >
                        ▼
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={ladder.length}
                        placeholder="#"
                        value={moveDrafts[b.id] ?? ""}
                        onChange={(e) => setMoveDrafts((d) => ({ ...d, [b.id]: e.target.value }))}
                        style={{
                          width: 42,
                          padding: "3px 4px",
                          borderRadius: 5,
                          border: `1px solid ${COLORS.parchmentDeep}`,
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 11,
                        }}
                      />
                      <button
                        onClick={() => {
                          const val = parseInt(moveDrafts[b.id], 10);
                          if (Number.isFinite(val)) {
                            onMove(b.id, val);
                            setMoveDrafts((d) => ({ ...d, [b.id]: "" }));
                          }
                        }}
                        style={{
                          background: "transparent",
                          border: `1px solid ${COLORS.brass}`,
                          color: COLORS.brass,
                          borderRadius: 5,
                          padding: "3px 6px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Go
                      </button>
                    </div>
                    )}
                  </td>
                  <td style={{ padding: "6px 6px", whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 90 }}>
                        {editError && <span style={{ color: COLORS.clay, fontSize: 10.5 }}>{editError}</span>}
                        <span style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => saveEdit(b.id)}
                            style={{ background: COLORS.lawn, color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{ background: "transparent", color: COLORS.slate, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                          >
                            Cancel
                          </button>
                        </span>
                      </div>
                    ) : confirmDeleteId === b.id ? (
                      <span style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => { onDelete(b.id); setConfirmDeleteId(null); }}
                          style={{ background: COLORS.clay, color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ background: "transparent", color: COLORS.slate, border: `1px solid ${COLORS.parchmentDeep}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <span style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => startEdit(b)}
                          style={{ background: "transparent", color: COLORS.lawn, border: `1px solid ${COLORS.lawn}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(b.id)}
                          style={{ background: "transparent", color: COLORS.clay, border: `1px solid ${COLORS.clay}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderOfMeritView({ standings, recentEntries, settings }) {
  const typeLabels = {
    challenge: "Challenge issued",
    win: "Win",
    loss: "Loss",
    bonus: "Bonus",
    inactivity: "Inactivity penalty",
  };

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          background: "rgba(244,239,226,0.08)",
          border: `1px solid rgba(216,178,110,0.35)`,
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12.5,
          color: COLORS.parchment,
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        <strong style={{ color: COLORS.brassLight }}>Scoring:</strong> issuing a challenge is{" "}
        {settings.oomChallengePoints} point{Math.abs(settings.oomChallengePoints) === 1 ? "" : "s"}, a win is{" "}
        {settings.oomWinPoints} point{Math.abs(settings.oomWinPoints) === 1 ? "" : "s"}, a loss is{" "}
        {settings.oomLosePoints} point{Math.abs(settings.oomLosePoints) === 1 ? "" : "s"}. Going{" "}
        {settings.oomInactivityDays} days without issuing a challenge costs{" "}
        {settings.oomInactivityPenalty} points. Admins can also award bonus points.
      </div>

      <div
        style={{
          background: COLORS.parchment,
          borderRadius: 16,
          padding: "10px 8px",
          border: `1px solid ${COLORS.parchmentDeep}`,
          marginBottom: 18,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif", fontSize: 12.5 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.lawn}` }}>
                <th style={{ padding: "8px 6px" }}>#</th>
                <th style={{ padding: "8px 6px" }}>Name</th>
                <th style={{ padding: "8px 6px" }}>Points</th>
                <th style={{ padding: "8px 6px" }}>W</th>
                <th style={{ padding: "8px 6px" }}>L</th>
                <th style={{ padding: "8px 6px" }}>C</th>
                <th style={{ padding: "8px 6px" }}>B</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${COLORS.parchmentDeep}` }}>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>{i + 1}</td>
                  <td style={{ padding: "7px 6px", fontWeight: 600, color: COLORS.ink }}>{displayName(b)}</td>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: COLORS.lawnDark }}>
                    {b.points}
                  </td>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>{b.breakdown.win}</td>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>{b.breakdown.loss}</td>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>{b.breakdown.challenge}</td>
                  <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>{b.breakdown.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "8px 10px 2px", fontSize: 10.5, color: COLORS.slate }}>
          W = wins · L = losses · C = challenges issued · B = bonus awards
        </div>
      </div>

      {recentEntries.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: COLORS.parchment, margin: "0 0 10px" }}>
            Recent points
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentEntries.map((e) => (
              <div
                key={e.id}
                style={{
                  background: COLORS.parchment,
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: COLORS.ink,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>
                  <strong>{displayName(e.bowler)}</strong> — {typeLabels[e.type] || e.type}
                  {e.note ? ` (${e.note})` : ""}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    color: e.points >= 0 ? COLORS.lawnDark : COLORS.clay,
                    flexShrink: 0,
                  }}
                >
                  {e.points > 0 ? "+" : ""}{e.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GreenBookingsView({ bookings }) {
  const withDate = bookings.filter((b) => b.proposedDate);
  const withoutDate = bookings.filter((b) => !b.proposedDate);

  const byDate = {};
  for (const b of withDate) {
    if (!byDate[b.proposedDate]) byDate[b.proposedDate] = [];
    byDate[b.proposedDate].push(b);
  }
  const sortedDates = Object.keys(byDate).sort();

  for (const d of sortedDates) {
    byDate[d].sort((a, b) => (a.proposedTime || "").localeCompare(b.proposedTime || ""));
  }

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          background: "rgba(244,239,226,0.08)",
          border: `1px solid rgba(216,178,110,0.35)`,
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12.5,
          color: COLORS.parchment,
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        Every scheduled challenge, grouped by day, so it's easy to see how many
        greens to prepare. Read-only — no login needed.
      </div>

      {bookings.length === 0 ? (
        <div
          style={{
            background: COLORS.parchment,
            borderRadius: 12,
            padding: "16px 14px",
            textAlign: "center",
            color: COLORS.slate,
            fontSize: 13,
          }}
        >
          No matches currently scheduled.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sortedDates.map((date) => (
            <div key={date}>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 15,
                  color: COLORS.parchment,
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span>{formatDateNice(date)}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: COLORS.brassLight }}>
                  {byDate[date].length} match{byDate[date].length === 1 ? "" : "es"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {byDate[date].map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: COLORS.parchment,
                      borderRadius: 10,
                      padding: "9px 12px",
                      border: `1px solid ${COLORS.parchmentDeep}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: 13, color: COLORS.ink, fontWeight: 600 }}>
                      {displayName(b.challenger)} vs {displayName(b.opponent)}
                    </span>
                    <span style={{ fontSize: 12, color: COLORS.slate, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {b.proposedTime ? formatTimeNice(b.proposedTime) : "Time TBC"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {withoutDate.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 15,
                  color: COLORS.parchment,
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span>Date not set yet</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: COLORS.brassLight }}>
                  {withoutDate.length} match{withoutDate.length === 1 ? "" : "es"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {withoutDate.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: COLORS.parchment,
                      borderRadius: 10,
                      padding: "9px 12px",
                      border: `1px solid ${COLORS.parchmentDeep}`,
                    }}
                  >
                    <span style={{ fontSize: 13, color: COLORS.ink, fontWeight: 600 }}>
                      {displayName(b.challenger)} vs {displayName(b.opponent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const {
    ladder, challenges, myId, isAdmin, settings, oomLedger, oomTracking, ready, err, setErr,
    loadAll, persistLadder, persistChallenges, persistMyId, persistIsAdmin, persistSettings,
    persistOomLedger, persistOomTracking,
  } = usePersisted();

  const [search, setSearch] = useState("");
  const [showIdentity, setShowIdentity] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(15);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [composerTarget, setComposerTarget] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleDraft, setScheduleDraft] = useState({ date: "", time: "" });
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [mainView, setMainView] = useState("ladder");

  const showToast = (message, kind = "ok") => setToast({ message, kind, key: Date.now() });

  const myIndex = useMemo(() => {
    if (!ladder || !myId) return -1;
    return ladder.findIndex((b) => b.id === myId);
  }, [ladder, myId]);

  const myPosition = myIndex >= 0 ? myIndex + 1 : -1;

  useEffect(() => {
    if (ready && ladder && myId && myIndex === -1) {
      setShowIdentity(true);
    }
  }, [ready, ladder, myId, myIndex]);

  const eligibleIds = useMemo(() => {
    if (!ladder || myPosition < 0) return new Set();
    return new Set(eligibleOpponentIndexes(myPosition, settings).map((i) => ladder[i].id));
  }, [ladder, myPosition, settings]);

  const myActiveChallenge = useMemo(() => {
    if (!challenges || !myId) return null;
    return challenges.find(
      (c) => c.status === "pending" && (c.challengerId === myId || c.opponentId === myId)
    );
  }, [challenges, myId]);

  const idInAnyPending = useCallback(
    (id) => (challenges || []).some((c) => c.status === "pending" && (c.challengerId === id || c.opponentId === id)),
    [challenges]
  );

  const filteredLadder = useMemo(() => {
    if (!ladder) return [];
    const s = search.trim().toLowerCase();
    if (!s) return ladder.map((b, i) => ({ ...b, position: i + 1 }));
    return ladder
      .map((b, i) => ({ ...b, position: i + 1 }))
      .filter((b) => `${b.name} ${b.surname}`.toLowerCase().includes(s));
  }, [ladder, search]);

  const pendingChallenges = useMemo(() => {
    if (!challenges || !ladder) return [];
    return challenges
      .filter((c) => c.status === "pending")
      .map((c) => {
        const cIdx = ladder.findIndex((b) => b.id === c.challengerId);
        const oIdx = ladder.findIndex((b) => b.id === c.opponentId);
        return {
          ...c,
          challenger: cIdx >= 0 ? { ...ladder[cIdx], position: cIdx + 1 } : null,
          opponent: oIdx >= 0 ? { ...ladder[oIdx], position: oIdx + 1 } : null,
        };
      })
      .filter((c) => c.challenger && c.opponent)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [challenges, ladder]);

  const historyChallenges = useMemo(() => {
    if (!challenges || !ladder) return [];
    return challenges
      .filter((c) => c.status === "completed")
      .map((c) => {
        const challengerBowler = ladder.find((b) => b.id === c.challengerId);
        const opponentBowler = ladder.find((b) => b.id === c.opponentId);
        const winnerBowler = ladder.find((b) => b.id === c.winnerId);
        const loserId = c.winnerId === c.challengerId ? c.opponentId : c.challengerId;
        const loserBowler = ladder.find((b) => b.id === loserId);
        const upsetWin = c.winnerId === c.challengerId;
        return {
          ...c,
          challengerBowler,
          opponentBowler,
          winnerBowler,
          loserBowler,
          upsetWin,
        };
      })
      .filter((c) => c.challengerBowler && c.opponentBowler && c.winnerBowler)
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [challenges, ladder]);

  const oomStandings = useMemo(() => {
    if (!ladder || !oomLedger) return [];
    const totals = {};
    const breakdown = {};
    for (const entry of oomLedger) {
      totals[entry.bowlerId] = (totals[entry.bowlerId] || 0) + entry.points;
      if (!breakdown[entry.bowlerId]) breakdown[entry.bowlerId] = { challenge: 0, win: 0, loss: 0, bonus: 0, inactivity: 0 };
      if (breakdown[entry.bowlerId][entry.type] !== undefined) {
        breakdown[entry.bowlerId][entry.type] += 1;
      }
    }
    return ladder
      .map((b) => ({
        ...b,
        points: totals[b.id] || 0,
        breakdown: breakdown[b.id] || { challenge: 0, win: 0, loss: 0, bonus: 0, inactivity: 0 },
      }))
      .sort((a, b) => b.points - a.points || a.surname.localeCompare(b.surname));
  }, [ladder, oomLedger]);

  const recentOomEntries = useMemo(() => {
    if (!oomLedger || !ladder) return [];
    return [...oomLedger]
      .sort((a, b) => b.at - a.at)
      .slice(0, 40)
      .map((e) => ({ ...e, bowler: ladder.find((b) => b.id === e.bowlerId) }))
      .filter((e) => e.bowler);
  }, [oomLedger, ladder]);

  const handlePickIdentity = async (id) => {
    await persistMyId(id);
    setShowIdentity(false);
    const b = ladder.find((x) => x.id === id);
    showToast(`You're set up as ${displayName(b)}.`);
  };

  const issueChallenge = async (opponentId, details = {}) => {
    if (!myId) {
      setShowIdentity(true);
      return;
    }
    if (myActiveChallenge) {
      showToast("You already have a challenge in progress.", "error");
      return;
    }
    if (idInAnyPending(opponentId)) {
      showToast("That bowler already has a challenge in progress.", "error");
      return;
    }
    setBusy(true);
    const opponentPosition = ladder.findIndex((x) => x.id === opponentId) + 1;
    const opp = ladder.find((x) => x.id === opponentId);
    const next = [
      ...(challenges || []),
      {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        challengerId: myId,
        opponentId,
        status: "pending",
        createdAt: Date.now(),
        challengerPosition: myPosition,
        opponentPosition,
        proposedDate: details.dateISO || null,
        proposedTime: details.time || null,
      },
    ];
    await persistChallenges(next);

    // Activity tracking for the inactivity penalty resets here (issuing a
    // challenge counts as "active"), but the Order of Merit points for
    // issuing/winning/losing are only awarded once the match is actually
    // completed — see recordResult. That way a cancelled challenge never
    // earned any points in the first place, so there's nothing to reverse.
    const nowTs = Date.now();
    const nextTracking = {
      ...(oomTracking || {}),
      [myId]: { ...(oomTracking?.[myId] || {}), lastActiveAt: nowTs, lastPenaltyAppliedAt: nowTs },
    };
    await persistOomTracking(nextTracking);

    setBusy(false);
    setComposerTarget(null);

    if (details.sendWhatsApp) {
      const number = toWhatsAppNumber(opp.cell);
      if (number) {
        const msg = details.message || buildChallengeWhatsAppMessage({
          meBowler: ladder[myIndex], opponentBowler: opp, myPosition, opponentPosition,
          dateISO: details.dateISO, time: details.time,
        });
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
      }
    }
    showToast(`Challenge issued to ${displayName(opp)}. Get the game arranged!`);
  };

  const recordResult = async (challenge, winnerId) => {
    setBusy(true);
    const ladderCopy = ladder.map((b) => ({ ...b }));
    const cIdx = ladderCopy.findIndex((b) => b.id === challenge.challengerId);
    const oIdx = ladderCopy.findIndex((b) => b.id === challenge.opponentId);

    let newLadder = ladderCopy;
    // The challenger only takes the opponent's spot if the challenger wins
    // AND the opponent was genuinely ranked ahead of them (lower index = better).
    if (winnerId === challenge.challengerId && cIdx > oIdx && cIdx >= 0 && oIdx >= 0) {
      const [mover] = ladderCopy.splice(cIdx, 1);
      mover.movement = "up";
      ladderCopy.splice(oIdx, 0, mover);
      for (let i = oIdx + 1; i <= cIdx; i++) {
        ladderCopy[i] = { ...ladderCopy[i], movement: "down" };
      }
      newLadder = ladderCopy;
    }

    const newChallenges = (challenges || []).map((c) =>
      c.id === challenge.id
        ? { ...c, status: "completed", winnerId, completedAt: Date.now() }
        : c
    );

    await persistLadder(newLadder);
    await persistChallenges(newChallenges);

    const loserId = winnerId === challenge.challengerId ? challenge.opponentId : challenge.challengerId;
    const nowTs = Date.now();
    const challengerBowler = ladder.find((b) => b.id === challenge.challengerId);
    const opponentBowler = ladder.find((b) => b.id === challenge.opponentId);
    const nextLedger = [
      ...(oomLedger || []),
      {
        id: `oom-${nowTs}-${Math.random().toString(36).slice(2, 7)}c`,
        bowlerId: challenge.challengerId,
        points: settings.oomChallengePoints,
        type: "challenge",
        note: `Challenged ${displayName(opponentBowler || { name: "", surname: "" })}`.trim(),
        at: nowTs,
      },
      {
        id: `oom-${nowTs}-${Math.random().toString(36).slice(2, 7)}w`,
        bowlerId: winnerId,
        points: settings.oomWinPoints,
        type: "win",
        note: "Won a challenge match",
        at: nowTs,
      },
      {
        id: `oom-${nowTs}-${Math.random().toString(36).slice(2, 7)}l`,
        bowlerId: loserId,
        points: settings.oomLosePoints,
        type: "loss",
        note: "Lost a challenge match",
        at: nowTs,
      },
    ];
    await persistOomLedger(nextLedger);

    setBusy(false);

    const winner = ladder.find((b) => b.id === winnerId);
    showToast(`Result recorded \u2014 ${displayName(winner)} moves up!`);
  };

  const sendReminderWhatsApp = (fromBowler, toBowler, proposedDate, proposedTime) => {
    const number = toWhatsAppNumber(toBowler.cell);
    if (!number) {
      showToast("No cell number on file for that bowler.", "error");
      return;
    }
    const msg = buildReminderWhatsAppMessage({
      meBowler: fromBowler, otherBowler: toBowler, dateISO: proposedDate, time: proposedTime,
    });
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const canEditSchedule = (challenge) =>
    isAdmin || myId === challenge.challengerId || myId === challenge.opponentId;

  const startEditingSchedule = (challenge) => {
    setEditingScheduleId(challenge.id);
    setScheduleDraft({
      date: challenge.proposedDate || todayISO(),
      time: challenge.proposedTime || defaultTimeHHMM(),
    });
  };

  const saveSchedule = async (challengeId) => {
    const next = (challenges || []).map((c) =>
      c.id === challengeId
        ? { ...c, proposedDate: scheduleDraft.date || null, proposedTime: scheduleDraft.time || null }
        : c
    );
    await persistChallenges(next);
    setEditingScheduleId(null);
    showToast("Match details updated.");
  };

  const cancelChallenge = async (challengeId) => {
    const next = (challenges || []).filter((c) => c.id !== challengeId);
    await persistChallenges(next);
    setConfirmCancelId(null);
    showToast("Challenge cancelled. Both bowlers are free to challenge again.");
  };

  const handleAdminUnlock = async () => {
    await persistIsAdmin(true);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
    showToast("Admin access unlocked on this device.");
  };

  const handleAdminLock = async () => {
    await persistIsAdmin(false);
    setShowAdminPanel(false);
    showToast("Admin access locked.");
  };

  const addPlayer = async (data) => {
    const id = `new-${Date.now()}-${data.surname}-${data.name}`.replace(/[^a-zA-Z0-9_-]/g, "_");
    const entry = {
      id,
      name: data.name,
      surname: data.surname,
      cell: data.cell || "",
      grade: data.grade || "",
      hcap: Number.isFinite(data.hcap) ? data.hcap : 0,
      years: Number.isFinite(data.years) ? data.years : 0,
    };
    const next = [...ladder];
    let insertAt = next.length;
    if (data.position && data.position >= 1 && data.position <= next.length + 1) {
      insertAt = data.position - 1;
    }
    next.splice(insertAt, 0, entry);
    await persistLadder(next);
    showToast(`${displayName(entry)} added to the ladder at #${insertAt + 1}.`);
  };

  const deletePlayer = async (id) => {
    const removed = ladder.find((b) => b.id === id);
    const next = ladder.filter((b) => b.id !== id);
    await persistLadder(next);
    if (myId === id) {
      await persistMyId(null);
      showToast(`${removed ? displayName(removed) : "That bowler"} removed. Please re-select who you are.`);
      setShowAdminPanel(false);
      setShowIdentity(true);
    } else {
      showToast(`${removed ? displayName(removed) : "Bowler"} removed from the ladder.`);
    }
  };

  const movePlayer = async (id, newPosition) => {
    const idx = ladder.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const clampedTarget = Math.max(1, Math.min(ladder.length, Math.round(newPosition)));
    const targetIdx = clampedTarget - 1;
    if (targetIdx === idx) return;
    const next = [...ladder];
    const [mover] = next.splice(idx, 1);
    next.splice(targetIdx, 0, mover);
    await persistLadder(next);
    showToast(`${displayName(mover)} moved to #${targetIdx + 1}.`);
  };

  const editPlayer = async (id, updates) => {
    const next = ladder.map((b) => (b.id === id ? { ...b, ...updates } : b));
    await persistLadder(next);
    showToast(`${displayName(updates)} updated.`);
  };

  const importJoinDates = async (matched) => {
    const byId = new Map(matched.map((m) => [m.id, m.dateISO]));
    const next = ladder.map((b) => (byId.has(b.id) ? { ...b, joinDate: byId.get(b.id) } : b));
    await persistLadder(next);
    showToast(`Registration date set for ${matched.length} bowler${matched.length === 1 ? "" : "s"}.`);
  };

  const importLadder = async (nextLadder) => {
    const stillHereIds = new Set(nextLadder.map((b) => b.id));
    await persistLadder(nextLadder);
    if (myId && !stillHereIds.has(myId)) {
      await persistMyId(null);
      showToast("Ladder synced. You're no longer on the list \u2014 please re-select who you are.");
      setShowAdminPanel(false);
      setShowIdentity(true);
    } else {
      showToast("Ladder synced from the official list.");
    }
  };

  const handleSaveSettings = async (next) => {
    await persistSettings(next);
    showToast(
      `Challenge rules updated: top ${next.topThreshold} may challenge ${next.topLimit} up, everyone else ${next.standardLimit} up.`
    );
  };

  const awardBonusPoints = async (bowlerId, points, note) => {
    const bowler = ladder.find((b) => b.id === bowlerId);
    if (!bowler) return;
    const nowTs = Date.now();
    const nextLedger = [
      ...(oomLedger || []),
      {
        id: `oom-${nowTs}-${Math.random().toString(36).slice(2, 7)}`,
        bowlerId,
        points,
        type: "bonus",
        note: note || "Bonus points",
        at: nowTs,
      },
    ];
    await persistOomLedger(nextLedger);
    showToast(`${points > 0 ? "+" : ""}${points} bonus point${Math.abs(points) === 1 ? "" : "s"} for ${displayName(bowler)}.`);
  };

  const deleteOomEntry = async (entryId) => {
    const next = (oomLedger || []).filter((e) => e.id !== entryId);
    await persistOomLedger(next);
    showToast("Order of Merit entry removed.");
  };

  if (!ready) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif", color: COLORS.slate }}>
        <style>{FONT_IMPORT}</style>
        <img src={LOGO_SRC} alt="RCB logo" style={{ width: 64, height: 64, marginBottom: 12, opacity: 0.85 }} />
        <div>Loading the ladder...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.lawn,
        minHeight: "100%",
        color: COLORS.ink,
        paddingBottom: 40,
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        ::selection { background: ${COLORS.brassLight}; }
        .rung { position: relative; }
        .rung::before {
          content: "";
          position: absolute;
          left: 19px;
          top: -8px;
          bottom: -8px;
          width: 2px;
          background: repeating-linear-gradient(
            to bottom,
            ${COLORS.rail} 0px,
            ${COLORS.rail} 3px,
            transparent 3px,
            transparent 7px
          );
          z-index: 0;
        }
        .rung:first-child::before { top: 20px; }
      `}</style>

      {showIdentity && (
        <IdentityPicker
          ladder={ladder}
          onPick={handlePickIdentity}
          cancelable={!!myId}
          onCancel={() => setShowIdentity(false)}
        />
      )}
      {composerTarget && myIndex >= 0 && (
        <ChallengeComposer
          meBowler={ladder[myIndex]}
          opponentBowler={composerTarget}
          myPosition={myPosition}
          opponentPosition={composerTarget.position}
          onCancel={() => setComposerTarget(null)}
          onConfirm={(details) => issueChallenge(composerTarget.id, details)}
        />
      )}
      {showAdminLogin && (
        <AdminLogin
          onUnlock={handleAdminUnlock}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminPanel && isAdmin && (
        <AdminPanel
          ladder={ladder}
          settings={settings}
          oomLedger={oomLedger}
          onAdd={addPlayer}
          onDelete={deletePlayer}
          onEdit={editPlayer}
          onImport={importLadder}
          onImportJoinDates={importJoinDates}
          onSaveSettings={handleSaveSettings}
          onMove={movePlayer}
          onAwardBonus={awardBonusPoints}
          onDeleteOomEntry={deleteOomEntry}
          onClose={() => setShowAdminPanel(false)}
          onLock={handleAdminLock}
        />
      )}
      <Toast message={toast?.message} kind={toast?.kind} onClose={() => setToast(null)} />

      {/* Sticky action bar — Admin and identity stay reachable no matter how far you scroll */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: COLORS.lawnDark,
          borderBottom: `1px solid rgba(111,199,186,0.35)`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <img src={LOGO_SRC} alt="RCB logo" style={{ width: 26, height: 26, flexShrink: 0 }} />
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 14.5,
              color: COLORS.parchment,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            RCB Ladder Challenge
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => (isAdmin ? setShowAdminPanel(true) : setShowAdminLogin(true))}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: isAdmin ? COLORS.parchment : COLORS.lawnDark,
              background: isAdmin ? "rgba(255,255,255,0.15)" : COLORS.parchment,
              border: isAdmin ? `1px solid ${COLORS.brassLight}` : "none",
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isAdmin ? "Manage players" : "Admin"}
          </button>
          <button
            onClick={() => setShowIdentity(true)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.lawnDark,
              background: COLORS.brassLight,
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {myId ? "Switch bowler" : "Who am I?"}
          </button>
        </div>
      </div>

      {/* Header plaque */}
      <div
        style={{
          background: `linear-gradient(160deg, ${COLORS.lawnDark}, ${COLORS.lawn} 60%)`,
          borderBottom: `4px solid ${COLORS.brass}`,
          padding: "26px 20px 20px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={LOGO_SRC}
              alt="RCB logo"
              style={{ width: 48, height: 48, flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
            />
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "clamp(26px, 6vw, 34px)",
                color: COLORS.parchment,
                margin: 0,
                letterSpacing: 0.2,
              }}
            >
              RCB Ladder Challenge
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              color: COLORS.brassLight,
              fontSize: 14.5,
              margin: "6px 0 14px",
            }}
          >
            {ladder.length} bowlers. One rail. Climb it a rung at a time.
          </p>
          <div
            style={{
              background: "rgba(244,239,226,0.08)",
              border: `1px solid rgba(216,178,110,0.35)`,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12.5,
              color: COLORS.parchment,
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: COLORS.brassLight }}>Challenge rule:</strong> anyone
            outside the top {settings.topThreshold} may challenge up to {settings.standardLimit} place{settings.standardLimit === 1 ? "" : "s"} above them. Inside
            the top {settings.topThreshold}, you may only challenge the bowler {settings.topLimit} place{settings.topLimit === 1 ? "" : "s"} above.
          </div>
          {myId && myPosition > 0 && (
            <div style={{ marginTop: 10, fontSize: 13, color: COLORS.parchment }}>
              You're <strong>#{myPosition}</strong> — {displayName(ladder[myIndex])}
              {myActiveChallenge && (
                <span style={{ color: COLORS.brassLight }}> · challenge in progress</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "18px 16px 0" }}>
        {err && (
          <div
            style={{
              background: COLORS.clayLight,
              border: `1px solid ${COLORS.clay}`,
              color: COLORS.clay,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {err}{" "}
            <button
              onClick={() => { setErr(null); loadAll(); }}
              style={{ marginLeft: 8, textDecoration: "underline", background: "none", border: "none", color: COLORS.clay, cursor: "pointer" }}
            >
              retry
            </button>
          </div>
        )}

        {/* Ladder / Order of Merit toggle */}
        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
          <button
            onClick={() => setMainView("ladder")}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: mainView === "ladder" ? COLORS.brass : "rgba(255,255,255,0.12)",
              color: mainView === "ladder" ? "#fff" : COLORS.parchment,
              fontFamily: "'Fraunces', serif",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ladder
          </button>
          <button
            onClick={() => setMainView("oom")}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: mainView === "oom" ? COLORS.brass : "rgba(255,255,255,0.12)",
              color: mainView === "oom" ? "#fff" : COLORS.parchment,
              fontFamily: "'Fraunces', serif",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Order of Merit
          </button>
          <button
            onClick={() => setMainView("greens")}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: mainView === "greens" ? COLORS.brass : "rgba(255,255,255,0.12)",
              color: mainView === "greens" ? "#fff" : COLORS.parchment,
              fontFamily: "'Fraunces', serif",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Green Bookings
          </button>
        </div>

        {mainView === "oom" && (
          <OrderOfMeritView standings={oomStandings} recentEntries={recentOomEntries} settings={settings} />
        )}

        {mainView === "greens" && (
          <GreenBookingsView bookings={pendingChallenges} />
        )}

        {mainView === "ladder" && (
        <>
        {/* Pending challenges */}
        {pendingChallenges.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18,
                color: COLORS.parchment,
                margin: "0 0 10px",
              }}
            >
              On the rail right now
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingChallenges.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: COLORS.parchment,
                    borderRadius: 12,
                    padding: "12px 14px",
                    border: `1px solid ${COLORS.parchmentDeep}`,
                  }}
                >
                  <div style={{ fontSize: 13.5, marginBottom: 8 }}>
                    <strong>#{c.challenger.position} {displayName(c.challenger)}</strong>
                    {" "}challenges{" "}
                    <strong>#{c.opponent.position} {displayName(c.opponent)}</strong>
                  </div>
                  {(c.proposedDate || c.proposedTime) && editingScheduleId !== c.id && (
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.lawnDark,
                        fontFamily: "'IBM Plex Mono', monospace",
                        marginBottom: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        Proposed: {c.proposedDate ? formatDateNice(c.proposedDate) : ""}
                        {c.proposedTime ? ` at ${formatTimeNice(c.proposedTime)}` : ""}
                      </span>
                      {canEditSchedule(c) && (
                        <button
                          onClick={() => startEditingSchedule(c)}
                          style={{
                            border: "none",
                            background: "none",
                            color: COLORS.brass,
                            textDecoration: "underline",
                            fontSize: 11.5,
                            fontFamily: "'Inter', sans-serif",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  )}
                  {!(c.proposedDate || c.proposedTime) && editingScheduleId !== c.id && canEditSchedule(c) && (
                    <button
                      onClick={() => startEditingSchedule(c)}
                      style={{
                        border: "none",
                        background: "none",
                        color: COLORS.brass,
                        textDecoration: "underline",
                        fontSize: 11.5,
                        fontFamily: "'Inter', sans-serif",
                        cursor: "pointer",
                        padding: 0,
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      Set a date/time
                    </button>
                  )}
                  {editingScheduleId === c.id && (
                    <div
                      style={{
                        background: COLORS.parchmentDeep,
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="date"
                          value={scheduleDraft.date}
                          onChange={(e) => setScheduleDraft((d) => ({ ...d, date: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: `1.5px solid ${COLORS.parchment}`,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 12,
                          }}
                        />
                        <input
                          type="time"
                          value={scheduleDraft.time}
                          onChange={(e) => setScheduleDraft((d) => ({ ...d, time: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: `1.5px solid ${COLORS.parchment}`,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 12,
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => saveSchedule(c.id)}
                          style={{
                            flex: 1,
                            padding: "6px 0",
                            borderRadius: 6,
                            border: "none",
                            background: COLORS.lawn,
                            color: COLORS.parchment,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingScheduleId(null)}
                          style={{
                            flex: 1,
                            padding: "6px 0",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.slate}`,
                            background: "transparent",
                            color: COLORS.slate,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <button
                      onClick={() => sendReminderWhatsApp(c.challenger, c.opponent, c.proposedDate, c.proposedTime)}
                      style={{
                        flex: "1 1 auto",
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #25D366",
                        background: "transparent",
                        color: "#128C7E",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Nudge {c.opponent.name} on WhatsApp
                    </button>
                    <button
                      onClick={() => sendReminderWhatsApp(c.opponent, c.challenger, c.proposedDate, c.proposedTime)}
                      style={{
                        flex: "1 1 auto",
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #25D366",
                        background: "transparent",
                        color: "#128C7E",
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Nudge {c.challenger.name} on WhatsApp
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      disabled={busy}
                      onClick={() => recordResult(c, c.challenger.id)}
                      style={{
                        flex: "1 1 auto",
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.lawn}`,
                        background: COLORS.lawn,
                        color: COLORS.parchment,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {c.challenger.name} won
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => recordResult(c, c.opponent.id)}
                      style={{
                        flex: "1 1 auto",
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.slate}`,
                        background: "transparent",
                        color: COLORS.ink,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {c.opponent.name} won
                    </button>
                  </div>
                  {canEditSchedule(c) && (
                    <div style={{ marginTop: 8 }}>
                      {confirmCancelId === c.id ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            disabled={busy}
                            onClick={() => cancelChallenge(c.id)}
                            style={{
                              flex: 1,
                              padding: "6px 0",
                              borderRadius: 8,
                              border: "none",
                              background: COLORS.clay,
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Confirm cancel
                          </button>
                          <button
                            onClick={() => setConfirmCancelId(null)}
                            style={{
                              flex: 1,
                              padding: "6px 0",
                              borderRadius: 8,
                              border: `1px solid ${COLORS.slate}`,
                              background: "transparent",
                              color: COLORS.slate,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            Keep challenge
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmCancelId(c.id)}
                          style={{
                            border: "none",
                            background: "none",
                            color: COLORS.slate,
                            textDecoration: "underline",
                            fontSize: 11.5,
                            fontFamily: "'Inter', sans-serif",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Cancel this challenge
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match history */}
        <div style={{ marginBottom: 22 }}>
          <button
            onClick={() => setShowHistory((s) => !s)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(111,199,186,0.35)`,
              borderRadius: 10,
              padding: "10px 14px",
              cursor: "pointer",
              color: COLORS.parchment,
              fontFamily: "'Fraunces', serif",
              fontSize: 16,
            }}
          >
            <span>Match history{historyChallenges.length > 0 ? ` (${historyChallenges.length})` : ""}</span>
            <span style={{ fontSize: 13, color: COLORS.brassLight }}>{showHistory ? "Hide \u25B4" : "Show \u25BE"}</span>
          </button>

          {showHistory && (
            <div style={{ marginTop: 10 }}>
              {historyChallenges.length === 0 ? (
                <div
                  style={{
                    background: COLORS.parchment,
                    borderRadius: 12,
                    padding: "16px 14px",
                    textAlign: "center",
                    color: COLORS.slate,
                    fontSize: 13,
                  }}
                >
                  No results recorded yet. Once a challenge is played, it'll show up here.
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {historyChallenges.slice(0, historyLimit).map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: COLORS.parchment,
                          borderRadius: 12,
                          padding: "11px 14px",
                          border: `1px solid ${COLORS.parchmentDeep}`,
                        }}
                      >
                        <div style={{ fontSize: 13, color: COLORS.ink }}>
                          <strong>{displayName(c.winnerBowler)}</strong> beat{" "}
                          <strong>{displayName(c.loserBowler)}</strong>
                          {c.upsetWin ? (
                            <span>
                              {" "}
                              — moved from #{c.challengerPosition ?? "?"} up to #{c.opponentPosition ?? "?"}
                            </span>
                          ) : (
                            <span> — held #{c.opponentPosition ?? "?"}</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.slate, marginTop: 3, fontFamily: "'IBM Plex Mono', monospace" }}>
                          {formatDateTime(c.completedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {historyChallenges.length > historyLimit && (
                    <button
                      onClick={() => setHistoryLimit((n) => n + 15)}
                      style={{
                        marginTop: 10,
                        width: "100%",
                        padding: "9px 0",
                        background: "transparent",
                        border: `1px solid rgba(111,199,186,0.35)`,
                        borderRadius: 8,
                        color: COLORS.parchment,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      Show more
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Toolbar: search + view toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the ladder..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              background: "rgba(255,255,255,0.92)",
              color: COLORS.ink,
            }}
          />
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "0 12px",
                border: "none",
                background: viewMode === "table" ? COLORS.brass : "rgba(255,255,255,0.75)",
                color: viewMode === "table" ? "#fff" : COLORS.ink,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              style={{
                padding: "0 12px",
                border: "none",
                background: viewMode === "cards" ? COLORS.brass : "rgba(255,255,255,0.75)",
                color: viewMode === "cards" ? "#fff" : COLORS.ink,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Ladder */}
        <div
          style={{
            background: COLORS.parchment,
            borderRadius: 16,
            padding: viewMode === "table" ? "10px 8px" : "16px 14px",
            border: `1px solid ${COLORS.parchmentDeep}`,
          }}
        >
          {viewMode === "table" ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.lawn}` }}>
                    <th style={{ padding: "8px 6px" }}>#</th>
                    <th style={{ padding: "8px 6px" }}>Name</th>
                    <th style={{ padding: "8px 6px" }}>Grade</th>
                    <th style={{ padding: "8px 6px" }}>Cell</th>
                    <th style={{ padding: "8px 6px" }}>Hcap</th>
                    <th style={{ padding: "8px 6px" }}>Years</th>
                    <th style={{ padding: "8px 6px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLadder.map((b) => {
                    const isMe = b.id === myId;
                    const canChallenge = myId && !isMe && eligibleIds.has(b.id) && !myActiveChallenge && !idInAnyPending(b.id);
                    return (
                      <tr
                        key={b.id}
                        style={{
                          borderBottom: `1px solid ${COLORS.parchmentDeep}`,
                          background: isMe ? "rgba(42,157,143,0.10)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace", color: COLORS.slate }}>
                          {b.position}
                        </td>
                        <td style={{ padding: "7px 6px", fontWeight: 600, color: COLORS.ink, whiteSpace: "nowrap" }}>
                          {displayName(b)} <MoveArrow movement={b.movement} />
                          {isMe && (
                            <span style={{ marginLeft: 6, fontSize: 10.5, color: COLORS.brass, fontWeight: 700 }}>
                              YOU
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "7px 6px" }}>{gradeLabel(b.grade)}</td>
                        <td style={{ padding: "7px 6px" }}><PhoneLink cell={b.cell} /></td>
                        <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{b.hcap}</td>
                        <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{formatYearsActive(b)}</td>
                        <td style={{ padding: "7px 6px" }}>
                          {canChallenge && (
                            <button
                              disabled={busy}
                              onClick={() => setComposerTarget(b)}
                              style={{
                                padding: "5px 9px",
                                borderRadius: 7,
                                border: "none",
                                background: COLORS.clay,
                                color: COLORS.parchment,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Challenge
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLadder.length === 0 && (
                <div style={{ textAlign: "center", padding: 24, color: COLORS.slate, fontSize: 13.5 }}>
                  No bowler matches that search.
                </div>
              )}
            </div>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredLadder.map((b) => {
              const isMe = b.id === myId;
              const canChallenge = myId && !isMe && eligibleIds.has(b.id) && !myActiveChallenge && !idInAnyPending(b.id);
              return (
                <div
                  key={b.id}
                  className="rung"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px 10px 4px",
                    borderRadius: 12,
                    background: isMe ? "rgba(184,135,74,0.14)" : "transparent",
                    border: isMe ? `1.5px solid ${COLORS.brass}` : "1.5px solid transparent",
                    zIndex: 1,
                  }}
                >
                  <BallBadge position={b.position} highlight={isMe} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink }}>
                        {displayName(b)}
                      </span>
                      <MoveArrow movement={b.movement} />
                      <GradeTag grade={b.grade} />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <PhoneLink cell={b.cell} />
                      <span style={{ fontSize: 11.5, color: COLORS.slate, fontFamily: "'IBM Plex Mono', monospace" }}>
                        hcap {b.hcap} · {formatYearsActive(b)}
                      </span>
                    </div>
                  </div>
                  {canChallenge && (
                    <button
                      disabled={busy}
                      onClick={() => setComposerTarget(b)}
                      style={{
                        flexShrink: 0,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: COLORS.clay,
                        color: COLORS.parchment,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: 0.3,
                      }}
                    >
                      Challenge
                    </button>
                  )}
                  {isMe && (
                    <span style={{ fontSize: 11, color: COLORS.brass, fontWeight: 700, flexShrink: 0 }}>
                      YOU
                    </span>
                  )}
                </div>
              );
            })}
            {filteredLadder.length === 0 && (
              <div style={{ textAlign: "center", padding: 24, color: COLORS.slate, fontSize: 13.5 }}>
                No bowler matches that search.
              </div>
            )}
          </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11.5, color: "rgba(244,239,226,0.55)" }}>
          Ladder updates are shared with every bowler using this app.
        </div>
        </>
        )}
      </div>
    </div>
  );
}
