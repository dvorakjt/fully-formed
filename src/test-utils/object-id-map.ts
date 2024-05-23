export class ObjectIdMap {
  private map: WeakMap<object, number> = new WeakMap<object, number>();
  private currentId: number = 0;

  public get(obj: object): number {
    if (!this.map.has(obj)) {
      this.map.set(obj, this.currentId++);
    }
    return this.map.get(obj)!;
  }
}
