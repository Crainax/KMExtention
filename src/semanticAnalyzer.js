const { Location, Position } = require('vscode-languageserver-types');

class KMScriptSemanticAnalyzer {
    constructor() {
        this.functionDefinitions = [];
    }

    analyze(document) {
        this.functionDefinitions = [];
        const text = document.getText();
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const match = line.match(/^Sub\s+(\w+)/i);
            if (match) {
                const functionName = match[1];
                const location = Location.create(
                    document.uri,
                    {
                        start: Position.create(i, line.indexOf(functionName)),
                        end: Position.create(i, line.indexOf(functionName) + functionName.length)
                    }
                );
                this.functionDefinitions.push({ name: functionName, location });
            }
        }
    }

    getFunctionDefinition(name) {
        return this.functionDefinitions.find(def => def.name.toLowerCase() === name.toLowerCase());
    }
}

module.exports = {
    KMScriptSemanticAnalyzer
};