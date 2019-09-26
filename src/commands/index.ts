import * as vscode from "vscode";
import * as lastCommand from "../last-command";
import { currentMode, Mode } from "../mode";
import * as normal from "./normal";

export function type({ text }: { text: string }): void {
  if (currentMode === Mode.INSERT) {
    vscode.commands.executeCommand("default:type", { text });
    if (lastCommand.clearInsertTextOnNextInsert) {
      lastCommand.clearInsertText();
    }
    lastCommand.appendToInsertText(text);
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
