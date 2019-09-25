import * as vscode from "vscode";
import { type } from "./commands";
import { ensureCursorPosition } from "./commands/normal";
import * as currentInput from "./current-input";
import { goToNormalMode } from "./mode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("type", type));
  context.subscriptions.push(
    vscode.commands.registerCommand("vsVim.goToNormalMode", goToNormalMode)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vsVim.clearInput", currentInput.clear)
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
