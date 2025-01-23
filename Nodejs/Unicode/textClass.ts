class TextFormatter {
  private static readonly boldMap: { [key: string]: string } = {
    a: "𝗮",
    b: "𝗯",
    c: "𝗰",
    d: "𝗱",
    e: "𝗲",
    f: "𝗳",
    g: "𝗴",
    h: "𝗵",
    i: "𝗶",
    j: "𝗷",
    k: "𝗸",
    l: "𝗹",
    m: "𝗺",
    n: "𝗻",
    o: "𝗼",
    p: "𝗽",
    q: "𝗾",
    r: "𝗿",
    s: "𝘀",
    t: "𝘁",
    u: "𝘂",
    v: "𝘃",
    w: "𝘄",
    x: "𝘅",
    y: "𝘆",
    z: "𝘇",
    A: "𝗔",
    B: "𝗕",
    C: "𝗖",
    D: "𝗗",
    E: "𝗘",
    F: "𝗙",
    G: "𝗚",
    H: "𝗛",
    I: "𝗜",
    J: "𝗝",
    K: "𝗞",
    L: "𝗟",
    M: "𝗠",
    N: "𝗡",
    O: "𝗢",
    P: "𝗣",
    Q: "𝗤",
    R: "𝗥",
    S: "𝗦",
    T: "𝗧",
    U: "𝗨",
    V: "𝗩",
    W: "𝗪",
    X: "𝗫",
    Y: "𝗬",
    Z: "𝗭",
    "0": "𝟬",
    "1": "𝟭",
    "2": "𝟮",
    "3": "𝟯",
    "4": "𝟰",
    "5": "𝟱",
    "6": "𝟲",
    "7": "𝟳",
    "8": "𝟴",
    "9": "𝟵",
  };

  private static readonly italicMap: { [key: string]: string } = {
    a: "𝘢",
    b: "𝘣",
    c: "𝘤",
    d: "𝘥",
    e: "𝘦",
    f: "𝘧",
    g: "𝘨",
    h: "𝘩",
    i: "𝘪",
    j: "𝘫",
    k: "𝘬",
    l: "𝘭",
    m: "𝘮",
    n: "𝘯",
    o: "𝘰",
    p: "𝘱",
    q: "𝘲",
    r: "𝘳",
    s: "𝘴",
    t: "𝘵",
    u: "𝘶",
    v: "𝘷",
    w: "𝘸",
    x: "𝘹",
    y: "𝘺",
    z: "𝘻",
    A: "𝘈",
    B: "𝘉",
    C: "𝘊",
    D: "𝘋",
    E: "𝘌",
    F: "𝘍",
    G: "𝘎",
    H: "𝘏",
    I: "𝘐",
    J: "𝘑",
    K: "𝘒",
    L: "𝘓",
    M: "𝘔",
    N: "𝘕",
    O: "𝘖",
    P: "𝘗",
    Q: "𝘘",
    R: "𝘙",
    S: "𝘚",
    T: "𝘛",
    U: "𝘜",
    V: "𝘝",
    W: "𝘞",
    X: "𝘟",
    Y: "𝘠",
    Z: "𝘡",
  };

  // Convert text to bold Unicode
  public toBold(text: string): string {
    return text
      .split("")
      .map((char) => TextFormatter.boldMap[char] || char)
      .join("");
  }

  // Convert text to italic Unicode
  public toItalic(text: string): string {
    return text
      .split("")
      .map((char) => TextFormatter.italicMap[char] || char)
      .join("");
  }

  // Add underline to text (using Unicode combining character)
  public toUnderline(text: string): string {
    return text
      .split("")
      .map((char) => char + "\u0332")
      .join("");
  }

  // Create bullet points from an array of strings
  public toBulletPoints(
    items: string[],
    style: "disc" | "circle" | "square" = "disc"
  ): string {
    const bulletMap = {
      disc: "•",
      circle: "○",
      square: "■",
    };
    return items.map((item) => `${bulletMap[style]} ${item}`).join("\n");
  }

  // Format text as code (with optional syntax highlighting placeholder)
  public toCodeBlock(code: string, language?: string): string {
    const delimiter = "```";
    const lang = language ? language : "";
    return `${delimiter}${lang}\n${code}\n${delimiter}`;
  }

  // Combine multiple formatting options
  public format(
    text: string,
    options: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
    }
  ): string {
    let result = text;

    if (options.bold) {
      result = this.toBold(result);
    }
    if (options.italic) {
      result = this.toItalic(result);
    }
    if (options.underline) {
      result = this.toUnderline(result);
    }
    if (options.code) {
      result = this.toCodeBlock(result);
    }

    return result;
  }
}
