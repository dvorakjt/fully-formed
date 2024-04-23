import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormTemplate,
  Field,
  FormFactory,
  StringValidators,
  Group,
  Validity,
} from '../../../model';
import {
  FFFieldMessages,
  FFInput,
  getFieldMessagesContainerId,
} from '../../../components';
import { useForm } from '../../../hooks';

describe('FFFieldMessages', () => {
  afterEach(cleanup);

  test(`It renders a div element with an id derived from the id of the field it 
  received as a prop.`, () => {
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
        <FFFieldMessages form={form} field={form.formElements.testField} />
      );
    }

    render(<TestForm />);

    expect(
      document.getElementById(
        getFieldMessagesContainerId(form.formElements.testField.id),
      )?.nodeName,
    ).toBe('DIV');
  });

  test(`If its props contain containerClassName, that className is applied to 
  the div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          containerClassName="test-field-messages"
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.className).toBe('test-field-messages');
  });

  test(`If its props contain getContainerClassName(), that function is called
  and the resultant className is applied to the the div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          getContainerClassName={() => 'test-field-messages'}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.className).toBe('test-field-messages');
  });

  test(`If its props contain both containerClassName and 
  getContainerClassName(), getContainerClassName() is called, the className it 
  returns is merged with containerClassName, and the result is applied to the 
  div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          containerClassName="class-1"
          getContainerClassName={() => 'class-2'}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.className).toBe('class-1 class-2');
  });

  test(`If its props contain containerStyle, those styles are applied to the 
  div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          containerStyle={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.style.display).toBe('flex');
    expect(container?.style.flexDirection).toBe('column');
  });

  test(`If its props contain getContainerStyle(), that function is called and 
  the resultant styles are applied to the div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          getContainerStyle={() => ({
            display: 'flex',
            flexDirection: 'column',
          })}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.style.display).toBe('flex');
    expect(container?.style.flexDirection).toBe('column');
  });

  test(`If its props contain both containerStyle and getContainerStyle(),
  getContainerStyle() is called and the resultant styles are merged with 
  containerStyle and applied to the div it returns.`, () => {
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
        <FFFieldMessages
          form={form}
          field={form.formElements.testField}
          containerStyle={{
            display: 'grid',
          }}
          getContainerStyle={() => ({
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '8px',
            rowGap: '8px',
          })}
        />
      );
    }

    render(<TestForm />);

    const container = document.getElementById(
      getFieldMessagesContainerId(form.formElements.testField.id),
    );
    expect(container?.style.display).toBe('grid');
    expect(container?.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    expect(container?.style.columnGap).toBe('8px');
    expect(container?.style.rowGap).toBe('8px');
  });

  test(`It maps the underlying field's messages to Message components.`, () => {
    const validatorMessages = {
      includesLower: 'The password must include a lowercase letter.',
      includesUpper: 'The password must include an uppercase letter.',
      includesDigit: 'The password must include a digit.',
      includesSymbol: 'The password must include a symbol',
    };

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'password',
          defaultValue: '',
          validators: [
            StringValidators.includesLower({
              invalidMessage: validatorMessages.includesLower,
            }),
            StringValidators.includesUpper({
              invalidMessage: validatorMessages.includesUpper,
            }),
            StringValidators.includesDigit({
              invalidMessage: validatorMessages.includesDigit,
            }),
            StringValidators.includesSymbol({
              invalidMessage: validatorMessages.includesSymbol,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return <FFFieldMessages form={form} field={form.formElements.password} />;
    }

    render(<TestForm />);

    const messages = document.getElementsByTagName('span');
    const expectedMessages = Object.values(validatorMessages);

    for (let i = 0; i < expectedMessages.length; i++) {
      expect(messages[i].textContent).toBe(expectedMessages[i]);
    }
  });

  test(`When the underlying field's messages are updated, the messages it 
  displays are updated.`, async () => {
    const validMessage = 'Please enter a valid email address.';
    const invalidMessage = 'The email address is valid.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: '',
          validators: [
            StringValidators.email({
              validMessage,
              invalidMessage,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <>
          <FFInput form={form} field={form.formElements.email} type="email" />
          <FFFieldMessages form={form} field={form.formElements.email} />
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(screen.queryByText(invalidMessage)).not.toBeNull();

    const input = document.getElementsByTagName('input')[0];
    await user.type(input, 'user@example.com');
    await waitFor(() =>
      expect(screen.queryByText(validMessage)).not.toBeNull(),
    );
    expect(screen.queryByText(invalidMessage)).toBeNull();
  });

  test(`It maps the messages of groups it receives in its props to Message 
  components.`, () => {
    const passwordsDoNotMatch =
      'Please ensure the re-entered password matches the password.';

    class Template extends FormTemplate {
      public readonly name = 'signUpForm';

      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
          validators: [
            StringValidators.email({
              invalidMessage: 'Please enter a valid email address.',
            }),
          ],
        }),
        new Field({
          name: 'password',
          defaultValue: 'MySuperSecretPassword',
          validators: [
            StringValidators.required({
              invalidMessage: 'Password is required.',
            }),
          ],
        }),
        new Field({
          name: 'confirmPassword',
          defaultValue: 'NotMySuperSecretPassword',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please re-enter your password.',
            }),
          ],
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'passwordGroup',
          members: [this.formElements[1], this.formElements[2]],
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
              invalidMessage: passwordsDoNotMatch,
              validMessage: 'The passwords match.',
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.confirmPassword}
          groups={[form.groups.passwordGroup]}
        />
      );
    }

    render(<TestForm />);
    expect(screen.queryByText(passwordsDoNotMatch)).not.toBeNull();
  });

  test(`When the messages of groups it receives as props are updated, the 
  messages it displays are updated.`, async () => {
    const passwordsDoNotMatch =
      'Please ensure the re-entered password matches the password.';
    const passwordsMatch = 'The passwords match.';

    class Template extends FormTemplate {
      public readonly name = 'signUpForm';

      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
          validators: [
            StringValidators.email({
              invalidMessage: 'Please enter a valid email address.',
            }),
          ],
        }),
        new Field({
          name: 'password',
          defaultValue: 'MySuperSecretPassword',
          validators: [
            StringValidators.required({
              invalidMessage: 'Password is required.',
            }),
          ],
        }),
        new Field({
          name: 'confirmPassword',
          defaultValue: 'NotMySuperSecretPassword',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please re-enter your password.',
            }),
          ],
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'passwordGroup',
          members: [this.formElements[1], this.formElements[2]],
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
              invalidMessage: passwordsDoNotMatch,
              validMessage: passwordsMatch,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestForm(): React.JSX.Element {
      return (
        <>
          <FFInput
            form={form}
            field={form.formElements.confirmPassword}
            type="password"
          />
          <FFFieldMessages
            form={form}
            field={form.formElements.confirmPassword}
            groups={[form.groups.passwordGroup]}
          />
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestForm />);
    expect(screen.queryByText(passwordsDoNotMatch)).not.toBeNull();

    const confirmPassword = document.getElementsByTagName('input')[0];
    await user.clear(confirmPassword);
    await user.type(confirmPassword, 'MySuperSecretPassword');
    await waitFor(() =>
      expect(screen.queryByText(passwordsMatch)).not.toBeNull(),
    );
    expect(screen.queryByText(passwordsDoNotMatch)).toBeNull();
  });

  test(`If its props contain messageClassName, that className is applied to any 
  Message components it renders.`, () => {
    const messageText = 'Name is required';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'name',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: messageText,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.name}
          messageClassName="test-message"
        />
      );
    }

    render(<TestForm />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('test-message');
  });

  test(`If its props contain getMessageClassName(), that function is called and
  the resultant className is applied to any Message components it renders.`, () => {
    const messageText = 'Name is required';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'name',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: messageText,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.name}
          getMessageClassName={() => 'test-message'}
        />
      );
    }

    render(<TestForm />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('test-message');
  });

  test(`If its props contain both messageClassName and getMessageClassName(), 
  getClassName() is called, the resultant className is merged with 
  messageClassName, and the result is applied to any Message components that
  it renders.`, () => {
    const messageText = 'Name is required';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'name',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: messageText,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.name}
          messageClassName="class-1"
          getMessageClassName={() => 'class-2'}
        />
      );
    }

    render(<TestForm />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('class-1 class-2');
  });

  test(`If its props contain messageStyle, those styles are applied to any 
  messages it renders.`, () => {
    const messageText = 'Name is required';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'name',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: messageText,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.name}
          messageStyle={{
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'red',
          }}
        />
      );
    }

    render(<TestForm />);

    const message = screen.queryByText(messageText);
    expect(message?.style.display).toBe('block');
    expect(message?.style.fontFamily).toBe('Arial');
    expect(message?.style.fontSize).toBe('12px');
    expect(message?.style.fontStyle).toBe('italic');
    expect(message?.style.color).toBe('red');
  });

  test(`If its props contain getMessageStyle(), that function is called and the 
  resultant styles are applied to any Message components it renders.`, () => {
    const includesLower = 'The password includes a lowercase letter.';
    const doesNotIncludeUpper =
      'The password must include an uppercase letter.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'password',
          defaultValue: 'mysupersecretpassword',
          validators: [
            StringValidators.includesLower({
              validMessage: includesLower,
            }),
            StringValidators.includesUpper({
              invalidMessage: doesNotIncludeUpper,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.password}
          getMessageStyle={({ validity }) => ({
            color: validity === Validity.Valid ? 'green' : 'red',
          })}
        />
      );
    }

    render(<TestForm />);

    const validMessage = screen.queryByText(includesLower);
    expect(validMessage?.style.color).toBe('green');

    const invalidMessage = screen.queryByText(doesNotIncludeUpper);
    expect(invalidMessage?.style.color).toBe('red');
  });

  test(`If its props contain both messageStyle and getMessageStyle(), 
  getMessageStyle() is called, the resultant styles are merged with 
  messageStyle, and the result is applied to any Message components it 
  renders.`, () => {
    const includesLower = 'The password includes a lowercase letter.';
    const doesNotIncludeUpper =
      'The password must include an uppercase letter.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'password',
          defaultValue: 'mysupersecretpassword',
          validators: [
            StringValidators.includesLower({
              validMessage: includesLower,
            }),
            StringValidators.includesUpper({
              invalidMessage: doesNotIncludeUpper,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestForm(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFFieldMessages
          form={form}
          field={form.formElements.password}
          messageStyle={{
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '12px',
            fontStyle: 'italic',
          }}
          getMessageStyle={({ validity }) => ({
            color: validity === Validity.Valid ? 'green' : 'red',
          })}
        />
      );
    }

    render(<TestForm />);

    const validMessage = screen.queryByText(includesLower);
    expect(validMessage?.style.display).toBe('block');
    expect(validMessage?.style.fontFamily).toBe('Arial');
    expect(validMessage?.style.fontSize).toBe('12px');
    expect(validMessage?.style.fontStyle).toBe('italic');
    expect(validMessage?.style.color).toBe('green');

    const invalidMessage = screen.queryByText(doesNotIncludeUpper);
    expect(invalidMessage?.style.display).toBe('block');
    expect(invalidMessage?.style.fontFamily).toBe('Arial');
    expect(invalidMessage?.style.fontSize).toBe('12px');
    expect(invalidMessage?.style.fontStyle).toBe('italic');
    expect(invalidMessage?.style.color).toBe('red');
  });
});
