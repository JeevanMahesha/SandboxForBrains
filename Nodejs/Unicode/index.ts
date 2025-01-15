type TextStyle = "bold" | "italic" | "underline" | "bullet" | "code";

const textStyleMap: Record<TextStyle, (char: string) => string> = {
  bold: (char: string) => {
    const boldUppercase = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙";
    const boldLowercase = "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳";
    const boldNumbers = "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";

    if (char >= "A" && char <= "Z") {
      return boldUppercase[char.charCodeAt(0) - "A".charCodeAt(0)];
    }
    if (char >= "a" && char <= "z") {
      return boldLowercase[char.charCodeAt(0) - "a".charCodeAt(0)];
    }
    if (char >= "0" && char <= "9") {
      return boldNumbers[char.charCodeAt(0) - "0".charCodeAt(0)];
    }
    return char;
  },

  italic: (char: string) => {
    const italicUppercase = "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍";
    const italicLowercase = "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧";
    // Add italic digits so numbers also get converted
    const italicNumbers = "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡";

    if (char >= "A" && char <= "Z") {
      return italicUppercase[char.charCodeAt(0) - "A".charCodeAt(0)];
    }
    if (char >= "a" && char <= "z") {
      return italicLowercase[char.charCodeAt(0) - "a".charCodeAt(0)];
    }
    if (char >= "0" && char <= "9") {
      return italicNumbers[char.charCodeAt(0) - "0".charCodeAt(0)];
    }
    return char;
  },

  underline: (char: string) => {
    // Add underline as a combining Unicode character
    return `${char}\u0332`;
  },

  bullet: (char: string) => {
    return `• ${char}`;
  },

  code: (char: string) => {
    return `\`${char}\``;
  },
};

function convertText(text: string, style: TextStyle): string {
  return text
    .split("")
    .map((char) => textStyleMap[style](char))
    .join("");
}

// Example usage
console.log(convertText("Hello123!", "bold"));       // 𝐇𝐞𝐥𝐥𝐨𝟏𝟐𝟑!
console.log(convertText("Hello123!", "italic"));     // 𝐻𝑒𝑙𝑙𝑜𝟙𝟚𝟛!
console.log(convertText("Hello123!", "underline"));  // H̲e̲l̲l̲o̲1̲2̲3̲!
console.log(convertText("Hello123!", "bullet"));     // • H• e• l• l• o• 1• 2• 3• !
console.log(convertText("Hello123!", "code"));       // `H``e``l``l``o``1``2``3``!`
