const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const path = require("path");
const url = require("url");
const fs = require("fs");

let mainWindow;

var mkdirOutputDirectory = function() {
  dir = path.join(app.getPath("desktop"), "BNCF-Bookdeposit");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

var reload = function() {
  ipcMain.on("reload", (event, arg) => {
    mainWindow.webContents.reload();
  });
};

function createWindow() {
  mkdirOutputDirectory();
  mainWindow = new BrowserWindow({ width: 600, height: 800 });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", function() {
  createWindow();
  reload();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
