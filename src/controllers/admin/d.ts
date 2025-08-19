import kuromoji from "kuromoji";
import * as wanakana from "wanakana";

export interface SlugOptions {
  lang?: "vi" | "jp";
  jpMode?: "romaji" | "keep";
}

export async function toSlug(
  text: string,
  opts: SlugOptions = { lang: "vi" }
): Promise<string> {
  let s = (text || "")
    .trim()
    .replace(/\u3000/g, " ") // full-width space
    .replace(/\s+/g, " "); // collapse space

  if (opts.lang === "vi") {
    s = removeVietnameseTones(s);
    s = s.toLowerCase();
  } else if (opts.lang === "jp") {
    if (opts.jpMode === "romaji") {
      // dùng kuromoji để tokenize
      const tokenizer = await buildTokenizer();
      const tokens = tokenizer.tokenize(s);
      const romajiArr = tokens.map((t) =>
        wanakana.toRomaji(t.reading || t.surface_form)
      );
      s = romajiArr.join("_").toLowerCase();
    }
  }

  // chỉ giữ lại a-z0-9 và romaji/kanji/hiragana/katakana
  s = s.replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/gi, " ");
  s = s.trim().replace(/\s+/g, "_");

  return s;
}

// ===== cache tokenizer để không build lại nhiều lần =====
let tokenizerPromise: Promise<
  kuromoji.Tokenizer<kuromoji.IpadicFeatures>
> | null = null;

function buildTokenizer(): Promise<
  kuromoji.Tokenizer<kuromoji.IpadicFeatures>
> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji
        .builder({ dicPath: "node_modules/kuromoji/dict" })
        .build((err, tokenizer) => {
          if (err) reject(err);
          else resolve(tokenizer);
        });
    });
  }
  return tokenizerPromise;
}
export function fromSlugRomaji(
  slug: string,
  mode: "hiragana" | "katakana" = "hiragana"
): string {
  const s = slug.replace(/_/g, " ");
  return mode === "hiragana" ? wanakana.toHiragana(s) : wanakana.toKatakana(s);
}

// Hàm bỏ dấu tiếng Việt (giữ nguyên cũ)
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
