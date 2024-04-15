import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormTemplate,
  ExcludableField,
  Field,
  FormFactory,
  type AbstractField,
  type AbstractExcludableField,
  type ControlledExcludableFieldState,
} from '../../model';
import { Input } from '../../components';
import { useExclude, useFieldState } from '../../hooks';

describe('useExclude()', () => {
  afterEach(cleanup);

  test(`It returns a boolean value indicating whether or not an Excludable 
  form element is excluded.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements: [
        AbstractField<'changedName', boolean, false>,
        AbstractExcludableField<'previousName', string, false>,
      ];

      public constructor() {
        super();
        const changedName = new Field({
          name: 'changedName',
          defaultValue: false,
        });
        this.formElements = [
          changedName,
          new ExcludableField({
            name: 'previousName',
            defaultValue: '',
            controlledBy: {
              controllers: [changedName],
              controlFn: ([
                { value },
              ]): ControlledExcludableFieldState<string> => {
                return {
                  exclude: !value,
                };
              },
            },
          }),
        ];
      }
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.ReactNode {
      const changedNameState = useFieldState(form.formElements.changedName);
      const exclude = useExclude(form.formElements.previousName);

      return (
        <>
          <input
            name="changedName"
            id="changedName"
            type="checkbox"
            checked={changedNameState.value}
            onChange={e => {
              form.formElements.changedName.setValue(e.target.checked);
            }}
          />
          {!exclude && (
            <Input
              form={form}
              field={form.formElements.previousName}
              type="text"
              disabledWhenExcluded={true}
            />
          )}
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    expect(document.getElementById(form.formElements.previousName.id)).toBe(
      null,
    );

    const changedName = document.getElementById('changedName')!;
    await user.click(changedName);
    await waitFor(() =>
      expect(
        document.getElementById(form.formElements.previousName.id),
      ).not.toBe(null),
    );
  });
});
