![banner](https://github.com/dvorakjt/fully-formed/blob/main/banner.png)

# Fully Formed

## About

Fully Formed provides powerful, type-safe, style-agnostic form state management for React with TypeScript. Fully Formed embraces the following principles:

### <ins>Forms are completely type-safe.</ins>

Forms are aware of the names of their constituents and the types of values each of those constituents contain, and construct a type representing their own value based on the types of these constituents. This makes it possible to verify the structure of the data of the form against the structure that an API route expects to receive.

### <ins>Value and validity are synchronized.</ins>

The value of a field is always set simultaneously with its validity.

### <ins>Forms are instantiated in a declarative manner.</ins>

This improves code readability and facilitates a layered approach to forms, in which their data and the components that present it are distinct.

### <ins>Forms should be powerful and flexible.</ins>

With Fully Formed, fields can control other fields, groups of fields can be created to provide an additional layer of validation, values of form elements can be adapted prior to their inclusion in value of a parent form, values to be displayed to the user or to control the UI can be derived from the state of the form and its constituents, and forms can be nested within other forms. This power and flexibility can be harnessed to provide a rich and pain-free user experience to end-users and developers alike.

### <ins>Style agnosticism.</ins>

In addition to providing the tools to structure your form data and define what makes it valid, Fully Formed provides numerous hooks for interacting with this data, controlling the UI, etc. This allows you to create any visual design you can imagine by declaratively describing how the form data controls this design.

## What's New in Version 1.1.0

- Validity can now be "Caution." `Validity.Caution` can be used to display a warning message in the event that a field coult not be verified, but is not necessarily invalid. For example, if all of the components of an address could not be confirmed by an address validation API, the developer could use this validity to highlight the fields that were not recognized by the API. The address still may be valid, so the developer can use this to indicate the user that they should double-check specific fields without preventing them from proceeding. Other use cases could include a password strength validator: `Validity.Caution` could be used to indicate a medium-strength password. In general, the property exists so that users' attention can be drawn to specific elements without indicating that they are definitively invalid.

## Requirements

Fully Formed requires **React 18** or higher and **TypeScript 5** or higher to be installed in your project.

## Installation

    npm i fully-formed

## Getting Started

First, we need to define the data model for our form. We do this by extending the `FormTemplate`class.

    import { FormTemplate } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {}

`FormTemplate` is an abstract class that provides certain useful defaults for properties that might not always be customized by developers, but at minimum, requires that an array of fields be provided. Let's extend the FormTemplate class:

<pre>
import { FormTemplate, Field, StringValidators } from 'fully-formed';

class SignUpTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
  ] as const;
}
</pre>

Great! We now have a template for a form with one field! We imported the `Field` class to create this field, and the `StringValidators` class to add a validator to the field indicating that it must be an email address. `StringValidators` provides lots of convenient methods that create validator instances with pre-defined predicates for common string validation operations. Note that the library exports the `EmailRegExp` class used internally by this validator. If you are using a full stack TypeScript framework, this makes it easy to apply the same validation to email addresses in both the frontend and backend.

**Important: The names of all fields in the fields array must be unique!**

The particular validator we will be instantiating here returns an object containing the validity of a value it examines, together with the message we provided if that value is not valid. Additionally, before validating the value, it will trim it, because we set `trimBeforeValidation` to true. This setting is useful because you can very easily tell your form that you would like it to auto-trim certain fields:

<pre>
import { FormTemplate, Field, StringValidators } from 'fully-formed';

class SignUpTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
  ] as const;

  // here we are instructing our form to automatically trim the email field before
  // including its value in the object representing the value of the form.
  public readonly autoTrim = {
    include: ['email'],
  };
}
</pre>

`autoTrim` can also be a boolean, in which case it will affect all non-transient (more on transience later!), string-type fields, or an object with an `exclude` property containing an array of field names, in which case it will affect all non-transient, string-type fields, _except_ those specified in the array.

Since this is a sign up form, let's add password and confirm password fields.

<pre>
import { FormTemplate, Field, StringValidators } from 'fully-formed';

class SignUpTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
    new Field({
      name: 'password',
      defaultValue: '',
      validators: [
        StringValidators.includesLower({
          invalidMessage: 'Password must include a lowercase letter.',
          validMessage: 'Password includes a lowercase letter.',
        }),
        StringValidators.includesUpper({
          invalidMessage: 'Password must include an uppercase letter.',
          validMessage: 'Password includes an uppercase letter.',
        }),
        StringValidators.includesDigit({
          invalidMessage: 'Password must include a digit.',
          validMessage: 'Password includes a digit.',
        }),
        StringValidators.includesSymbol({
          invalidMessage: 'Password must include a symbol.',
          validMessage: 'Password includes a symbol.',
        }),
      ],
    }),
    new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please re-enter your password.',
        }),
      ],
      transient: true,
    }),
  ] as const;

  public readonly autoTrim = {
    include: ['email'],
  };
}
</pre>

You'll notice that we set `transient` to `true` in the object provided to the constructor of our confirm password field. Transient fields are not included in the value of a form, but they do contribute to the form's overall validity.

You'll also notice that we applied several validators to the password and confirm password fields. The password must contain a lowercase letter, an uppercase letter, a digit and a symbol. The confirmed password is simply required. But what about checking if they are the same? This is where groups come in.

Groups allow you to group together fields (or even other groups) in order to validate members' values as a unit. Let's create a group that will check if password and confirm password share the same value.

<pre>
import { FormTemplate, Field, StringValidators, Group } from 'fully-formed';

class SignUpTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
    new Field({
      name: 'password',
      defaultValue: '',
      validators: [
        StringValidators.includesLower({
          invalidMessage: 'Password must include a lowercase letter.',
          validMessage: 'Password includes a lowercase letter.',
        }),
        StringValidators.includesUpper({
          invalidMessage: 'Password must include an uppercase letter.',
          validMessage: 'Password includes an uppercase letter.',
        }),
        StringValidators.includesDigit({
          invalidMessage: 'Password must include a digit.',
          validMessage: 'Password includes a digit.',
        }),
        StringValidators.includesSymbol({
          invalidMessage: 'Password must include a symbol.',
          validMessage: 'Password includes a symbol.',
        }),
      ],
    }),
    new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please re-enter your password.',
        }),
      ],
      transient: true,
    }),
  ] as const;

  public readonly groups = [
    new Group({
      name: 'passwordGroup',
      members: [this.fields[1], this.fields[2]],
      validatorTemplates: [
        {
          predicate: ({ password, confirmPassword }) =&gt;
            password === confirmPassword,
          invalidMessage:
            'Please ensure that the re-entered password matches the password',
          validMessage: 'The passwords match!',
        },
      ],
    }),
  ] as const;

  public readonly autoTrim = {
    include: ['email'],
  };
}
</pre>

**Like fields, the names of groups must be unique!**

Perfect, we now have a group which will compare the password against the re-entered password once both are valid and will determine if they are the same! Note that we used `validatorTemplates` rather than `validators`. Using `validatorTemplates` allows us to provide a predicate, and optionally a `validMessage` and/or `invalidMessage`, and the library will create a validator for us.

Next, let's use this template to create a subclass of `AbstractForm` that we can instantiate in our components.

First, we need to import the `FormFactory` class. Let's update the import statement at the top of the file:

<pre>
import {
  FormTemplate,
  Field,
  StringValidators,
  Group,
  FormFactory,
} from 'fully-formed';
</pre>

Then, at the end of the file, add this line:

    export const SignUpForm = FormFactory.createForm(SignUpTemplate);

Congratulations, you've created your first form with Fully Formed!

At this point, the data model for our form is defined. We know what type of value each field will contain, what makes each field valid, how fields relate to each other within groups, what fields will be included in the value of the form, and even what fields the form will automatically trim for us. Now, we need to present this data to the user so they can interact with our form. For this, the library provides...

## Hooks

The library offers many hooks that allow you to interact with your form data and transform it into a React state variable with which to control your UI. Some notable hooks include:

### useForm

