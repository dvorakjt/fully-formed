import { describe, test, expect } from 'vitest';
import { StatefulArrayReducer, StateManager } from '../../../../../model';

describe('StatefulArrayReducer', () => {
  test('The default state of the reducer is an array containing the states of its members.', () => {
    const defaultMemberStates = ['test', 99, true] as const;
    const members = [
      new StateManager<string>(defaultMemberStates[0]),
      new StateManager<number>(defaultMemberStates[1]),
      new StateManager<boolean>(defaultMemberStates[2]),
    ];
    const reducer = new StatefulArrayReducer({ members });
    expect(reducer.state).toStrictEqual(defaultMemberStates);
  });

  test('When the state of its members updates, its state is updated.', () => {
    const members = [
      new StateManager<string>('test'),
      new StateManager<number>(99),
      new StateManager<boolean>(true),
    ] as const;
    const reducer = new StatefulArrayReducer({ members });
    const updatedMemberStates = [
      members[0].state.toUpperCase(),
      members[1].state + 1,
      !members[2].state,
    ];
    for (let i = 0; i < members.length; i++) {
      members[i].state = updatedMemberStates[i];
    }
    expect(reducer.state).toStrictEqual(updatedMemberStates);
  });

  test('When the state of its members updates, it emits an updated array to its subscribers.', () => {
    const member = new StateManager<string>('test');
    const reducer = new StatefulArrayReducer({ members: [member] });
    const updatedMemberState = member.state.toUpperCase();
    reducer.subscribeToState(state => {
      expect(state).toStrictEqual([updatedMemberState]);
    });
    member.state = updatedMemberState;
  });
});
