import { FormReducer, type AbstractFormReducer } from "../../../reducers";
import { DefaultAdapterFactory } from "./default-adapter-factory";
import type { FormElement } from "../../../form-elements";
import type { AbstractGroup, GroupMembers } from "../../../groups";
import type { NonGenericAutoTrim } from "../../types";
import type { AbstractAdapter } from "../../../adapters";

export class FormReducerFactory {
  public static createFormReducer<Value extends Record<string, unknown>>(
    formElements : readonly FormElement[],
    userDefinedAdapters : ReadonlyArray<AbstractAdapter<string, FormElement | AbstractGroup<string, GroupMembers>, unknown>>,
    groups : ReadonlyArray<AbstractGroup<string, GroupMembers>>,
    autoTrim : NonGenericAutoTrim
  ) : AbstractFormReducer<Value> {
    const adapters = [...DefaultAdapterFactory.createDefaultAdapters(formElements, autoTrim), ...userDefinedAdapters];
    const transientFormElements = formElements.filter(formElement => formElement.transient);
    return new FormReducer({
      adapters,
      transientFormElements,
      groups
    });
  }
}