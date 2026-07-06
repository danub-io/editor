import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from './ThemeProvider';

// Mock next-themes as it uses React Context and window object which might be missing/complex in jsdom
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div
      data-testid="next-themes-provider"
      data-attribute={props.attribute}
      data-default-theme={props.defaultTheme}
      data-enable-system={props.enableSystem}
    >
      {children}
    </div>
  ),
}));

describe('ThemeProvider component', () => {
  it('renderiza os filhos (children) corretamente', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-element">Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('repassa as propriedades (props) para o NextThemesProvider subjacente', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Test</div>
      </ThemeProvider>
    );

    const providerDiv = screen.getByTestId('next-themes-provider');
    expect(providerDiv).toHaveAttribute('data-attribute', 'class');
    expect(providerDiv).toHaveAttribute('data-default-theme', 'system');
    expect(providerDiv).toHaveAttribute('data-enable-system', 'true');
  });
});
