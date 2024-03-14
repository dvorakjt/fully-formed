export type NonGenericAutoTrim =
  | boolean
  | {
      include: string[];
    }
  | {
      exclude: string[];
    };
