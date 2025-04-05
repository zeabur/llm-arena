import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '1rem 1rem 0.5rem 1rem'}}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'semibold', padding: '1rem 1rem 0rem 1rem'}}>{children}</h2>
    ),
    p: ({ children }) => (
      <p style={{ fontSize: '1rem', padding: '0.5rem 1rem 0.5rem 3rem'}}>{children}</p>
    ),
    ol: ({ children }) => (
      <ol style={{ listStyle: 'decimal', margin: '0rem 2rem 1rem 4rem', padding: '0 0 0 2rem'}}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ display: 'list-item', padding: '0.2rem 0.5rem'}}>{children}</li>
    ),
    a: ({ href, children }) => (
      <a href={href} style={{ color: '#0070f3', textDecoration: 'underline' }}>{children}</a>
    ),
    ...components,
  }
}