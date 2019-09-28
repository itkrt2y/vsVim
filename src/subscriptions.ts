import * as vscode from "vscode";
import * as normal from "./commands/normal";
import * as currentInput from "./current-input";
import {
  appendToInsertText,
  clearInsertText,
  clearInsertTextOnNextInsert,
  setClearTextOnNextInsert
} from "./last-command";
import { currentMode, goToNormalMode, Mode } from "./mode";

export const commands = {
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

function type({ text }: { text: string }): void {
  if (currentMode === Mode.INSERT) {
    vscode.commands.executeCommand("default:type", { text });
    if (clearInsertTextOnNextInsert) {
      clearInsertText();
      setClearTextOnNextInsert(false);
    }
    appendToInsertText(text);
    return;
  }

  if (currentMode === Mode.NORMAL) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    normal.mapping[text]();
  }
}
