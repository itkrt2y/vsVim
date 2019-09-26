import * as vscode from "vscode";
import { type } from "./commands";
import { ensureCursorPosition } from "./commands/normal";
import * as currentInput from "./current-input";
import { setClearTextOnNextInsert } from "./last-command";
import { goToNormalMode } from "./mode";

export function activate(context: vscode.ExtensionContext) {
  for (const [command, fn] of Object.entries(registerCommands)) {
    context.subscriptions.push(vscode.commands.registerCommand(command, fn));
  }

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(listener => {
      if (listener.kind === vscode.TextEditorSelectionChangeKind.Mouse) {
        ensureCursorPosition();
      }
    })
  );

  goToNormalMode();
}

const registerCommands = {
  type,
  "vsVim.goToNormalMode": goToNormalMode,
  "vsVim.clearInput": currentInput.clear,
  "vim.cursorLeft": () => {
    setClearTextOnNextInsert(true);
    vscode.commands.executeCommand("cursorLeft");
  },
  "vim.cursorRight": () => {
    setClearTextOnNextInsert(true);
    vscode.commands.executeCommand("cursorRight");
  },
  "vim.cursorUp": () => {
    setClearTextOnNextInsert(true);
    vscode.commands.executeCommand("cursorUp");
  },
  "vim.cursorDown": () => {
    setClearTextOnNextInsert(true);
    vscode.commands.executeCommand("cursorDown");
  },
  "vim.PageUp": () => {
    setClearTextOnNextInsert(true);
  },
  "vim.PageDown": () => {
    setClearTextOnNextInsert(true);
  },
  "vim.cursorHome": () => {
    setClearTextOnNextInsert(true);
  },
  "vim.cursorEnd": () => {
    setClearTextOnNextInsert(true);
  }
};
