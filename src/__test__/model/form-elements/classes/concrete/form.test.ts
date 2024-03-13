import { describe, test, expect } from 'vitest';
import { FormFactory, FormTemplate } from '../../../../../model';

describe('Form', () => {
  test('Its id defaults to its name.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createForm(Template);
    const testForm = new TestForm();
    expect(testForm.name).toBe('TestForm');
    expect(testForm.id).toBe(testForm.name);
  });
});