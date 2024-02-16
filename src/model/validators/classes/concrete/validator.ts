import { AbstractValidator } from "../abstract";
import type { ValidatorResult } from "../../types";

export class Validator<Value> extends AbstractValidator<Value> {
  public validate(value: Value): ValidatorResult<Value> {
    throw new Error("Method not implemented.");
  }
}