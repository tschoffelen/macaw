---
layout: twig-test
fromEmail: {{ email ?: 'mark@example.com' }}
fromName: {{ (email ?: 'mark@example.com') | split('@', 2) | first | title }}
subject: Hello!
---
