import * as vscode from "vscode";
import { ensureCursorPosition } from "./commands/normal";
import * as statusBar from "./status-bar";

export enum Mode {
  NORMAL,
  INSERT
}

export let currentMode: Mode = Mode.NORMAL;

export function goToNormalMode() {
  currentMode = Mode.NORMAL;
  setCursorStyle(Mode.NORMAL);
  statusBar.showNormal();
  vscode.commands.executeCommand("setContext", "vsVim.inNormalMode", true);
  selectPreviousChar();
  ensureCursorPosition();
}

export function goToInsertMode() {
  currentMode = Mode.INSERT;
  setCursorStyle(Mode.INSERT);
  statusBar.showInsert();
  vscode.commands.executeCommand("setContext", "vsVim.inNormalMode", false);
}

function setCursorStyle(mode: Mode): vscode.TextEditorCursorStyle | void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  editor.options = { cursorStyle: getCursorStyle(mode) };
}

function getCursorStyle(mode: Mode): vscode.TextEditorCursorStyle {
  const style = vscode.TextEditorCursorStyle;
  switch (mode) {
    case Mode.NORMAL:
      return style.Block;
    case Mode.INSERT:
      return style.Line;
  }
}

function selectPreviousChar() {
  const editor = vscode.window.activeTextEditor!;
  const position = editor.selection.active;
  if (position.character !== 0) {
    const newPosition = editor.selection.active.translate(0, -1);
    editor.selection = new vscode.Selection(newPosition, newPosition);
  }
}
