import { TemplateManager } from './templates.js';

// Prompt transformation utilities
class PromptTransformer {
  static transformToJSON(prompt, templateId, platform = 'chatgpt', customOptions = {}) {
    let template;
    
    if (templateId === 'auto') {
      template = TemplateManager.matchTemplate(prompt);
    } else {
      template = TemplateManager.getTemplate(templateId);
    }

    if (!template) {
      throw new Error('Template not found');
    }

    // Create a deep copy of the template schema
    const result = JSON.parse(JSON.stringify(template.schema));

    // Apply basic transformations based on template type
    switch (template.id) {
      case 'question-answer':
        result.content.question = prompt;
        result.content.context = customOptions.context || '';
        result.content.constraints = customOptions.constraints || [];
        break;
        
      case 'creative-writing':
        result.content.theme = this.extractTheme(prompt);
        result.content.genre = this.extractGenre(prompt);
        result.content.constraints = customOptions.constraints || [];
        break;
        
      case 'code-generation':
        result.content.functionality = prompt;
        result.content.language = this.extractLanguage(prompt);
        result.content.requirements = customOptions.requirements || [];
        break;
        
      case 'role-playing':
        result.content.character = this.extractCharacter(prompt);
        result.content.scenario = prompt;
        break;
        
      default:
        if (typeof result.content === 'object' && result.content !== null) {
          result.content = { ...result.content, prompt: prompt };
        } else {
          result.content = prompt;
        }
    }

    // Apply platform-specific formatting
    return this.formatForPlatform(result, platform);
  }

  static extractTheme(prompt) {
    const themeMatches = prompt.match(/about\s+([^,.]+)/i);
    return themeMatches ? themeMatches[1].trim() : '';
  }

  static extractGenre(prompt) {
    const genres = ['story', 'poem', 'song', 'script', 'novel', 'essay'];
    const promptLower = prompt.toLowerCase();
    
    for (const genre of genres) {
      if (promptLower.includes(genre)) {
        return genre;
      }
    }
    return '';
  }

  static extractLanguage(prompt) {
    const languages = ['python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust'];
    const promptLower = prompt.toLowerCase();
    
    for (const lang of languages) {
      if (promptLower.includes(lang)) {
        return lang;
      }
    }
    return '';
  }

  static extractCharacter(prompt) {
    const characterMatch = prompt.match(/(?:act as|you are|pretend to be)\s+(?:a\s+)?([^,.]+)/i);
    return characterMatch ? characterMatch[1].trim() : '';
  }

  static formatForPlatform(jsonObject, platform) {
    switch (platform) {
      case 'chatgpt':
        return this.formatForChatGPT(jsonObject);
      case 'claude':
        return this.formatForClaude(jsonObject);
      case 'gemini':
        return this.formatForGemini(jsonObject);
      default:
        return jsonObject;
    }
  }

  static formatForChatGPT(jsonObject) {
    if (jsonObject.role && jsonObject.content) {
      return {
        messages: [jsonObject],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000
      };
    }
    return jsonObject;
  }

  static formatForClaude(jsonObject) {
    if (jsonObject.role && jsonObject.content) {
      const contentStr = typeof jsonObject.content === 'string' ? 
        jsonObject.content : 
        JSON.stringify(jsonObject.content);
      
      return {
        prompt: `Human: ${contentStr}\n\nAssistant:`,
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000
      };
    }
    return jsonObject;
  }

  static formatForGemini(jsonObject) {
    if (jsonObject.role && jsonObject.content) {
      const contentStr = typeof jsonObject.content === 'string' ? 
        jsonObject.content : 
        JSON.stringify(jsonObject.content);
      
      return {
        contents: [{
          parts: [{ text: contentStr }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95
        }
      };
    }
    return jsonObject;
  }
}

// Export for ES6 modules
export { PromptTransformer };

