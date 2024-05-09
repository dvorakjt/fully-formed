import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, DerivedValue, FormFactory } from '../../model';
import { useDerivedValue, useForm } from '../../hooks';
import { FFInput } from '../../components';

describe('useDerivedValue()', () => {
  afterEach(cleanup);

  test(`It returns a value which is updated when the value of the underlying 
  AbstractDerivedValue is updated.`, async () => {
    const messages = {
      invalidDate: 'Please enter your birthday.',
      notBirthday: "It's not your birthday yet!",
      isBirthday: 'Happy birthday!',
    };

    class Template extends FormTemplate {
      public readonly formElements = [
        new Field({ name: 'birthday', defaultValue: '' }),
      ] as const;

      public readonly derivedValues = [
        new DerivedValue({
          name: 'birthdayMessage',
          sources: this.formElements,
          deriveFn: ([{ value }]): string => {
            if (!isDate(value)) {
              return messages.invalidDate;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_year, month, day] = value.split('-');

            if (month === '04' && day === '15') return messages.isBirthday;

            return messages.notBirthday;
          },
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());
      const birthdayMessage = useDerivedValue(
        form.derivedValues.birthdayMessage,
      );

      return (
        <>
          <FFInput form={form} field={form.formElements.birthday} type="date" />
          <span>{birthdayMessage}</span>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(screen.queryByText(messages.invalidDate)).not.toBeNull();

    const input = document.getElementsByTagName('input')[0];

    await user.type(input, '1990-12-31');
    await waitFor(() =>
      expect(screen.queryByText(messages.notBirthday)).not.toBeNull(),
    );
    expect(screen.queryByText(messages.invalidDate)).toBeNull();

    await user.clear(input);
    await user.type(input, '1990-04-15');
    await waitFor(() =>
      expect(screen.queryByText(messages.isBirthday)).not.toBeNull(),
    );
    expect(screen.queryByText(messages.notBirthday)).toBeNull();
  });
});

function isDate(str: string): boolean {
  return !Number.isNaN(new Date(str).getMilliseconds());
}
