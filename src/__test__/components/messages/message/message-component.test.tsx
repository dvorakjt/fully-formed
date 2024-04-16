import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MessageComponent } from '../../../../components';

describe('MessageComponent', () => {
  afterEach(cleanup);

  test('It renders a span element.', () => {
    render(<MessageComponent text="" />);

    const spanElements = document.getElementsByTagName('span');
    expect(spanElements.length).toBe(1);
  });

  test(`The span element it returns contains the message text it received as a 
  prop.`, () => {
    render(<MessageComponent text="test message" />);

    const span = document.getElementsByTagName('span')[0];
    expect(span.textContent).toBe('test message');
  });

  test(`If it received a className as a prop, the span element it returns 
  receives that className.`, () => {
    render(<MessageComponent text="" className="test-message" />);

    const span = document.getElementsByTagName('span')[0];
    expect(span.className).toBe('test-message');
  });

  test(`If it received style as a prop, those styles are applied to the span 
  element it returns.`, () => {
    render(
      <MessageComponent
        text=""
        style={{
          display: 'block',
          fontFamily: 'Arial',
          fontSize: '12px',
        }}
      />,
    );

    const span = document.getElementsByTagName('span')[0];
    expect(span.style.display).toBe('block');
    expect(span.style.fontFamily).toBe('Arial');
    expect(span.style.fontSize).toBe('12px');
  });
});
