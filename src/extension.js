const vscode = require('vscode');
const { workspace, ExtensionContext } = vscode;
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');
const path = require('path');

// 添加日志
console.log('扩展激活');

// 使用 path.join 确保路径正确
const formatterPath = path.join(__dirname, '..', 'kmscript-formatter', 'formatter.js');
console.log('Formatter 路径:', formatterPath);

// 导入格式化器
const KMScriptFormatter = require(formatterPath);

// 创建格式化器实例
const formatter = new KMScriptFormatter();

/**
 * 激活扩展
 * @param {ExtensionContext} context 扩展上下文
 */
async function activate(context) {
    console.log('KMScript 扩展已激活');
    // 注册文档格式化提供程序
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('kmscript', {
        provideDocumentFormattingEdits(document) {
            const text = document.getText();
            const formattedText = formatter.format(text);
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            return [vscode.TextEdit.replace(fullRange, formattedText)];
        }
    });

    // 注册格式化命令
    const formatCommand = vscode.commands.registerCommand('kmscript.format', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const { document } = editor;
            const text = document.getText();
            const formattedText = formatter.format(text);
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editor.edit(editBuilder => editBuilder.replace(fullRange, formattedText));
        }
    });

    // 设置服务器模块路径
    const serverModule = context.asAbsolutePath(path.join('src', 'server.js'));

    // 服务器选项配置
    const serverOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6009'] }
        }
    };

    // 客户端选项配置
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'kmscript' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.kms')
        }
    };

    // 创建语言客户端
    const client = new LanguageClient(
        'kmscriptLanguageServer',
        'KMScript Language Server',
        serverOptions,
        clientOptions
    );

    // 启动客户端
    client.start();

    // 将所有注册的功能添加到订阅列表中
    context.subscriptions.push(formatCommand, formattingProvider, client);
}

/**
 * 停用扩展
 * @returns {Thenable<void> | undefined}
 */
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

module.exports = { activate, deactivate };
