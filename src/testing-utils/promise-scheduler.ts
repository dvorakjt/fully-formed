/**
 * Schedules promises that can be resolved sequentially. For testing of asynchronous processes.
 */
export class PromiseScheduler {
  private promiseResolvers : Array<() => void> = [];

  public get scheduledPromises() : number {
    return this.promiseResolvers.length;
  }
  
  public createScheduledPromise<T>(value : T) : Promise<T> {
    return new Promise<T>(resolve => {
      const resolver : () => void = () => resolve(value);
      this.promiseResolvers.push(resolver);
    });
  }

  public resolveFirst() : void {
    const resolver = this.promiseResolvers.shift();
    resolver && resolver();
  }

  public resolveLast() : void {
    const resolver = this.promiseResolvers.pop();
    resolver && resolver();
  }
}