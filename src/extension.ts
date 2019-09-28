import * as vscode from "vscode";
import { ensureCursorPosition } from "./commands/normal";
import { goToNormalMode } from "./mode";
import { commands } from "./subscriptions";

export function activate(context: vscode.ExtensionContext) {
  for (const [command, fn] of Object.entries(commands)) {
    context.subscriptions.push(vscode.commands.registerCommand(command, fn));
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(goToNormalMode)
  );

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(listener => {
      if (listener.kind === vscode.TextEditorSelectionChangeKind.Mouse) {
        ensureCursorPosition();
      }
    })
  );

  goToNormalMode();
}
