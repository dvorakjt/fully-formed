import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFSelect } from '../../../components';

describe('FFSelect', () => {
  afterEach(cleanup);

  test('It renders an html select element.', () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const selectElements = document.getElementsByTagName('select');
    expect(selectElements.length).toBe(1);
  });

  test(`The name property of the select element it renders is set to the name 
  property of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.name).toBe(form.formElements.favoriteFruit.name);
  });

  test(`The id property of the select element it renders is set to the id 
  property of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
          id: 'favorite-fruit',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.id).toBe(form.formElements.favoriteFruit.id);
  });

  test(`Any options or optgroups it receives are rendered inside the select 
  element.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteInstrument',
          defaultValue: 'clarinet',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    const options = {
      strings: ['violin', 'viola', 'cello', 'bass'],
      woodwinds: ['flute', 'oboe', 'clarinet', 'bassoon'],
      brass: ['trumpet', 'french horn', 'trombone', 'tuba'],
    };

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect form={form} field={form.formElements.favoriteInstrument}>
          <optgroup label="Strings">
            {options.strings.map((instrument, index) => (
              <option value={instrument} key={index}>
                {instrument}
              </option>
            ))}
          </optgroup>
          <optgroup label="Woodwinds">
            {options.woodwinds.map((instrument, index) => (
              <option value={instrument} key={index}>
                {instrument}
              </option>
            ))}
          </optgroup>
          <optgroup label="Brass">
            {options.brass.map((instrument, index) => (
              <option value={instrument} key={index}>
                {instrument}
              </option>
            ))}
          </optgroup>
          <option value="intonarumori">Intonarumori</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    const [strings, woodwinds, brass, intonarumori] = select.children;
    expect(strings.nodeName).toBe('OPTGROUP');
    expect(woodwinds.nodeName).toBe('OPTGROUP');
    expect(brass.nodeName).toBe('OPTGROUP');
    expect(intonarumori.nodeName).toBe('OPTION');

    for (let i = 0; i < options.strings.length; i++) {
      const option = strings.children[i];
      expect(option.nodeName).toBe('OPTION');
      expect((option as HTMLOptionElement).value).toBe(options.strings[i]);
    }

    for (let i = 0; i < options.woodwinds.length; i++) {
      const option = woodwinds.children[i];
      expect(option.nodeName).toBe('OPTION');
      expect((option as HTMLOptionElement).value).toBe(options.woodwinds[i]);
    }

    for (let i = 0; i < options.brass.length; i++) {
      const option = brass.children[i];
      expect(option.nodeName).toBe('OPTION');
      expect((option as HTMLOptionElement).value).toBe(options.brass[i]);
    }

    expect((intonarumori as HTMLOptionElement).value).toBe('intonarumori');
  });

  test(`The value of the select element is set to the value of the underlying 
  field.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'mango',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.value).toBe('mango');
  });

  test(`When the value of the underlying field is updated, the value of the
  select element is updated.`, async () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.value).toBe('apple');

    form.formElements.favoriteFruit.setValue('watermelon');
    await waitFor(() => expect(select.value).toBe('watermelon'));
  });

  test(`When the user selects an option, the value of the underlying field is 
  updated.`, async () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(form.formElements.favoriteFruit.state.value).toBe('apple');

    const select = document.getElementsByTagName('select')[0];
    await user.selectOptions(select, 'banana');
    expect(form.formElements.favoriteFruit.state.value).toBe('banana');
  });

  test(`When the select element receives focus, the focused property of the 
  state of the underlying field becomes true.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);
    expect(form.formElements.favoriteFruit.state.focused).toBe(false);

    const select = document.getElementsByTagName('select')[0];
    select.focus();
    expect(form.formElements.favoriteFruit.state.focused).toBe(true);
  });

  test(`When the select element receives focus and is then blurred, the 
  visited property of the underlying field becomes true.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFSelect form={form} field={form.formElements.favoriteFruit}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);
    expect(form.formElements.favoriteFruit.state.visited).toBe(false);

    const select = document.getElementsByTagName('select')[0];
    select.focus();
    expect(form.formElements.favoriteFruit.state.visited).toBe(false);

    select.blur();
    expect(form.formElements.favoriteFruit.state.visited).toBe(true);
  });

  test(`If its props include className, the select element it renders receives 
  that className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          className="test-select"
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('test-select');
  });

  test(`If its props include getClassName, that function is called the select 
  element it renders receives the resulting className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          getClassName={() => 'test-select'}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('test-select');
  });

  test(`If its props include both className and getClassName, getClassName() is 
  called and then merged with className.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          className="class1"
          getClassName={() => 'class2'}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('class1 class2');
  });

  test(`If its props include style, those styles are applied to the select 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          style={{
            fontFamily: 'Arial',
            fontSize: '12px',
            backgroundColor: 'lime',
            border: '2px solid yellow',
          }}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.style.fontFamily).toBe('Arial');
    expect(select.style.fontSize).toBe('12px');
    expect(select.style.backgroundColor).toBe('lime');
    expect(select.style.border).toBe('2px solid yellow');
  });

  test(`If its props include getStyle(), getStyle() is called and the result is 
  applied to the select element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          getStyle={() => ({
            fontFamily: 'Arial',
            fontSize: '12px',
            backgroundColor: 'lime',
            border: '2px solid yellow',
          })}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.style.fontFamily).toBe('Arial');
    expect(select.style.fontSize).toBe('12px');
    expect(select.style.backgroundColor).toBe('lime');
    expect(select.style.border).toBe('2px solid yellow');
  });

  test(`If its props include both style and getStyle(), getStyle() is called and 
  the result is merged with the style prop and applied to the select element it 
  renders.`, () => {
    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({
          name: 'favoriteFruit',
          defaultValue: 'apple',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteFruit}
          style={{
            fontFamily: 'Arial',
            fontSize: '12px',
          }}
          getStyle={() => ({
            backgroundColor: 'lime',
            border: '2px solid yellow',
          })}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.style.fontFamily).toBe('Arial');
    expect(select.style.fontSize).toBe('12px');
    expect(select.style.backgroundColor).toBe('lime');
    expect(select.style.border).toBe('2px solid yellow');
  });
});
