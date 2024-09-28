# KMScript 语言支持

这个 Visual Studio Code 扩展为 KMScript 语言提供基本的语法支持。

## 功能描述

该扩展为 KMScript 文件（.km 扩展名）提供以下功能：

- 语法高亮
- 基本的语言配置（如注释、括号匹配等）

## 安装说明

1. 打开 Visual Studio Code
2. 进入扩展视图（Ctrl+Shift+X）
3. 搜索 "KMScript"
4. 点击 "安装" 按钮

或者，您可以直接从 VSIX 文件安装：

1. 下载 .vsix 文件
2. 在 VS Code 中，选择 "扩展" 视图
3. 点击视图右上角的 "..." 按钮，选择 "从 VSIX 安装..."
4. 选择下载的 .vsix 文件

## 使用方法

安装扩展后，VS Code 将自动识别 .km 文件为 KMScript 文件。打开任何 .km 文件，您就能看到语法高亮效果。

## 支持的 KMScript 语法特性

- 关键字高亮（如 if、then、else、while、for 等）
- 函数名高亮（如 GetScreenResolution、FindPic、MoveTo 等）
- 字符串识别
- 注释识别（使用 // 作为行注释）
- 数字识别
- 操作符识别
- 常量识别（如 PageDown、Enter、Esc 等）

## 已知问题

- 目前功能还比较少，仅提供基本的语法高亮和语言配置。

## 未来计划

1. 完善代码片段（snippet）功能
2. 实现代码格式化功能
3. 为函数添加符号
4. 为所有函数及关键词加入自动补全功能
5. 为所有函数补充参数数量信息

如果您有任何建议或遇到问题，请在我们的 GitHub 仓库中提出 issue。

感谢您使用 KMScript 语言支持扩展！
