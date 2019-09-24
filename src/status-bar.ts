import * as vscode from "vscode";

const statusBar = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);

export function showNormal() {
  statusBar.text = "-- NORMAL --";
  statusBar.show();
}

export function showInsert() {
  statusBar.text = "-- INSERT --";
  statusBar.show();
}
