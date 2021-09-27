'use strict';
const path = require('path');
const {app, BrowserWindow/*	, Menu	*/} = require('electron');
// Xconst {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
// Xconst debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
// Xconst config = require('./config.js');
// Xconst menu = require('./menu.js');

unhandled();
// Xdebug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.open4glabs.harmony1wallet');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
//	if (!is.development) {
// 	const CHECKUPDATE_HOURS = 1000 * 60 * 60 * 12;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, CHECKUPDATE);
// 	autoUpdater.checkForUpdates();
//	}

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	let win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 1200,
		height: 839,
		icon: path.join(app.getAppPath(), 'build/icon.png'),
		webPreferences: {
			nodeIntergration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true
		}
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	// Xwindow menu
	win.setMenu(null);
	// Xawait win.loadFile(path.join(__dirname, 'index.html'));
	// Load html into window
	win.loadURL('https://1wallet.crazy.one/');
	// Garbage collection handle
	win.on('close', () => {
		win = null;
	});

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	// Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();
})();
