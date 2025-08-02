import type { CSSProperties } from 'react';

export const figmaNodeStyle: CSSProperties = {
  backgroundColor: 'hsl(var(--color-secondary))',
  border: '1px solid hsl(var(--color-border))',
  borderRadius: 'var(--radius)',
  boxShadow: '0 2px 8px #000a',
  transition: 'box-shadow 0.2s ease'
};

export const selectedNodeStyle: CSSProperties = {
  boxShadow: '0 0 0 2px hsl(var(--color-accent)), 0 2px 8px #000a'
};

export const hoverNodeStyle: CSSProperties = {
  boxShadow: '0 0 0 2px hsl(var(--color-border)), 0 2px 8px #000a'
};
