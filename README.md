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

### <ins>Accessibility is provided out-of-the-box. </ins>

Components provided by Fully Formed are designed to work together to provide a positive experience for all users with little-to-no additional configuration required by developers.

### <ins>Style agnosticism.</ins>

Fully Formed provides convenient means of applying any styles or CSS classes you wish to our components based on the state of the corresponding field. No styles are applied by the library: we give you a completely clean slate, allowing you to use whatever CSS framework or custom styles you so choose.

## Current Version (Alpha)

At the time of writing, Fully Formed is in alpha. While a great many features are available, and these features have been thoroughly tested, there are still a few components in development (TextArea, Select), and the shape of the API should not be considered fully stable as of yet, as with further usage, it may be adapted to improve its ergonomics. Additionally, a comprehensive documentation site is in development and will be released together with the first production-ready release of the library. In the meantime, this document serves to provide an overview of how to use the library and some of its notable features.

## Requirements

Fully Formed requires **React 18** or higher and **TypeScript 5** or higher to be installed in your project.

## Installation

    npm i fully-formed

## Getting Started

First, we need to define the data model for our form. We do this by extending the `FormTemplate`class.

    import { FormTemplate } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {}

`FormTemplate` is an abstract class that provides certain useful defaults for properties that might not always be customized by developers, but at minimum, requires that a `name` and array of form elements be provided. Let's provide those now:

    import { FormTemplate, Field, StringValidators } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {
      public readonly name = 'signUpForm';
      public readonly formElements = [
        new Field({
          name : 'email',
          defaultValue : '',
          validators : [
            StringValidators.email({
              invalidMessage : 'Please enter a valid email address.',
              trimBeforeValidation : true
            })
          ]
        })
      ] as const;
    }

Great! We now have a template for a form with one field! We imported the `Field` class to create this field, and the `StringValidators` class to add a validator to the field indicating that it must be an email address. `StringValidators` provides lots of convenient methods that create validator instances with pre-defined predicates for common string validation operations.

The particular validator we will be instantiating here returns an object containing the validity of a value it examines, together with the message we provided if that value is not valid. Additionally, before validating the value, it will trim it, because we set `trimBeforeValidation` to true. This setting is useful because you can very easily tell your form that you would like it to auto-trim certain fields:

    import { FormTemplate, Field, StringValidators } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {
      public readonly name = 'signUpForm';
      public readonly formElements = [
        new Field({
          name : 'email',
          defaultValue : '',
          validators : [
            StringValidators.email({
              invalidMessage : 'Please enter a valid email address.',
              trimBeforeValidation : true
            })
          ]
        })
      ] as const;

      //here we are instructing our form to automatically trim the email field before
      //including its value in the object representing the value of the form.
      public readonly autoTrim = {
        include : [
    	  'email'
        ]
      }
    }

`autoTrim` can also be a boolean, in which case it will affect all non-transient (more on transience later!), string-type fields, or an object with an `exclude` property containing an array of field names, in which case it will affect all non-transient, string-type fields, _except_ those specified in the array.

Since this is a sign up form, let's add password and confirm password fields.

    import { FormTemplate, Field, StringValidators } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {
      public readonly name = 'signUpForm';
      public readonly formElements = [
        new Field({
          name : 'email',
          defaultValue : '',
          validators : [
            StringValidators.email({
              invalidMessage : 'Please enter a valid email address.',
              trimBeforeValidation : true
            })
          ]
        }),
        new Field({
          name : 'password',
          defaultValue : '',
          validators : [
            StringValidators.includesLower({
              invalidMessage : 'Password must include a lowercase letter.',
              validMessage : 'Password includes a lowercase letter.'
            }),
            StringValidators.includesUpper({
              invalidMessage : 'Password must include an uppercase letter.',
              validMessage : 'Password includes an uppercase letter.'
            }),
            StringValidators.includesDigit({
              invalidMessage : 'Password must include a digit.',
              validMessage : 'Password includes a digit.'
            }),
            StringValidators.includesSymbol({
    	      invalidMessage : 'Password must include a symbol.',
    	      validMessage : 'Password includes a symbol.'
            })
          ]
        }),
        new Field({
          name : 'confirmPassword',
          defaultValue : '',
          validators : [
            StringValidators.required({
              invalidMessage : 'Please re-enter your password.'
            })
          ],
          transient : true
        })
      ] as const;

      public readonly autoTrim = {
        include : [
    	  'email'
        ]
      }
    }

