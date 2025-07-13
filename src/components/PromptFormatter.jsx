import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, Sparkles, Code, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { TemplateManager } from '@/lib/templates';
import { PromptTransformer } from '@/lib/prompt-transformer';

const PromptFormatter = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('chatgpt');
  const [selectedTemplate, setSelectedTemplate] = useState('auto');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Initialize templates
    const templateManager = new TemplateManager();
    const allTemplates = Object.values(templateManager.getAllTemplates());
    setTemplates(allTemplates);

    // Load history from localStorage
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleTransform = async () => {
    if (!prompt.trim()) {
      setValidationStatus({ type: 'error', message: 'Please enter a prompt' });
      return;
    }

    setIsTransforming(true);
    setValidationStatus(null);

    try {
      const templateManager = new TemplateManager();
      let templateId = selectedTemplate;
      
      if (selectedTemplate === 'auto') {
        const detectedTemplate = templateManager.matchTemplate(prompt, selectedPlatform);
        templateId = detectedTemplate.id;
      }

      const result = PromptTransformer.transformToJSON(prompt, templateId, selectedPlatform, {});
      const formattedJson = JSON.stringify(result, null, 2);
      
      setJsonOutput(formattedJson);
      setValidationStatus({ type: 'success', message: 'Prompt transformed successfully!' });

      // Save to history
      const historyItem = {
        id: Date.now(),
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        platform: selectedPlatform,
        template: templateId,
        timestamp: new Date().toISOString(),
        result: formattedJson
      };

      const newHistory = [historyItem, ...history.slice(0, 9)]; // Keep last 10 items
      setHistory(newHistory);
      localStorage.setItem('promptHistory', JSON.stringify(newHistory));

    } catch (error) {
      console.error('Transformation error:', error);
      setValidationStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setValidationStatus({ type: 'success', message: 'Copied to clipboard!' });
      setTimeout(() => setValidationStatus(null), 2000);
    } catch (error) {
      setValidationStatus({ type: 'error', message: 'Failed to copy to clipboard' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setValidationStatus({ type: 'success', message: 'File downloaded!' });
    setTimeout(() => setValidationStatus(null), 2000);
  };

  const loadFromHistory = (item) => {
    setPrompt(item.prompt.replace('...', ''));
    setSelectedPlatform(item.platform);
    setSelectedTemplate(item.template);
    setJsonOutput(item.result);
  };

  const getTemplatesByPlatform = () => {
    return templates.filter(template => 
      template.platforms.includes(selectedPlatform)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Code className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            JSON Prompt Formatter
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform natural language prompts into structured JSON formats optimized for ChatGPT, Claude, and other AI models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Prompt Configuration
              </CardTitle>
              <CardDescription>
                Configure your prompt settings and target platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Platform</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatgpt">ChatGPT</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                      <SelectItem value="custom">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      {getTemplatesByPlatform().map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Natural Language Prompt</label>
                <Textarea
                  placeholder="Enter your prompt here... e.g., 'Explain how machine learning works in simple terms'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{prompt.length} characters</span>
                  {prompt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrompt('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleTransform} 
                disabled={!prompt.trim() || isTransforming}
                className="w-full"
                size="lg"
              >
                {isTransforming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    Transform to JSON
                  </>
                )}
              </Button>

              {validationStatus && (
                <Alert className={validationStatus.type === 'error' ? 'border-destructive' : 'border-green-500'}>
                  {validationStatus.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{validationStatus.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    JSON Output
                  </CardTitle>
                  <CardDescription>
                    Formatted JSON ready for your AI platform
                  </CardDescription>
                </div>
                {jsonOutput && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono">
                  {jsonOutput || 'Click "Transform to JSON" to generate formatted prompt'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          {selectedTemplate !== 'auto' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Info</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const template = templates.find(t => t.id === selectedTemplate);
                  return template ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Supported Platforms:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.platforms.map(platform => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.keywords.slice(0, 6).map(keyword => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transformations</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="text-sm font-medium truncate">{item.prompt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.template}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent transformations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptFormatter;

