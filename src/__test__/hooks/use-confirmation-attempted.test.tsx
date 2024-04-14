import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { FormFactory, FormTemplate } from '../../model';
import { useConfirmationAttempted } from '../../hooks';

describe('useConfirmationAttempted()', () => {
  afterEach(cleanup);

  test(`It returns a boolean value that indicates whether or not the confirm() 
  method of the form it receives has been called.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [];
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.ReactNode {
      const confirmationAttempted = useConfirmationAttempted(form);

      return <span>Confirmed = {confirmationAttempted.toString()}</span>;
    }

    render(<TestComponent />);
    expect(screen.queryByText('Confirmed = false')).not.toBeNull();

    form.confirm();

    await waitFor(() =>
      expect(screen.queryByText('Confirmed = true')).not.toBeNull(),
    );
    expect(screen.queryByText('Confirmed = false')).toBeNull();
  });
});
