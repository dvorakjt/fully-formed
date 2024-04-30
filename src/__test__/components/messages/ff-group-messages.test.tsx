import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import {
  FormTemplate,
  Field,
  Group,
  FormFactory,
  Validity,
} from '../../../model';
import { useForm } from '../../../hooks';
import { FFGroupMessages } from '../../../components/messages/ff-group-messages';

describe('FFGroupMessages', () => {
  afterEach(cleanup);

  test(`It renders a div element whose id is the containerId it received as a 
  prop.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerId="email-group-messages"
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementById('email-group-messages');
    expect(container).toBeTruthy();
    expect(container?.nodeName).toBe('DIV');
  });

  test(`It renders an FFMessage component for each of the messages of the 
  messageBearers it receives.`, async () => {
    const emailGroupMessages = {
      invalid:
        'Please ensure the re-entered email address matches the email address.',
      valid: 'The email addresses match.',
    };

    const passwordGroupMessages = {
      invalid: 'Please ensure the re-entered password matches the password.',
      valid: 'The passwords match.',
    };

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
        new Field({
          name: 'password',
          defaultValue: 'password',
        }),
        new Field({
          name: 'confirmPassword',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: [this.formElements[0], this.formElements[1]],
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: emailGroupMessages.invalid,
              validMessage: emailGroupMessages.valid,
            },
          ],
        }),
        new Group({
          name: 'passwordGroup',
          members: [this.formElements[2], this.formElements[3]],
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
              invalidMessage: passwordGroupMessages.invalid,
              validMessage: passwordGroupMessages.valid,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup, form.groups.passwordGroup]}
        />
      );
    }

    render(<TestComponent />);

    expect(screen.queryByText(emailGroupMessages.invalid)).not.toBeNull();
    expect(screen.queryByText(emailGroupMessages.valid)).toBeNull();
    expect(screen.queryByText(passwordGroupMessages.invalid)).not.toBeNull();
    expect(screen.queryByText(passwordGroupMessages.valid)).toBeNull();

    form.formElements.confirmEmail.setValue(
      form.formElements.email.state.value,
    );

    await waitFor(() =>
      expect(screen.queryByText(emailGroupMessages.valid)).not.toBeNull(),
    );
    expect(screen.queryByText(emailGroupMessages.invalid)).toBeNull();

    form.formElements.confirmPassword.setValue(
      form.formElements.password.state.value,
    );

    await waitFor(() =>
      expect(screen.queryByText(passwordGroupMessages.valid)).not.toBeNull(),
    );
    expect(screen.queryByText(passwordGroupMessages.invalid)).toBeNull();
  });

  test(`If its props contain containerClassName, that className is applied to 
  the div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerClassName="test-group-messages"
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementsByClassName('test-group-messages')[0];
    expect(container).toBeTruthy();
    expect(container.nodeName).toBe('DIV');
  });

  test(`If its props contain getContainerClassName(), that function is called
  and the resultant className is applied to the the div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          getContainerClassName={() => 'test-group-messages'}
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementsByClassName('test-group-messages')[0];
    expect(container).toBeTruthy();
    expect(container.nodeName).toBe('DIV');
  });

  test(`If its props contain both containerClassName and 
  getContainerClassName(), getContainerClassName() is called, the className it 
  returns is merged with containerClassName, and the result is applied to the 
  div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerId="container"
          containerClassName="class1"
          getContainerClassName={() => 'class2'}
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementById('container');
    expect(container?.className).toBe('class1 class2');
  });

  test(`If its props contain containerStyle, those styles are applied to the 
  div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerId="container"
          containerStyle={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementById('container');
    expect(container?.style.display).toBe('flex');
    expect(container?.style.flexDirection).toBe('column');
  });

  test(`If its props contain getContainerStyle(), that function is called and 
  the resultant styles are applied to the div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerId="container"
          getContainerStyle={() => ({
            display: 'flex',
            flexDirection: 'column',
          })}
        />
      );
    }

    render(<TestComponent />);

    const container = document.getElementById('container');
    expect(container?.style.display).toBe('flex');
    expect(container?.style.flexDirection).toBe('column');
  });

  test(`If its props contain both containerStyle and getContainerStyle(),
  getContainerStyle() is called and the resultant styles are merged with 
  containerStyle and applied to the div it returns.`, () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: 'user@example.com',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          containerId="container"
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

    render(<TestComponent />);

    const container = document.getElementById('container');
    expect(container?.style.display).toBe('grid');
    expect(container?.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    expect(container?.style.columnGap).toBe('8px');
    expect(container?.style.rowGap).toBe('8px');
  });

  //////////////////////////////

  test(`If its props contain messageClassName, that className is applied to any 
  Message components it renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          messageClassName="test-message"
        />
      );
    }

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('test-message');
  });

  test(`If its props contain getMessageClassName(), that function is called and
  the resultant className is applied to any Message components it renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          getMessageClassName={() => 'test-message'}
        />
      );
    }

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('test-message');
  });

  test(`If its props contain both messageClassName and getMessageClassName(), 
  getClassName() is called, the resultant className is merged with 
  messageClassName, and the result is applied to any Message components that
  it renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          messageClassName="class1"
          getMessageClassName={() => 'class2'}
        />
      );
    }

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.className).toBe('class1 class2');
  });

  test(`If its props contain messageStyle, those styles are applied to any 
  messages it renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
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

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.style.display).toBe('block');
    expect(message?.style.fontFamily).toBe('Arial');
    expect(message?.style.fontSize).toBe('12px');
    expect(message?.style.fontStyle).toBe('italic');
    expect(message?.style.color).toBe('red');
  });

  test(`If its props contain getMessageStyle(), that function is called and the 
  resultant styles are applied to any Message components it renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          getMessageStyle={() => ({
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'red',
          })}
        />
      );
    }

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.style.display).toBe('block');
    expect(message?.style.fontFamily).toBe('Arial');
    expect(message?.style.fontSize).toBe('12px');
    expect(message?.style.fontStyle).toBe('italic');
    expect(message?.style.color).toBe('red');
  });

  test(`If its props contain both messageStyle and getMessageStyle(), 
  getMessageStyle() is called, the resultant styles are merged with 
  messageStyle, and the result is applied to any Message components it 
  renders.`, () => {
    const messageText = 'Please ensure that the email addresses match.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: 'user@example.com',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'emailGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ email, confirmEmail }): boolean => {
                return email === confirmEmail;
              },
              invalidMessage: messageText,
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      return (
        <FFGroupMessages
          form={form}
          groups={[form.groups.emailGroup]}
          messageStyle={{
            display: 'block',
            fontFamily: 'Arial',
            fontSize: '12px',
            fontStyle: 'italic',
          }}
          getMessageStyle={({ messageValidity }) => {
            return {
              color: messageValidity === Validity.Invalid ? 'red' : 'green',
            };
          }}
        />
      );
    }

    render(<TestComponent />);

    const message = screen.queryByText(messageText);
    expect(message?.style.display).toBe('block');
    expect(message?.style.fontFamily).toBe('Arial');
    expect(message?.style.fontSize).toBe('12px');
    expect(message?.style.fontStyle).toBe('italic');
    expect(message?.style.color).toBe('red');
  });
});
