import * as vscode from "vscode";
import * as currentInput from "../current-input";
import * as lastCommand from "../last-command";
import { currentMode, goToInsertMode, goToNormalMode, Mode } from "../mode";
import * as motion from "../motions";

export const mapping: { [key: string]: () => void } = {
  a,
  A,
  b: motion.b,
  d,
  g,
  G: motion.G,
  h: motion.h,
  H: motion.H,
  i,
  I,
  j: motion.j,
  k: motion.k,
  l: motion.l,
  L: motion.L,
  M: motion.M,
  o,
  O,
  s,
  S,
  w: motion.w,
  x,
  "^": motion.caret,
  $: motion.dollar,
  _: motion.underscore,
  ".": period,
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

export function ensureCursorPosition(): void {
  if (currentMode !== Mode.NORMAL) {
    return;
  }

  const editor = vscode.window.activeTextEditor!;
  const { selection, document } = editor;
  const position = selection.active;
  const { line } = position;
  const { length } = document.lineAt(line).text;
  if (length === 0) {
    return;
  }

  const maxCharacter = length - 1;
  if (position.character > maxCharacter) {
    const pos = new vscode.Position(line, maxCharacter);
    editor.selection = new vscode.Selection(pos, pos);
  }
}

function a() {
  const editor = vscode.window.activeTextEditor!;
  const isBlankLine =
    editor.document.lineAt(editor.selection.active.line).text.length === 0;
  if (!isBlankLine) {
    vscode.commands.executeCommand("cursorMove", { to: "right" });
  }
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "a");
  currentInput.clear();
}

function A() {
  vscode.commands.executeCommand("cursorEnd");
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "A");
  currentInput.clear();
}

function i() {
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "i");
  currentInput.clear();
}

function I() {
  goToFirstChar();
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "I");
  currentInput.clear();
}

function o() {
  vscode.commands.executeCommand("editor.action.insertLineAfter");
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "o");
  currentInput.clear();
}

function O() {
  vscode.commands.executeCommand("editor.action.insertLineBefore");
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "O");
  currentInput.clear();
}

function s() {
  const editor = vscode.window.activeTextEditor!;
  let { selection } = editor;

  if (selection.anchor.isEqual(selection.active)) {
    const { line, character } = selection.active;
    const deleteCharCount = Math.min(
      currentInput.number() || 1,
      editor.document.lineAt(line).text.length - character
    );

    selection = new vscode.Selection(
      line,
      character,
      line,
      character + deleteCharCount
    );
  }

  editor.selection = selection;
  vscode.commands
    .executeCommand("editor.action.clipboardCutAction")
    .then(goToInsertMode);
  lastCommand.setOperator(currentInput.text + "s");
  currentInput.clear();
}

function S() {
  const editor = vscode.window.activeTextEditor!;
  const document = editor.document;
  const num = (currentInput.number() || 1) - 1;
  const startLine = editor.selection.active.line;
  const endLine = Math.min(document.lineCount - 1, startLine + num);
  const range = new vscode.Range(
    new vscode.Position(
      startLine,
      editor.document.lineAt(startLine).firstNonWhitespaceCharacterIndex
    ),
    new vscode.Position(endLine, document.lineAt(endLine).text.length)
  );

  editor.edit(edit => edit.replace(range, ""));
  goToInsertMode();
  lastCommand.setOperator(currentInput.text + "S");
  currentInput.clear();
}
function x() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("deleteRight");
  }
  lastCommand.setOperator(currentInput.text + "x");
  currentInput.clear();
}

function d() {
  if (currentInput.testWith(/^\d*d$/)) {
    const editor = vscode.window.activeTextEditor!;
    const repeatCount = currentInput.number() || 1;

    let fromLine = editor.selection.active.line;
    let fromChar = 0;
    let toLine = fromLine + repeatCount;
    let toChar = 0;

    const maxLine = editor.document.lineCount - 1;
    if (toLine >= maxLine) {
      toLine = maxLine;
      toChar = editor.document.lineAt(toLine).text.length;
      if (fromLine > 0) {
        fromLine = fromLine - 1;
        fromChar = editor.document.lineAt(fromLine).text.length;
      }
    }

    if (fromLine !== toLine || fromChar !== toChar) {
      const range = new vscode.Range(fromLine, fromChar, toLine, toChar);
      editor.edit(edit => edit.delete(range));
    }
    lastCommand.setOperator(currentInput.text + "d");
    currentInput.clear();
  } else {
    currentInput.append("d");
  }
}

function g() {
  if (currentInput.testWith(/^\d*$/)) {
    currentInput.append("g");
    return;
  }

  if (currentInput.text.endsWith("g")) {
    const editor = vscode.window.activeTextEditor!;
    const line = Math.min(
      (currentInput.number() || 1) - 1,
      editor.document.lineCount - 1
    );
    const position = new vscode.Position(
      line,
      editor.document.lineAt(line).firstNonWhitespaceCharacterIndex
    );
    editor.selection = new vscode.Selection(position, position);
    currentInput.clear();
  }
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

function period() {
  [...lastCommand.get()].forEach(char => {
    vscode.commands.executeCommand("type", { text: char });
  });

  if (currentMode !== Mode.NORMAL) {
    goToNormalMode();
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
    editor.document.lineAt(position.line).firstNonWhitespaceCharacterIndex
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}
