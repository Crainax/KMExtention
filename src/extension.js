const vscode = require('vscode');
const KMScriptFormatter = require('../kmscript-formatter/formatter');

// 创建格式化器实例
const formatter = new KMScriptFormatter();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// 注册格式化提供程序
	const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('kmscript', {
		provideDocumentFormattingEdits(document) {
			const text = document.getText();
			const formattedText = formatter.format(text);
			const range = new vscode.Range(
				document.positionAt(0),
				document.positionAt(text.length)
			);
			return [vscode.TextEdit.replace(range, formattedText)];
		}
	});

	const formatCommand = vscode.commands.registerCommand('kmscript.format', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const text = document.getText();
			const formattedText = formatter.format(text);
			editor.edit(editBuilder => {
				const range = new vscode.Range(
					document.positionAt(0),
					document.positionAt(text.length)
				);
				editBuilder.replace(range, formattedText);
			});
		}
	});

	context.subscriptions.push(formatCommand);
	context.subscriptions.push(formattingProvider);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
