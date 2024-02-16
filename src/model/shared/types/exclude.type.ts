export type Exclude<Excludable extends boolean> =
  Excludable extends true ? boolean : false;
