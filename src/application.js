const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const url = require('url');

module.exports = class Application {
    createWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1280, 
            height: 720,
            frame: false,
            toolbar: false,
            // alwaysOnTop: true,
            resizable: false,
            minimizable: false,
        });
        // this.startUrl = process.env.ELECTRON_START_URL || url.format({
        //     pathname: path.join(__dirname, '/../build/index.html'), // 警告：このファイルを移動する場合ここの相対パスの指定に注意してください
        //     protocol: 'file:',
        //     slashes: true,
        // });

        this.mainWindow.loadURL("http://localhost:3000");
        this.mainWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        this.mainWindow.on('closed', function () {
            this.mainWindow = null;
        });

        const template = [{
            label: 'Application',
            submenu: [
                { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
                { type: 'separator' },
                { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
            ]}, {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
            ]},
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }

    ready() {
        app.on('ready', this.createWindow);
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        app.on('activate', () => {
            if (this.mainWindow === null) {
                this.createWindow();
            }
        });
    }

    run() {
        this.ready();
    }
};