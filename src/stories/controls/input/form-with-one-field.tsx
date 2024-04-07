import React, { useRef, type ReactNode } from 'react';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { Input } from '../../../components';
import './input.css';

class Template extends FormTemplate {
  public readonly name = 'formWithOneField';
  public readonly formElements = [
    new Field({ name: 'firstName', defaultValue: '' }),
  ];
}

const Form = FormFactory.createForm(Template);

export function FormWithOneField(): ReactNode {
  const formRef = useRef(new Form());
  return (
    <>
      <label className="label" htmlFor="firstName">
        First Name
      </label>
      <Input
        form={formRef.current}
        fieldName={'firstName'}
        type="text"
        className="input"
      />
    </>
  );
}
