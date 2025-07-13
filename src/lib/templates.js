// Template definitions for different prompt types
const PROMPT_TEMPLATES = {
  'question-answer': {
    id: 'question-answer',
    name: 'Question & Answer',
    description: 'Format prompts for information retrieval and Q&A',
    platforms: ['chatgpt', 'claude', 'gemini'],
    schema: {
      role: 'user',
      content: {
        type: 'question',
        question: '',
        context: '',
        format: 'detailed',
        constraints: []
      }
    },
    keywords: ['what', 'how', 'why', 'when', 'where', 'explain', 'describe', 'tell me']
  },
  
  'creative-writing': {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Structure prompts for creative content generation',
    platforms: ['chatgpt', 'claude', 'gemini'],
    schema: {
      role: 'user',
      content: {
        type: 'creative_task',
        genre: '',
        style: '',
        length: '',
        characters: [],
        setting: '',
        theme: '',
        constraints: []
      }
    },
    keywords: ['write', 'story', 'poem', 'creative', 'imagine', 'character', 'plot']
  },
  
  'code-generation': {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Format programming and code-related prompts',
    platforms: ['chatgpt', 'claude', 'gemini'],
    schema: {
      role: 'user',
      content: {
        type: 'code_request',
        language: '',
        framework: '',
        functionality: '',
        requirements: [],
        constraints: [],
        examples: []
      }
    },
    keywords: ['code', 'program', 'function', 'class', 'algorithm', 'debug', 'implement']
  },
  
  'data-analysis': {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Structure prompts for data processing and analysis',
    platforms: ['chatgpt', 'claude', 'gemini'],
    schema: {
      role: 'user',
      content: {
        type: 'analysis_request',
        data_type: '',
        analysis_goal: '',
        methods: [],
        output_format: '',
        visualizations: []
      }
    },
    keywords: ['analyze', 'data', 'statistics', 'chart', 'graph', 'trend', 'pattern']
  },
  
  'role-playing': {
    id: 'role-playing',
    name: 'Role Playing',
    description: 'Create structured role-playing scenarios',
    platforms: ['chatgpt', 'claude', 'gemini'],
    schema: {
      role: 'system',
      content: {
        type: 'role_assignment',
        character: '',
        personality: '',
        background: '',
        scenario: '',
        objectives: [],
        constraints: []
      }
    },
    keywords: ['act as', 'pretend', 'role', 'character', 'persona', 'behave like']
  },
  
  'function-calling': {
    id: 'function-calling',
    name: 'Function Calling',
    description: 'Format prompts for OpenAI function calling',
    platforms: ['chatgpt'],
    schema: {
      role: 'user',
      content: '',
      functions: [{
        name: '',
        description: '',
        parameters: {
          type: 'object',
          properties: {},
          required: []
        }
      }],
      function_call: 'auto'
    },
    keywords: ['function', 'call', 'api', 'tool', 'execute', 'invoke']
  }
};

// Template matching utilities
class TemplateManager {
  static getAllTemplates() {
    return PROMPT_TEMPLATES;
  }
  
  static getTemplate(id) {
    return PROMPT_TEMPLATES[id] || null;
  }
  
  static matchTemplate(prompt) {
    const promptLower = prompt.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [id, template] of Object.entries(PROMPT_TEMPLATES)) {
      let score = 0;
      
      // Check for keyword matches
      for (const keyword of template.keywords) {
        if (promptLower.includes(keyword)) {
          score += 1;
        }
      }
      
      // Bonus for exact phrase matches
      if (promptLower.includes('act as') || promptLower.includes('you are')) {
        if (id === 'role-playing') score += 3;
      }
      
      if (promptLower.includes('write code') || promptLower.includes('create function')) {
        if (id === 'code-generation') score += 3;
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = template;
      }
    }
    
    // Default to question-answer if no strong match
    return bestMatch || PROMPT_TEMPLATES['question-answer'];
  }
  
  static getPlatformTemplates(platform) {
    return Object.values(PROMPT_TEMPLATES).filter(
      template => template.platforms.includes(platform)
    );
  }
}

// Export for ES6 modules
export { PROMPT_TEMPLATES, TemplateManager };

