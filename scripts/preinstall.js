if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `[33mThis repository must using pnpm as the package manager ` +
    ` for scripts to work properly.[39m
`,
  )
  process.exit(1)
}
