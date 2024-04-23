import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFLabel } from '../../../components';
import { removeEmptyTextNodes } from '../../../test-utils';

describe('FFLabel', () => {
  afterEach(cleanup);

  test('It renders a label element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFLabel form={form} field={form.formElements.testField} />;
    }

    render(<TestForm />);

    expect(document.getElementsByTagName('label').length).toBe(1);
  });

  test(`The id of the field it receives as a prop is assigned to the htmlFor
    attribute of the label it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '', id: 'test-field' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFLabel form={form} field={form.formElements.testField} />;
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.htmlFor).toBe('test-field');
  });

  test('It renders child components inside the label.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel form={form} field={form.formElements.testField}>
          Test Field{' '}
          <small>
            <i>(optional)</i>
          </small>
        </FFLabel>
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    const childNodes = removeEmptyTextNodes(label.childNodes);

    expect(childNodes[0].nodeName).toBe('#text');
    expect(childNodes[0].textContent).toBe('Test Field');
    expect(childNodes[1].nodeName).toBe('SMALL');

    const grandchildNodes = removeEmptyTextNodes(childNodes[1].childNodes);
    expect(grandchildNodes[0].nodeName).toBe('I');
    expect(grandchildNodes[0].textContent).toBe('(optional)');
  });

  test(`If it received a className as a prop, the label it returns receives that 
  className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          className="test-field"
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('test-field');
  });

  test(`If it received getClassName() as a prop, getClassName() is called and 
  the label it returns receives the resulting className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          getClassName={() => 'test-field'}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('test-field');
  });

  test(`If it received both className and getClassName() as props, 
  getClassName() is called and merged with className, and the label it returns 
  receives the resulting className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          className="class-1"
          getClassName={() => 'class-2'}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('class-1 class-2');
  });

  test(`If it received style as a prop, those styles are applied to the label 
  element it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          style={{
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '18px',
          }}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.display).toBe('block');
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });

  test(`If it received getStyle() as a prop, that function is called and the
  resultant styles are applied to the label element it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          getStyle={() => ({
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '18px',
          })}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.display).toBe('block');
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });

  test(`If it received both style and getStyle() as props, getStyle() is
  called and the resultant styles are merged with style and applied to the label 
  element it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFLabel
          form={form}
          field={form.formElements.testField}
          style={{
            display: 'block',
          }}
          getStyle={() => ({
            fontFamily: 'Arial',
            fontSize: '18px',
          })}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.display).toBe('block');
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });
});
