import React, { useState, useRef, useEffect } from 'react';
import { Copy, Languages } from 'lucide-react';

const RichTextEditor = () => {
  const [content, setContent] = useState('');
  const [editorMode, setEditorMode] = useState('text'); // 'text', 'code'
  const [outputMode, setOutputMode] = useState('code'); // 'preview', 'code'
  const [language, setLanguage] = useState('en'); // 'en', 'zh'
  const editorRef = useRef(null);
  const contentEditableRef = useRef(null);

  // 语言配置
  const translations = {
    en: {
      title: 'HTML Text Editor',
      subtitle: 'Auto-convert text to HTML paragraph format',
      editor: 'Editor',
      preview: 'Text View',
      htmlCode: 'Code View',
      copyHtml: 'Copy HTML',
      copySuccess: 'Copied successfully!',
      textInput: 'Text Input Area',
      htmlPreview: 'Output Area',
      realTimePreview: 'Real-time preview',
      generatedHtml: 'Generated HTML Code',
      paragraphs: 'paragraphs',
      paragraph: 'paragraph',
      realTimeHtml: 'Real-time HTML Output',
      characters: 'Characters',
      paragraphCount: 'Paragraphs',
      htmlLength: 'HTML Length',
      tip: 'Tip: Each line of text will be automatically wrapped in <p> tags',
      usage: 'Usage Instructions',
      features: 'Features',
      feature1: '• Real-time text to HTML paragraph conversion',
      feature2: '• Automatic multi-paragraph recognition',
      feature3: '• Preview and code view support',
      feature4: '• One-click HTML code copying',
      feature5: '• Auto-convert headers to H2 tags',
      howToUse: 'How to Use',
      usage1: '• Enter text content in the editor area',
      usage2: '• Press Enter to separate paragraphs',
      usage3: '• Use #+space or HTML h-tags for H2 headings',
      usage4: '• Click "Copy HTML" to get the code',
      placeholder: 'Enter your text content here...\n\nEach paragraph will be automatically wrapped in HTML <p> tags.\n\nPlease use #+space for headings to make them H2 tags.\n\nPress Enter to create new paragraphs.',
      textModePlaceholder: 'Please enter or paste your text content in Code Mode',
      emptyPreview: 'Preview will appear here...',
      emptyCode: '<!-- Generated HTML will appear here -->',
      switchLang: 'EN/中文',
      textMode: 'Text Mode',
      codeMode: 'Code Mode'
    },
    zh: {
      title: '网页文本编辑器',
      subtitle: '自动转换文本为HTML段落格式',
      editor: '编辑器',
      preview: '文本视图',
      htmlCode: '代码视图',
      copyHtml: '复制HTML',
      copySuccess: '复制成功！',
      textInput: '文本输入区域',
      htmlPreview: '输出区域',
      realTimePreview: '实时预览',
      generatedHtml: '生成的HTML代码',
      paragraphs: '个段落',
      paragraph: '个段落',
      realTimeHtml: '实时HTML输出',
      characters: '字符数',
      paragraphCount: '段落数',
      htmlLength: 'HTML长度',
      tip: '提示：每行文本被包裹在<p>中，#开头的行将自动转换为<h2>',
      usage: '使用说明',
      features: '功能特点',
      feature1: '• 实时文本转HTML段落转换',
      feature2: '• 自动多段落识别',
      feature3: '• 支持预览和代码视图',
      feature4: '• 一键复制HTML代码',
      feature5: '• 自动识别小标题并转换为H2',
      howToUse: '如何使用',
      usage1: '• 在编辑区输入文本内容',
      usage2: '• 按回车键分隔段落',
      usage3: '• 使用 #+空格 或 H标签标记小标题(H2)',
      usage4: '• 点击"复制HTML"获取代码',
      placeholder: '在此输入文本内容...\n\n每个段落将自动被包裹在HTML <p>标签中。\n\n请使用 #+空格 标记小标题（将自动转为H2）。\n\n按回车键创建新段落。',
      textModePlaceholder: '请在代码视图中输入或粘贴您要处理的文本内容',
      emptyPreview: '预览将在此处显示...',
      emptyCode: '<!-- 生成的HTML将在此处显示 -->',
      switchLang: '中/EN',
      textMode: '文本视图',
      codeMode: '代码视图'
    }
  };

  const t = translations[language];

  const convertToHtml = (text) => {
    if (!text.trim()) return '';

    // If text contains HTML tags, use DOMParser
    if (/<[a-z][\s\S]*>/i.test(text)) {
      const parser = new DOMParser();
      // Replace newlines with a marker to preserve them if they are outside tags?
      // Actually, if it's HTML, we should respect HTML whitespace rules (collapse).
      // But users might mix. Let's try parsing directly.
      const doc = parser.parseFromString(text, 'text/html');
      
      // We need to iterate over body children
      // We want to normalize to <p>...
      
      // Let's use a simplified approach:
      // 1. Flatten text and inline tags.
      // 2. Wrap in <p> if not already.
      
      // Better approach:
      // Treat the DOM tree.
      // Block elements -> <p>
      // Headers -> <p><strong>
      // Inline -> strong or text
      
      // Helper to get inline HTML content recursively
      const getInlineHtml = (n) => {
         let s = '';
         n.childNodes.forEach(c => {
             if (c.nodeType === Node.TEXT_NODE) {
                 s += c.textContent;
             } else if (c.nodeType === Node.ELEMENT_NODE) {
                 const t = c.tagName.toLowerCase();
                 if (t === 'br') s += '<br>';
                 else {
                    const inner = getInlineHtml(c);
                    if (t === 'strong' || t === 'b') s += `<strong>${inner}</strong>`;
                    else if (t === 'em' || t === 'i') s += `<em>${inner}</em>`;
                    else if (t === 'span') s += inner; 
                    else s += inner; 
                 }
             }
         });
         return s;
      };

      // Helper to check if content is effectively empty (only whitespace, br, or nbsp)
      const isContentEmpty = (html) => {
          if (!html) return true;
          // Remove all HTML tags and non-breaking spaces
          // If only whitespace remains, it's considered empty
          const clean = html
              .replace(/<[^>]+>/g, '') // Remove all tags
              .replace(/&nbsp;/gi, '')
              .trim();
          return clean.length === 0;
      };

      const processBody = (root) => {
         let output = '';
         let accumulator = '';

         const flush = () => {
             if (isContentEmpty(accumulator)) {
                 accumulator = '';
                 return;
             }
             const text = accumulator.replace(/<[^>]+>/g, '').trim();
             // H2 detection
             if (/^#+\s/.test(text) && text.length <= 50) {
                 let content = accumulator.replace(/^(\s*<[^>]+>)*\s*#+\s+/, '$1');
                 output += `<h2>${content}</h2>\n`;
             } else {
                 output += `<p>${accumulator}</p>\n`;
             }
             accumulator = '';
         };

         root.childNodes.forEach(node => {
             if (node.nodeType === Node.TEXT_NODE) {
                 const parts = node.textContent.split('\n');
                 parts.forEach((part, i) => {
                     if (i > 0) flush(); 
                     accumulator += part;
                 });
             } else if (node.nodeType === Node.ELEMENT_NODE) {
                 const tag = node.tagName.toLowerCase();
                 
                 if (tag === 'br') {
                     flush();
                 } else if (/^(div|p|h[1-6]|section|article|li|ul|ol|blockquote)$/.test(tag)) {
                     flush();
                     if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'blockquote' || tag === 'ul' || tag === 'ol') {
                         output += processBody(node);
                     } else {
                         const inner = getInlineHtml(node);
                         if (!isContentEmpty(inner)) {
                             const text = node.textContent.trim();
                             if (/^h[1-6]$/.test(tag)) {
                                 if (text.length > 50) {
                                     output += `<p>${inner}</p>\n`;
                                 } else {
                                     output += `<h2>${inner}</h2>\n`;
                                 }
                             } else {
                                 if (/^#+\s/.test(text) && text.length <= 50) {
                                     const content = inner.replace(/^(\s*<[^>]+>)*\s*#+\s+/, '$1');
                                     output += `<h2>${content}</h2>\n`;
                                 } else {
                                     output += `<p>${inner}</p>\n`;
                                 }
                             }
                         }
                     }
                 } else {
                     accumulator += getInlineHtml(node);
                 }
             }
         });
         flush();
         return output;
      };
      
      return processBody(doc.body).trim();
    }

    // Fallback to original logic for plain text
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        if (/^#+\s/.test(line)) {
          const content = line.replace(/^#+\s+/, '');
          // If content is too long, treat as paragraph even if it starts with #
          if (content.length > 50) {
            return `<p><strong>${content}</strong></p>`; // Fallback to bold paragraph or just p? Let's use bold p to respect user intent but avoid h2 layout break
          }
          return `<h2>${content}</h2>`;
        }
        return `<p>${line}</p>`;
      })
      .join('\n');
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const textHtml = e.clipboardData.getData('text/html');
    const textPlain = e.clipboardData.getData('text/plain');
    
    // If HTML exists, we want to insert it?
    // But inserting full HTML into textarea is messy.
    // Let's check if the user wants the SOURCE of the HTML.
    // Yes, "preserve html style tags".
    
    let insertText = textPlain;
    if (textHtml) {
        // We might want to clean it up a bit or just dump it?
        // If we dump full HTML document, it's too much.
        // Let's try to extract the fragment.
        // But getting the exact source code of the selection is hard from clipboard data sometimes.
        // text/html usually contains <body>...</body> or fragment.
        
        // Let's use the plain text if no HTML, but if HTML is there, use it?
        // Wait, text/html is the rendered HTML.
        // If I copy "Foo" (bold) from Word, text/html is `...<b>Foo</b>...`.
        // If I insert that into textarea, I get `...<b>Foo</b>...`.
        // This seems to be what is requested.
        
        // Clean up the HTML source to avoid <html><body> wrappers
        const parser = new DOMParser();
        const doc = parser.parseFromString(textHtml, 'text/html');
        insertText = doc.body.innerHTML; 
    }
    
    // Insert into textarea at cursor
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + insertText + content.substring(end);
    setContent(newContent);
    
    // Update cursor position (approximation)
    setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
    }, 0);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Sync content to contentEditable div without resetting cursor on every input
  useEffect(() => {
    if (contentEditableRef.current) {
      // Only update if content is different (e.g. initial load, mode switch, or external update)
      // This prevents cursor jumping when typing because innerHTML matches content
      if (contentEditableRef.current.innerHTML !== content) {
        contentEditableRef.current.innerHTML = content;
      }
    }
  }, [content, editorMode]);

  const handleEditableInput = (e) => {
    const newContent = e.currentTarget.innerHTML;
    // We need to keep the HTML as is, but our state 'content' is the source of truth.
    // If 'content' is expected to be HTML source, then this works fine.
    // If 'content' is raw text with markdown, then editing HTML directly is tricky.
    // Given the previous requirement "paste html... preserve html tags", 'content' stores HTML source.
    // So updating 'content' with innerHTML is correct for WYSIWYG editing.
    setContent(newContent);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(t.copySuccess);
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const htmlOutput = convertToHtml(content);
  const paragraphCount = content.trim() ? content.split('\n').filter(p => p.trim()).length : 0;
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-blue-100 mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-sm"
            >
              <Languages size={16} />
              {t.switchLang}
            </button>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="border-b bg-gray-50 p-3 flex gap-2 flex-wrap">
          <button
            onClick={() => copyToClipboard(htmlOutput)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ml-auto"
            disabled={!htmlOutput}
          >
            <Copy size={16} />
            {t.copyHtml}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-96">
          {/* 编辑区域 */}
          <div className="border-r border-gray-200">
            <div className="p-3 bg-gray-50 border-b text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>{t.textInput}</span>
              <div className="flex bg-gray-200 rounded p-0.5 text-xs">
                <button
                  onClick={() => setEditorMode('text')}
                  className={`px-3 py-1 rounded transition-colors ${
                    editorMode === 'text'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.textMode}
                </button>
                <button
                  onClick={() => setEditorMode('code')}
                  className={`px-3 py-1 rounded transition-colors ${
                    editorMode === 'code'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.codeMode}
                </button>
              </div>
            </div>
            {editorMode === 'code' ? (
              <textarea
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                onPaste={handlePaste}
                placeholder={t.placeholder}
                className="w-full h-96 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset leading-relaxed font-mono text-sm bg-gray-900 text-green-400"
                style={{ fontFamily: 'Monaco, Menlo, Consolas, monospace' }}
              />
            ) : (
              <div 
                ref={contentEditableRef}
                className={`w-full h-96 p-4 overflow-auto bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset text-gray-800 leading-relaxed ${!content ? 'empty-editor' : ''}`}
                contentEditable={true}
                onInput={handleEditableInput}
                suppressContentEditableWarning={true}
                style={{ lineHeight: '1.6' }}
                data-placeholder={t.placeholder}
              />
            )}
          </div>
          
          {/* 预览/代码区域 */}
          <div className="bg-gray-50">
            <div className="p-3 bg-gray-100 border-b text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>{t.htmlPreview}</span>
              <div className="flex bg-gray-200 rounded p-0.5 text-xs">
                <button
                  onClick={() => setOutputMode('preview')}
                  className={`px-3 py-1 rounded transition-colors ${
                    outputMode === 'preview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.preview}
                </button>
                <button
                  onClick={() => setOutputMode('code')}
                  className={`px-3 py-1 rounded transition-colors ${
                    outputMode === 'code'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.htmlCode}
                </button>
              </div>
            </div>

            {outputMode === 'preview' && (
              <div className="p-4 h-96 overflow-auto bg-white">
                {htmlOutput ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                    className="prose prose-gray max-w-none preview-content"
                    style={{ lineHeight: '1.6' }}
                  />
                ) : (
                  <p className="text-gray-400 italic">{t.emptyPreview}</p>
                )}
              </div>
            )}

            {outputMode === 'code' && (
              <div className="h-96 overflow-auto bg-gray-900">
                <pre className="p-4 text-sm text-green-400 font-mono leading-relaxed">
                  <code>
                    {htmlOutput || t.emptyCode}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="bg-gray-50 border-t p-3 text-xs text-gray-600 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span>{t.characters}: {content.length}</span>
            <span>{t.paragraphCount}: {paragraphCount}</span>
            <span>{t.htmlLength}: {htmlOutput.length}</span>
          </div>
          <div className="text-gray-500">
            {t.tip}
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{t.usage}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">{t.features}</h3>
            <ul className="space-y-1">
              <li>{t.feature1}</li>
              <li>{t.feature2}</li>
              <li>{t.feature3}</li>
              <li>{t.feature4}</li>
              <li>{t.feature5}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">{t.howToUse}</h3>
            <ul className="space-y-1">
              <li>{t.usage1}</li>
              <li>{t.usage2}</li>
              <li>{t.usage3}</li>
              <li>{t.usage4}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;