export type AutoTrim =
  | boolean
  | {
      include: string[];
    }
  | {
      exclude: string[];
    };
