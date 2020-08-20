declare module Resume {
  interface Exp {
    company: string
    title: string
    tasks: string
    keywords: string
  }

  interface Contact {
    type: 'phone' | 'email' | 'site'
    value: string
  }

  interface Edu {
    name: string
    subject: string
    duration: string
    level: string
  }
}
