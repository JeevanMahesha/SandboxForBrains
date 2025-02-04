// // Character maps for Unicode transformations
// const boldMap: { [key: string]: string } = {
//   a: "𝗮",
//   b: "𝗯",
//   c: "𝗰",
//   d: "𝗱",
//   e: "𝗲",
//   f: "𝗳",
//   g: "𝗴",
//   h: "𝗵",
//   i: "𝗶",
//   j: "𝗷",
//   k: "𝗸",
//   l: "𝗹",
//   m: "𝗺",
//   n: "𝗻",
//   o: "𝗼",
//   p: "𝗽",
//   q: "𝗾",
//   r: "𝗿",
//   s: "𝘀",
//   t: "𝘁",
//   u: "𝘂",
//   v: "𝘃",
//   w: "𝘄",
//   x: "𝘅",
//   y: "𝘆",
//   z: "𝘇",
//   A: "𝗔",
//   B: "𝗕",
//   C: "𝗖",
//   D: "𝗗",
//   E: "𝗘",
//   F: "𝗙",
//   G: "𝗚",
//   H: "𝗛",
//   I: "𝗜",
//   J: "𝗝",
//   K: "𝗞",
//   L: "𝗟",
//   M: "𝗠",
//   N: "𝗡",
//   O: "𝗢",
//   P: "𝗣",
//   Q: "𝗤",
//   R: "𝗥",
//   S: "𝗦",
//   T: "𝗧",
//   U: "𝗨",
//   V: "𝗩",
//   W: "𝗪",
//   X: "𝗫",
//   Y: "𝗬",
//   Z: "𝗭",
//   "0": "𝟬",
//   "1": "𝟭",
//   "2": "𝟮",
//   "3": "𝟯",
//   "4": "𝟰",
//   "5": "𝟱",
//   "6": "𝟲",
//   "7": "𝟳",
//   "8": "𝟴",
//   "9": "𝟵",
// };

// const italicMap: { [key: string]: string } = {
//   a: "𝘢",
//   b: "𝘣",
//   c: "𝘤",
//   d: "𝘥",
//   e: "𝘦",
//   f: "𝘧",
//   g: "𝘨",
//   h: "𝘩",
//   i: "𝘪",
//   j: "𝘫",
//   k: "𝘬",
//   l: "𝘭",
//   m: "𝘮",
//   n: "𝘯",
//   o: "𝘰",
//   p: "𝘱",
//   q: "𝘲",
//   r: "𝘳",
//   s: "𝘴",
//   t: "𝘵",
//   u: "𝘶",
//   v: "𝘷",
//   w: "𝘸",
//   x: "𝘹",
//   y: "𝘺",
//   z: "𝘻",
//   A: "𝘈",
//   B: "𝘉",
//   C: "𝘊",
//   D: "𝘋",
//   E: "𝘌",
//   F: "𝘍",
//   G: "𝘎",
//   H: "𝘏",
//   I: "𝘐",
//   J: "𝘑",
//   K: "𝘒",
//   L: "𝘓",
//   M: "𝘔",
//   N: "𝘕",
//   O: "𝘖",
//   P: "𝘗",
//   Q: "𝘘",
//   R: "𝘙",
//   S: "𝘚",
//   T: "𝘛",
//   U: "𝘜",
//   V: "𝘝",
//   W: "𝘞",
//   X: "𝘟",
//   Y: "𝘠",
//   Z: "𝘡",
// };

// // Basic formatting functions
// const toBold = (text: string): string => {
//   return text
//     .split("")
//     .map((char) => boldMap[char] || char)
//     .join("");
// };

// const toItalic = (text: string): string => {
//   return text
//     .split("")
//     .map((char) => italicMap[char] || char)
//     .join("");
// };

// const toUnderline = (text: string): string => {
//   return text
//     .split("")
//     .map((char) => char + "\u0332")
//     .join("");
// };

// // Bullet point types and function
// type BulletStyle = "disc" | "circle" | "square";

