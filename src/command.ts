import * as vscode from "vscode";
import { currentMode, goToInsert, Mode } from "./mode";

export function type({ text }: { text: string }) {
  switch (currentMode) {
    case Mode.INSERT:
      vscode.commands.executeCommand("default:type", { text });
      return;
    case Mode.NORMAL:
      switch (text) {
        case "i":
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
      }
  }
}