A very simple hook that takes in an instance of a form and returns that instance. The same instance will be returned across re-renders. This is the bridge between your form data and the UI. Here, we use it with our SignUpForm:

<pre>
import React, { type FormEventHandler } from 'react';
import { useForm, ValidityUtils } from 'fully-formed';
import { SignUpForm } from './signup-form';

export function SignUpPage(): React.JSX.Element {
  const signUpForm = useForm(new SignUpForm());

  const onSubmit: FormEventHandler = e =&gt; {
    e.preventDefault();

    // this will cause the submitted property of the state of the form
    // and its fields to become true
    signUpForm.setSubmitted();

    if (!ValidityUtils.isValid(signUpForm)) {
      // show error message, focus on first invalid field, etc.
      return;
    }

    // form is valid, so submit it to the server here...
  };

  return (
    &lt;form onSubmit={onSubmit}&gt;
      &lt;button type="submit"&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}
</pre>

Note that the validity of the form is always known. ValidityUtils just provides a convenient method of checking this so you don't have to write `signUpForm.state.validity === Validity.Valid` every time. `ValidityUtils.isValid` (and the corresponding methods for `Validity.Invalid`, `Validity.Pending` and `Validity.Caution`) can also directly accept the state of a form or field, or just a value of type `Validity`.

### useUserInput()

This hook is intended to be spread into the props of an input, select, or textarea element. This hook converts that element into a controlled input which will update the state of the underlying field when it receives input and will update its own value when the value of the underlying field changes.

Once the user changes the value of the input element, the `hasBeenModified` property of the state of the underlying field will also become true. This property can be used to reveal error messages once the user has actually typed something in the input.

Here, we use it to create an input for the email field of our SignUpForm:

<pre>
import React from 'react';
import { useForm, useUserInput } from 'fully-formed';
import { SignUpForm } from './signup-form';

export function SignUpPage(): React.JSX.Element {
  const signUpForm = useForm(new SignUpForm());

  return (
    &lt;form&gt;
      &lt;label htmlFor={signUpForm.fields.email.id}&gt;Email&lt;/label&gt;
      &lt;input
        name={signUpForm.fields.email.name}
        id={signUpForm.fields.email.id}
        {...useUserInput(signUpForm.fields.email)}
        type="email"
      /&gt;
    &lt;/form&gt;
  );
}
</pre>

### useFocusEvents()

This hook allows you to instruct an html element (usually an input, select or textarea) to control the focus state of a field. When the element is focused, the `isInFocus` property of the state of the field will become true. When the element is blurred, `isInFocus` will become false and `hasBeenBlurred` will become true.

Additionally, this hook handles a very specific edge case in which the user navigates away from a page without focus leaving the focused element (such as with keyboard back and forward shortcuts) while the form still exists in memory (for instance, a subform within a multi-page form). The hook will call `cancelFocus` on the underlying field when such a scenario arises, preventing potential visual bugs.

This hook is particularly useful for creating things like floating labels. Like `useUserInput()`, it is intended to be spread into the props of an html element:

<pre>
import React from 'react';
import { useForm, useUserInput, useFocusEvents } from 'fully-formed';
import { SignUpForm } from './signup-form';

export function SignUpPage(): React.JSX.Element {
  const signUpForm = useForm(new SignUpForm());

  return (
    &lt;form&gt;
      &lt;label htmlFor={signUpForm.fields.email.id}&gt;Email&lt;/label&gt;
      &lt;input
        name={signUpForm.fields.email.name}
        id={signUpForm.fields.email.id}
        {...useUserInput(signUpForm.fields.email)}
        {...useFocusEvents(signUpForm.fields.email)}
        type="email"
      /&gt;
    &lt;/form&gt;
  );
}
</pre>

### useMessages()

This hook accepts any number of `MessageBearers`, usually fields or groups and outputs their messages in a flattened array as a React state variable. This enables you to output the messages from a field and a group in the same component within your UI, if you want. This can be useful for cases like our confirm password field. We might want to show both the messages associated with the field and the message that indicates whether it matches the password (which comes from the group we created) immediately below the input for the field. To do that, we can use the useMessages() hook.

### usePipe() / useMultiPipe()

`usePipe()` and `useMultiPipe()` allow you to listen to the state of a form, field, or group (or an array of those elements, respectively), and produce a new value based on that state. This value is returned as a React state variable and will be updated whenever the state of the form(s)/field(s)/group(s) provided as its first argument changes. Here, we use `usePipe()` to create a reusable input component whose appearance changes depending on its validity:

<pre>
import React from 'react';
import {
  usePipe,
  useUserInput,
  useFocusEvents,
  type FieldOfType,
} from 'fully-formed';
import styles from './styles.module.css';

interface InputProps {
  field: FieldOfType&lt;string&gt;;
  type: string;
}

export function Input({ field, type }: InputProps): React.JSX.Element {
  const className = usePipe(field, state =&gt; {
    // first, check if the user has interacted with the field and if not,
    // return styles.pristine
    if (!(state.hasBeenBlurred || state.hasBeenModified || state.submitted)) {
      return styles.pristine;
    }

    // otherwise, style the field according to its validity
    return styles[state.validity];
  });

  return (
    &lt;input
      name={field.name}
      id={field.id}
      {...useUserInput(field)}
      {...useFocusEvents(field)}
      className={className}
      type={type}
    /&gt;
  );
}
</pre>

## Creating Custom Validators

You are not limited to the validators provided by the library. It's a trivial matter to create your own validators, and there are even three ways to do it:

### 1. Using Validator Templates

Any entity that accepts validators also accepts validator templates. Using validator templates provides the advantage that the templates are already aware of the type of value that they must be able to validate. This is useful for entities whose type is somewhat complex, such as groups. We took advantage of this when we created our password group in the Getting Started section.

### 2. Using the Validator Class

You can create a reusable validator with the `Validator` class. For example:

<pre>
import { Validator } from 'fully-formed';

const containsNoWhiteSpace = new Validator&lt;string&gt;({
  //predicate is required. Must be a function that returns a boolean value
  predicate: value =&gt; !/\s/.test(value),

  //messages are optional
  invalidMessage: 'The field must contain no whitespace.',
  validMessage: 'The field contains no whitespace.',
});
</pre>

You could also create a function that returns such a validator, enabling you to define certain aspects of it in advance (like the predicate), but allows for other properties to be customized per instance. In fact, this is exactly how the `StringValidators` class works.

### 3. Implementing IValidator

If you wish for even finer grained control over the output of your validator (for instance, creating a validator that can output different messages based on more than just the result of a predicate), you may want to simply create a class that implements the `IValidator` interface. At the present moment, this is the only means by which a validator can return `Validity.Caution`.

## Async Validators

Fully Formed provides support for asynchronous validation as well. Creating an `AsyncValidator` is very similar to creating a `Validator`, except that the predicate should return a `Promise<boolean>`. Fields can accept a `pendingMessage` prop, which sets a message on the field that is removed once all pending async validators return. Similarly, the validity of the field becomes `Validity.Pending` until these validators return.

Async validators will only run once all synchronous validators have returned `Validity.Valid` and once the value of the field or group has been unchanged for the duration provided via `delayAsyncValidatorExecution`property of their constructor parameters. This delay defaults to 500 milliseconds.

## Adapting Values

Sometimes the fields that you include in your form to make it convenient for users to fill out don't correspond perfectly with the fields expected by your API. In other cases, you might simply want to clean up a field in a specific way before submitting it to the backend. In cases like these, you can use adapters to adapt the values your users enter in order to correspond to what your API expects to receive. **Note that, if you create an adapter that shares its name with a form element, the form element must be transient.**

Here is an example in which we adapt a string-type field so that the value included in the form becomes a number:

<pre>
import { FormTemplate, Field, Adapter, FormFactory } from 'fully-formed';

class ExampleTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'age',
      defaultValue: '',
      validatorTemplates: [
        {
          predicate: value =&gt; !!value.length && Number.isNaN(Number(value)),
          invalidMessage: 'Please enter a valid number.',
        },
      ],
      transient: true,
    }),
  ] as const;

  public readonly adapters = [
    new Adapter({
      name: 'age',
      source: this.fields[0],
      adaptFn: ({ value }) =&gt; Number(value),
    }),
  ] as const;
}

