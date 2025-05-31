import { AbstractForm } from './abstract-form';
import type { FormChild, Identifiable, PossiblyTransient } from '../interfaces';
import type { AutoTrim, FormMembers, FormValue } from '../types';

type AbstractSubFormConstructorParams<
  T extends string,
  U extends FormMembers,
  V extends boolean,
> = {
  name: T;
  fields: U['fields'];
  groups: U['groups'];
  adapters: U['adapters'];
  autoTrim: AutoTrim;
  transient?: V;
  id?: string;
};

export abstract class AbstractSubForm<
    T extends string,
    U extends FormMembers,
    V extends boolean = false,
  >
  extends AbstractForm<U>
  implements FormChild<T, FormValue<U>>, PossiblyTransient<V>, Identifiable
{
  public readonly name: T;
  public readonly transient: V;
  public readonly id: string;

  public constructor({
    name,
    fields,
    adapters,
    groups,
    autoTrim,
    transient,
    id = name,
  }: AbstractSubFormConstructorParams<T, U, V>) {
    super({
      fields,
      adapters,
      groups,
      autoTrim,
    });
    this.name = name;
    this.transient = !!transient as V;
    this.id = id;
  }
}
