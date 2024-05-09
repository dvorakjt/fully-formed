import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFRadio } from '../../../components';

describe('FFRadio', () => {
  afterEach(cleanup);

  test(`It renders a radio button and a label inside a div.`, () => {
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

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent=""
          value=""
          containerClassName="container"
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementsByClassName('container')[0];
    expect(container).not.toBeUndefined();
    expect(container.nodeName).toBe('DIV');

    const input = container.children[0];
    expect(input).not.toBeUndefined();
    expect(input.nodeName).toBe('INPUT');
    expect((input as HTMLInputElement).type).toBe('radio');

    const label = container.children[1];
    expect(label).not.toBeUndefined();
    expect(label.nodeName).toBe('LABEL');
  });

  test(`The name property of the field it receives is assigned to the name 
  attribute of the input element it renders.`, () => {
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

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent=""
          value=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.name).toBe('testField');
  });

  test(`The value prop it receives is assigned to the value attribute of the 
  input element it renders.`, () => {
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
        <form>
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Red"
            value="red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Green"
            value="green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Blue"
            value="blue"
          />
        </form>
      );
    }

    render(<TestComponent />);

    const inputElements = document.getElementsByTagName('input');
    expect(inputElements[0].value).toBe('red');
    expect(inputElements[1].value).toBe('green');
    expect(inputElements[2].value).toBe('blue');
  });

  test(`The htmlFor attribute of the label it renders matches the id attribute 
  of the input element it renders.`, () => {
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

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent=""
          value=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];
    expect(input.id.length).toBeTruthy();
    expect(input.id).toBe(label.htmlFor);
  });

  test(`It renders the content it receives in the labelContent prop inside the 
  label element it renders.`, () => {
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

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent={<span>Test content</span>}
          value=""
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

  test(`The input it renders is checked when the value of the field matches that 
  of the input.`, async () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field<'favoriteColor', 'red' | 'green' | 'blue', false>({
          name: 'favoriteColor',
          defaultValue: 'red',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <form>
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Red"
            value="red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Green"
            value="green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Blue"
            value="blue"
          />
        </form>
      );
    }

    render(<TestComponent />);

    const red = screen.getByLabelText('Red') as HTMLInputElement;
    const green = screen.getByLabelText('Green') as HTMLInputElement;
    const blue = screen.getByLabelText('Blue') as HTMLInputElement;

    expect(red.checked).toBe(true);
    expect(green.checked).toBe(false);
    expect(blue.checked).toBe(false);

    form.formElements.favoriteColor.setValue('green');
    await waitFor(() => expect(green.checked).toBe(true));
    expect(red.checked).toBe(false);
    expect(blue.checked).toBe(false);

    form.formElements.favoriteColor.setValue('blue');
    await waitFor(() => expect(blue.checked).toBe(true));
    expect(red.checked).toBe(false);
    expect(green.checked).toBe(false);
  });

  test(`When the user clicks on the radio input, it updates the value of the
  underlying field.`, async () => {
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

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent={<span>Test content</span>}
          value=""
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

  test(`The input it renders is checked when the value of the field matches that 
  of the input.`, async () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field<'favoriteColor', '' | 'red' | 'green' | 'blue', false>({
          name: 'favoriteColor',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <form>
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Red"
            value="red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Green"
            value="green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Blue"
            value="blue"
          />
        </form>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(form.formElements.favoriteColor.state.value).toBe('');

    const red = screen.getByLabelText('Red') as HTMLInputElement;
    const green = screen.getByLabelText('Green') as HTMLInputElement;
    const blue = screen.getByLabelText('Blue') as HTMLInputElement;

    await user.click(red);
    expect(form.formElements.favoriteColor.state.value).toBe('red');

    await user.click(green);
    expect(form.formElements.favoriteColor.state.value).toBe('green');

    await user.click(blue);
    expect(form.formElements.favoriteColor.state.value).toBe('blue');
  });

  test(`When the user presses the spacebar on an unchecked radio button, it
  becomes checked.`, async () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field<'favoriteColor', '' | 'red' | 'green' | 'blue', false>({
          name: 'favoriteColor',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <form>
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Red"
            value="red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Green"
            value="green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            labelContent="Blue"
            value="blue"
          />
        </form>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    const red = screen.getByLabelText('Red') as HTMLInputElement;
    red.focus();
    expect(red.checked).toBe(false);

    await user.keyboard(' ');
    expect(red.checked).toBe(true);
  });

  test(`When the radio button it renders receives focus, the focused property of
  the state of the underlying field is set to true.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent=""
          value=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    expect(form.formElements.testField.state.focused).toBe(false);

    input.focus();
    expect(form.formElements.testField.state.focused).toBe(true);
  });

  test(`When the radio button it renders receives focus and is then blurred, 
  the visited property of the state of the underlying field becomes 
  true.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          labelContent=""
          value=""
        />
      );
    }

    render(<TestComponent />);

    const input = document.getElementsByTagName('input')[0];
    input.focus();
    expect(form.formElements.testField.state.visited).toBe(false);

    input.blur();
    expect(form.formElements.testField.state.visited).toBe(true);
  });

  test(`If it received containerClassName in its props, that className is 
  applied to the div it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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

  test(`If it received radioClassName in its props, that className is 
  applied to the input it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          radioClassName="radio"
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('radio');
  });

  test(`If it received getRadioClassName() is its props, that function is 
  called, and the input it renders receives the resultant className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          getRadioClassName={() => 'radio'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('radio');
  });

  test(`If it received both radioClassName and getRadioClassName(),
  getRadioClassName() is called, the resultant className is joined with 
  radioClassName, and the result is applied to the input it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          radioClassName="class1"
          getRadioClassName={() => 'class2'}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.className).toBe('class1 class2');
  });

  test(`If it received radioStyle, those styles are applied to the input 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          radioStyle={{
            boxShadow: '4px 4px gray',
            border: '2px solid black',
          }}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('2px solid black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received getRadioStyle(), that function is called and the
  resultant styles are applied to the input element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          getRadioStyle={() => ({
            boxShadow: '4px 4px gray',
            border: '2px solid black',
          })}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('2px solid black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received both radioStyle and getRadioStyle(),
  getRadioStyle() is called, and the result is merged with radioStyle
  and then applied to the input element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
          labelContent=""
          radioStyle={{
            boxShadow: '4px 4px gray',
          }}
          getRadioStyle={() => ({
            border: '2px solid black',
          })}
        />
      );
    }

    render(<TestForm />);

    const input = document.getElementsByTagName('input')[0];
    expect(input.style.border).toBe('2px solid black');
    expect(input.style.boxShadow).toBe('4px 4px gray');
  });

  test(`If it received labelClassName in its props, that className is 
  applied to the label it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadio
          form={form}
          field={form.formElements.testField}
          value=""
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
