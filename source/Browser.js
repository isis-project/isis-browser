//   Copyright 2012 Hewlett-Packard Development Company, L.P.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

enyo.kind({
	name: "Browser",
	kind: enyo.VFlexBox,
	className: "basic-back",
	published: {
		url: "",
		searchPreferences: {},
		defaultSearch: ""
	},
	events: {
		onPageTitleChanged: "",
		onPageLoadStopped: "",
		onFileLoad: "",
		onAddBookmark: "",
		onAddToLauncher: "",
		onShareLink: "",
		onOpenBookmarks: "",
		onPrint: "",
		onUrlRedirected: "",
		// called when user wants to leave the browser
		onClose: ""
	},
	components: [
		{name: "launchApplicationService", kind: enyo.PalmService, service: enyo.palmServices.application, method: "open"},
		{name: "importWallpaperService", kind: enyo.PalmService, service: enyo.palmServices.system, method: "wallpaper/importWallpaper", onSuccess: "importedWallpaper", onFailure: "wallpaperError"},
		{name: "setWallpaperService", kind: enyo.PalmService, service: enyo.palmServices.system, method: "setPreferences", onFailure: "wallpaperError"},
		{name: "actionbar", kind: "ActionBar",
			onBack: "goBack",
			onForward: "goForward",
			onLoad: "goClick",
			onStopLoad: "stopClick",
			onRefresh: "reloadClick",
			onAddBookmark: "doAddBookmark",
			onAddToLauncher: "doAddToLauncher",
			onShareLink: "doShareLink",
			onOpenBookmarks: "doOpenBookmarks",
			onNewCard: "openNewCard"
		},
		{name: "view", kind: "WebView", flex: 1, height: "100%",
			onMousehold: "openContextMenu",
			onPageTitleChanged: "pageTitleChanged",
			onUrlRedirected: "doUrlRedirected",
			onLoadStarted: "loadStarted",
			onLoadProgress: "loadProgress",
			onLoadStopped: "loadStopped",
			onLoadComplete: "loadCompleted",
			onFileLoad: "doFileLoad",
			onError: "browserError",
			onSingleTap: "browserTap",
			onAlertDialog: "showAlertDialog",
			onConfirmDialog: "showConfirmDialog",
			onPromptDialog: "showPromptDialog",
			onSSLConfirmDialog: "showSSLConfirmDialog",
			onUserPasswordDialog: "showUserPasswordDialog",
			onNewPage: "openNewCardWithIdentifier",
			onPrint: "doPrint",
			minFontSize: 2,
		},
		{kind: "FindBar", showing: false, onFind: "find", onGoToPrevious: "goToPrevious", onGoToNext: "goToNext"},
		{name: "context", kind: "BrowserContextMenu", onItemClick: "contextItemClick"},
		{name: "dialog", kind: "VerticalAcceptCancelPopup", cancelCaption: "", components: [
			{name: "dialogTitle", className: "enyo-dialog-prompt-title"},
			{name: "dialogMessage", className: "browser-dialog-body enyo-text-body "}
		]},
		{name: "alertDialog", kind: "AcceptCancelPopup", cancelCaption: "", onResponse: "sendDialogResponse", components: [
			{name: "alertMessage", className: "browser-dialog-body enyo-text-body "}
		]},
		{name: "confirmDialog", kind: "VerticalAcceptCancelPopup", onResponse: "sendDialogResponse", components: [
			{name: "confirmMessage", className: "browser-dialog-body enyo-text-body "}
		]},
		{name: "promptDialog", kind: "AcceptCancelPopup", cancelCaption: "", onResponse: "promptResponse", onClose: "closePrompt", components: [
			{name: "promptMessage", className: "browser-dialog-body enyo-text-body "},
			{name: "promptInput", kind: "Input", spellcheck: false, autocorrect: false, autoCapitalize: "lowercase"}
		]},
		{name: "shareLinkDialog", kind: "ShareLinkDialog"},
		{name: "loginDialog", kind: "AcceptCancelPopup", onResponse: "loginResponse", onClose: "closeLogin", components: [
			{name: "loginMessage", className: "browser-dialog-body enyo-text-body "},
			{name: "userInput", kind: "Input", spellcheck: false, autocorrect: false, autoCapitalize: "lowercase", hint: $L("Username...")},
			{name: "passwordInput", kind: "PasswordInput", hint: $L("Password...")}
		]},
		{name: "sslDialog", kind: "Popup", onClose: "sslConfirmResponse", components: [
			{name: "sslConfirmMessage", className: "browser-dialog-body enyo-text-body "},
			{kind: enyo.HFlexBox, components: [
				{kind: "Button", name: "viewCertButton", flex: 1, caption: $L("View Certificate"), className: "enyo-button-dark", onclick: "viewSSLCertificate"},
				{kind: "Button", flex: 1, caption: $L("Trust Always"), response: "1", className: "enyo-button-dark", onclick: "closeSSLConfirmBox"},
				{kind: "Button", flex: 1, caption: $L("Trust Once"), response: "2", className: "enyo-button-dark", onclick: "closeSSLConfirmBox"},
				{kind: "Button", flex: 1, caption: $L("Don't Trust"), response: "0", className: "enyo-button-dark", onclick: "closeSSLConfirmBox"}
			]}
		]},
        {name: "sslCertDialog", kind: "CertificateDialog", onCertLoad: "enableViewSSLCertificate", onClose: "closeSSLCertificate"}
    ],
	WebKitErrors: {
		ERR_SYS_FILE_DOESNT_EXIST: 14,
		ERR_WK_FLOADER_CANCELLED: 1000,
		ERR_WK_NOINTERNET:1005,
		ERR_CURL_FAILURE: 2000,
		ERR_CURL_COULDNT_RESOLVE_HOST: 2006,
		ERR_CURL_SSL_CACERT: 2060
	},
	create: function() {
		this.inherited(arguments);
		this.$.context.setView(this.$.view);
		this.urlChanged();
		this.searchPreferencesChanged();
		this.defaultSearchChanged();
		if (window.PalmSystem) {
			this.$.view.setIdentifier(enyo.windowParams.webviewId);
		}
	},
	resize: function() {
		this.$.actionbar.resize();
		this.$.view.resize();
	},
	showingChanged: function() {
		this.inherited(arguments);
		if (!this.showing) {
			this.$.actionbar.forceBlur();
		}
	},
	//* @public
	printFrame: function(inJobID, inPrintParams) {
		this.viewCall("printFrame", ["", inJobID, inPrintParams.width, inPrintParams.height, inPrintParams.pixelUnits, false, inPrintParams.renderInReverseOrder]);
	},
	showFind: function() {
		this.$.findBar.show();
	},
	//* @protected
	find: function(inSender, inString) {
		this.log(inString);
		this.$.view.callBrowserAdapter("findInPage", [inString]);
	},
	goToPrevious: function() {
	},
	goToNext: function() {
	},
	setEnableJavascript: function(inEnable) {
		this.viewCall("setEnableJavascript", [inEnable]);
	},
	setBlockPopups: function(inBlock) {
		this.viewCall("setBlockPopups", [inBlock]);
	},
	setAcceptCookies: function(inAccept) {
		this.viewCall("setAcceptCookies", [inAccept]);
	},
	clearHistory: function() {
		this.viewCall("clearHistory");
	},
	clearCookies: function() {
		new PalmServiceBridge().call('palm://com.palm.browserServer/clearCookies', '{}');
	},
	clearCache: function() {
		new PalmServiceBridge().call('palm://com.palm.browserServer/clearCache', '{}');
	},
	isLoading: function() {
		return this.$.actionbar.getProgress() != 0;
	},
	viewCall: function(inMethod, inArgs) {
		if (window.PalmSystem) {
			var v = this.$.view;
			if (v[inMethod]) {
				v[inMethod].apply(v, inArgs);
			} else {
				v.callBrowserAdapter(inMethod, inArgs);
			}
		}
	},
	urlChanged: function() {
		this.log(this.url);
		this.$.view.setUrl(this.url);
		this.$.actionbar.setLoading(true);
		this.$.actionbar.setUrl(this.url);
	},
	searchPreferencesChanged: function() {
		this.$.actionbar.setSearchPreferences(this.searchPreferences);
	},
	defaultSearchChanged: function() {
		this.$.actionbar.setDefaultSearch(this.defaultSearch);
	},
	pageTitleChanged: function(inSender, inTitle, inUrl, inBack, inForward) {
		this.log(inUrl, inTitle, inBack, inForward);
		this.url = inUrl;
		this.title = inTitle || $L("Untitled");
		if (!this.$.dialog.isOpen) {
			this.$.actionbar.setUrl(this.url);
			this.$.actionbar.setTitle(this.title);
		}
		this.gotHistoryState(inBack, inForward);
		this.doPageTitleChanged(this.title, this.url);
	},
	gotHistoryState: function(inBack, inForward) {
		this.canGoBack = inBack;
		this.$.actionbar.setCanGoBack(inBack);
		this.$.actionbar.setCanGoForward(inForward);
	},
	goClick: function(inSender, inUrl) {
		//this.$.popup.openAtTap({centerX: 100, centerY: 100});
		this.setUrl(inUrl);
		//this.showHideTitle(true);
	},
	browserTap: function(inSender, inPosition, inEvent, inTapInfo) {
	},
	showPopup: function(inPopup) {
		var w = enyo.fetchControlSize(this).w;
		inPopup.applyStyle("max-width", w - 100);
		inPopup.openPopup();
	},
	showAlertDialog: function(inSender, inMsg) {
		this.$.alertDialog.validateComponents();
		this.$.alertMessage.setContent(inMsg);
		this.showPopup(this.$.alertDialog);
	},
	showConfirmDialog: function(inSender, inMsg) {
		this.$.confirmDialog.validateComponents();
		this.$.confirmMessage.setContent(inMsg);
		this.showPopup(this.$.confirmDialog);
	},
	showPromptDialog: function(inSender, inMsg, inDefaultValue) {
		this.$.promptDialog.validateComponents();
		this.$.promptMessage.setContent(inMsg);
		this.$.promptInput.setValue("");
		this.$.promptInput.setHint(inDefaultValue);
		this.showPopup(this.$.promptDialog);
	},
    showShareLinkDialog: function(inUrl, inTitle) {
        this.$.shareLinkDialog.init(inUrl, inTitle);
        this.showPopup(this.$.shareLinkDialog);
    },
	promptResponse: function(inAccept) {
		this.sendDialogResponse(this, inAccept, this.$.promptInput.getValue() || this.$.promptInput.getHint());
	},
	closePrompt: function() {
		this.$.promptInput.forceBlur();
	},
	showSSLConfirmDialog: function(inSender, inHost, inErrorCode, inCertFile) {
		this.$.sslDialog.validateComponents();
		this.$.viewCertButton.setDisabled(true);
		this.$.sslCertDialog.setCertFile(inCertFile);
		var msg;
		if (inErrorCode == 0) {
			msg = $L("The security certificate #{websiteName} sent is expired. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode >= 2 && inErrorCode < 5) {
			msg = $L("The website #{websiteName} didn't send a security certificate to identify itself. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode >= 5 && inErrorCode < 10) {
			msg = $L("The security certificate #{websiteName} sent could not be read completely. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode >= 10 && inErrorCode < 18) {
			msg = $L("The security certificate #{websiteName} sent has some invalid information. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode >= 18 && inErrorCode < 24) {
			msg = $L("The security certificate #{websiteName} sent has questionable signatures. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode >= 24 && inErrorCode < 30) {
			msg = $L("The security certificate #{websiteName} sent is invalid. Connecting to this site might put your confidential information at risk.");
		} else if (inErrorCode == 30 || inErrorCode == 31 || inErrorCode == 50) {
			msg = $L("The security certificate #{websiteName} sent has inconsistent information in it. Connecting to this site might put your confidential information at risk.");
		}
		if (msg) {
			var m = msg.replace("#{websiteName}", inHost);
			this.$.sslConfirmMessage.setContent(m);
		}
		this.$.sslDialog.response = "0";
		this.$.sslDialog.openAtCenter();
	},
	closeSSLConfirmBox: function(inSender) {
		this.$.sslDialog.response = inSender.response;
		this.$.sslDialog.close();
	},
	sslConfirmResponse: function(inSender) {
		this.viewCall("sendDialogResponse", [inSender.response]);
	},
	enableViewSSLCertificate: function() {
		this.$.viewCertButton.setDisabled(false);
	},
	viewSSLCertificate: function(inSender) {
		this.$.sslCertDialog.validateComponents();
		this.$.sslCertDialog.openAtCenter();
	},
	closeSSLCertificate: function(inSender) {
		this.$.sslCertDialog.close();
	},
	showUserPasswordDialog: function(inSender, inMsg) {
		this.$.loginDialog.validateComponents();
		var msg = $L("The server {$serverName} requires a username and password");
		msg = enyo.macroize(msg, {serverName: inMsg});
		this.$.loginMessage.setContent(msg);
		this.showPopup(this.$.loginDialog);
	},
	loginResponse: function(inSender, inAccept) {
		this.sendDialogResponse(this, inAccept, this.$.userInput.getValue(), this.$.passwordInput.getValue());
	},
	sendDialogResponse: function(inSender, inAccepted) {
		this.log(inAccepted);
		if (inAccepted) {
			this.viewCall("acceptDialog", [].slice.call(arguments, 2));
		} else {
			this.viewCall("cancelDialog");
		}
	},
	closeLogin: function() {
		this.$.userInput.forceBlur();
		this.$.passwordInput.forceBlur();
	},
	openContextMenu: function(inSender, inEvent, inTapInfo) {
		if (inTapInfo.isLink || inTapInfo.isImage) {
			this.$.context.openAtTap(inEvent, inTapInfo);
			return true;
		}
	},
	contextItemClick: function(inSender, inValue, inTapInfo, inPosition) {
		if (this[inValue]) {
			this[inValue](inTapInfo, inPosition);
		}
	},
	newCardClick: function(inTapInfo) {
		enyo.windows.openWindow("index.html", null, {url: inTapInfo.linkUrl});
	},
	openNewCard: function() {
		enyo.windows.openWindow("index.html", null, null);
	},
	openNewCardWithIdentifier: function(inSender, inIdentifier) {
		enyo.windows.openWindow("index.html", null, {webviewId: inIdentifier});
	},
	copyLinkClick: function(inTapInfo) {
		enyo.dom.setClipboard(inTapInfo.linkUrl);
		var params = enyo.json.stringify({dontLaunch:true});
		enyo.windows.addBannerMessage($L("Link Copied to clipboard"), params);
	},
    //handler for the context menu shareLinkClick in BrowserContextMenu.js.
    //TODO: refactor these for a clearer abstraction. So you don't have to hunt
    //to see where it is being called.
	shareLinkClick: function(inTapInfo) {
		this.shareLink(inTapInfo.linkUrl, inTapInfo.linkText || inTapInfo.linkUrl);
	},
	shareLink: function(inUrl, inTitle) {
        this.showShareLinkDialog(inUrl, inTitle);
	},
	copyToPhotosClick: function(inTapInfo, inPosition) {
		this.viewCall("saveImageAtPoint", [inPosition.left, inPosition.top, "/media/internal",
			enyo.hitch(this, "finishCopyToPhotos", inTapInfo)]);
	},
	shareImageClick: function(inTapInfo, inPosition) {
		this.viewCall("saveImageAtPoint", [inPosition.left, inPosition.top, "/tmp",
			enyo.hitch(this, "finishShareImage", inTapInfo)]);
	},
	setWallpaperClick: function(inTapInfo, inPosition) {
		this.viewCall("saveImageAtPoint", [inPosition.left, inPosition.top, "/media/internal",
			enyo.hitch(this, "finishSetWallpaper", inTapInfo)]);
	},
	openDialog: function(inTitle, inMessage) {
		this.$.dialog.validateComponents();
		this.$.dialogTitle.setContent(inTitle);
		this.$.dialogMessage.setContent(inMessage);
		this.$.dialog.openPopup();
	},
	finishCopyToPhotos: function(inTapInfo, inSuccess, inPath) {
		var params = enyo.json.stringify({dontLaunch:true});
		if (inSuccess) {
			enyo.windows.addBannerMessage($L("Image Saved to Photos"),params);
		} else {
			enyo.windows.addBannerMessage($L("Error Saving Image"),params);
		}
	},
	finishShareImage: function(inTapInfo, inSuccess, inPath) {
		if (inSuccess) {
			var url = inTapInfo.imageUrl;
			var defaultTitle = url.indexOf("data:") >= 0 ? $L("Picture Link") : $L("Picture at ") + url;
			var title = inTapInfo.title || inTapInfo.altText || defaultTitle;
			var msg = $L("Here's a picture I think you'll like: <a href='{$src}'>{$title}</a>");
			msg = enyo.macroize(msg, {src: url, title: title});
			var s = url.lastIndexOf("/") + 1;
			var params = {
				summary: $L("Check out this picture..."),
				text: msg,
				attachments: [{name: url.substring(s), path: inPath}]
			};
			this.$.launchApplicationService.call({id: "com.palm.app.email", params: params});
		} else {
			var p = enyo.json.stringify({dontLaunch:true});
			enyo.windows.addBannerMessage($L("Error Sharing Image"),p);
		}
	},
	finishSetWallpaper: function(inTapInfo, inSuccess, inPath) {
		if (inSuccess) {
			this.$.importWallpaperService.call({target: inPath, scale: 1.0});
		} else {
			var p = enyo.json.stringify({dontLaunch:true});
			enyo.windows.addBannerMessage($L("Error Setting Wallpaper"),p);
		}
	},
	importedWallpaper: function(inSender, inResponse) {
		this.$.setWallpaperService.call({wallpaper: inResponse.wallpaper});
	},
	wallpaperError: function(inSender, inResponse) {
		this.openDialog($L("Error"), $L("Failed to set wallpaper"));
	},
	goBack: function() {
		if (this.canGoBack) {
			this.$.view.callBrowserAdapter("goBack");
		} else {
			this.doClose();
		}
	},
	goForward: function() {
		this.$.view.callBrowserAdapter("goForward");
	},
	reloadClick: function() {
	if(this.isErrorLoadFailed === true) {
		this.isErrorLoadFailed = false;
		this.setUrl(this.failedLoadUrl);
	}
	else
		this.$.view.callBrowserAdapter("reloadPage");
		//this.$.view.setZoom(this.$.view.getZoom() + 0.1);
	},
	stopClick: function() {
		this.log();
		this.$.view.callBrowserAdapter("stopLoad");
		this.$.actionbar.setProgress(0);
	},
	loadStarted: function() {
	   this._lastProgress = 0;
	   if (this._timeoutHandle != null) {
		   clearTimeout(this._timeoutHandle);
		   this._timeoutHandle = null;
	   }
	   this.isErrorLoadFailed = false;
	   this.$.actionbar.setLoading(true);
	},
	loadProgress: function(inSender, inProgress) {
		if (this._lastProgress < inProgress) {
			this.$.actionbar.setProgress(inProgress);
			this._lastProgress = inProgress;

			if (inProgress === 100) {
				this._timeoutHandle = setTimeout(enyo.hitch(this, "clearProgress"), 1000);
			}
		}
	},
	loadStopped: function() {
		this.doPageLoadStopped(this.url);
	},
	loadCompleted: function() {
		// empty
	},
	clearProgress: function() {
		this.$.actionbar.setProgress(0);
		this.$.actionbar.setLoading(false);
		this._timeoutHandle = null;
	},
	browserError: function(inSender, inErrorCode, inMsg) {
		
		switch(inErrorCode){
			case this.WebKitErrors.ERR_SYS_FILE_DOESNT_EXIST:
				this.openDialog($L("Error"), $L('File does not exist.'));
				break;
			case this.WebKitErrors.ERR_CURL_COULDNT_RESOLVE_HOST:
				this.isErrorLoadFailed = true;
				this.failedLoadUrl = this.url;
				this.openDialog($L("Error"), $L('Unable to resolve host.'));
				break;
			case this.WebKitErrors.ERR_WK_NOINTERNET:
				this.isErrorLoadFailed = true;
				this.failedLoadUrl = this.url;
				this.openDialog($L("Error"), $L('No Internet Connection.'));
				break;
			case this.WebKitErrors.ERR_WK_FLOADER_CANCELLED:
				break;
			default:
				this.openDialog($L("Error"), $L("Unable to Load Page"));
				this.log("Unknown Handled Error: " + inMsg);
				break;
				
			}
		this.clearProgress();
	},
	createPageImages: function() {
		var t = (new Date()).getTime();
		var w = 90;
		var h = 120;
		var p = "/var/luna/data/browser/icons/";
		var thumbnail = p + "thumbnail-" + t + ".png";
		var icon32 = p + "icon32-" + t + ".png";
		var icon64 = p + "icon64-" + t + ".png";
		this.viewCall("saveViewToFile", [thumbnail, 0, 0, w, h]);
		this.viewCall("generateIconFromFile", [thumbnail, icon64, 0, 0, w, h]);
		//FIXME: resize the icon or thumbnail?
		this.viewCall("resizeImage", [icon64, icon32, 32, 32]);
		return {thumbnailFile: thumbnail, iconFile32: icon32, iconFile64: icon64};
		return {};
	},
	deleteImages: function(inImages) {
		for (var i=0, image; image=inImages[i]; i++) {
			this.log(image);
			this.viewCall("deleteImage", [image]);
		}
	}
})
