import type { InitSubFormReturnType } from './init-subform-return-type.type';
import type {
  ExcludableSubFormControlTemplate,
  FormElement,
} from '../../form-elements';
import type { AbstractFieldGroup, FieldGroupMembers } from '../../field-groups';

export type InitExcludableSubFormReturnType = InitSubFormReturnType & {
  excludeByDefault?: boolean;
  controlledBy?: ExcludableSubFormControlTemplate<
    ReadonlyArray<FormElement | AbstractFieldGroup<string, FieldGroupMembers>>
  >;
};
