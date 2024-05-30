import { describe, test, expect } from 'vitest';
import {
  applyAutoTrim,
  Field,
  ExcludableField,
  Adapter,
  ExcludableAdapter,
} from '../../../../model';

describe('applyAutoTrim()', () => {
  test(`It replaces all string fields with adapters which trim the field's 
  value when autoTrim is true.`, () => {
    const fields = [
      new Field({
        name: 'fieldA',
        defaultValue: '   test   ',
      }),
      new Field({
        name: 'fieldB',
        defaultValue: '\ntest\n',
      }),
      new ExcludableField({
        name: 'fieldC',
        defaultValue: '\ttest\t',
      }),
    ];

    const afterApplyAutoTrim = applyAutoTrim(fields, true);

    expect(afterApplyAutoTrim[0]).toBeInstanceOf(Adapter);
    expect(afterApplyAutoTrim[1]).toBeInstanceOf(Adapter);
    expect(afterApplyAutoTrim[2]).toBeInstanceOf(ExcludableAdapter);

    for (const adapter of afterApplyAutoTrim) {
      expect(adapter.state.value).toBe('test');
    }
  });

  test(`It does not replace any string-type fields if autoTrim is false.`, () => {
    const fields = [
      new Field({
        name: 'fieldA',
        defaultValue: '   test   ',
      }),
      new Field({
        name: 'fieldB',
        defaultValue: '\ntest\n',
      }),
      new ExcludableField({
        name: 'fieldC',
        defaultValue: '\ttest\t',
      }),
    ];

    const afterApplyAutoTrim = applyAutoTrim(fields, false);

    expect(afterApplyAutoTrim[0]).toBeInstanceOf(Field);
    expect(afterApplyAutoTrim[1]).toBeInstanceOf(Field);
    expect(afterApplyAutoTrim[2]).toBeInstanceOf(ExcludableField);

    expect(afterApplyAutoTrim[0].state.value).toBe('   test   ');
    expect(afterApplyAutoTrim[1].state.value).toBe('\ntest\n');
    expect(afterApplyAutoTrim[2].state.value).toBe('\ttest\t');
  });

  test(`If autoTrim is an object with an include property, it replaces only the 
  string-type fields included in the array.`, () => {
    const fields = [
      new Field({
        name: 'included',
        defaultValue: '',
      }),
      new Field({
        name: 'excluded',
        defaultValue: '',
      }),
    ];

    const afterApplyAutoTrim = applyAutoTrim(fields, { include: ['included'] });

    expect(afterApplyAutoTrim[0]).toBeInstanceOf(Adapter);
    expect(afterApplyAutoTrim[1]).toBeInstanceOf(Field);
  });

  test(`If autoTrim is an object with an exclude property, it replaces only the 
  string-type fields NOT included in the array.`, () => {
    const fields = [
      new Field({
        name: 'included',
        defaultValue: '',
      }),
      new Field({
        name: 'excluded',
        defaultValue: '',
      }),
    ];

    const afterApplyAutoTrim = applyAutoTrim(fields, { exclude: ['excluded'] });

    expect(afterApplyAutoTrim[0]).toBeInstanceOf(Adapter);
    expect(afterApplyAutoTrim[1]).toBeInstanceOf(Field);
  });
});
