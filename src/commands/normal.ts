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
    currentInput.number(),
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
  const startLine = editor.selection.active.line;
  const endLine = Math.min(
    document.lineCount - 1,
    startLine + currentInput.number() - 1
  );
  const range = new vscode.Range(
    new vscode.Position(startLine, firstCharIndex(document, startLine)),
    new vscode.Position(endLine, document.lineAt(endLine).text.length)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  currentInput.clear();
}

function h() {
  vscode.commands.executeCommand("cursorMove", { to: "left" });
  currentInput.clear();
}

function j() {
  vscode.commands.executeCommand("cursorMove", { to: "down" });
  currentInput.clear();
}

function k() {
  vscode.commands.executeCommand("cursorMove", { to: "up" });
  currentInput.clear();
}

function l() {
  vscode.commands.executeCommand("cursorMove", { to: "right" });
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
  vscode.commands.executeCommand("cursorWordStartRight");
  currentInput.clear();
}

function b() {
  vscode.commands.executeCommand("cursorWordStartLeft");
  currentInput.clear();
}

function x() {
  vscode.commands.executeCommand("deleteRight");
  currentInput.clear();
}

function d() {
  if (/^\d*d$/.test(currentInput.text)) {
    const editor = vscode.window.activeTextEditor!;
    const startLine = editor.selection.active.line;
    const endLine = startLine + currentInput.number() - 1;
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

function zero() {
  // append "0" to currentInput if currentInput already have number
  if (parseInt(currentInput.text, 10)) {
    currentInput.append("0");
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
  const num = parseInt(currentInput.text, 10);
  if (currentInput.text === "" || num) {
    currentInput.append(text);
  }
}