You'll notice that we set `transient` to `true` in the object provided to the constructor of our confirm password field. Transient fields are not included in the value of a form, but they do contribute to the form's overall validity.

You'll also notice that we applied several validators to the password and confirm password fields. The password must contain a lowercase letter, an uppercase letter, a digit and a symbol. The confirmed password is simply required. But what about checking if they are the same? This is where groups come in.

Groups allow you to group together fields (or even other groups) in order to validate members' values as a unit. Let's create a group that will check if password and confirm password share the same value.

    import {
      FormTemplate,
      Field,
      StringValidators,
      Group
    } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {
      public readonly name = 'signUpForm';
      public readonly formElements = [
        new Field({
          name : 'email',
          defaultValue : '',
          validators : [
            StringValidators.email({
              invalidMessage : 'Please enter a valid email address.',
              trimBeforeValidation : true
            })
          ]
        }),
        new Field({
          name : 'password',
          defaultValue : '',
          validators : [
            StringValidators.includesLower({
              invalidMessage : 'Password must include a lowercase letter.',
              validMessage : 'Password includes a lowercase letter.'
            }),
            StringValidators.includesUpper({
              invalidMessage : 'Password must include an uppercase letter.',
              validMessage : 'Password includes an uppercase letter.'
            }),
            StringValidators.includesDigit({
              invalidMessage : 'Password must include a digit.',
              validMessage : 'Password includes a digit.'
            }),
            StringValidators.includesSymbol({
    	      invalidMessage : 'Password must include a symbol.',
    	      validMessage : 'Password includes a symbol.'
            })
          ]
        }),
        new Field({
          name : 'confirmPassword',
          defaultValue : '',
          validators : [
            StringValidators.required({
              invalidMessage : 'Please re-enter your password.'
            })
          ],
          transient : true
        })
      ] as const;

      public readonly groups = [
        new Group({
          name : 'passwordGroup',
          members : [this.formElements[1], this.formElements[2]],
          validatorTemplates : [
            {
              predicate : ({ password, confirmPassword }) => password === confirmPassword,
              invalidMessage : 'Please ensure that the re-entered password matches the password',
              validMessage : 'The passwords match!'
            }
          ]
        })
      ] as const;

      public readonly autoTrim = {
        include : [
    	  'email'
        ]
      }
    }

Perfect, we now have a group which will compare the password against the re-entered password once both are valid and will determine if they are the same! Note that we used `validatorTemplates` rather than `validators`. Using `validatorTemplates` allows us to provide a predicate, and optionally a `validMessage` and/or `invalidMessage`, and the library will create a validator for us.

Next, let's use this template to create a subclass of `AbstractForm` that we can instantiate in our components.

First, we need to import the `FormFactory` class. Let's update the import statement at the top of the file:

    import {
      FormTemplate,
      Field,
      StringValidators,
      Group,
      FormFactory
    } from 'fully-formed';

Then, at the end of the file, add this line:

    export const SignUpForm = FormFactory.createForm(SignUpTemplate);

At this point, the data model for our form is defined. We know what type of value each field will contain, what makes each field valid, how fields relate to each other within groups, what fields will be included in the value of the form, and even what fields the form will automatically trim for us. Now, we need to present this data to the user so they can interact with our form. For this, we'll turned to the React components provided by Fully Formed.

Fully Formed provides a number of components and hooks that are pre-configured to interact with the model layer of the library. Remember, these components are style-agnostic, so without any CSS classes or styles applied to them, they will render plain HTML elements. Components can be styled either with classes or with styles. In general, components accept two versions of these props (some accept more if they are composites of multiple HTML elements, like a checkbox component which also contains its label). These props are:

    className
    getClassName
    style
    getStyle

