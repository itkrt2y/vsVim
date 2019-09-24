import * as vscode from "vscode";
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

let currentInput = "";
let currentInputNum = 1;
function clearCurrentInput() {
  currentInput = "";
  currentInputNum = 1;
}

export function hasInput(): boolean {
  return currentInput.length > 0;
}

function a() {
  vscode.commands.executeCommand("cursorMove", { to: "right" });
  goToInsertMode();
  clearCurrentInput();
}

function A() {
  vscode.commands.executeCommand("cursorEnd");
  goToInsertMode();
  clearCurrentInput();
}

function i() {
  goToInsertMode();
  clearCurrentInput();
}

function I() {
  goToFirstChar();
  goToInsertMode();
  clearCurrentInput();
}

function o() {
  vscode.commands.executeCommand("editor.action.insertLineAfter");
  goToInsertMode();
  clearCurrentInput();
}

function O() {
  vscode.commands.executeCommand("editor.action.insertLineBefore");
  goToInsertMode();
  clearCurrentInput();
}

function s() {
  const editor = vscode.window.activeTextEditor!;
  const position = editor.selection.active;
  const line = position.line;
  const deleteCharCount = Math.min(
    currentInputNum,
    editor.document.lineAt(line).text.length - position.character
  );
  const range = new vscode.Range(
    position,
    new vscode.Position(line, position.character + deleteCharCount)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  clearCurrentInput();
}

function S() {
  const editor = vscode.window.activeTextEditor!;
  const document = editor.document;
  const startLine = editor.selection.active.line;
  const endLine = startLine + currentInputNum - 1;
  const range = new vscode.Range(
    new vscode.Position(startLine, firstCharIndex(document, startLine)),
    new vscode.Position(endLine, document.lineAt(endLine).text.length)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  clearCurrentInput();
}

function h() {
  vscode.commands.executeCommand("cursorMove", { to: "left" });
  clearCurrentInput();
}

function j() {
  vscode.commands.executeCommand("cursorMove", { to: "down" });
  clearCurrentInput();
}

function k() {
  vscode.commands.executeCommand("cursorMove", { to: "up" });
  clearCurrentInput();
}

function l() {
  vscode.commands.executeCommand("cursorMove", { to: "right" });
  clearCurrentInput();
}

function H() {
  vscode.commands.executeCommand("cursorMove", { to: "viewPortTop" });
  clearCurrentInput();
}

function M() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortCenter"
  });
  clearCurrentInput();
}

function L() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortBottom"
  });
  clearCurrentInput();
}

function w() {
  vscode.commands.executeCommand("cursorWordStartRight");
  clearCurrentInput();
}

function b() {
  vscode.commands.executeCommand("cursorWordStartLeft");
  clearCurrentInput();
}

function x() {
  vscode.commands.executeCommand("deleteRight");
  clearCurrentInput();
}

function d() {
  if (/^\d*d$/.test(currentInput)) {
    const editor = vscode.window.activeTextEditor!;
    const startLine = editor.selection.active.line;
    const endLine = startLine + currentInputNum - 1;
    const range = new vscode.Range(
      new vscode.Position(startLine, 0),
      new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
    );

    editor.edit(edit => edit.replace(range, ""));
    clearCurrentInput();
  } else {
    currentInput += "d";
  }
}

function zero() {
  // append "0" to currentInput if currentInput already have number
  if (parseInt(currentInput, 10)) {
    currentInput += "0";
    updateCurrentInputNum();
  }
}

function one() {
  appendNumberToCurrentInput("1");
}

function two() {
  appendNumberToCurrentInput("2");
}

function three() {
  appendNumberToCurrentInput("3");
}

function four() {
  appendNumberToCurrentInput("4");
}

function five() {
  appendNumberToCurrentInput("5");
}

function six() {
  appendNumberToCurrentInput("6");
}

function seven() {
  appendNumberToCurrentInput("7");
}

function eight() {
  appendNumberToCurrentInput("8");
}

function nine() {
  appendNumberToCurrentInput("9");
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

function appendNumberToCurrentInput(
  text: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
): void {
  const num = parseInt(currentInput, 10);
  if (currentInput === "" || num) {
    currentInput += text;
  }
  updateCurrentInputNum();
}

function updateCurrentInputNum(): void {
  currentInputNum = parseInt(currentInput, 10);
}
