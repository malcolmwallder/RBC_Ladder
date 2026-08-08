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

const DEFAULT_SETTINGS = { topThreshold: 10, topLimit: 1, standardLimit: 5 };
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

  return {
    ladder, challenges, myId, isAdmin, settings, ready, err, setErr,
    loadAll, persistLadder, persistChallenges, persistMyId, persistIsAdmin, persistSettings,
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

function AdminPanel({ ladder, settings, onAdd, onDelete, onImport, onSaveSettings, onMove, onClose, onLock }) {
  const [form, setForm] = useState({
    name: "", surname: "", cell: "", grade: "", hcap: "", years: "", position: "",
  });
  const [formError, setFormError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [moveDrafts, setMoveDrafts] = useState({});
  const [showSync, setShowSync] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState(null);
  const [syncError, setSyncError] = useState("");
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
    onSaveSettings({ topThreshold, topLimit, standardLimit });
    setRulesSaved(true);
    setTimeout(() => setRulesSaved(false), 2500);
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
    });
    setForm({ name: "", surname: "", cell: "", grade: "", hcap: "", years: "", position: "" });
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
            <input placeholder="Years playing" type="number" step="0.1" value={form.years} onChange={(e) => updateField("years", e.target.value)} style={inputStyle} />
          </div>
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
              {ladder.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${COLORS.parchmentDeep}` }}>
                  <td style={{ padding: "6px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}</td>
                  <td style={{ padding: "6px 6px" }}>{displayName(b)}</td>
                  <td style={{ padding: "6px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{b.cell || "\u2014"}</td>
                  <td style={{ padding: "6px 6px" }}>{gradeLabel(b.grade)}</td>
                  <td style={{ padding: "6px 6px" }}>{b.hcap}</td>
                  <td style={{ padding: "6px 6px" }}>{b.years}</td>
                  <td style={{ padding: "6px 6px", whiteSpace: "nowrap" }}>
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
                  </td>
                  <td style={{ padding: "6px 6px", whiteSpace: "nowrap" }}>
                    {confirmDeleteId === b.id ? (
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
                      <button
                        onClick={() => setConfirmDeleteId(b.id)}
                        style={{ background: "transparent", color: COLORS.clay, border: `1px solid ${COLORS.clay}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    ladder, challenges, myId, isAdmin, settings, ready, err, setErr,
    loadAll, persistLadder, persistChallenges, persistMyId, persistIsAdmin, persistSettings,
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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [viewMode, setViewMode] = useState("table");

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
    setScheduleDraft({ date: challenge.proposedDate || todayISO(), time: challenge.proposedTime || defaultTimeHHMM() });
  };

  const saveSchedule = async (challengeId) => {
    const next = (challenges || []).map((c) =>
      c.id === challengeId
        ? { ...c, proposedDate: scheduleDraft.date || null, proposedTime: scheduleDraft.time || null }
        : c
    );
    await persistChallenges(next);
    setEditingScheduleId(null);
    showToast("Match date/time updated.");
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
          onAdd={addPlayer}
          onDelete={deletePlayer}
          onImport={importLadder}
          onSaveSettings={handleSaveSettings}
          onMove={movePlayer}
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
                        <td style={{ padding: "7px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{b.years}</td>
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
                        hcap {b.hcap} · {b.years}y
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
      </div>
    </div>
  );
}