`getClassName` and `getStyle` are functions that allow you to destructure an object which contains properties representing the state of the field, whether or not the `confirm()` method of the parent form was called, and, if you provided an array of groups to the component, a reduced `groupValidity` property. Here is an example of using `getClassName` to style a component:

    import React from 'react';
    import {
      FFInput,
      Validity,
      Utils,
      type InputProps,
      type  AnyForm,
      type  AnyStringTypeField,
      type  FormChild,
    } from 'fully-formed';
    import './styles.css';

    export function Input<
      Form extends AnyForm,
      Field extends FormChild<Form, AnyStringTypeField>,
    >(props: InputProps<Form, Field>): React.JSX.Element {
      return (
        <FFInput
          {...props}
          className="input"
          getClassName={({ fieldState, confirmationAttempted, groupValidity }) => {
            if (Utils.isClean(fieldState) && !confirmationAttempted) return;

            return Utils.reduceValidity(fieldState.validity, groupValidity);
          }}
        />
      );
    }

In the example above, the "input" class is always applied to this component. If the field has not been visited (focused then blurred) or modified, and the parent form has not been confirmed, no other class will be applied. Otherwise, if the field or any groups passed to this component as props are invalid, the input element will receive the "invalid" class. Finally, if none of these conditions are met, the input has been interacted with or the form has been confirmed, and the underlying field is valid, so the input element receives the "valid" class. You could now use this component throughout your project anywhere you need a customized input that interacts with the model layer of Fully Formed.

For the purposes of our sign up form we will just the components directly. Let's create a separate file and import the form we created, plus a few components and hooks:

    import React from 'react';
    import {
      FFLabel,
      FFInput,
      FFFieldMessages,
      useForm
    } from 'fully-formed';
    import { SignUpForm } from './signup-form';

Now, let's create our presentation layer component!

    import React from 'react';
    import {
      FFLabel,
      FFInput,
      FFFieldMessages,
      useForm
    } from 'fully-formed';
    import { SignUpForm } from './signup-form';

    export function SignUp() {
      const form = useForm(new SignUpForm());

      return (
        <form id={form.id}>
          <FFLabel form={form} field={form.formElements.email} />
          <FFInput
            form={form}
            field={form.formElements.email}
            type="email"
            aria-required={true}
            placeholder="user@example.com"
          />
          <FFFieldMessages form={form} field={form.formElements.email} />

          <FFLabel form={form} field={form.formElements.password} />
          <FFInput
            form={form}
            field={form.formElements.password}
            type="password"
            aria-required={true}
          />
          <FFFieldMessages form={form} field={form.formElements.password} />

      	  <FFLabel
      	    form={form}
      	    field={form.formElements.confirmPassword}
      	    groups={[form.groups.passwordGroup]}
      	  />
          <FFInput
            form={form}
            field={form.formElements.confirmPassword}
            groups={[form.groups.passwordGroup]}
            type="password"
            aria-required={true}
          />
          <FFFieldMessages
            form={form}
            field={form.formElements.password}
            groups={[form.groups.passwordGroup]}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              form.confirm({
                onSuccess : (data) => {
                  //here we simply log the data, but you could instead submit it to
                  //a backend API, etc.
                  console.log(data);
                }
              });
            }}
          >
            Submit
          </button>
        </form>
      )
    }

Congratulations, you've created your first form with Fully Formed!

## Creating Custom Validators

You are not limited to the validators provided by the library. It's a trivial matter to create your own validators, and there are even three ways to do it:

### 1. Using Validator Templates

Any entity that accepts validators also accepts validator templates. Using validator templates provides the advantage that the templates are already aware of the type of value that they must be able to validate. This is useful for entities whose type is somewhat complex, such as groups. We took advantage of this when we created our password group in the Getting Started section.

### 2. Using the Validator Class

