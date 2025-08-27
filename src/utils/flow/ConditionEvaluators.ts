import type { AnswerPrimitive, FlowEvaluators } from "@/types/flowTypes";

const toNum = (v: any): number | null => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const normalizeStr = (v: any): string =>
  String(v ?? "")
    .trim()
    .toLowerCase();

const toStrArray = (v: any): string[] => {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [String(v)];
};

const intersects = (a: string[], b: string[]) => a.some((x) => b.includes(x));
const isSuperset = (sup: string[], sub: string[]) => sub.every((x) => sup.includes(x));

export const EVALUATORS: FlowEvaluators = {
  BINARY: {
    is: (answer: AnswerPrimitive, rule: any) => normalizeStr(answer) === normalizeStr(rule),
  },

  RADIO: {
    is: (answer: AnswerPrimitive, rule: any) => normalizeStr(answer) === normalizeStr(rule),
    "is-not": (answer: AnswerPrimitive, rule: any) => normalizeStr(answer) !== normalizeStr(rule),
  },

  MULTIPLE_CHOICE: {
    is: (answer: AnswerPrimitive, rule: any) => {
      const ans = toStrArray(answer).map(normalizeStr);
      if (Array.isArray(rule)) {
        const rv = toStrArray(rule).map(normalizeStr);
        if (rv.length === 0) return false;
        return intersects(ans, rv);
      } else {
        const rv = normalizeStr(rule);
        return rv ? ans.includes(rv) : false;
      }
    },
    "is-not": (answer: AnswerPrimitive, rule: any) => {
      const ans = toStrArray(answer).map(normalizeStr);
      if (Array.isArray(rule)) {
        const rv = toStrArray(rule).map(normalizeStr);
        if (rv.length === 0) return false;
        return !intersects(ans, rv);
      } else {
        const rv = normalizeStr(rule);
        return rv ? !ans.includes(rv) : false;
      }
    },
    "contains-any": (answer: AnswerPrimitive, rule: any) => {
      const ans = toStrArray(answer).map(normalizeStr);
      const rv = toStrArray(rule).map(normalizeStr);
      if (rv.length === 0) return false;
      return intersects(ans, rv);
    },
    "contains-all": (answer: AnswerPrimitive, rule: any) => {
      const ans = toStrArray(answer).map(normalizeStr);
      const rv = toStrArray(rule).map(normalizeStr);
      if (rv.length === 0) return false;
      return isSuperset(ans, rv);
    },
    "not-contains": (answer: AnswerPrimitive, rule: any) => {
      const ans = toStrArray(answer).map(normalizeStr);
      const rv = toStrArray(rule).map(normalizeStr);
      if (rv.length === 0) return false;
      return !intersects(ans, rv);
    },
  },

  NUMBER: {
    "is-equal-to": (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const r = toNum(rule);
      return a !== null && r !== null && a === r;
    },
    "is-greater-than": (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const r = toNum(rule);
      return a !== null && r !== null && a > r;
    },
    "is-greater-than-equal-to": (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const r = toNum(rule);
      return a !== null && r !== null && a >= r;
    },
    "is-less-than": (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const r = toNum(rule);
      return a !== null && r !== null && a < r;
    },
    "is-less-than-equal-to": (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const r = toNum(rule);
      return a !== null && r !== null && a <= r;
    },
    between: (answer: AnswerPrimitive, rule: any) => {
      const a = toNum(answer);
      const [loRaw, hiRaw] = Array.isArray(rule) ? rule : [null, null];
      const lo = toNum(loRaw),
        hi = toNum(hiRaw);
      if (a === null || lo === null || hi === null) return false;
      return lo <= a && a <= hi; // inclusive
    },
  },

  RANGE: {
    "is-equal-to": (answer, rule) => EVALUATORS.NUMBER["is-equal-to"](answer, rule),
    "is-greater-than": (answer, rule) => EVALUATORS.NUMBER["is-greater-than"](answer, rule),
    "is-greater-than-equal-to": (answer, rule) =>
      EVALUATORS.NUMBER["is-greater-than-equal-to"](answer, rule),
    "is-less-than": (answer, rule) => EVALUATORS.NUMBER["is-less-than"](answer, rule),
    "is-less-than-equal-to": (answer, rule) =>
      EVALUATORS.NUMBER["is-less-than-equal-to"](answer, rule),
    between: (answer, rule) => EVALUATORS.NUMBER["between"](answer, rule),
  },

  TEXT: {
    //future
  },
};
