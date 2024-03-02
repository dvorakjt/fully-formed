import { describe, test, expect } from 'vitest';
import { DerivedValue, StateManager } from '../../../../../model';

describe('DerivedValue', () => {
  const complementaryColors = {
    red: 'green',
    yellow: 'purple',
    blue: 'orange',
    green: 'red',
    purple: 'yellow',
    orange: 'blue',
  };
  const messages = {
    notAColor: 'Please enter two valid colors.',
    complementary: 'You have entered complementary colors!',
    nonComplementary: 'You have entered non-complementary colors.',
  };

  test('Its default value is the result of running the provided derive function against the state of its sources.', () => {
    const sources = [
      new StateManager<string>('red'),
      new StateManager<string>('green'),
    ] as const;
    const derivedValue = new DerivedValue({
      name: 'areComplementary',
      sources,
      deriveFn: ([color1, color2]): string => {
        if (
          !(color1 in complementaryColors) ||
          !(color2 in complementaryColors)
        ) {
          return messages.notAColor;
        }
        return (
            complementaryColors[color1 as keyof typeof complementaryColors] ===
              color2
          ) ?
            messages.complementary
          : messages.nonComplementary;
      },
    });
    expect(derivedValue.value).toBe(messages.complementary);
  });

  test('When the state of one of its sources updates, its value is updated.', () => {
    const sources = [
      new StateManager<string>('red'),
      new StateManager<string>('green'),
    ] as const;
    const derivedValue = new DerivedValue({
      name: 'areComplementary',
      sources,
      deriveFn: ([color1, color2]): string => {
        if (
          !(color1 in complementaryColors) ||
          !(color2 in complementaryColors)
        ) {
          return messages.notAColor;
        }
        return (
            complementaryColors[color1 as keyof typeof complementaryColors] ===
              color2
          ) ?
            messages.complementary
          : messages.nonComplementary;
      },
    });
    sources[0].state = 'blue';
    expect(derivedValue.value).toBe(messages.nonComplementary);
    sources[1].state = 'tofu';
    expect(derivedValue.value).toBe(messages.notAColor);
  });

  test('When the state of one of its sources is updated, it emits a new value to subscribers.', () => {
    const sources = [
      new StateManager<string>('red'),
      new StateManager<string>('green'),
    ] as const;
    const derivedValue = new DerivedValue({
      name: 'areComplementary',
      sources,
      deriveFn: ([color1, color2]): string => {
        if (
          !(color1 in complementaryColors) ||
          !(color2 in complementaryColors)
        ) {
          return messages.notAColor;
        }
        return (
            complementaryColors[color1 as keyof typeof complementaryColors] ===
              color2
          ) ?
            messages.complementary
          : messages.nonComplementary;
      },
    });
    derivedValue.subscribeToValue(value => {
      expect(value).toBe(messages.notAColor);
    });
    sources[0].state = 'pizza';
  });
});
