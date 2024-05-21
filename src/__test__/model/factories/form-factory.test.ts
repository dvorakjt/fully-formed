import { describe, test, expect } from 'vitest';
import {
  FormFactory,
  AbstractFormTemplate,
  AbstractSubFormTemplate,
  AbstractForm,
  Field,
  Group,
  AbstractSubForm,
  AbstractExcludableSubForm,
  type ExcludableTemplate,
  type TransientTemplate,
} from '../../../model';

describe('FormFactory', () => {
  test(`It returns a constructor for a subclass of AbstractForm when 
  createForm() is called.`, () => {
    class FormTemplate extends AbstractFormTemplate {
      public readonly fields = [];
    }

    const Form = FormFactory.createForm(FormTemplate);
    const instance = new Form();

    expect(instance).toBeInstanceOf(AbstractForm);
  });

  test(`When createForm() is called, the fields of the form that is returned 
  are the fields that were provided in the template.`, () => {
    class FormTemplate extends AbstractFormTemplate {
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(FormTemplate);
    const instance = new Form();

    expect(instance.fields.firstName).toBeInstanceOf(Field);
    expect(instance.fields.lastName).toBeInstanceOf(Field);
  });

  test(`When createForm() is called, the groups of the form that is returned
  are the groups that were provided in the template.`, () => {
    class FormTemplate extends AbstractFormTemplate {
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
        new Field({
          name: 'email',
          defaultValue: '',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'fullName',
          members: [this.fields[0], this.fields[1]],
        }),
        new Group({
          name: 'emailGroup',
          members: [this.fields[2], this.fields[3]],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(FormTemplate);
    const instance = new Form();

    expect(instance.groups.fullName).toBeInstanceOf(Group);
    expect(instance.groups.emailGroup).toBeInstanceOf(Group);
  });

  test(`When createForm() is called, the parameters of the template constructor 
  that is provided become the parameters of the constructor that is 
  returned.`, () => {
    class GenericTemplate<T extends string> extends AbstractFormTemplate {
      public readonly fields: [Field<T, string, false>];

      public constructor(fieldName: T) {
        super();
        this.fields = [
          new Field({
            name: fieldName,
            defaultValue: '',
            transient: false,
          }),
        ];
      }
    }

    const Form = FormFactory.createForm(GenericTemplate);
    const instance = new Form('myCustomField');

    expect(instance.fields.myCustomField).toBeInstanceOf(Field);
    expect(instance.fields.myCustomField.name).toBe('myCustomField');
  });

  test(`It returns an instance of AbstractSubForm when createSubForm() is
  called.`, () => {
    class SubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'subForm';
      public readonly fields = [];
    }

    const SubForm = FormFactory.createSubForm(SubFormTemplate);
    const instance = new SubForm();

    expect(instance).toBeInstanceOf(AbstractSubForm);
  });

  test(`When createSubForm() is called, the fields of the form that is returned 
  are the fields that were provided in the template.`, () => {
    class SubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'subForm';
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
      ] as const;
    }

    const SubForm = FormFactory.createSubForm(SubFormTemplate);
    const instance = new SubForm();

    expect(instance.fields.firstName).toBeInstanceOf(Field);
    expect(instance.fields.lastName).toBeInstanceOf(Field);
  });

  test(`When createSubForm() is called, the groups of the form that is returned
  are the groups that were provided in the template.`, () => {
    class SubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'subForm';
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
        new Field({
          name: 'email',
          defaultValue: '',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'fullName',
          members: [this.fields[0], this.fields[1]],
        }),
        new Group({
          name: 'emailGroup',
          members: [this.fields[2], this.fields[3]],
        }),
      ] as const;
    }

    const SubForm = FormFactory.createSubForm(SubFormTemplate);
    const instance = new SubForm();

    expect(instance.groups.fullName).toBeInstanceOf(Group);
    expect(instance.groups.emailGroup).toBeInstanceOf(Group);
  });

  test(`When createSubForm() is called, the parameters of the template 
  constructor that is provided become the parameters of the constructor that is 
  returned.`, () => {
    class GenericSubFormTemplate<
      T extends string,
      V extends string,
    > extends AbstractSubFormTemplate {
      public readonly name: T;
      public readonly fields: [Field<V, string, false>];

      public constructor(name: T, fieldName: V) {
        super();
        this.name = name;
        this.fields = [
          new Field({
            name: fieldName,
            defaultValue: '',
            transient: false,
          }),
        ];
      }
    }

    const SubForm = FormFactory.createSubForm(GenericSubFormTemplate);
    const instance = new SubForm('mySubForm', 'myCustomField');

    expect(instance.name).toBe('mySubForm');
    expect(instance.fields.myCustomField).toBeInstanceOf(Field);
    expect(instance.fields.myCustomField.name).toBe('myCustomField');
  });

  test(`When createSubForm() is called and the template it receives implements 
  the TransientTemplate interface, the resulting form's transient property is 
  set accordingly.`, () => {
    class TransientSubFormTemplate
      extends AbstractSubFormTemplate
      implements TransientTemplate<true>
    {
      public readonly name = 'transientSubForm';
      public readonly fields = [];
      public readonly transient = true;
    }

    const SubForm = FormFactory.createSubForm(TransientSubFormTemplate);
    const instance = new SubForm();

    expect(instance.transient).toBe(true);
  });

  test(`It returns an instact of AbstractExcludableSubForm when
  createExcludableSubForm() is called.`, () => {
    class ExcludableSubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'excludableSubForm';
      public readonly fields = [];
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      ExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm();

    expect(instance).toBeInstanceOf(AbstractExcludableSubForm);
  });

  test(`When createExcludableSubForm() is called, the fields of the form that 
  is returned are the fields that were provided in the template.`, () => {
    class ExcludableSubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'excludableSubForm';
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
      ] as const;
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      ExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm();

    expect(instance.fields.firstName).toBeInstanceOf(Field);
    expect(instance.fields.lastName).toBeInstanceOf(Field);
  });

  test(`When createExcludableSubForm() is called, the groups of the form that is 
  returned are the groups that were provided in the template.`, () => {
    class ExcludableSubFormTemplate extends AbstractSubFormTemplate {
      public readonly name = 'excludableSubForm';
      public readonly fields = [
        new Field({
          name: 'firstName',
          defaultValue: '',
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
        }),
        new Field({
          name: 'email',
          defaultValue: '',
        }),
        new Field({
          name: 'confirmEmail',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'fullName',
          members: [this.fields[0], this.fields[1]],
        }),
        new Group({
          name: 'emailGroup',
          members: [this.fields[2], this.fields[3]],
        }),
      ] as const;
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      ExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm();

    expect(instance.groups.fullName).toBeInstanceOf(Group);
    expect(instance.groups.emailGroup).toBeInstanceOf(Group);
  });

  test(`When createExcludableSubForm() is called, the parameters of the template 
  constructor that is provided become the parameters of the constructor that is 
  returned.`, () => {
    class GenericExcludableSubFormTemplate<
      T extends string,
      V extends string,
    > extends AbstractSubFormTemplate {
      public readonly name: T;
      public readonly fields: [Field<V, string, false>];

      public constructor(name: T, fieldName: V) {
        super();
        this.name = name;
        this.fields = [
          new Field({
            name: fieldName,
            defaultValue: '',
            transient: false,
          }),
        ];
      }
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      GenericExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm(
      'myExcludableSubForm',
      'myCustomField',
    );

    expect(instance.name).toBe('myExcludableSubForm');
    expect(instance.fields.myCustomField).toBeInstanceOf(Field);
    expect(instance.fields.myCustomField.name).toBe('myCustomField');
  });

  test(`When createExcludableSubForm() is called and the template it receives 
  implements the TransientTemplate interface, the resulting form's transient 
  property is set accordingly.`, () => {
    class TransientExcludableSubFormTemplate
      extends AbstractSubFormTemplate
      implements TransientTemplate<true>
    {
      public readonly name = 'transientExcludableSubForm';
      public readonly fields = [];
      public readonly transient = true;
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      TransientExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm();

    expect(instance.transient).toBe(true);
  });

  test(`When createExcludableSubForm() is called and the template it receives 
  implements the ExcludableTemplate interface, the resulting form's 
  excludeByDefault property is set accordingly.`, () => {
    class ExcludableSubFormTemplate
      extends AbstractSubFormTemplate
      implements ExcludableTemplate
    {
      public readonly name = 'excludableSubForm';
      public readonly fields = [];
      public readonly excludeByDefault = true;
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      ExcludableSubFormTemplate,
    );
    const instance = new ExcludableSubForm();

    expect(instance.state.exclude).toBe(true);
  });
});
