import * as vscode from "vscode";
import { currentMode, goToInsert, Mode } from "./mode";

export function type({ text }: { text: string }) {
  switch (currentMode) {
    case Mode.INSERT:
      vscode.commands.executeCommand("default:type", { text });
      return;

    case Mode.NORMAL:
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const position = editor.selection.active;

      switch (text) {
        case "a":
          vscode.commands.executeCommand("cursorMove", { to: "right" });
          goToInsert();
          return;
        case "A":
          vscode.commands.executeCommand("cursorEnd");
          goToInsert();
          return;
        case "i":
          goToInsert();
          return;
        case "I":
          const newPositionI = position.with(
            position.line,
            firstCharIndex(editor.document, position.line)
          );
          editor.selection = new vscode.Selection(newPositionI, newPositionI);
          goToInsert();
          return;
        case "o":
          vscode.commands.executeCommand("editor.action.insertLineAfter");
          goToInsert();
          return;
        case "O":
          vscode.commands.executeCommand("editor.action.insertLineBefore");
          goToInsert();
          return;
        case "s":
          vscode.commands.executeCommand("deleteRight");
          goToInsert();
          return;
        case "S":
          const newPositionS = position.with(
            position.line,
            firstCharIndex(editor.document, position.line)
          );
          editor.selection = new vscode.Selection(newPositionS, newPositionS);
          vscode.commands.executeCommand("deleteAllRight");
          goToInsert();
          return;
        case "h":
          vscode.commands.executeCommand("cursorMove", { to: "left" });
          return;
        case "j":
          vscode.commands.executeCommand("cursorMove", { to: "down" });
          return;
        case "k":
          vscode.commands.executeCommand("cursorMove", { to: "up" });
          return;
        case "l":
          vscode.commands.executeCommand("cursorMove", { to: "right" });
          return;
        case "H":
          vscode.commands.executeCommand("cursorMove", { to: "viewPortTop" });
          return;
        case "M":
          vscode.commands.executeCommand("cursorMove", {
            to: "viewPortCenter"
          });
          return;
        case "L":
          vscode.commands.executeCommand("cursorMove", {
            to: "viewPortBottom"
          });
          return;
        case "w":
          vscode.commands.executeCommand("cursorWordStartRight");
          return;
        case "b":
          vscode.commands.executeCommand("cursorWordStartLeft");
          return;
        case "x":
          vscode.commands.executeCommand("deleteRight");
          return;
      }
  }
}

function firstCharIndex(document: vscode.TextDocument, line: number): number {
  const { text } = document.lineAt(line);

  for (const [i, char] of [...text].entries()) {
    if (char !== " " && char !== "\t") {
      return i;
    }
  }

  return 0;
}
