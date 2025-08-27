import { cn } from '../../lib/utils';

describe('lib/utils - cn', () => {
  it('merges class names and removes falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('merges Tailwind classes using tailwind-merge', () => {
    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500');
  });

  it('accepts conditional objects via clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });
});


