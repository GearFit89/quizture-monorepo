const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')
const { parseArgs } = require('util')

// Parse command-line flags (-path or --path)
const { values } = parseArgs({
  options: {
    path: {
      type: 'string',
      short: 'p',
      default: 'dev-log',
    },
  },
  // Allow unknown args so execution doesn't throw if other flags are passed
  strict: false,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Promise wrapper for single questions
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve))
}

// Helper for single-line input with optional fallback default
const askQuestionWithDefault = async (query, defaultValue = '') => {
  const defaultPrompt = defaultValue ? ` (default: ${defaultValue})` : ''
  const answer = await askQuestion(`${query}${defaultPrompt}: `)
  return answer.trim() || defaultValue
}

// Helper for multi-line list input (press Enter twice or type 'done')
const askList = async (promptText) => {
  console.log(`\n--- ${promptText} ---`)
  console.log("(Type items below. Press ENTER twice or type 'done' to finish)")
  const items = []
  while (true) {
    const input = await askQuestion('> ')
    const trimmed = input.trim()
    if (trimmed.toLowerCase() === 'done' || trimmed === '') {
      break
    }
    items.push(`* ${trimmed}`)
  }
  return items.length > 0 ? items.join('\n') : '* None'
}

// Helper to paste multi-line code blocks
const askCodeBlock = async () => {
  console.log('\n--- Paste Code Snippets (Optional) ---')
  const wantCode = await askQuestion('Would you like to attach a code snippet? (y/N): ')
  if (wantCode.trim().toLowerCase() !== 'y') {
    return '```\n// No code snippet added\n```'
  }

  const lang = await askQuestionWithDefault('Programming language (e.g., ts, js, python)', 'ts')
  console.log('\nPaste your code below. Type \'END\' on a new line when finished:')

  const lines = []
  while (true) {
    const input = await askQuestion('> ')
    if (input.trim() === 'END') {
      break
    }
    lines.push(input)
  }

  return `\`\`\`${lang}\n${lines.join('\n')}\n\`\`\``
}

// Helper to safely pull Git commit history for today
const getGitCommits = () => {
  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const sinceDate = startOfToday.toISOString()

    const output = execSync(`git log --since="${sinceDate}" --pretty=format:"* %s (%h)"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim()

    return output || '* No commits recorded today yet.'
  } catch {
    return '* (Not inside a Git repository or Git unavailable)'
  }
}

async function createLog () {
  const today = new Date().toISOString().split('T')[0]
  console.log('\n========================================')
  console.log(`       CREATING DEV LOG FOR ${today}`)
  console.log('========================================')

  // 1. Fetch Git data
  console.log('\n--> Fetching today\'s Git commits...')
  const gitCommits = getGitCommits()

  // 2. Prompt for user details
  const summary = await askQuestion('\nSummary / High-level Overview: ')
  const whatIDid = await askList('WHAT I DID')
  const challenges = await askList('BUGS & CHALLENGES')
  const nextUp = await askList('NEXT UP / TODO')
  const codeSnippet = await askCodeBlock()

  rl.close()

  // 3. Format markdown content
  const content = `---
date: ${today}
type: dev-log
---

# Dev Log: ${today}

${summary ? `> ${summary}\n\n` : ''}## 🐙 Today's Git Commits
${gitCommits}

## 🚀 What I Did
${whatIDid}

## 🐛 Bugs & Challenges
${challenges}

## 📝 Next Up
${nextUp.replace(/\*/g, '- [ ]')}

## 💻 Code Snippet / Reference
${codeSnippet}
`

  // 4. Resolve output directory from -path flag
  const customPath = values.path
  const dirPath = path.isAbsolute(customPath)
    ? customPath
    : path.join(process.cwd(), customPath)

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const filePath = path.join(dirPath, `${today}.md`)
  fs.writeFileSync(filePath, content, 'utf8')

  console.log(`\n Success! Log created at: ${filePath}\n`)
}

createLog()
