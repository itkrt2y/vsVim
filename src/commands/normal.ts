import * as vscode from "vscode";
import * as currentInput from "../current-input";
import { goToInsertMode } from "../mode";

export const mapping: { [key: string]: () => void } = {
  a,
  A,
  b,
  d,
  h,
  H,
  i,
  I,
  j,
  k,
  l,
  L,
  M,
  o,
  O,
  s,
  S,
  w,
  x,
  "^": caret,
  $: dollar,
  "0": zero,
  "1": one,
  "2": two,
  "3": three,
  "4": four,
  "5": five,
  "6": six,
  "7": seven,
  "8": eight,
  "9": nine
};

function a() {
  vscode.commands.executeCommand("cursorMove", { to: "right" });
  goToInsertMode();
  currentInput.clear();
}

function A() {
  vscode.commands.executeCommand("cursorEnd");
  goToInsertMode();
  currentInput.clear();
}

function i() {
  goToInsertMode();
  currentInput.clear();
}

function I() {
  goToFirstChar();
  goToInsertMode();
  currentInput.clear();
}

function o() {
  vscode.commands.executeCommand("editor.action.insertLineAfter");
  goToInsertMode();
  currentInput.clear();
}

function O() {
  vscode.commands.executeCommand("editor.action.insertLineBefore");
  goToInsertMode();
  currentInput.clear();
}

function s() {
  const editor = vscode.window.activeTextEditor!;
  const position = editor.selection.active;
  const line = position.line;
  const deleteCharCount = Math.min(
    currentInput.number() || 1,
    editor.document.lineAt(line).text.length - position.character
  );
  const range = new vscode.Range(
    position,
    new vscode.Position(line, position.character + deleteCharCount)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  currentInput.clear();
}

function S() {
  const editor = vscode.window.activeTextEditor!;
  const document = editor.document;
  const num = (currentInput.number() || 1) - 1;
  const startLine = editor.selection.active.line;
  const endLine = Math.min(document.lineCount - 1, startLine + num);
  const range = new vscode.Range(
    new vscode.Position(startLine, firstCharIndex(document, startLine)),
    new vscode.Position(endLine, document.lineAt(endLine).text.length)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  currentInput.clear();
}

function h() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "left" });
  }
  currentInput.clear();
}

function j() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "down" });
  }
  currentInput.clear();
}

function k() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "up" });
  }
  currentInput.clear();
}

function l() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "right" });
  }
  currentInput.clear();
}

function H() {
  vscode.commands.executeCommand("cursorMove", { to: "viewPortTop" });
  currentInput.clear();
}

function M() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortCenter"
  });
  currentInput.clear();
}

function L() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortBottom"
  });
  currentInput.clear();
}

function w() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorWordStartRight");
  }
  currentInput.clear();
}

function b() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorWordStartLeft");
  }
  currentInput.clear();
}

function x() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("deleteRight");
  }
  currentInput.clear();
}

function d() {
  if (currentInput.testWith(/^\d*d$/)) {
    const editor = vscode.window.activeTextEditor!;
    const startLine = editor.selection.active.line;
    const num = (currentInput.number() || 1) - 1;
    const endLine = startLine + num;
    const range = new vscode.Range(
      new vscode.Position(startLine, 0),
      new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
    );

    editor.edit(edit => edit.replace(range, ""));
    currentInput.clear();
  } else {
    currentInput.append("d");
  }
}

function caret() {
  goToFirstChar();
  currentInput.clear();
}

function dollar() {
  const editor = vscode.window.activeTextEditor!;
  const num = (currentInput.number() || 1) - 1;
  const line = editor.selection.active.line + num;
  const position = new vscode.Position(
    line,
    editor.document.lineAt(line).text.length
  );
  editor.selection = new vscode.Selection(position, position);
  currentInput.clear();
}

function zero() {
  if (currentInput.isBlank()) {
    const editor = vscode.window.activeTextEditor!;
    const position = new vscode.Position(editor.selection.active.line, 0);
    editor.selection = new vscode.Selection(position, position);
    return;
  }

  if (currentInput.testWith(/^\d+$/)) {
    currentInput.append("0");
  }
}

function one() {
  currentInput.appendNonZeroNumber("1");
}

function two() {
  currentInput.appendNonZeroNumber("2");
}

function three() {
  currentInput.appendNonZeroNumber("3");
}

function four() {
  currentInput.appendNonZeroNumber("4");
}

function five() {
  currentInput.appendNonZeroNumber("5");
}

function six() {
  currentInput.appendNonZeroNumber("6");
}

function seven() {
  currentInput.appendNonZeroNumber("7");
}

function eight() {
  currentInput.appendNonZeroNumber("8");
}

function nine() {
  currentInput.appendNonZeroNumber("9");
}

function goToFirstChar() {
  const editor = vscode.window.activeTextEditor!;
  const position = editor.selection.active;
  const newPosition = position.with(
    position.line,
    firstCharIndex(editor.document, position.line)
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}

function firstCharIndex(document: vscode.TextDocument, line: number): number {
  const { text } = document.lineAt(line);

  for (const [index, char] of [...text].entries()) {
    if (char !== " " && char !== "\t") {
      return index;
    }
  }

  return 0;
}
