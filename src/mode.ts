import * as vscode from "vscode";

export enum Mode {
  NORMAL,
  INSERT
}

export let currentMode: Mode = Mode.NORMAL;
setCursorStyle(currentMode);

export function goToNormal() {
  currentMode = Mode.NORMAL;
  setCursorStyle(Mode.NORMAL);
  vscode.commands.executeCommand("setContet", "vsVim.inNormalMode", true);
}

export function goToInsert() {
  currentMode = Mode.INSERT;
  setCursorStyle(Mode.INSERT);
  vscode.commands.executeCommand("setContet", "vsVim.inNormalMode", false);
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
