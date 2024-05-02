import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFTextArea } from '../../../components';

describe('FFTextArea', () => {
  afterEach(cleanup);

  test('It renders a textarea element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFTextArea form={form} field={form.formElements.testField} />;
    }

    render(<TestForm />);

    expect(document.getElementsByTagName('textarea').length).toBe(1);
  });

  test(`It renders a textarea element whose name matches that of the field it 
  receives as a prop.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFTextArea form={form} field={form.formElements.testField} />;
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.name).toBe('testField');
  });

  test(`It renders a textarea element whose id matches that of the field it 
  receives as a prop.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
          id: 'test-field',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFTextArea form={form} field={form.formElements.testField} />;
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.id).toBe('test-field');
  });

  test(`It renders a textarea element whose value is initialized to the default 
  value of the field it received as a prop.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'comments', defaultValue: 'Lorem ipsum dolor est' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFTextArea form={form} field={form.formElements.comments} />;
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.value).toBe('Lorem ipsum dolor est');
  });

  test(`Its value is updated when text is entered into the textarea element it 
  renders.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'comments', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFTextArea form={form} field={form.formElements.comments} />;
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.value).toBe('');

    await user.type(textarea, 'Lorem ipsum dolor est');
    expect(textarea.value).toBe('Lorem ipsum dolor est');
  });

  test(`When its value is updated, the modified property of the state of the 
  underlying field becomes true.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'comments', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return <FFTextArea form={form} field={form.formElements.comments} />;
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.comments.state.modified).toBe(false);

    const textarea = document.getElementsByTagName('textarea')[0];
    await user.type(textarea, 'Lorem ipsum dolor est');
    expect(form.formElements.comments.state.modified).toBe(true);
  });

  test(`When it receives focus, the focused property of the state of the 
  underlying field becomes true.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return <FFTextArea form={form} field={form.formElements.testField} />;
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.focused).toBe(false);

    const textarea = document.getElementsByTagName('textarea')[0];
    await user.click(textarea);
    expect(form.formElements.testField.state.focused).toBe(true);
  });

  test(`When it is blurred, the visited property of the state of the underlying 
  field becomes true.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({ name: 'testField', defaultValue: '' }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return <FFTextArea form={form} field={form.formElements.testField} />;
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(form.formElements.testField.state.visited).toBe(false);

    const textarea = document.getElementsByTagName('textarea')[0];
    await user.click(textarea);
    expect(form.formElements.testField.state.visited).toBe(false);

    textarea.blur();
    expect(form.formElements.testField.state.visited).toBe(true);
  });

  test(`If its props include className, the textarea it renders receives that 
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          className="test-textarea"
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.className).toBe('test-textarea');
  });

  test(`If its props include getClassName that function is called the textarea 
  element it renders receives the resulting className.`, () => {
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          getClassName={() => 'test-textarea'}
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.className).toBe('test-textarea');
  });

  test(`If its props include both className and getClassName, getClassName() is 
  called and then merged with className.`, () => {
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          className="class1"
          getClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.className).toBe('class1 class2');
  });

  test(`If its props include style, those styles are applied to the textarea 
  element it renders.`, () => {
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          style={{
            fontFamily: 'Arial',
            fontSize: '18px',
            resize: 'none',
            border: '1px solid lightgray',
          }}
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.style.fontFamily).toBe('Arial');
    expect(textarea.style.fontSize).toBe('18px');
    expect(textarea.style.resize).toBe('none');
    expect(textarea.style.border).toBe('1px solid lightgray');
  });

  test(`If its props include getStyle(), getStyle() is called and the result is 
  applied to the style of the textarea element it renders.`, () => {
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          getStyle={() => ({
            fontFamily: 'Arial',
            fontSize: '18px',
            resize: 'none',
            border: '1px solid lightgray',
          })}
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.style.fontFamily).toBe('Arial');
    expect(textarea.style.fontSize).toBe('18px');
    expect(textarea.style.resize).toBe('none');
    expect(textarea.style.border).toBe('1px solid lightgray');
  });

  test(`If its props include both style and getStyle(), getStyle() is called and 
  the result is merged with the style prop and applied to the style of the  
  textarea element it renders.`, () => {
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
        <FFTextArea
          form={form}
          field={form.formElements.testField}
          style={{
            fontFamily: 'Arial',
            fontSize: '18px',
          }}
          getStyle={() => ({
            resize: 'none',
            border: '1px solid lightgray',
          })}
        />
      );
    }

    render(<TestForm />);

    const textarea = document.getElementsByTagName('textarea')[0];
    expect(textarea.style.fontFamily).toBe('Arial');
    expect(textarea.style.fontSize).toBe('18px');
    expect(textarea.style.resize).toBe('none');
    expect(textarea.style.border).toBe('1px solid lightgray');
  });
});