export const ExampleForm = FormFactory.createForm(ExampleTemplate);
</pre>

## Sub-Forms

Forms may include nested forms in their form elements. To do this, pass a `SubFormTemplate` into the `createSubForm()` or `createExcludableSubForm()` methods of the `FormFactory` class, and then include an instance of the resultant sub-form in the `formElements` array of a form template.

The template can implement `TransientTemplate` and/or `ExcludableTemplate`in order to configure its transience and whether it should be excluded by default, respectively.

## Excludable Form Elements

Fields, sub-forms and adapters can be excludable, meaning that they may be omitted from the value AND the validity of their parent form as well as any groups they are part of (in the case of fields/forms), depending on whether the `exclude` property of their state is `true`. To create an excludable field, instantiate an instance of `ExcludableField`. To create an excludable sub-form, pass a form template into the `createExcludableSubForm()` method of the `FormFactory` class. To create an excludable adapter, instantiate an instance of the `ExcludableAdapter` class.

Excludable form elements have a `setExclude()` method which can be used to exclude or include the form element as needed. Form elements that are both transient and excludable will never contribute to the value of a form, but will contribute to its validity if included.

The `adaptFn` for an excludable adapter is the mechanism by which it is included or excluded. Instead of simply returning a value, this type of `adaptFn` should return an object containing both a `value` property and an `exclude` property.

