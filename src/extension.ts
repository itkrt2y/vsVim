import * as vscode from "vscode";
import { type } from "./commands";
import { ensureCursorPosition } from "./commands/normal";
import * as currentInput from "./current-input";
import { setClearTextOnNextInsert } from "./last-command";
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
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorLeft", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorRight", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorUp", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorDown", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.PageUp", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.PageDown", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorHome", () => {
      setClearTextOnNextInsert(true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vim.cursorEnd", () => {
      setClearTextOnNextInsert(true);
    })
  );

  goToNormalMode();
}
