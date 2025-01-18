import { GroupValiditySource } from '../../groups';
import { Validity, type Validated, type ValidatedState } from '../../shared';

type EntityStateOrValidity = Validated | ValidatedState | Validity;

type MinValidityOpts = {
  pruneUnvalidatedGroups: boolean;
};

/**
 * A collection of utility methods for various common operations related to
 * validity.
 */
export class ValidityUtils {
  /**
   * Accepts an entity such as a Field, the state of such an entity, or a
   * value of type {@link Validity} and returns true if it is
   * {@link Validity.Valid}.
   *
   * @param entityStateOrValidity - The entity, state or validity to evaluate.
   * @returns `true` if the provided argument is valid, `false` otherwise.
   *
   * @example
   * ```
   * const field = new Field({
   *   name: 'field',
   *   defaultValue: '',
   *   validatorTemplates: [
   *     {
   *       predicate: () => false
   *     }
   *   ]
   * });
   *
   * ValidityUtils.isValid(field); // false
   *
   * const state : ValidatedState<string> = {
   *   value: '',
   *   validity: Validity.Pending
   * };
   *
   * ValidityUtils.isValid(state); // false
   *
   * ValidityUtils.isValid(Validity.Caution); // false
   *
   * ValidityUtils.isValid(Validity.Valid); // true
   * ```
   */
  public static isValid(entityStateOrValidity: EntityStateOrValidity): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Valid;
  }

  /**
   * Accepts an entity such as a Field, the state of such an entity, or a
   * value of type {@link Validity} and returns true if it its validity is
   * {@link Validity.Caution}.
   *
   * @param entityStateOrValidity - The entity, state or validity to evaluate.
   * @returns `true` if the validity of the argument is
   * {@link Validity.Caution}, `false` otherwise.
   *
   * @example
   * ```
   * const field = new Field({
   *   name: 'field',
   *   defaultValue: ''
   * });
   *
   * ValidityUtils.isCaution(field); // false
   *
   * const state : ValidatedState<string> = {
   *   value: '',
   *   validity: Validity.Pending
   * };
   *
   * ValidityUtils.isCaution(state); // false
   *
   * ValidityUtils.isCaution(Validity.Invalid); // false
   *
   * ValidityUtils.isCaution(Validity.Caution); // true
   * ```
   */
  public static isCaution(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Caution;
  }

  /**
   * Accepts an entity such as a Field, the state of such an entity, or a
   * value of type {@link Validity} and returns true if it its validity is
   * {@link Validity.Valid} or {@link Validity.Caution}.
   *
   * @param entityStateOrValidity - The entity, state or validity to evaluate.
   * @returns `true` if the validity of the argument is
   * {@link Validity.Valid} or {@link Validity.Caution}, `false` otherwise.
   *
   * @example
   * ```
   * const field = new Field({
   *   name: 'field',
   *   defaultValue: '',
   *   validatorTemplates: [
   *     {
   *       predicate: () => false
   *     }
   *   ]
   * });
   *
   * ValidityUtils.isValidOrCaution(field); // false
   *
   * const state : ValidatedState<string> = {
   *   value: '',
   *   validity: Validity.Pending
   * };
   *
   * ValidityUtils.isValidOrCaution(state); // false
   *
   * ValidityUtils.isValidOrCaution(Validity.Caution); // true
   *
   * ValidityUtils.isValidOrCaution(Validity.Valid); // true
   * ```
   */
  public static isValidOrCaution(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Valid || validity === Validity.Caution;
  }

  /**
   * Accepts an entity such as a Field, the state of such an entity, or a
   * value of type {@link Validity} and returns true if it its validity is
   * {@link Validity.Pending}.
   *
   * @param entityStateOrValidity - The entity, state or validity to evaluate.
   * @returns `true` if the validity of the argument is
   * {@link Validity.Pending}, `false` otherwise.
   *
   * @example
   * ```
   * const field = new Field({
   *   name: 'field',
   *   defaultValue: ''
   * });
   *
   * ValidityUtils.isPending(field); // false
   *
   * const state : ValidatedState<string> = {
   *   value: '',
   *   validity: Validity.Caution
   * };
   *
   * ValidityUtils.isPending(state); // false
   *
   * ValidityUtils.isPending(Validity.Valid); // false
   *
   * ValidityUtils.isPending(Validity.Pending); // true
   * ```
   */
  public static isPending(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Pending;
  }

  /**
   * Accepts an entity such as a Field, the state of such an entity, or a
   * value of type {@link Validity} and returns true if it its validity is
   * {@link Validity.Invalid}.
   *
   * @param entityStateOrValidity - The entity, state or validity to evaluate.
   * @returns `true` if the validity of the argument is
   * {@link Validity.Invalid}, `false` otherwise.
   *
   * @example
   * ```
   * const field = new Field({
   *   name: 'field',
   *   defaultValue: ''
   * });
   *
   * ValidityUtils.isInvalid(field); // false
   *
   * const state : ValidatedState<string> = {
   *   value: '',
   *   validity: Validity.Pending
   * };
   *
   * ValidityUtils.isInvalid(state); // false
   *
   * ValidityUtils.isInvalid(Validity.Caution); // false
   *
   * ValidityUtils.isInvalid(Validity.Invalid); // true
   * ```
   */
  public static isInvalid(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Invalid;
  }

  /**
   * Accepts an array of entities (such as Fields), states, and/or validities
   * and returns the minimum validity found in the array.
   *
   * @param entitiesStatesOrValidities - An array of entities, states, and/or
   * validities whose minimum validity will be returned.
   *
   * @param opts - A configuration object which enables the user to define
   * whether unvalidated groups should be ignored.
   *
   * @returns The minimum {@link Validity} of the array.
   *
   * @remarks
   * The different possible validities relate to each other as follows:
   * {@link Validity.Invalid} \< {@link Validity.Pending} \< {@link Validity.Caution} \< {@link Validity.Valid}
   */
  public static minValidity(
    entitiesStatesOrValidities:
      | EntityStateOrValidity[]
      | readonly EntityStateOrValidity[],
    opts?: MinValidityOpts,
  ): Validity {
    let pendingSeen = false;
    let cautionSeen = false;

    for (const entityStateOrValidity of entitiesStatesOrValidities) {
      if (
        opts?.pruneUnvalidatedGroups &&
        this.validitySourceIsReduction(entityStateOrValidity)
      )
        continue;

      if (this.isInvalid(entityStateOrValidity)) return Validity.Invalid;
      if (this.isPending(entityStateOrValidity)) pendingSeen = true;
      if (this.isCaution(entityStateOrValidity)) cautionSeen = true;
    }

    return (
      pendingSeen ? Validity.Pending
      : cautionSeen ? Validity.Caution
      : Validity.Valid
    );
  }

  private static toValidity(
    entityStateOrValidity: EntityStateOrValidity,
  ): Validity {
    if (this.isEntity(entityStateOrValidity)) {
      return entityStateOrValidity.state.validity;
    } else if (this.isState(entityStateOrValidity)) {
      return entityStateOrValidity.validity;
    }
    return entityStateOrValidity;
  }

  private static isEntity(
    entityStateOrValidity: Validated | ValidatedState | Validity,
  ): entityStateOrValidity is Validated {
    return (
      typeof entityStateOrValidity === 'object' &&
      'state' in entityStateOrValidity
    );
  }

  private static isState(
    entityStateOrValidity: Validated | ValidatedState | Validity,
  ): entityStateOrValidity is ValidatedState {
    return (
      typeof entityStateOrValidity === 'object' &&
      'validity' in entityStateOrValidity
    );
  }

  private static validitySourceIsReduction(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    if (this.isEntity(entityStateOrValidity)) {
      return (
        'validitySource' in entityStateOrValidity.state &&
        entityStateOrValidity.state.validitySource ===
          GroupValiditySource.Reduction
      );
    } else if (this.isState(entityStateOrValidity)) {
      return (
        'validitySource' in entityStateOrValidity &&
        entityStateOrValidity.validitySource === GroupValiditySource.Reduction
      );
    }

    return false;
  }
}
