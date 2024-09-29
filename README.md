# KMScript 语言支持

这个 Visual Studio Code 扩展为 KMScript 语言提供基本的语法支持。

## 功能描述

该扩展为 KMScript 文件（.km 扩展名）提供以下功能：

- 语法高亮
- 基本的语言配置（如注释、括号匹配等）
- 代码格式化

## 使用方法

安装扩展后，VS Code 将自动识别 .km 文件为 KMScript 文件。打开任何 .km 文件，您就能看到语法高亮效果。

要格式化代码，您可以使用以下方法之一：
- 使用快捷键（Windows: Shift+Alt+F, Mac: Shift+Option+F）
- 右键单击并选择"格式化文档"
- 在命令面板中搜索并执行"格式化文档"命令

## 支持的 KMScript 语法特性

- 关键字高亮（如 if、then、else、while、for、and、or 等）
- 函数名高亮（如 GetScreenResolution、FindPic、MoveTo 等）
- 字符串识别
- 注释识别（使用 // 作为行注释）
- 数字识别
- 操作符识别（包括新增的比较操作符）
- 常量识别（如 PageDown、Enter、Esc 等）

## 格式化功能

- 支持基本的代码缩进
- 在比较操作符和逻辑操作符两侧添加空格
- 正确处理 If-ElseIf-Else 结构和 For 循环的缩进

## 已知问题

- 当前的格式化功能还可能无法处理某些复杂的代码结构。

## 未来计划

1. 完善代码片段（snippet）功能
2. 进一步改进代码格式化功能
    - 处理更多复杂的 KMScript 语法结构
    - 添加更多的格式化选项，如处理空行等
3. 为函数添加符号
4. 为所有函数及关键词加入自动补全功能
5. 为所有函数补充参数数量信息

如果您有任何建议或遇到问题，请在我们的 GitHub 仓库中提出 issue。

感谢您使用 KMScript 语言支持扩展！
