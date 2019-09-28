import * as vscode from "vscode";
import * as currentInput from "../current-input";
import { currentMode, Mode } from "../mode";

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L161-L171
export function h() {
  const editor = vscode.window.activeTextEditor!;
  const count = Math.min(
    currentInput.number() || 1,
    editor.selection.active.character
  );
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "left" });
  }
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L289-L293
export function j() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "down" }).then(() => {
      ensureCursorPosition();
    });
  }
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L285-L287
export function k() {
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "up" }).then(() => {
      ensureCursorPosition();
    });
  }
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L173-L177
export function l() {
  const editor = vscode.window.activeTextEditor!;
  const line = editor.selection.active.line;
  const max =
    editor.document.lineAt(line).text.length -
    editor.selection.active.character -
    1;
  const count = Math.min(currentInput.number() || 1, max);

  for (let idx = 0; idx < count; idx++) {
    vscode.commands.executeCommand("cursorMove", { to: "right" });
  }
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L1300-L1307
export function H() {
  vscode.commands.executeCommand("cursorMove", { to: "viewPortTop" });
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L1309-L1311
export function M() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortCenter"
  });
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L1313-L1320
export function L() {
  vscode.commands.executeCommand("cursorMove", {
    to: "viewPortBottom"
  });
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L370-L371
export async function w() {
  const editor = vscode.window.activeTextEditor!;
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    await vscode.commands.executeCommand("cursorWordStartRight").then(() => {
      // skip line break
      const position = editor.selection.active;
      const { length } = editor.document.lineAt(position.line).text;
      if (position.character === length) {
        vscode.commands.executeCommand("cursorWordStartRight");
      }
    });
  }
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L384-L385
export async function b() {
  const editor = vscode.window.activeTextEditor!;
  const count = currentInput.number() || 1;
  for (let idx = 0; idx < count; idx++) {
    await vscode.commands.executeCommand("cursorWordStartLeft").then(() => {
      const { character, line } = editor.selection.active;
      if (character !== 0) {
        return;
      }
      const firstChar = editor.document.lineAt(line).text[0];
      if (firstChar === " " || firstChar === "\t") {
        vscode.commands.executeCommand("cursorWordStartLeft");
      }
    });
  }
  currentInput.clear();
}

// TODO: Implement this later
// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L204-L242
// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L328-L331
// export function g() {
//   if (currentInput.testWith(/^\d*$/)) {
//     currentInput.append("g");
//     return;
//   }

//   if (currentInput.text.endsWith("g")) {
//     const editor = vscode.window.activeTextEditor!;
//     const line = Math.min(
//       (currentInput.number() || 1) - 1,
//       editor.document.lineCount - 1
//     );
//     const position = new vscode.Position(
//       line,
//       editor.document.lineAt(line).firstNonWhitespaceCharacterIndex
//     );
//     editor.selection = new vscode.Selection(position, position);
//     currentInput.clear();
//   }
// }

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L318-L322
export function G() {
  const editor = vscode.window.activeTextEditor!;
  const { document } = editor;
  const line = Math.min(
    (currentInput.number() || document.lineCount) - 1,
    document.lineCount - 1
  );
  const character = document.lineAt(line).firstNonWhitespaceCharacterIndex;
  editor.selection = new vscode.Selection(line, character, line, character);
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L314-L316
export function underscore() {
  const editor = vscode.window.activeTextEditor!;
  const { line } = editor.selection.active;
  const character = lastCharIndex(editor.document, line);
  editor.selection = new vscode.Selection(line, character, line, character);
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L191-L193
export function caret() {
  goToFirstChar();
  currentInput.clear();
}

// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L195-L202
export function dollar() {
  const editor = vscode.window.activeTextEditor!;
  const num = (currentInput.number() || 1) - 1;
  const line = editor.selection.active.line + num;
  const character = editor.document.lineAt(line).text.length - 1;
  editor.selection = new vscode.Selection(line, character, line, character);
  currentInput.clear();
}

// TODO: Implement this later
// https://github.com/vim/vim/blob/2e47cab715669bd0c89762217cbf77bd70cd82ac/runtime/doc/motion.txt#L179-L181
// export function zero() {
//   if (currentInput.isBlank()) {
//     const editor = vscode.window.activeTextEditor!;
//     const { line } = editor.selection.active;
//     editor.selection = new vscode.Selection(line, 0, line, 0);
//     return;
//   }

//   if (currentInput.testWith(/^\d+$/)) {
//     currentInput.append("0");
//   }
// }

function ensureCursorPosition(): void {
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

function goToFirstChar() {
  const editor = vscode.window.activeTextEditor!;
  const position = editor.selection.active;
  const newPosition = position.with(
    position.line,
    editor.document.lineAt(position.line).firstNonWhitespaceCharacterIndex
  );
  editor.selection = new vscode.Selection(newPosition, newPosition);
}

function lastCharIndex(document: vscode.TextDocument, line: number): number {
  const { text } = document.lineAt(line);
  const chars = [...text];

  let index = chars.length;
  while (true) {
    const char = chars.pop();
    if (!char) {
      break;
    }

    index--;

    if (char !== " " && char !== "\t") {
      return index;
    }
  }

  return 0;
}
