import { FormTemplate, Field, FormFactory, Adapter, Group, StringValidators } from "./model";

class MyTemplate<Name extends string> extends FormTemplate {
  public readonly name : Name;
  public formElements = <const>[
    new Field({ 
      name : 'firstName', 
      defaultValue : '', 
      validators : [
        StringValidators.required({ trimBeforeValidation : true })
      ] 
    }),
    new Field({ 
      name : 'lastName', 
      defaultValue : '', 
      validators : [
        StringValidators.required({ trimBeforeValidation : true }) 
      ]
    }),
    new Field({ name : 'age', defaultValue : 34, transient : true })
  ];
  public groups = <const>[
    new Group({ name : 'fullName', members : [this.formElements[0], this.formElements[1]]})
  ];
  public adapters = <const>[
    new Adapter({ name : 'fullName', source : this.groups[0], adaptFn : ({ value }):string => {
      return value.firstName + value.lastName
    }})
  ];
  public autoTrim = true;

  public constructor(name : Name) {
    super();
    this.name = name;
  }
}

const MyForm = FormFactory.createForm(MyTemplate);

const myFormInstance = new MyForm('MyForm');

myFormInstance.formElements.age.setValue(3)


// eslint-disable-next-line @typescript-eslint/no-unused-vars
type name = typeof myFormInstance.name