You can create a reusable validator with the `Validator` class. For example:

    import { Validator } from 'fully-formed';

    const containsNoWhiteSpace = new Validator<string>({
      //predicate is required. Must be a function that returns a boolean value
      predicate : value => !(/\s/.test(value)),

      //messages are optional
      invalidMessage : 'The field must contain no whitespace.',
      validMessage : 'The field contains no whitespace.'
    });

You could also create a function that returns such a validator, enabling you to define certain aspects of it in advance (like the predicate), but allows for other properties to be customized per instance. In fact, this is exactly how the `StringValidators` class works.

### 3. Extending AbstractValidator

If you wish for even finer grained control over the output of your validator (for instance, creating a validator that can output different messages based on more than just the result of a predicate), you may want to extend the `AbstractValidator` class and implement its methods.

## Async Validators

Fully Formed provides support for asynchronous validation as well. Creating an `AsyncValidator` is very similar to creating a `Validator`, except that the predicate should return a `Promise<boolean>`. Fields can accept a `pendingMessage` prop, which sets a message on the field that is removed once all pending async validators return. Similarly, the validity of the field becomes `Validity.Pending` until these validators return. Async validators will only run once all synchronous validators have returned `Validity.Valid`.

## Adapting Values

Sometimes the fields that you include in your form to make it convenient for users to fill out don't correspond perfectly with the fields expected by your API. In other cases, you might simply want to clean up a field in a specific way before submitting it to the backend. In cases like these, you can use adapters to adapt the values your users enter in order to correspond to what your API expects to receive. **Note that, if you create an adapter that shares its name with a form element, the form element must be transient.**

Here is an example in which we adapt a string-type field so that the value included in the form becomes a number:

    import {
      FormTemplate,
      Field,
      Adapter,
      FormFactory
    } from 'fully-formed';

    class ExampleTemplate extends FormTemplate {
      public readonly name = 'exampleForm';
      public readonly formElements = [
        new Field({
          name : 'age',
          defaultValue : '',
          validatorTemplates : [
            {
              predicate : value => !!value.length && Number.isNaN(Number(value)),
              invalidMessage : 'Please enter a valid number.'
            }
          ],
          transient : true
        })
      ] as const;

      public readonly adapters = [
        new Adapter({
          name : 'age',
          source : this.formElements[0],
          adaptFn : ({ value }) => Number(value)
        })
      ] as const;
    }

    export const ExampleForm = FormFactory.createForm(ExampleTemplate);

## Sub-Forms

Forms may include nested forms in their form elements. To do this, pass a form template into the `createSubForm()` or `createExcludableSubForm()` methods of the `FormFactory` class, and then include an instance of the resultant sub-form in the `formElements` array of a form template.

## Excludable Form Elements

Form elements and adapters can be excludable, meaning that they may be omitted from the value AND the validity of their parent form as well as any groups they are part of (in the case of form elements), depending on whether the `exclude` property of their state is `true`. To create an excludable field, instantiate an instance of `ExcludableField`. To create an excludable sub-form, pass a form template into the `createExcludableSubForm()` method of the `FormFactory` class. To create an excludable adapter, instantiate an instance of the `ExcludableAdapter` class.

Excludable form elements have a `setExclude()` method which can be used to exclude or include the form element as needed. Form elements that are both transient and excludable will never contribute to the value of a form, but will contribute to its validity if included.

The `adaptFn` for an excludable adapter is the mechanism by which it is included or excluded. Instead of simply returning a value, this type of `adaptFn` should return an object containing both a `value` property and an `exclude` property.

## Controlled Fields

