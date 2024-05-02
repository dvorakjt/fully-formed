import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { useForm } from '../../../hooks';
import { FFMultiSelect } from '../../../components';
import { getSelectedOptionValues } from '../../../test-utils';

describe('FFMultiSelect', () => {
  afterEach(cleanup);

  test('It renders an html select element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['apple'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const selectElements = document.getElementsByTagName('select');
    expect(selectElements.length).toBe(1);
  });

  test(`The name property of the select element it renders is set to the name 
  property of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['apple'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.name).toBe(form.formElements.favoriteFruits.name);
  });

  test(`The id property of the select element it renders is set to the id 
  property of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['apple'],
          id: 'favorite-fruits',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.id).toBe(form.formElements.favoriteFruits.id);
  });

  test(`Any options or optgroups it receives are rendered inside the select 
  element.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteInstruments', string[], false>({
          name: 'favoriteInstruments',
          defaultValue: [],
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
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteInstruments}
        >
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
        </FFMultiSelect>
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

  test(`The value of the select element is the first option that is included 
  in the value of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['mango', 'watermelon'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.value).toBe('mango');
  });

  test(`The values of the selectedOptions of the select element are the values 
  included in the value array of the underlying field.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['watermelon', 'mango'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    const selectedValues = getSelectedOptionValues(select);
    expect(selectedValues.length).toBe(
      form.formElements.favoriteFruits.state.value.length,
    );
    expect(selectedValues).toEqual(
      expect.arrayContaining(form.formElements.favoriteFruits.state.value),
    );
  });

  test(`When the value of the underlying field is updated, the value of the
  select element is updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['apple'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.value).toBe('apple');

    form.formElements.favoriteFruits.setValue(['watermelon']);
    await waitFor(() => expect(select.value).toBe('watermelon'));
  });

  test(`When the value of the underlying field is updated, the selectedOptions
  property of the select element is updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['apple', 'banana'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    const selectedValues = getSelectedOptionValues(select);
    expect(selectedValues).toStrictEqual(['apple', 'banana']);

    form.formElements.favoriteFruits.setValue(['peach', 'watermelon']);
    await waitFor(() =>
      expect(getSelectedOptionValues(select)).toStrictEqual([
        'peach',
        'watermelon',
      ]),
    );
  });

  test(`When the user selects an option, the value of the underlying field is 
  updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([]);

    const select = document.getElementsByTagName('select')[0];
    await user.selectOptions(select, ['apple', 'banana', 'watermelon']);
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([
      'apple',
      'banana',
      'watermelon',
    ]);
  });

  test(`When the user deselects an option, the value of the underlying field is
  updated.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: ['banana', 'mango', 'peach'],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([
      'banana',
      'mango',
      'peach',
    ]);

    const select = document.getElementsByTagName('select')[0];
    await user.deselectOptions(select, 'banana');
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([
      'mango',
      'peach',
    ]);

    await user.deselectOptions(select, 'mango');
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([
      'peach',
    ]);

    await user.deselectOptions(select, 'peach');
    expect(form.formElements.favoriteFruits.state.value).toStrictEqual([]);
  });

  test(`When the select element receives focus, the focused property of the 
  state of the underlying field becomes true.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);
    expect(form.formElements.favoriteFruits.state.focused).toBe(false);

    const select = document.getElementsByTagName('select')[0];
    select.focus();
    expect(form.formElements.favoriteFruits.state.focused).toBe(true);
  });

  test(`When the select element receives focus and is then blurred, the 
  visited property of the underlying field becomes true.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFMultiSelect form={form} field={form.formElements.favoriteFruits}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);
    expect(form.formElements.favoriteFruits.state.visited).toBe(false);

    const select = document.getElementsByTagName('select')[0];
    select.focus();
    expect(form.formElements.favoriteFruits.state.visited).toBe(false);

    select.blur();
    expect(form.formElements.favoriteFruits.state.visited).toBe(true);
  });

  test(`If its props include className, the select element it renders receives 
  that className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
          className="test-select"
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('test-select');
  });

  test(`If its props include getClassName, that function is called the select 
  element it renders receives the resulting className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
          getClassName={() => 'test-select'}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('test-select');
  });

  test(`If its props include both className and getClassName, getClassName() is 
  called and then merged with className.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
          className="class1"
          getClassName={() => 'class2'}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="mango">Mango</option>
          <option value="peach">Peach</option>
          <option value="watermelon">Watermelon</option>
        </FFMultiSelect>
      );
    }

    render(<TestComponent />);

    const select = document.getElementsByTagName('select')[0];
    expect(select.className).toBe('class1 class2');
  });

  test(`If its props include style, those styles are applied to the select 
  element it renders.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
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
        </FFMultiSelect>
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
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
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
        </FFMultiSelect>
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
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field<'favoriteFruits', string[], false>({
          name: 'favoriteFruits',
          defaultValue: [],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFMultiSelect
          form={form}
          field={form.formElements.favoriteFruits}
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
        </FFMultiSelect>
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
