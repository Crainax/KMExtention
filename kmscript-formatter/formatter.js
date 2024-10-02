const { Console } = require("console");

class KMScriptFormatter {
    constructor(options = {}) {
        this.indentSize = options.indentSize || 4;
        this.indentChar = options.indentChar || ' ';
    }

    format(code) {
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (this.isEndBlock(line) || this.isElseBlock(line)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            if (line !== '') {
                line = this.formatOperators(line);
                formattedLines.push(this.getIndent(indentLevel) + line);
            } else {
                formattedLines.push('');
            }

            if (this.isStartBlock(line)) {
                indentLevel++;
            } else if (this.isElseBlock(line)) {
                if (i + 1 < lines.length) {
                    indentLevel++;
                }
            }
        }

        return formattedLines.join('\n');
    }

    isStartBlock(line) {
        return /^(Sub|If|While|For)\b/i.test(line) ||
               /^For\s+\w+\s*=\s*\w+\s+to\s+\w+(\s+Step\s+\w+)?$/i.test(line);
    }

    isEndBlock(line) {
        return /^(End Sub|End If|EndIf|Wend|Next)$/i.test(line);
    }

    isElseBlock(line) {
        return /^(Else|ElseIf|Else If)(\s|$)/i.test(line);
    }

    getIndent(level) {
        return this.indentChar.repeat(this.indentSize * level);
    }

    formatOperators(line) {
        // 分离注释和代码
        const commentIndex = line.indexOf('//');
        let code = commentIndex !== -1 ? line.slice(0, commentIndex) : line;
        const comment = commentIndex !== -1 ? line.slice(commentIndex) : '';

        const operators = ['>=', '=>', '!<', '<=', '=<', '!>', '!=', '<>', '><', '==', '>', '<', '=', '+', '-', '*', '/', '%'];

        // 使用正则表达式一次性替换所有操作符
        const operatorPattern = operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(`\\s*(${operatorPattern})\\s*`, 'g');

        code = code.replace(regex, ' $1 ');

        // 全字匹配 'and' 和 'or'
        code = code.replace(/\b(and|or)\b/gi, ' $1 ');

        // 移除多余的空格
        code = code.replace(/\s+/g, ' ').trim();

        // 重新组合代码和注释
        return code + (comment ? ' ' + comment : '');
    }
}

module.exports = KMScriptFormatter;