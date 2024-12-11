import { describe, test, expect, afterEach } from 'vitest';
import {
  FormFactory,
  PersistentExcludableSubFormTemplate,
  clearAllPersistentFormElements,
  createPersistenceKey,
} from '../../../model';

describe('AbstractPersistentExcludableSubForm', () => {
  afterEach(clearAllPersistentFormElements);

  test(`If its state has not yet been stored in session storage, its exclude 
  property becomes exclude by default.`, () => {
    const ExcludedByDefault = FormFactory.createPersistentExcludableSubForm(
      class ExcludedByDefault extends PersistentExcludableSubFormTemplate {
        public readonly name = 'excludedByDefault';
        public readonly key = 'excludedByDefault';
        public readonly fields = [];
        public readonly excludeByDefault = true;
      },
    );

    const excludedByDefault = new ExcludedByDefault();
    expect(excludedByDefault.state.exclude).toBe(true);

    const IncludedByDefault = FormFactory.createPersistentExcludableSubForm(
      class IncludedByDefault extends PersistentExcludableSubFormTemplate {
        public readonly name = 'includedByDefault';
        public readonly key = 'includedByDefault';
        public readonly fields = [];
        public readonly excludeByDefault = false;
      },
    );

    const includedByDefault = new IncludedByDefault();
    expect(includedByDefault.state.exclude).toBe(false);

    const ImplicitlyIncluded = FormFactory.createPersistentExcludableSubForm(
      class ImplicitlyIncluded extends PersistentExcludableSubFormTemplate {
        public readonly name = 'implicitlyIncluded';
        public readonly key = 'implicitlyIncluded';
        public readonly fields = [];
      },
    );

    const implicitlyIncluded = new ImplicitlyIncluded();
    expect(implicitlyIncluded.state.exclude).toBe(false);
  });

  test(`If its state has been stored in session storage, its exclude property 
  is set to the value read from storage.`, () => {
    const excludeByDefault = true;
    const key = 'excludedByDefault';

    const Form = FormFactory.createPersistentExcludableSubForm(
      class FormTemplate extends PersistentExcludableSubFormTemplate {
        public readonly name = 'excludedByDefault';
        public readonly key = key;
        public readonly fields = [];
        public readonly excludeByDefault = excludeByDefault;
      },
    );

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ exclude: !excludeByDefault }),
    );
    const form = new Form();
    expect(form.state.exclude).toBe(!excludeByDefault);
  });

  test(`When its exclude property is updated, the value in session storage is 
  updated.`, () => {
    const excludeByDefault = false;
    const key = 'excludedByDefault';

    const Form = FormFactory.createPersistentExcludableSubForm(
      class FormTemplate extends PersistentExcludableSubFormTemplate {
        public readonly name = 'excludedByDefault';
        public readonly key = key;
        public readonly fields = [];
        public readonly excludeByDefault = excludeByDefault;
      },
    );

    const form = new Form();
    expect(form.state.exclude).toBe(excludeByDefault);

    form.setExclude(!excludeByDefault);
    expect(
      JSON.parse(sessionStorage.getItem(createPersistenceKey(key))!).exclude,
    ).toBe(!excludeByDefault);
  });

  test(`When reset() is called, its exclude property is set to excludeByDefault,
  not the value stored in session storage.`, () => {
    const excludeByDefault = false;
    const key = 'excludedByDefault';

    const Form = FormFactory.createPersistentExcludableSubForm(
      class FormTemplate extends PersistentExcludableSubFormTemplate {
        public readonly name = 'excludedByDefault';
        public readonly key = key;
        public readonly fields = [];
        public readonly excludeByDefault = excludeByDefault;
      },
    );

    sessionStorage.setItem(
      createPersistenceKey(key),
      JSON.stringify({ exclude: !excludeByDefault }),
    );

    const form = new Form();
    expect(form.state.exclude).toBe(!excludeByDefault);

    form.reset();
    expect(form.state.exclude).toBe(excludeByDefault);
  });
});
