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
      documentSymbolProvider: true
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

// 监听文档变化
documents.listen(connection);

// 启动语言服务器
connection.listen();