import React, { useState, useRef } from 'react';
import { Copy, Code, Eye, Edit, Languages } from 'lucide-react';

const RichTextEditor = () => {
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState('editor'); // 'editor', 'preview', 'code'
  const [language, setLanguage] = useState('en'); // 'en', 'zh'
  const editorRef = useRef(null);

  // 语言配置
  const translations = {
    en: {
      title: 'Rich Text Editor',
      subtitle: 'Auto-convert text to HTML paragraph format',
      editor: 'Editor',
      preview: 'Preview',
      htmlCode: 'HTML Code',
      copyHtml: 'Copy HTML',
      copySuccess: 'Copied successfully!',
      textInput: 'Text Input Area',
      htmlPreview: 'HTML Preview Effect',
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
      howToUse: 'How to Use',
      usage1: '• Enter text content in the editor area',
      usage2: '• Press Enter to separate paragraphs',
      usage3: '• Empty lines are automatically ignored',
      usage4: '• Click "Copy HTML" to get the code',
      placeholder: 'Enter your text content here...\n\nEach paragraph will be automatically wrapped in HTML <p> tags.\n\nPress Enter to create new paragraphs.\n\nEmpty lines will be ignored.',
      emptyPreview: 'Preview will appear here...',
      emptyCode: '<!-- Generated HTML will appear here -->',
      switchLang: 'EN/中文'
    },
    zh: {
      title: '富文本编辑器',
      subtitle: '自动转换文本为HTML段落格式',
      editor: '编辑器',
      preview: '预览',
      htmlCode: 'HTML代码',
      copyHtml: '复制HTML',
      copySuccess: '复制成功！',
      textInput: '文本输入区域',
      htmlPreview: 'HTML预览效果',
      realTimePreview: '实时预览',
      generatedHtml: '生成的HTML代码',
      paragraphs: '个段落',
      paragraph: '个段落',
      realTimeHtml: '实时HTML输出',
      characters: '字符数',
      paragraphCount: '段落数',
      htmlLength: 'HTML长度',
      tip: '提示：每行文本将自动被包裹在<p>标签中',
      usage: '使用说明',
      features: '功能特点',
      feature1: '• 实时文本转HTML段落转换',
      feature2: '• 自动多段落识别',
      feature3: '• 支持预览和代码视图',
      feature4: '• 一键复制HTML代码',
      howToUse: '如何使用',
      usage1: '• 在编辑区输入文本内容',
      usage2: '• 按回车键分隔段落',
      usage3: '• 空行将被自动忽略',
      usage4: '• 点击"复制HTML"获取代码',
      placeholder: '在此输入文本内容...\n\n每个段落将自动被包裹在HTML <p>标签中。\n\n按回车键创建新段落。\n\n空行将被忽略。',
      emptyPreview: '预览将在此处显示...',
      emptyCode: '<!-- 生成的HTML将在此处显示 -->',
      switchLang: '中/EN'
    }
  };

  const t = translations[language];

  const convertToHtml = (text) => {
    if (!text.trim()) return '';
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join('\n');
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
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
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'editor'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Edit size={16} />
            {t.editor}
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Eye size={16} />
            {t.preview}
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'code'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Code size={16} />
            {t.htmlCode}
          </button>
          
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
          {(viewMode === 'editor' || window.innerWidth >= 1024) && (
            <div className="border-r border-gray-200">
              <div className="p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                {t.textInput}
              </div>
              <textarea
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                placeholder={t.placeholder}
                className="w-full h-96 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset text-gray-800 leading-relaxed"
                style={{ fontFamily: 'Monaco, Menlo, Consolas, monospace' }}
              />
            </div>
          )}
          {/* 预览/代码区域 */}
          <div className="bg-gray-50">
            {viewMode === 'preview' && (
              <>
                <div className="p-3 bg-gray-100 border-b text-sm font-medium text-gray-700 flex items-center justify-between">
                  <span>{t.htmlPreview}</span>
                  <span className="text-xs text-gray-500">{t.realTimePreview}</span>
                </div>
                <div className="p-4 h-96 overflow-auto bg-white">
                  {htmlOutput ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: htmlOutput }}
                      className="prose prose-gray max-w-none"
                      style={{ lineHeight: '1.6' }}
                    />
                  ) : (
                    <p className="text-gray-400 italic">{t.emptyPreview}</p>
                  )}
                </div>
              </>
            )}

            {viewMode === 'code' && (
              <>
                <div className="p-3 bg-gray-100 border-b text-sm font-medium text-gray-700 flex items-center justify-between">
                  <span>{t.generatedHtml}</span>
                  <span className="text-xs text-gray-500">
                    {htmlOutput ? `${paragraphCount} ${paragraphCount === 1 ? t.paragraph : t.paragraphs}` : `0 ${t.paragraphs}`}
                  </span>
                </div>
                <div className="h-96 overflow-auto bg-gray-900">
                  <pre className="p-4 text-sm text-green-400 font-mono leading-relaxed">
                    <code>
                      {htmlOutput || t.emptyCode}
                    </code>
                  </pre>
                </div>
              </>
            )}

            {viewMode === 'editor' && window.innerWidth >= 1024 && (
              <>
                <div className="p-3 bg-gray-100 border-b text-sm font-medium text-gray-700 flex items-center justify-between">
                  <span>{t.realTimeHtml}</span>
                  <span className="text-xs text-gray-500">
                    {htmlOutput ? `${paragraphCount} ${paragraphCount === 1 ? t.paragraph : t.paragraphs}` : `0 ${t.paragraphs}`}
                  </span>
                </div>
                <div className="h-96 overflow-auto bg-gray-900">
                  <pre className="p-4 text-sm text-green-400 font-mono leading-relaxed">
                    <code>
                      {htmlOutput || t.emptyCode}
                    </code>
                  </pre>
                </div>
              </>
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