// const toBulletPoints = (
//   items: string[],
//   style: BulletStyle = "disc"
// ): string => {
//   const bulletMap: Record<BulletStyle, string> = {
//     disc: "•",
//     circle: "○",
//     square: "■",
//   };
//   return items.map((item) => `${bulletMap[style]} ${item}`).join("\n");
// };

// // Code block formatting
// const toCodeBlock = (code: string, language?: string): string => {
//   const delimiter = "```";
//   const lang = language ? language : "";
//   return `${delimiter}${lang}\n${code}\n${delimiter}`;
// };

// // Combined formatting options interface
// interface FormatOptions {
//   bold?: boolean;
//   italic?: boolean;
//   underline?: boolean;
//   code?: boolean;
// }
// const format = (text: string, options: FormatOptions): string => {
//   // Apply transformations in a specific order to avoid conflicts
//   const transformations: ((text: string) => string)[] = [];

//   // Order matters! Add transformations in the correct sequence
//   if (options.italic) {
//     transformations.push(toItalic);
//   }
//   if (options.bold) {
//     transformations.push(toBold);
//   }
//   // Apply underline last to avoid Unicode conflicts
//   if (options.underline) {
//     transformations.push((text) => {
//       // For underline, we need to handle each character carefully
//       return text
//         .split("")
//         .map((char) => `${char}\u0332`)
//         .join("");
//     });
//   }
//   // Code block should be the very last transformation
//   if (options.code) {
//     transformations.push((text) => toCodeBlock(text));
//   }

//   // Apply all transformations in sequence
//   return transformations.reduce((result, transform) => transform(result), text);
// };
// // Compose multiple formatting functions
// const compose =
//   (...fns: Array<(text: string) => string>) =>
//   (text: string): string =>
//     fns.reduce((result, fn) => fn(result), text);

// // // Basic formatting
// // console.log(toBold("Hello")); // 𝗛𝗲𝗹𝗹𝗼
// // console.log(toItalic("World")); // 𝘞𝘰𝘳𝘭𝘥
// // console.log(toUnderline("Underlined")); // U̲n̲d̲e̲r̲l̲i̲n̲e̲d̲

// // // Bullet points
// // const items = ["First", "Second", "Third"];
// // console.log(toBulletPoints(items));
// // // • First
// // // • Second
// // // • Third

// // // Code blocks
// // console.log(toCodeBlock("const x = 42;", "typescript"));
// // // ```typescript
// // // const x = 42;
// // // ```

// // Using the format function with multiple options
// console.log(
//   format("Hello", {
//     bold: true,
//     underline: true,
//   })
// ); // 𝗛̲𝗲̲𝗹̲𝗹̲𝗼̲

// // // Using function composition
// // const boldAndUnderline = compose(toBold, toUnderline);
// // console.log(boldAndUnderline("Hello")); // 𝗛̲𝗲̲𝗹̲𝗹̲𝗼̲

// Type definitions
type BulletStyle = "disc" | "circle" | "square";
interface FormatOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

