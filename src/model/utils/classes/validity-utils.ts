import { GroupValiditySource } from '../../groups';
import { Validity, type Validated, type ValidatedState } from '../../shared';

type EntityStateOrValidity = Validated | ValidatedState | Validity;

type MinValidityOpts = {
  pruneUnvalidatedGroups: boolean;
};

export class ValidityUtils {
  public static isValid(entityStateOrValidity: EntityStateOrValidity): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Valid;
  }

  public static isPending(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Pending;
  }

  public static isInvalid(
    entityStateOrValidity: EntityStateOrValidity,
  ): boolean {
    const validity = this.toValidity(entityStateOrValidity);
    return validity === Validity.Invalid;
  }

  public static minValidity(
    entitiesStatesOrValidities:
      | EntityStateOrValidity[]
      | readonly EntityStateOrValidity[],
    opts?: MinValidityOpts,
  ): Validity {
    let pendingSeen = false;

    for (const entityStateOrValidity of entitiesStatesOrValidities) {
      if (
        opts?.pruneUnvalidatedGroups &&
        this.validitySourceIsReduction(entityStateOrValidity)
      )
        continue;

      if (this.isInvalid(entityStateOrValidity)) return Validity.Invalid;
      if (this.isPending(entityStateOrValidity)) pendingSeen = true;
    }

    return pendingSeen ? Validity.Pending : Validity.Valid;
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
