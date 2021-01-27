// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const fs = require('fs')
const path = require('path')

function openPath(openPath, column) {
	openPath = vscode.Uri.file(openPath)
	vscode.workspace.openTextDocument(openPath)
	.then(doc => {
		vscode.window.showTextDocument(doc, column)
	})
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "student-project-opener" is now active!')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('student-project-opener.open', function (event) {
		// The code you place here will be executed every time your command is executed
		folderPath = event.fsPath
		console.log('PROUT')
		folderContent = fs.readdirSync(folderPath)
		console.log(folderContent)
		reportPath = path.join(folderPath, 'report.json')
		if(!fs.existsSync(reportPath)) return
		workspacePath = path.join(folderPath, 'workspace')
		if(!fs.existsSync(workspacePath)) return
		console.log(workspacePath)
		workspaceContent = fs.readdirSync(workspacePath)
		workspaceContent = workspaceContent.filter(name => name.endsWith('.py'))
		console.log(workspaceContent)
		let pyToOpen
		if(workspaceContent.length === 1) {
			pyToOpen = Promise.resolve(workspaceContent[0])
		}
		else {
			pyToOpen = vscode.window.showQuickPick(workspaceContent, {canPickMany: false})
		}
		pyToOpen.then(value => {
			const pyPath = path.join(workspacePath, value)
			vscode.commands.executeCommand('workbench.action.closeAllEditors')
			//workbench.action.splitEditor
			//workbench.action.focusFirstEditorGroup
			//workbench.action.focusSecondEditorGroup
			openPath(pyPath, 1)
			//vscode.commands.executeCommand('workbench.action.splitEditor')
			openPath(reportPath, 2)
		})

		// Display a message box to the user
		vscode.window.showInformationMessage(`Open ${folderPath}`)
	})

	context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