One field may control another. This is useful if certain information collected from the user can be used to anticipate the value of another field, simplifying the experience of completing the form for the user. Below is an example of the creation of a controlled field:

    import {
      FormTemplate,
      Field,
      FormFactory,
      Validity,
      type NonTransientField
    } from 'fully-formed';

    // some function that converts a ZIP code to a US state
    import { zipToState } from './zip-to-state.ts';

    class AddressTemplate extends FormTemplate {
      public readonly name = 'addressForm';
      public readonly formElements : [
        NonTransientField<'zip', string>,
        NonTransientField<'state', string>
      ];

      public constructor() {
        super();
        const zip = new Field({
          name : 'zip',
          defaultValue : '',
          validatorTemplates : [
            {
              predicate : value => /\d{5}/.test(value),
              invalidMessage : 'Please enter a 5 digit zip code.'
            }
          ]
        });
        this.formElements = [
          zip,
          new Field({
            name : 'state',
            defaultValue : 'AL',
            controlledBy : {
              controllers : [zip],
              controlFn : ([{ value, validity}]) => {
                //if a valid zip code hasn't been entered, don't change this field
                if(validity !== Validity.Valid) return;

                return {
                  value : zipToState(value),
                  validity : Validity.Valid,
                  messages : []
                }
              }
            }
          })
        ];
      }
    }

    export const AddressForm = FormFactory.createForm(AddressTemplate);

You'll notice that in this example, we've made use of the template's constructor. This is a powerful pattern: the constructor for your template essentially becomes the constructor for the form created with that template. Any parameters expected by your template will be expected by the resultant form class created by the `FormFactory`, even so far as generic type parameters!

## Derived Values

Derived values allow you to produce values from your form constituents. You can then harness these values in the UI via the `useDerivedValue()` hook. Here is a simple example of the creation of a derived value:

    import {
      FormTemplate,
      Field,
      DerivedValue,
      FormFactory
    } from 'fully-formed';

    class ExampleTemplate extends FormTemplate {
      public readonly name = 'exampleForm';
      public readonly formElements = [
        new Field({
          name : 'firstName',
          defaultValue : ''
        })
      ] as const;

      public readonly derivedValues = [
        new DerivedValue({
          name : 'greeting',
          sources : this.formElements,
          deriveFn : ([{ value }]) => {
            if(!value.length) return 'Hello, there! What should we call you?';
            return `Welcome, ${value}!`;
          }
        })
      ] as const;
    }

    export const ExampleForm = FormFactory.createForm(ExampleTemplate);

## Checkboxes

The `FFCheckbox` component accepts a field whose value is of type boolean. When checked, the field's value will be true. When unchecked, the field's value will be false. You can very easily leverage this behavior together with an `ExcludableAdapter` to emulate the behavior of traditional HTML checkboxes in which the value submitted with the form is a string when the checkbox is checked, and both the name and value are excluded from the form when it is unchecked. This approach also allows you to apply validators to the field, such as a validator that causes the field to be required. Here is an example of this approach:

    import {
      FormTemplate,
      Field,
      ExcludableAdapter,
      FormFactory,
    } from "fully-formed";

    class CheckboxExampleTemplate extends FormTemplate {
      public readonly name = "checkboxExample";
      public readonly formElements = [
        new Field({
          name: "acceptTerms",
          defaultValue: false,
          validatorTemplates: [
            {
              predicate: (value) => value,
              invalidMessage: "You must accept the terms and conditions to continue.",
            },
          ],
          transient: true,
        }),
      ] as const;

      public readonly adapters = [
        new ExcludableAdapter({
          name: "acceptTerms",
          source: this.formElements[0],
          adaptFn: ({ value }) => {
            return {
              exclude: !value,
              value: "yes",
            };
          },
        }),
      ] as const;
    }

    export const CheckboxExampleForm = FormFactory.createForm(
      CheckboxExampleTemplate
    );

## Compatibility

Fully Formed has been verified to be compatible with Next.js (both the app router and the pages router), Vite.js and Remix, provided that TypeScript 5 or higher is installed. Please note that to use components and hooks in Next.js with the app router, you will need to include the `'use client'` directive at the top of any files that import them.

Create React App currently ships with TypeScript 4.9.5 when invoked with `--template typescript`. If you would like to use this project in conjunction with Create React App, you will need to upgrade to TypeScript 5 or higher. Please see this issue for more information: https://github.com/facebook/create-react-app/issues/13080

## License

MIT License

Copyright (c) 2024 Joseph Dvorak

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
