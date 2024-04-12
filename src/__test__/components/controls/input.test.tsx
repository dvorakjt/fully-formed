import React, { type ReactNode } from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormTemplate,
  Field,
  FormFactory,
  Validity,
  type AbstractField,
  type ControlledFieldState,
} from '../../../model';
import { useForm } from '../../../hooks';
import { Input, type StringInputTypes } from '../../../components';

describe('Input', () => {
  afterEach(cleanup);

  test('It renders an input element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return (
        <Input form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);

    expect(document.getElementsByTagName('input').length).toBe(1);
  });

  test('It renders an input element whose name matches that of the field it receives as a prop.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return (
        <Input form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');

    expect(inputElements.length).toBe(1);
    expect(inputElements[0].name).toBe('testField');
  });

  test('It renders an input element whose id matches that of the field it receives as a prop.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField1', defaultValue: '' }),
        new Field({ name: 'testField2', defaultValue: '', id: 'test-field-2' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return (
        <>
          <Input form={form} field={form.formElements.testField1} type="text" />
          <Input form={form} field={form.formElements.testField2} type="text" />
        </>
      );
    }

    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(2);
    expect(inputElements[0].id).toBe('testField1');
    expect(inputElements[1].id).toBe('test-field-2');
  });

  test('It renders an input element of the type specified by its type prop.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    interface TestFormProps {
      type: StringInputTypes;
    }

    function TestForm({ type }: TestFormProps): ReactNode {
      const form = useForm(new Form());

      return (
        <Input form={form} field={form.formElements.testField} type={type} />
      );
    }

    const stringInputTypes: StringInputTypes[] = [
      'color',
      'date',
      'datetime-local',
      'email',
      'hidden',
      'month',
      'number',
      'password',
      'range',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ];

    stringInputTypes.forEach(type => {
      render(<TestForm type={type} />);

      const inputElements = document.getElementsByTagName('input');

      expect(inputElements.length).toBe(1);
      expect(inputElements[0].type).toBe(type);

      cleanup();
    });
  });

  test('It renders an input element whose value is initialized to the default value of the field it received as a prop.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'name', defaultValue: 'Joan Tower' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return <Input form={form} field={form.formElements.name} type="text" />;
    }

    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    expect(inputElements[0].value).toBe('Joan Tower');
  });

  test('Its value is updated when text is entered into the input element it renders.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'name', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return <Input form={form} field={form.formElements.name} type="text" />;
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    expect(inputElements[0].value).toBe('');

    await user.type(inputElements[0], 'Valerie Coleman');
    expect(inputElements[0].value).toBe('Valerie Coleman');
  });

  test('Its value is updated when the value of the field it received as a props is updated.', async () => {
    const complementaryColors = {
      red: 'green',
      blue: 'orange',
      yellow: 'purple',
      green: 'red',
      orange: 'blue',
      purple: 'yellow',
    };

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements: [
        AbstractField<'brandPrimary', string, false>,
        AbstractField<'brandSecondary', string, false>,
      ];

      public constructor() {
        super();
        const brandPrimary = new Field({
          name: 'brandPrimary',
          defaultValue: 'red',
        });
        this.formElements = [
          brandPrimary,
          new Field({
            name: 'brandSecondary',
            defaultValue: '',
            controlledBy: {
              controllers: [brandPrimary],
              controlFn: ([{ value }]):
                | ControlledFieldState<string>
                | undefined => {
                if (value in complementaryColors) {
                  return {
                    value:
                      complementaryColors[
                        value as keyof typeof complementaryColors
                      ],
                    validity: Validity.Valid,
                    messages: [],
                  };
                }
              },
            },
          }),
        ];
      }
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): ReactNode {
      const form = useForm(new Form());

      return (
        <>
          <Input
            form={form}
            field={form.formElements.brandPrimary}
            type="text"
          />
          <Input
            form={form}
            field={form.formElements.brandSecondary}
            type="text"
          />
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(2);
    expect(inputElements[1].value).toBe('green');

    await user.clear(inputElements[0]);
    await user.type(inputElements[0], 'blue');

    expect(inputElements[1].value).toBe('orange');
  });

  test('When its value is updated, the modified property of the state of the underlying field becomes true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'name', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): ReactNode {
      return <Input form={form} field={form.formElements.name} type="text" />;
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.name.state.modified).toBe(false);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    await user.type(inputElements[0], 'Ludwig van Beethoven');
    expect(form.formElements.name.state.modified).toBe(true);
  });

  test('When it receives focus, the focused property of the state of the underlying field becomes true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): ReactNode {
      return (
        <Input form={form} field={form.formElements.testField} type="text" />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.focused).toBe(false);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    await user.click(inputElements[0]);
    expect(form.formElements.testField.state.focused).toBe(true);
  });

  test('When it is blurred, the visited property of the state of the underlying field becomes true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): ReactNode {
      return (
        <Input form={form} field={form.formElements.testField} type="text" />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.visited).toBe(false);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    await user.click(inputElements[0]);
    expect(form.formElements.testField.state.visited).toBe(false);

    inputElements[0].blur();
    expect(form.formElements.testField.state.visited).toBe(true);
  });

  test('If its props include "className", the input it renders receives that className.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): ReactNode {
      return (
        <Input
          form={form}
          field={form.formElements.testField}
          type="text"
          className="test-input"
        />
      );
    }

    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements.length).toBe(1);
    expect(inputElements[0].className).toBe('test-input');
  });

  test('If its props include "getClassName" that function is called the input element it renders receives the resulting className.', () => {});
});
