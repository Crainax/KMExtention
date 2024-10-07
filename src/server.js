'use strict';

// 导入必要的模块
const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  SymbolKind,
  TextDocumentSyncKind
} = require('vscode-languageserver/node');
const { TextDocument } = require('vscode-languageserver-textdocument');
const { KMScriptSemanticAnalyzer } = require('./semanticAnalyzer');
const { Hover, MarkupKind } = require('vscode-languageserver');

// 创建语言服务器连接
const connection = createConnection(ProposedFeatures.all);

// 创建文档管理器
const documents = new TextDocuments(TextDocument);

// 初始化语言服务器
connection.onInitialize(() => {
  return {
    capabilities: {
      // 使用增量同步模式
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // 启用文档符号提供功能
      documentSymbolProvider: true,
      // 启用定义提供功能
      definitionProvider: true,
      // 启用悬停提供功能
      hoverProvider: true
    }
  };
});

// 处理文档符号请求
connection.onDocumentSymbol((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const text = document.getText();
  const symbols = [];
  // 正则表达式用于匹配子程序（Sub）声明
  const regex = /^[\s\t]*Sub\s+(\w+)(?:\s*\(.*\))?(?:\s*\/\/.*)?$/gm;
  let match;

  // 遍历所有匹配项
  while ((match = regex.exec(text)) !== null) {
    symbols.push({
      name: match[1], // 子程序名称
      kind: SymbolKind.Function, // 符号类型为函数
      location: {
        uri: document.uri,
        range: {
          start: document.positionAt(match.index),
          end: document.positionAt(match.index + match[0].length)
        }
      }
    });
  }

  return symbols;
});

// 添加文档内容变化的处理
documents.onDidChangeContent(change => {
  const document = change.document;
  analyzer.analyze(document);
});

// 监听文档变化
documents.listen(connection);

// 启动语言服务器
connection.listen();

const analyzer = new KMScriptSemanticAnalyzer();

connection.onDefinition((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return null;
    }

    analyzer.analyze(document);

    const position = params.position;
    const line = document.getText().split('\n')[position.line];
    const wordRange = getWordRangeAtPosition(line, position.character);

    if (!wordRange) {
        return null;
    }

    const word = line.slice(wordRange.start, wordRange.end);
    const callMatch = line.slice(0, wordRange.start).match(/\bCall\s+$/i);

    if (callMatch) {
        const definition = analyzer.getFunctionDefinition(word);
        if (definition) {
            return definition.location;
        }
    }

    return null;
});

// 添加悬停提供器
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return null;
    }

    analyzer.analyze(document);

    const position = params.position;
    const line = document.getText().split('\n')[position.line];
    const wordRange = getWordRangeAtPosition(line, position.character);

    if (!wordRange) {
        return null;
    }

    const word = line.slice(wordRange.start, wordRange.end);
    const callMatch = line.slice(0, wordRange.start).match(/\bCall\s+$/i);

    if (callMatch) {
        const definition = analyzer.getFunctionDefinition(word);
        if (definition) {
            const hoverText = `函数 "${word}" 定义于 第 ${definition.location.range.start.line + 1} 行`;
            return {
                contents: {
                    kind: MarkupKind.Markdown,
                    value: hoverText
                }
            };
        }
    }

    return null;
});

function getWordRangeAtPosition(line, character) {
    const wordPattern = /[a-zA-Z_]\w*/g;
    let match;
    while ((match = wordPattern.exec(line)) !== null) {
        if (match.index <= character && character <= match.index + match[0].length) {
            return { start: match.index, end: match.index + match[0].length };
        }
    }
    return null;
}