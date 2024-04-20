import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { StringCheckbox } from '../../../components';

describe('StringCheckbox', () => {
  afterEach(cleanup);

  test('It renders an input component and a label inside a div.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="checkboxContainer"
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementsByClassName('checkboxContainer')[0];
    expect(container).not.toBeUndefined();
    expect(container.nodeName).toBe('DIV');

    const input = container.children[0];
    expect(input).not.toBeUndefined();
    expect(input.nodeName).toBe('INPUT');
    expect(input.getAttribute('type')).toBe('checkbox');

    const label = container.children[1];
    expect(label).not.toBeUndefined();
    expect(label.nodeName).toBe('LABEL');
  });

  test(`It renders an input element whose name matches that of the field it 
  received.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.name).toBe('testCheckbox');
  });

  test(`It renders an input element whose id matches that of the field it 
  received.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          id: 'test-checkbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.id).toBe('test-checkbox');
  });

  test(`It renders a label whose htmlFor attribute matches the id of the field 
  it received.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          id: 'test-checkbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    render(<TestComponent />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.htmlFor).toBe('test-checkbox');
  });

  test(`It renders the content it receives through the labelContent prop inside 
  the label it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent={<span>Test content</span>}
        />
      );
    }

    render(<TestComponent />);

    const label = document.getElementsByTagName('label')[0];
    const content = label.children[0];
    expect(content).not.toBeUndefined();
    expect(content.nodeName).toBe('SPAN');
    expect(content.textContent).toBe('Test content');
  });

  test(`The checked attribute of the input it renders defaults to true if the 
  value of the field it received matches its own value prop, and false 
  otherwise.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'trueByDefault',
          defaultValue: 'on',
        }),
        new Field({
          name: 'falseByDefault',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <>
          <StringCheckbox
            form={form}
            field={form.formElements.trueByDefault}
            labelContent="Checked"
          />
          <StringCheckbox
            form={form}
            field={form.formElements.falseByDefault}
            labelContent="Unchecked"
          />
        </>
      );
    }

    render(<TestForm />);

    const [checked, unchecked] = document.getElementsByTagName('input');
    expect(checked.checked).toBe(true);
    expect(unchecked.checked).toBe(false);
  });

  test(`When the value of the underlying field is updated, the checked attribute 
  of the input it renders is updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.checked).toBe(false);

    form.formElements.testCheckbox.setValue('on');
    await waitFor(() => expect(input.checked).toBe(true));
  });

  test(`When the user clicks the checkbox, the checked attribute of the input it 
  renders changes.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.checked).toBe(false);

    await user.click(input);
    await waitFor(() => expect(input.checked).toBe(true));

    await user.click(input);
    await waitFor(() => expect(input.checked).toBe(false));
  });

  test(`When the user clicks the checkbox, the value of the underlying field is 
  updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.checked).toBe(false);

    await user.click(input);
    expect(form.formElements.testCheckbox.state.value).toBe('on');

    await user.click(input);
    expect(form.formElements.testCheckbox.state.value).toBe('');
  });

  test(`When the user clicks on the input, the focused property of the state of 
  the underlying field becomes true.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(form.formElements.testCheckbox.state.focused).toBe(false);

    await user.click(input);
    expect(form.formElements.testCheckbox.state.focused).toBe(true);
  });

  test(`When the input receives focus and is then blurred, the visited property 
  of the state of the underlying field becomes true.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
        />
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(form.formElements.testCheckbox.state.visited).toBe(false);

    await user.click(input);
    expect(form.formElements.testCheckbox.state.visited).toBe(false);

    input.blur();
    expect(form.formElements.testCheckbox.state.visited).toBe(true);
  });

  test(`If it received containerClassName in its props, that className is 
  applied to the div it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="container"
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName('container')[0];
    expect(container).not.toBeUndefined();
    expect(container.nodeName).toBe('DIV');
  });

  test(`If it received getContainerClassName() is its props, that function is 
  called, and the div it renders receives the resultant className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          getContainerClassName={() => 'container'}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName('container')[0];
    expect(container).not.toBeUndefined();
    expect(container.nodeName).toBe('DIV');
  });

  test(`If it received both containerClassName and getContainerClassName(),
  getContainerClassName() is called, the resultant className is joined with 
  containerClassName, and the result is applied to the div it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="class1"
          getContainerClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName('class1 class2')[0];
    expect(container).not.toBeUndefined();
    expect(container.nodeName).toBe('DIV');
  });

  test(`If it received containerStyle, those styles are applied to the div 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="container"
          containerStyle={{
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName(
      'container',
    )[0] as HTMLDivElement;
    expect(container.style.display).toBe('flex');
    expect(container.style.flexDirection).toBe('row-reverse');
  });

  test(`If it received getContainerStyle(), that function is called and the
  resultant styles are applied to the div element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="container"
          getContainerStyle={() => ({
            display: 'flex',
            flexDirection: 'row-reverse',
          })}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName(
      'container',
    )[0] as HTMLDivElement;
    expect(container.style.display).toBe('flex');
    expect(container.style.flexDirection).toBe('row-reverse');
  });

  test(`If it received both containerStyle and getContainerStyle(),
  getContainerStyle() is called, and the result is merged with containerStyle
  and then applied to the div element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          containerClassName="container"
          containerStyle={{
            display: 'flex',
          }}
          getContainerStyle={() => ({
            flexDirection: 'row-reverse',
          })}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementsByClassName(
      'container',
    )[0] as HTMLDivElement;
    expect(container.style.display).toBe('flex');
    expect(container.style.flexDirection).toBe('row-reverse');
  });

  test(`If it received checkboxClassName in its props, that className is 
  applied to the input it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          checkboxClassName="checkbox"
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('checkbox');
  });

  test(`If it received getCheckboxClassName() is its props, that function is 
  called, and the input it renders receives the resultant className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          getCheckboxClassName={() => 'checkbox'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('checkbox');
  });

  test(`If it received both checkboxClassName and getCheckboxClassName(),
  getCheckboxClassName() is called, the resultant className is joined with 
  checkboxClassName, and the result is applied to the input it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          checkboxClassName="class1"
          getCheckboxClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('class1 class2');
  });

  test(`If it received checkboxStyle, those styles are applied to the input 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          checkboxStyle={{
            boxShadow: '4px 4px gray',
            border: '1px dotted black',
          }}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px dotted black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received getCheckboxStyle(), that function is called and the
  resultant styles are applied to the input element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          getCheckboxStyle={() => ({
            boxShadow: '4px 4px gray',
            border: '1px dotted black',
          })}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px dotted black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received both checkboxStyle and getCheckboxStyle(),
  getCheckboxStyle() is called, and the result is merged with checkboxStyle
  and then applied to the input element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          checkboxStyle={{
            boxShadow: '4px 4px gray',
          }}
          getCheckboxStyle={() => ({
            border: '1px dotted black',
          })}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('1px dotted black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received labelClassName in its props, that className is 
  applied to the label it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          labelClassName="label"
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('label');
  });

  test(`If it received getLabelClassName() is its props, that function is 
  called, and the label it renders receives the resultant className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          getLabelClassName={() => 'label'}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('label');
  });

  test(`If it received both labelClassName and getLabelClassName(),
  getLabelClassName() is called, the resultant className is joined with 
  labelClassName, and the result is applied to the label it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          labelClassName="class1"
          getLabelClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.className).toBe('class1 class2');
  });

  test(`If it received labelStyle, those styles are applied to the label 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          labelStyle={{
            fontFamily: 'Arial',
            fontSize: '18px',
          }}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });

  test(`If it received getLabelStyle(), that function is called and the
  resultant styles are applied to the label element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          getLabelStyle={() => ({
            fontFamily: 'Arial',
            fontSize: '18px',
          })}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });

  test(`If it received both labelStyle and getLabelStyle(),
  getLabelStyle() is called, and the result is merged with labelStyle
  and then applied to the label element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'testCheckbox',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <StringCheckbox
          form={form}
          field={form.formElements.testCheckbox}
          labelContent=""
          labelStyle={{
            fontFamily: 'Arial',
          }}
          getLabelStyle={() => ({
            fontSize: '18px',
          })}
        />
      );
    }

    render(<TestForm />);

    const label = document.getElementsByTagName('label')[0];
    expect(label.style.fontFamily).toBe('Arial');
    expect(label.style.fontSize).toBe('18px');
  });
});
