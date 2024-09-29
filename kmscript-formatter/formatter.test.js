const KMScriptFormatter = require('./formatter');

describe('KMScriptFormatter', () => {
    let formatter;

    beforeEach(() => {
        formatter = new KMScriptFormatter();
    });

    test('基本缩进', () => {
        const input = `Sub Test
x = 1
y = 2
End Sub`;

        const expected = `Sub Test
    x = 1
    y = 2
End Sub`;

        expect(formatter.format(input)).toBe(expected);
    });

    test('嵌套块', () => {
        const input = `Sub Outer
Sub Inner
x = 1
End Sub
y = 2
End Sub`;

        const expected = `Sub Outer
    Sub Inner
        x = 1
    End Sub
    y = 2
End Sub`;

        expect(formatter.format(input)).toBe(expected);
    });
});