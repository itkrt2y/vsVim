import * as vscode from "vscode";
import { greet } from "./hello-world";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.helloWebpack", () => {
      vscode.window.showInformationMessage(greet("itkrt2y"));
    })
  );
}
