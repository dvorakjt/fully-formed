# Fully Formed

## About

Fully Formed provides powerful, type-safe, style-agnostic form state management for React with TypeScript. Fully Formed embraces the following principles:

- Forms are completely type-safe. Forms are aware of the names of their constituents and the types of values each of those constituents contain, and construct a type representing their own value based on the types of these constituents. This makes it possible to verify the structure of the data of the form against the structure that an API route expects to receive.
- Value and validity are synchronized. The value of a field is always set simultaneously with its validity.
- Forms are instantiated in a declarative manner, which improves code readability and facilitates a layered approach to forms, in which their data and the components that present it are distinct.
- Forms should be powerful and flexible. With Fully Formed, fields can control other fields, groups of fields can be created to provide an additional layer of validation, values of form elements can be adapted prior to their inclusion in value of a parent form, values to be displayed to the user or to control the UI can be derived from the state of the form and its constituents, and forms can be nested within other forms. This power and flexibility can be harnessed to provide a rich and pain-free user experience to end-users and developers alike.
- Accessibility is provided out-of-the-box. Components provided by Fully Formed are designed to work together to provide a positive experience for all users with little-to-no additional configuration required by developers.
- Style agnosticism. Fully Formed provides convenient means of applying any styles or CSS classes you wish to our components based on the state of the corresponding field. No styles are applied by the library: we give you a completely clean slate, allowing you to use whatever CSS framework or custom styles you so choose.

At the time of writing, Fully Formed is in alpha. A comprehensive documentation site is in development and will be released together with the first production-ready release of the library. In the meantime, this document serves to provide an overview of how to use the library and some of its notable features.

## Requirements

Fully Formed requires **React 18** or higher and **TypeScript 5** or higher to be installed in your project.

## Installation

    npm i fully-formed

## Getting Started

First, we need to define the data model for our form. We do this by extending the `FormTemplate`class.

    import { FormTemplate } from 'fully-formed';

    class SignUpTemplate extends FormTemplate {}

`FormTemplate` is an abstract class that provides certain useful defaults for properties that might not always be customized by developers, but at minimum, requires that a `name`and array of form elements be provided. Let's provide those now:

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

Great! We now have a template for a form with one field! We imported the `Field` class to create this field, and the `StringValidators`class to add a validator to the field indicating that it must be an email address. `StringValidators`provides lots of convenient methods that create validator instances with pre-defined predicates for common string validation operations.

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

`autoTrim` can also be a boolean, in which case it will affect all non-transient (more on transience later!), string-type fields, or an object with an `exclude`property containing an array of field names, in which case it will affect all non-transient, string-type fields, _except_ those specified in the array.

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
          ]
        })
      ] as const;

      public readonly autoTrim = {
        include : [
    	  'email'
        ]
      }
    }

You'll noticed that we applied several validators to the password and confirm password fields. The password must contain a lowercase letter, an uppercase letter, a digit and a symbol. The confirmed password is simply required. But what about checking if they are the same? This is where groups come in.

Groups allow you to group together fields (or even other groups) in order to validate members' values as a unit. Let's create a group that will check if password and confirm password share the same value.
