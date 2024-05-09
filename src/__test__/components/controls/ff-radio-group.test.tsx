import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  FormTemplate,
  Field,
  StringValidators,
  FormFactory,
  Validity,
  Group,
  GroupValiditySource,
} from '../../../model';
import {
  FFRadio,
  FFRadioGroup,
  getAriaDescribedBy,
  getLegendId,
} from '../../../components';
import { useForm } from '../../../hooks';

describe('FFRadioGroup', () => {
  afterEach(cleanup);

  test('It renders a fieldset element.', () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    const fieldsets = document.getElementsByTagName('fieldset');
    expect(fieldsets.length).toBe(1);
  });

  test('It renders child components inside the fieldset element.', () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field<'favoriteColor', 'red' | 'green' | 'blue', false>({
          name: 'favoriteColor',
          defaultValue: 'red',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.favoriteColor}
          className="radio-group"
        >
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="red"
            labelContent="Red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="green"
            labelContent="Green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="blue"
            labelContent="Blue"
          />
        </FFRadioGroup>
      );
    }

    render(<TestComponent />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    const containers = fieldset.children;
    expect(containers.length).toBe(3);

    for (const container of containers) {
      expect(container.children.length).toBe(2);
      expect(container.children[0].nodeName).toBe('INPUT');
      expect(container.children[1].nodeName).toBe('LABEL');
    }
  });

  test(`It calls getLegendId() with the id of the field it receives and sets the 
  aria-labelledby attribute of the fieldset to the result.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          id: 'test-field',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.getAttribute('aria-labelledby')).toBe(
      getLegendId(form.formElements.testField.id),
    );
  });

  test(`It calls getAriaDescribedBy() with the id of the field it 
  receives and set the aria-describedby attribute of the fieldset to the 
  result.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          id: 'test-field',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.getAttribute('aria-describedby')).toBe(
      getAriaDescribedBy(form.formElements.testField.id),
    );
  });

  test(`If it receives "aria-describedby" as a prop, that string is provided as 
  an argument to getAriaDescribedBy(), together with the id of the underlying 
  field, and the aria-describedby property of the fieldset is set to the 
  result.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          id: 'test-field',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          aria-describedby="some-id some-other-id"
        />
      );
    }

    render(<TestComponent />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.getAttribute('aria-describedby')).toBe(
      getAriaDescribedBy(
        form.formElements.testField.id,
        'some-id some-other-id',
      ),
    );
  });

  test(`The aria-invalid attribute of the fieldset is false while the 
  underlying field is clean and the confirm() method of the form has not been 
  called, even if the validity of the field is invalid.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    expect(form.formElements.testField.state.validity).toBe(Validity.Invalid);
    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.ariaInvalid).toBe('false');
  });

  test(`The aria-invalid attribute of the fieldset is true if the underlying 
  field is invalid and the field has been visited.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();
    form.formElements.testField.visit();

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    expect(form.formElements.testField.state.validity).toBe(Validity.Invalid);
    expect(form.formElements.testField.state.visited).toBe(true);
    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.ariaInvalid).toBe('true');
  });

  test(`The aria-invalid attribute of the fieldset is true if the underlying 
  field is invalid and the field has been modified.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();
    form.formElements.testField.setValue('');

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    expect(form.formElements.testField.state.validity).toBe(Validity.Invalid);
    expect(form.formElements.testField.state.modified).toBe(true);
    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.ariaInvalid).toBe('true');
  });

  test(`The aria-invalid attribute of the fieldset is true if the underlying 
  field is invalid and the confirm() method of the parent form has been 
  called.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();
    form.confirm();

    function TestComponent(): React.JSX.Element {
      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    expect(form.formElements.testField.state.validity).toBe(Validity.Invalid);
    expect(form.confirmationAttempted).toBe(true);
    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.ariaInvalid).toBe('true');
  });

  test(`If any groups are passed into the component, their validity impacts the 
  aria-invalid attribute of the fieldset.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'fieldOne',
          defaultValue: '',
        }),
        new Field({
          name: 'fieldTwo',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'invalidGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: (): boolean => false,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();
    form.formElements.fieldOne.visit();

    function TestComponent(): React.JSX.Element {
      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.fieldOne}
          groups={[form.groups.invalidGroup]}
        />
      );
    }

    render(<TestComponent />);

    expect(form.formElements.fieldOne.state.validity).toBe(Validity.Valid);
    expect(form.groups.invalidGroup.state.validity).toBe(Validity.Invalid);
    expect(form.groups.invalidGroup.state.validitySource).toBe(
      GroupValiditySource.Validation,
    );
    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.ariaInvalid).toBe('true');
  });

  test(`If its props include className, the fieldset it renders receives that 
  className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          className="test-radio-group"
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.className).toBe('test-radio-group');
  });

  test(`If its props include getClassName(), that function is called and the 
  fieldset element it renders receives the resulting className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          getClassName={() => 'test-radio-group'}
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.className).toBe('test-radio-group');
  });

  test(`If its props include both className and getClassName, getClassName() is 
  called and then merged with className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          className="class1"
          getClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.className).toBe('class1 class2');
  });

  test(`If its props include style, those styles are applied to the fieldset 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          style={{
            border: '2px dashed green',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.style.border).toBe('2px dashed green');
    expect(fieldset.style.display).toBe('flex');
    expect(fieldset.style.flexDirection).toBe('column');
    expect(fieldset.style.justifyContent).toBe('space-between');
  });

  test(`If its props include getStyle(), getStyle() is called and the fieldset 
  receives the resultant styles.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          getStyle={() => ({
            border: '2px dashed green',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          })}
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.style.border).toBe('2px dashed green');
    expect(fieldset.style.display).toBe('flex');
    expect(fieldset.style.flexDirection).toBe('column');
    expect(fieldset.style.justifyContent).toBe('space-between');
  });

  test(`If its props include both style and getStyle(), getStyle() is called and 
  the result is merged with the style prop and applied to the style of the 
  fieldset`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.testField}
          style={{
            border: '2px dashed green',
            display: 'flex',
          }}
          getStyle={() => ({
            flexDirection: 'column',
            justifyContent: 'space-between',
          })}
        />
      );
    }

    render(<TestForm />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    expect(fieldset.style.border).toBe('2px dashed green');
    expect(fieldset.style.display).toBe('flex');
    expect(fieldset.style.flexDirection).toBe('column');
    expect(fieldset.style.justifyContent).toBe('space-between');
  });
});
