import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormTemplate,
  Field,
  FormFactory,
  Validity,
  ExcludableField,
  StringValidators,
  type AbstractField,
  type ControlledFieldState,
} from '../../../model';
import { useForm } from '../../../hooks';
import { FFInput, type StringInputTypes } from '../../../components';

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

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
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

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.name).toBe('testField');
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

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <>
          <FFInput
            form={form}
            field={form.formElements.testField1}
            type="text"
          />
          <FFInput
            form={form}
            field={form.formElements.testField2}
            type="text"
          />
        </>
      );
    }

    render(<TestForm />);

    const inputElements = document.getElementsByTagName('input');
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

    function TestForm({ type }: TestFormProps): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type={type} />
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

      const input = document.getElementsByTagName('input')[0];
      expect(input.type).toBe(type);

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

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFInput form={form} field={form.formElements.name} type="text" />;
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.value).toBe('Joan Tower');
  });

  test('Its value is updated when text is entered into the input element it renders.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'name', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFInput form={form} field={form.formElements.name} type="text" />;
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.value).toBe('');

    await user.type(input, 'Valerie Coleman');
    expect(input.value).toBe('Valerie Coleman');
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

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <>
          <FFInput
            form={form}
            field={form.formElements.brandPrimary}
            type="text"
          />
          <FFInput
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

    function TestForm(): React.JSX.Element {
      return <FFInput form={form} field={form.formElements.name} type="text" />;
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.name.state.modified).toBe(false);

    const input = document.getElementsByTagName('input')[0];
    await user.type(input, 'Ludwig van Beethoven');
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

    function TestForm(): React.JSX.Element {
      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.focused).toBe(false);

    const input = document.getElementsByTagName('input')[0];
    await user.click(input);
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

    function TestForm(): React.JSX.Element {
      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.visited).toBe(false);

    const input = document.getElementsByTagName('input')[0];
    await user.click(input);
    expect(form.formElements.testField.state.visited).toBe(false);

    input.blur();
    expect(form.formElements.testField.state.visited).toBe(true);
  });

  test('If its props include className, the input it renders receives that className.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          className="test-input"
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('test-input');
  });

  test('If its props include getClassName that function is called the input element it renders receives the resulting className.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          getClassName={() => 'test-input'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('test-input');
  });

  test('If its props include both className and getClassName, getClassName() is called and then merged with className.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          className="class-name-1"
          getClassName={() => 'class-name-2'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('class-name-1 class-name-2');
  });

  test('If its props include style, those styles are applied to the input element it renders.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          style={{
            border: '1px solid lightgray',
            borderRadius: '2px',
            fontFamily: 'Arial',
            fontSize: '18px',
          }}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px solid lightgray');
    expect(input.style.borderRadius).toBe('2px');
    expect(input.style.fontFamily).toBe('Arial');
    expect(input.style.fontSize).toBe('18px');
  });

  test('If its props include getStyle(), getStyle() is called and the result is applied to the style of the input element it renders.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          getStyle={() => {
            return {
              border: '1px solid lightgray',
              borderRadius: '2px',
              fontFamily: 'Arial',
              fontSize: '18px',
            };
          }}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px solid lightgray');
    expect(input.style.borderRadius).toBe('2px');
    expect(input.style.fontFamily).toBe('Arial');
    expect(input.style.fontSize).toBe('18px');
  });

  test('If its props include both style and getStyle(), getStyle() is called and the result is merged with the style prop and applied to the style of the input element it renders.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          style={{
            border: '1px solid lightgray',
            borderRadius: '2px',
          }}
          getStyle={() => {
            return {
              fontFamily: 'Arial',
              fontSize: '18px',
            };
          }}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px solid lightgray');
    expect(input.style.borderRadius).toBe('2px');
    expect(input.style.fontFamily).toBe('Arial');
    expect(input.style.fontSize).toBe('18px');
  });

  test('If props.disabled is true, the input element it renders is disabled.', () => {
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
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          disabled={true}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.disabled).toBe(true);
  });

  test('If props.disableWhenExcluded is true, the input element it renders is disabled when the underlying field is excluded.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new ExcludableField({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          disabledWhenExcluded={true}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.disabled).toBe(false);

    form.formElements.testField.setExclude(true);
    await waitFor(() => expect(input.disabled).toBe(true));
  });

  test('If props.disabled and props.disabledWhenExcluded are both true, but the field is not currently excluded, it is still disabled.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new ExcludableField({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput
          form={form}
          field={form.formElements.testField}
          type="text"
          disabled={true}
          disabledWhenExcluded={true}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.disabled).toBe(true);
  });

  test('If the field has not been modified or visited and the confirm() method of the form has not been called, its aria-invalid property is false.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);
    const input = document.getElementsByTagName('input')[0];
    expect(input.ariaInvalid).toBe('false');
  });

  test('If the field has been modified and the underlying field is invalid, its aria-invalid property is true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.email()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.ariaInvalid).toBe('false');

    await user.type(input, 'not a valid email');
    expect(input.ariaInvalid).toBe('true');
  });

  test('If the field has been visited and the underlying field is invalid, its aria-invalid property is true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.ariaInvalid).toBe('false');

    input.focus();
    input.blur();
    await waitFor(() => expect(input.ariaInvalid).toBe('true'));
  });

  test('If the confirm() method of the form has been called and the underlying field is invalid, its aria-invalid property is true.', async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
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

    function TestForm(): React.JSX.Element {
      return (
        <FFInput form={form} field={form.formElements.testField} type="text" />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.ariaInvalid).toBe('false');

    form.confirm();
    await waitFor(() => expect(input.ariaInvalid).toBe('true'));
  });
});
