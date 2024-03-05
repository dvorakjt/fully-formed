import type { InitSubFormReturnType } from './init-subform-return-type.type';
import type {
  ExcludableSubFormControlTemplate,
  FormElement,
} from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';

export type InitExcludableSubFormReturnType = InitSubFormReturnType & {
  excludeByDefault?: boolean;
  controlledBy?: ExcludableSubFormControlTemplate<
    ReadonlyArray<FormElement | AbstractGroup<string, GroupMembers>>
  >;
};
