export interface SetExclude {
  setExclude(exclude: boolean): void;
}

//kind of annoying to implement both Excludable and SetExclude, like the
//way it is to implement Stateful<State<T>> & SetValue<T>
//excludable can be implemented without setExclude, but setExclude cannot be
//implement without Excludable
//the problem is actually just naming lol
