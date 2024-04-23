import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, FormFactory, FormTemplate, Group } from '../../model';
import { useCombinedMessages, useForm } from '../../hooks';
import { FFInput } from '../../components';

describe('useCombinedMessages()', () => {
  afterEach(cleanup);

  test(`It returns an array containing the messages of all messageBearers it 
  receives.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'stateAndZip';
      public readonly formElements = [
        new Field({
          name: 'state',
          defaultValue: 'CA',
        }),
        new Field({
          name: 'zip',
          defaultValue: '19022',
          validatorTemplates: [
            {
              predicate: (value): boolean => {
                return /\d{5}/.test(value);
              },
              validMessage: 'ZIP code is valid.',
            },
          ],
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'stateAndZip',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ zip }): boolean => {
                return isCaliforniaZipCode(zip);
              },
              invalidMessage: 'Please enter a ZIP code within your state.',
              validMessage: 'ZIP code is within your state.',
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());
      const messages = useCombinedMessages(
        form.formElements.zip,
        form.groups.stateAndZip,
      );

      return (
        <form>
          <FFInput form={form} field={form.formElements.zip} type="number" />
          <div>
            {messages.map((message, index) => {
              return <span key={index}>{message.text}</span>;
            })}
          </div>
        </form>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    expect(screen.queryByText('ZIP code is valid.')).not.toBeNull();
    expect(
      screen.queryByText('Please enter a ZIP code within your state.'),
    ).not.toBeNull();

    const input = document.getElementsByTagName('input')[0];
    await user.clear(input);
    await user.type(input, '90210');
    await waitFor(() =>
      expect(
        screen.queryByText('ZIP code is within your state.'),
      ).not.toBeNull(),
    );
    expect(screen.queryByText('ZIP code is valid.')).not.toBeNull();
    expect(
      screen.queryByText('Please enter a ZIP code within your state.'),
    ).toBeNull();
  });
});

function isCaliforniaZipCode(zipCode: string): boolean {
  if (!/\d{5}/.test(zipCode)) return false;

  const relevantDigits = Number(zipCode.slice(0, 3));

  return relevantDigits >= 900 && relevantDigits <= 961;
}
