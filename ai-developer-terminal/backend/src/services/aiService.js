import { logger } from '../utils/logger.js';

export const aiService = {
  /**
   * Main AI query router: queries OpenAI-compatible API if key configured,
   * otherwise uses the local heuristic code intelligence engine.
   */
  async askAssistant({ prompt = '', code = '', filePath = '', mode = 'chat' }) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (apiKey) {
      try {
        return await this.callOpenAI({ prompt, code, filePath, mode, apiKey });
      } catch (err) {
        logger.warn('OpenAI API call failed, falling back to local AI engine:', err.message);
        // Fallback to local heuristic engine
        return this.localHeuristicAssistant({ prompt, code, filePath, mode });
      }
    }

    return this.localHeuristicAssistant({ prompt, code, filePath, mode });
  },

  async callOpenAI({ prompt, code, filePath, mode, apiKey }) {
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const systemPrompt = `You are Brajesh Kushwaha AI Studio Assistant, an expert senior full-stack software engineer and AI coding assistant.
Provide concise, accurate, high-quality code snippets, explanations, and terminal commands.
Always respond in clear Markdown. When writing code, specify the language in code blocks.`;

    let userContent = prompt;
    if (code) {
      userContent += `\n\nFile Context (${filePath || 'active editor'}):\n\`\`\`\n${code}\n\`\`\``;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response returned from AI.';

    return {
      source: 'openai',
      model,
      answer,
    };
  },

  /**
   * Local Heuristic AI Engine:
   * Provides immediate code explanations, debugging, refactoring, and command suggestions
   * without needing external API tokens.
   */
  localHeuristicAssistant({ prompt, code, filePath, mode }) {
    const lowerPrompt = prompt.toLowerCase();

    // Mode: EXPLAIN CODE
    if (mode === 'explain' || lowerPrompt.includes('explain')) {
      if (!code) {
        return {
          source: 'local-engine',
          answer: `### Code Analysis & Architecture\n\nPlease select or open a file in the code editor to generate a comprehensive architectural walkthrough. You can also ask specific questions like: *"How does the routing work?"* or *"Explain async flow"*.\n\n**Supported languages**: JavaScript, TypeScript, React JSX, Node.js, Python, HTML5, CSS3.`,
        };
      }

      const lines = code.split('\n').length;
      const functions = (code.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*(async\s*)?\(/g) || []).length;
      const imports = (code.match(/import\s+.*?from|require\(.*?\)/g) || []).length;

      return {
        source: 'local-engine',
        answer: `### 🔍 Code Explanation: \`${filePath || 'Active File'}\`

**Overview:**
- **Lines of Code:** ${lines}
- **Detected Functions / Handlers:** ${functions}
- **Imported Modules / Dependencies:** ${imports}

**Key Components & Flow:**
1. **Module Imports:** Sets up runtime libraries, utility functions, and system handlers.
2. **Business Logic & State:** Encapsulates core state definitions, data transformations, and asynchronous operations.
3. **Export / Execution:** Exposes endpoints or exports reusable components for consuming layers.

**Efficiency & Best Practice Assessment:**
- Standard modular layout with separation of concerns.
- Consider memoizing heavy computations and keeping error handling strict across all asynchronous promises.`,
      };
    }

    // Mode: DEBUG / BUG FINDER
    if (mode === 'debug' || lowerPrompt.includes('debug') || lowerPrompt.includes('fix') || lowerPrompt.includes('bug')) {
      const suggestions = [];

      if (code.includes('var ')) {
        suggestions.push('• Replace legacy `var` declarations with `let` or `const` for block-scoped safety.');
      }
      if (code.includes('==') && !code.includes('===')) {
        suggestions.push('• Use strict equality `===` instead of loose `==` to prevent unintended coercion bugs.');
      }
      if (code.includes('.then(') && !code.includes('.catch(')) {
        suggestions.push('• Detected unhandled promise chain (`.then()` without `.catch()`). Add error rejection handling.');
      }
      if (code.includes('async ') && !code.includes('try {')) {
        suggestions.push('• Async function missing `try/catch` wrapper; unhandled rejections could crash process.');
      }

      const issuesText = suggestions.length > 0
        ? suggestions.join('\n')
        : '• No immediate critical syntax or anti-patterns detected in the active buffer!\n• Ensure input validation and null-checks are performed before accessing nested properties.';

      return {
        source: 'local-engine',
        answer: `### 🛡️ Studio Bug & Quality Audit

${issuesText}

**Recommended Refactoring:**
\`\`\`javascript
// Safe execution pattern with robust error handling:
try {
  // Safe sanitized operations
} catch (error) {
  console.error('[Operation Failed]:', error.message);
}
\`\`\``,
      };
    }

    // Mode: COMMANDS
    if (mode === 'commands' || lowerPrompt.includes('command') || lowerPrompt.includes('npm')) {
      return {
        source: 'local-engine',
        answer: `### ⚡ Recommended Studio Terminal Commands

- **List files:** \`ls\` or \`tree\`
- **Create project:** \`create my-app react\` or \`create my-api node\`
- **Start live preview:** \`preview\` or click the **Start Preview** button
- **Run dev script:** \`run dev\`
- **Check Git status:** \`git status\`
- **Navigate:** \`cd <folder>\` or \`cd ..\`
- **Inspect file:** \`cat <filename>\`
- **Open file in editor:** \`open <filename>\``,
      };
    }

    // Default chat mode
    return {
      source: 'local-engine',
      answer: `### 🤖 Brajesh AI Studio Assistant

I am your integrated developer assistant. You can ask me to:
1. **Explain code** — inspect syntax, control flow, and architecture.
2. **Debug & Find Bugs** — highlight anti-patterns and suggest automated fixes.
3. **Generate Features** — generate boilerplate React components or Express endpoints.
4. **Suggest Terminal Commands** — guide workspace navigation and workflow execution.

*(Note: To connect to live cloud LLM models, set \`OPENAI_API_KEY\` in your \`backend/.env\` file).*`,
    };
  },
};

