import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFRadioGroupLegend } from '../../../components';
import { removeEmptyTextNodes } from '../../../test-utils';

describe('FFRadioGroupLegend', () => {
  afterEach(cleanup);

  test('It renders a legend element.', () => {
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
        <FFRadioGroupLegend form={form} field={form.formElements.testField} />
      );
    }

    render(<TestForm />);

    expect(document.getElementsByTagName('legend').length).toBe(1);
  });

  test(`getLegendId() is called with the id of the field it receives and 
  assigned to its id property.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '', id: 'test-field' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroupLegend form={form} field={form.formElements.testField} />
      );
    }

    render(<TestForm />);

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.id).toBe('test-field-legend');
  });

  test('It renders child components inside the legend.', () => {
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
        <FFRadioGroupLegend form={form} field={form.formElements.testField}>
          Test Field{' '}
          <small>
            <i>(optional)</i>
          </small>
        </FFRadioGroupLegend>
      );
    }

    render(<TestForm />);

    const legend = document.getElementsByTagName('legend')[0];
    const childNodes = removeEmptyTextNodes(legend.childNodes);

    expect(childNodes[0].nodeName).toBe('#text');
    expect(childNodes[0].textContent).toBe('Test Field');
    expect(childNodes[1].nodeName).toBe('SMALL');

    const grandchildNodes = removeEmptyTextNodes(childNodes[1].childNodes);
    expect(grandchildNodes[0].nodeName).toBe('I');
    expect(grandchildNodes[0].textContent).toBe('(optional)');
  });

  test(`If it received a className as a prop, the legend it returns receives 
  that className.`, () => {
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
        <FFRadioGroupLegend
          form={form}
          field={form.formElements.testField}
          className="test-field"
        />
      );
    }

    render(<TestForm />);

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.className).toBe('test-field');
  });

  test(`If it received getClassName() as a prop, getClassName() is called and 
  the legend it returns receives the resulting className.`, () => {
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
        <FFRadioGroupLegend
          form={form}
          field={form.formElements.testField}
          getClassName={() => 'test-field'}
        />
      );
    }

    render(<TestForm />);

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.className).toBe('test-field');
  });

  test(`If it received both className and getClassName() as props, 
  getClassName() is called and merged with className, and the legend it returns 
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
        <FFRadioGroupLegend
          form={form}
          field={form.formElements.testField}
          className="class-1"
          getClassName={() => 'class-2'}
        />
      );
    }

    render(<TestForm />);

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.className).toBe('class-1 class-2');
  });

  test(`If it received style as a prop, those styles are applied to the legend 
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
        <FFRadioGroupLegend
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

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.style.display).toBe('block');
    expect(legend.style.fontFamily).toBe('Arial');
    expect(legend.style.fontSize).toBe('18px');
  });

  test(`If it received getStyle() as a prop, that function is called and the
  resultant styles are applied to the legend element it returns.`, () => {
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
        <FFRadioGroupLegend
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

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.style.display).toBe('block');
    expect(legend.style.fontFamily).toBe('Arial');
    expect(legend.style.fontSize).toBe('18px');
  });

  test(`If it received both style and getStyle() as props, getStyle() is
  called and the resultant styles are merged with style and applied to the 
  legend element it returns.`, () => {
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
        <FFRadioGroupLegend
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

    const legend = document.getElementsByTagName('legend')[0];
    expect(legend.style.display).toBe('block');
    expect(legend.style.fontFamily).toBe('Arial');
    expect(legend.style.fontSize).toBe('18px');
  });
});