// Character maps for bold and italic
const formatMaps = {
  bold: {
    a: "𝐚",
    b: "𝐛",
    c: "𝐜",
    d: "𝐝",
    e: "𝐞",
    f: "𝐟",
    g: "𝐠",
    h: "𝐡",
    i: "𝐢",
    j: "𝐣",
    k: "𝐤",
    l: "𝐥",
    m: "𝐦",
    n: "𝐧",
    o: "𝐨",
    p: "𝐩",
    q: "𝐪",
    r: "𝐫",
    s: "𝐬",
    t: "𝐭",
    u: "𝐮",
    v: "𝐯",
    w: "𝐰",
    x: "𝐱",
    y: "𝐲",
    z: "𝐳",
    A: "𝐀",
    B: "𝐁",
    C: "𝐂",
    D: "𝐃",
    E: "𝐄",
    F: "𝐅",
    G: "𝐆",
    H: "𝐇",
    I: "𝐈",
    J: "𝐉",
    K: "𝐊",
    L: "𝐋",
    M: "𝐌",
    N: "𝐍",
    O: "𝐎",
    P: "𝐏",
    Q: "𝐐",
    R: "𝐑",
    S: "𝐒",
    T: "𝐓",
    U: "𝐔",
    V: "𝐕",
    W: "𝐖",
    X: "𝐗",
    Y: "𝐘",
    Z: "𝐙",
    "0": "𝟎",
    "1": "𝟏",
    "2": "𝟐",
    "3": "𝟑",
    "4": "𝟒",
    "5": "𝟓",
    "6": "𝟔",
    "7": "𝟕",
    "8": "𝟖",
    "9": "𝟗",
  },
  italic: {
    a: "𝑎",
    b: "𝑏",
    c: "𝑐",
    d: "𝑑",
    e: "𝑒",
    f: "𝑓",
    g: "𝑔",
    h: "ℎ",
    i: "𝑖",
    j: "𝑗",
    k: "𝑘",
    l: "𝑙",
    m: "𝑚",
    n: "𝑛",
    o: "𝑜",
    p: "𝑝",
    q: "𝑞",
    r: "𝑟",
    s: "𝑠",
    t: "𝑡",
    u: "𝑢",
    v: "𝑣",
    w: "𝑤",
    x: "𝑥",
    y: "𝑦",
    z: "𝑧",
    A: "𝐴",
    B: "𝐵",
    C: "𝐶",
    D: "𝐷",
    E: "𝐸",
    F: "𝐹",
    G: "𝐺",
    H: "𝐻",
    I: "𝐼",
    J: "𝐽",
    K: "𝐾",
    L: "𝐿",
    M: "𝑀",
    N: "𝑁",
    O: "𝑂",
    P: "𝑃",
    Q: "𝑄",
    R: "𝑅",
    S: "𝑆",
    T: "𝑇",
    U: "𝑈",
    V: "𝑉",
    W: "𝑊",
    X: "𝑋",
    Y: "𝑌",
    Z: "𝑍",
  },
};

// Basic formatting functions
const toBold = (text: string): string => {
  return text
    .split("")
    .map((char) => formatMaps.bold[char] || char)
    .join("");
};

const toItalic = (text: string): string => {
  return text
    .split("")
    .map((char) => formatMaps.italic[char] || char)
    .join("");
};

const toUnderline = (text: string): string => {
  return text
    .split("")
    .map((char) => char + "\u0332")
    .join("");
};

// Bullet points formatter
const toBulletPoints = (
  items: string[],
  style: BulletStyle = "disc"
): string => {
  const bullets = {
    disc: "•",
    circle: "○",
    square: "■",
  };
  return items.map((item) => `${bullets[style]} ${item}`).join("\n");
};

// Code block formatter
const toCodeBlock = (code: string, language?: string): string => {
  return `\`\`\`${language || ""}\n${code}\n\`\`\``;
};

// Combined formatter
const format = (text: string, options: FormatOptions): string => {
  let result = text;

  // Apply formatting in specific order to prevent conflicts
  if (options.bold) {
    result = toBold(result);
  }
  if (options.italic) {
    result = toItalic(result);
  }
  if (options.underline) {
    result = toUnderline(result);
  }
  if (options.code) {
    result = toCodeBlock(result);
  }

  return result;
};

// Test individual formatting
console.log(toBold("Hello")); // 𝐇𝐞𝐥𝐥𝐨
console.log(toItalic("Hello")); // 𝑯𝒆𝒍𝒍𝒐
console.log(toUnderline("Hello")); // H̲e̲l̲l̲o̲

// Test bullet points
const items = ["First", "Second", "Third"];
console.log(toBulletPoints(items));
// • First
// • Second
// • Third

// Test code blocks
console.log(toCodeBlock("const x = 42;", "typescript"));
// ```typescript
// const x = 42;
// ```

// Test combined formatting
console.log(
  format("Hello", {
    bold: true,
    underline: true,
  })
); // Should show bold and underlined text

// Test all formats together
console.log(
  format("Hello", {
    bold: true,
    italic: false,
    underline: true,
    code: true,
  })
);