## Controlled Fields

One field may control another. This is useful if certain information collected from the user can be used to anticipate the value of another field, simplifying the experience of completing the form for the user. Below is an example of the creation of a controlled field:

<pre>
import {
  FormTemplate,
  Field,
  ControlledField,
  FormFactory,
  ValidityUtils,
  type NonTransientField,
} from 'fully-formed';

// some function that converts a ZIP code to a US state
import { zipToState } from './zip-to-state.ts';

class AddressTemplate extends FormTemplate {
  public readonly fields: [
    NonTransientField&lt;'zip', string&gt;,
    NonTransientField&lt;'state', string&gt;,
  ];

  public constructor() {
    super();
    const zip = new Field({
      name: 'zip',
      defaultValue: '',
      validatorTemplates: [
        {
          predicate: value =&gt; /\d{5}/.test(value),
          invalidMessage: 'Please enter a 5 digit zip code.',
        },
      ],
    });
    this.fields = [
      zip,
      new ControlledField({
        name: 'state',
        controller: zip,
        initFn: ({ value, validity }) =&gt; {
          if (!ValidityUtils.isValid(validity)) {
            return 'AL';
          }

          return zipToState(value);
        },
        controlFn: ({ value, validity, didPropertyChange }) =&gt; {
          // don't change the controlled field if the value didn't change or
          // the zip code field is not valid
          if (!didPropertyChange('value') || !ValidityUtils.isValid(validity)) {
            return;
          }

          return zipToState(value);
        },
      }),
    ];
  }
}

export const AddressForm = FormFactory.createForm(AddressTemplate);
</pre>

You'll notice that in this example, we've made use of the template's constructor. This is a powerful pattern: the constructor for your template essentially becomes the constructor for the form created with that template. Any parameters expected by your template will be expected by the resultant form class created by the `FormFactory`, even so far as generic type parameters!

## Compatibility

Fully Formed has been verified to be compatible with Next.js (both the app router and the pages router), Vite.js and Remix, provided that TypeScript 5 or higher is installed. Please note that to use hooks in Next.js with the app router, you will need to include the `'use client'` directive at the top of any files that import them.

Create React App currently ships with TypeScript 4.9.5 when invoked with `--template typescript`. If you would like to use this project in conjunction with Create React App, you will need to upgrade to TypeScript 5 or higher. Please see this issue for more information: https://github.com/facebook/create-react-app/issues/13080

## License

MIT License

Copyright (c) 2024 Joseph Dvorak

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
