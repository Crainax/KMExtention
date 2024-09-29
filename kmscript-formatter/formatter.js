class KMScriptFormatter {
    constructor(options = {}) {
        this.indentSize = options.indentSize || 4;
        this.indentChar = options.indentChar || ' ';
    }

    format(code) {
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;

        for (let line of lines) {
            line = line.trim();

            if (this.isEndBlock(line)) {
                indentLevel--;
            }

            if (line !== '') {
                formattedLines.push(this.getIndent(indentLevel) + line);
            } else {
                formattedLines.push('');
            }

            if (this.isStartBlock(line)) {
                indentLevel++;
            }
        }

        return formattedLines.join('\n');
    }

    isStartBlock(line) {
        return /^Sub\s+/.test(line);
    }

    isEndBlock(line) {
        return /^End Sub$/.test(line);
    }

    getIndent(level) {
        return this.indentChar.repeat(this.indentSize * level);
    }
}

module.exports = KMScriptFormatter;