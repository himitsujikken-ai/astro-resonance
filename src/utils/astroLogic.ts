export const charMap: Record<string, number> = {
    // あ行
    'あ': 261, 'い': 293, 'う': 329, 'え': 349, 'お': 392,
    // か行
    'か': 440, 'き': 493, 'く': 523, 'け': 587, 'こ': 659,
    // さ行
    'さ': 698, 'し': 783, 'す': 880, 'せ': 987, 'そ': 1046,
    // た行
    'た': 523, 'ち': 587, 'つ': 659, 'て': 698, 'と': 783,
    // な行
    'な': 880, 'に': 987, 'ぬ': 1046, 'ね': 1174, 'の': 1318,
    // は行
    'は': 349, 'ひ': 392, 'ふ': 440, 'へ': 493, 'ほ': 523,
    // ま行
    'ま': 587, 'み': 659, 'む': 698, 'め': 783, 'も': 880,
    // や行
    'や': 261, 'ゆ': 329, 'よ': 392,
    // ら行
    'ら': 783, 'り': 880, 'る': 987, 'れ': 1046, 'ろ': 1174,
    // わ行
    'わ': 523, 'を': 587,
    // ん (高音)
    'ん': 1975,
    // 濁点・半濁点対応
    'が': 440, 'ぎ': 493, 'ぐ': 523, 'げ': 587, 'ご': 659,
    'ざ': 698, 'じ': 783, 'ず': 880, 'ぜ': 987, 'ぞ': 1046,
    'だ': 523, 'ぢ': 587, 'づ': 659, 'で': 698, 'ど': 783,
    'ば': 349, 'び': 392, 'ぶ': 440, 'べ': 493, 'ぼ': 523,
    'ぱ': 349, 'ぴ': 392, 'ぷ': 440, 'ぺ': 493, 'ぽ': 523,
    'ゃ': 261, 'ゅ': 329, 'ょ': 392, 'っ': 1975
};

export const elementFreqs: Record<string, number> = { "木": 440, "火": 523, "土": 293, "金": 587, "水": 392 };

export interface SanmeigakuResult {
    myKan: string;
    myElement: string;
    guardianElement: string;
}

export function calculateSanmeigaku(dateStr: string): SanmeigakuResult {
    const jukkan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const gogyoMap: Record<string, string> = { "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水" };
    const guardianMap: Record<string, string> = { "木": "水", "火": "木", "土": "火", "金": "土", "水": "金" };

    const base = new Date(1900, 0, 1);
    const target = new Date(dateStr);

    // Calculate difference in days
    const diffTime = target.getTime() - base.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const myKan = jukkan[(diffDays + 10) % 60 % 10];
    const myElement = gogyoMap[myKan];

    return { myKan, myElement, guardianElement: guardianMap[myElement] };
}
