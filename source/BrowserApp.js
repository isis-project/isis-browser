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
	name: "enyo.BrowserApp",
	kind: enyo.VFlexBox,
	className: "basic-back",
	published: {
		url: "",
		systemPreferences: {},
		browserPreferences: {},
		searchPreferences: [],
		defaultSearch: ""
	},
	components: [
		{kind: "ApplicationEvents", onWindowActivated: "windowActivatedHandler", onWindowDeactivated: "windowDeactivatedHandler", onApplicationRelaunch: "applicationRelaunchHandler"},
		{name: "downloadService", kind: enyo.PalmService, service: "palm://com.palm.downloadmanager/", method: "download", onSuccess: "gotDownloadStatus", onFailure: "gotDownloadFailure", subscribe: true, resubscribe: true},
		{name: "cancelDownloadService", kind: enyo.PalmService, service: "palm://com.palm.downloadmanager/", method: "cancelDownload"},
		{name: "downloadHistoryService", kind: enyo.PalmService, service: "palm://com.palm.downloadmanager/", method: "getAllHistory", onSuccess: "gotDownloadHistory"},
		{name: "clearDownloadsService", kind: enyo.PalmService, service: "palm://com.palm.downloadmanager/", method: "clearHistory"},
		{name: "bookmarksService", kind: "DbService", dbKind: "com.palm.browserbookmarks:1", reCallWatches: true},
		{name: "historyService", kind: "DbService", dbKind: "com.palm.browserhistory:1", reCallWatches: true},
		{name: "systemPrefsService", kind: "SystemService"},
		{name: "browserPrefsService", kind: "DbService", dbKind: "com.palm.browserpreferences:1", reCallWatches: true},
		{name: "universalSearchService", kind: enyo.PalmService, service: "palm://com.palm.universalsearch/", method: "getUniversalSearchList", onSuccess: "gotUniversalSearchList", subscribe: true, resubscribe: true},
		{name: "setSearchPreferenceService", kind: enyo.PalmService, service: "palm://com.palm.universalsearch/", method: "setSearchPreference"},
		{name: "clearOptionalSearchListService", kind: enyo.PalmService, service: "palm://com.palm.universalsearch/", method: "clearOptionalSearchList"},
		{name: "stService", kind: "PalmService", service: "palm://com.palm.stservice/", timeout: 500},
		{name: "launchApplicationService", kind: "PalmService", service: enyo.palmServices.application, method: "open", onFailure: "gotResourceError"},
		{name: "addToLauncherService", kind: "PalmService", service: enyo.palmServices.application, method: "addLaunchPoint"},
		{name: "resourceInfoService", kind: "PalmService", service: enyo.palmServices.application, method: "getResourceInfo", onSuccess: "gotResourceInfo", onFailure: "gotResourceError"},
		{kind: enyo.Pane, flex: 1, height: "100%", lazyViews: [
			{name: "startPage", kind: "StartPage", 
				onUrlChange: "processUrlChange",
				onOpenBookmarks: "bookmarksClick",
				onNewCard: "newCardClick",
				onShow: "startPageShown"
			},
			{name: "browser", kind: "Browser",
				onPageTitleChanged: "pageTitleChanged",
				onPageLoadStopped: "pageLoadStopped",
				onFileLoad: "handleResource",
				onAddBookmark: "addBookmark",
				onAddToLauncher: "showAddtoLauncherDialog",
				onShareLink: "shareClick",
				onOpenBookmarks: "bookmarksClick",
				onPrint: "printClick",
				onUrlRedirected: "openResource",
				onClose: "browserClosed",
				onShow: "browserShown",
				onHide: "browserHidden"
			},
			{name: "preferences", kind: "Preferences",
				onPreferenceChanged: "preferenceChanged",
				onShow: "preferencesShown",
				onClose: "backHandler"
			}
		]},
		{kind: enyo.Toaster, flyInFrom: "right", style: "top: 0px; bottom: 0px", lazy: false, components: [
			{className: "enyo-sliding-view-shadow"},
			{kind: enyo.VFlexBox, flex: 1, width: "320px", height: "100%", components: [
				{kind: "Header", className: "enyo-header-dark", components: [
					{kind: "RadioGroup", flex: 1, components: [
						{kind: "RadioButton", value: "bookmarks", className: "enyo-radiobutton-dark", icon: "images/chrome/toaster-icon-bookmarks.png", onclick: "showBookmarks"},
						{kind: "RadioButton", value: "history", className: "enyo-radiobutton-dark", icon: "images/chrome/toaster-icon-history.png", onclick: "showHistory"},
						{kind: "RadioButton", value: "downloads", className: "enyo-radiobutton-dark", icon: "images/chrome/toaster-icon-downloads.png", onclick: "showDownloads"}
					]}
				]},
				{name: "drawerPane", kind: "Pane", flex: 1, lazyViews: [
					{name: "bookmarks", kind: "BookmarkList",
						onSelectItem: "selectItem",
						onEditItem: "showEditBookmarkDialog",
						onDeleteItem: "deleteBookmark",
						onAddBookmark: "addBookmark",
						onClose: "closeToaster"
					},
					{name: "history", kind: "HistoryList",
						onSelectItem: "selectItem",
						onDeleteItem: "deleteHistory",
						onClose: "closeToaster",
					},
					{name: "downloads", kind: "DownloadList",
						onOpenItem: "openDownloadedFile",
						onCancelItem: "cancelDownload",
						onRetryItem: "retryDownload",
						onDeleteItem: "deleteDownload",
						onClearAll: "showClearDownloadsDialog",
						onClose: "closeToaster",
						onShow: "downloadListShown"
					}
				]}
			]}
		]},
		{kind: "BookmarkDialog", onAccept: "bookmarkAccept", onBeforeOpen: "setupBookmarkDialog"},
		{name: "downloadError", kind: "BrowserPrompt", caption: $L("Cannot open MIME type"), message: ""},
		{name: "clearDownloadsDialog", kind: "BrowserPrompt",
			caption: $L("Are you sure you want to clear the Downloads list?"),
			message: $L("This will not delete the file(s). Plug your device into a computer and use USB mode."),
			acceptCaption: $L("Clear List"),
			onAccept: "clearDownloads"
		},
		{kind: "PrintDialog", lazy: false, duplexOption: true, colorOption: true, onRenderDocument: "renderDocument", appName: "Browser"},
		{kind: "AppMenu", onBeforeOpen: "toggleAppMenuItems", components: [
			//{caption: $L("Find on Page"), onclick: "showFindOnPage"},
			{name: "preferencesItem", caption: $L("Preferences"), onclick: "preferencesClick"},
			{name: "printMenuItem", caption: $L("Print"), onclick: "printClick"},
			{caption: $L("Help"), onclick: "helpClick"}
		]}
	],
	//* @protected
	constructor: function() {
		this.inherited(arguments);
		this.downloads = [];
		this.preferences = {};
	},
	create: function() {
		this.inherited(arguments);
		this.fetchInitialPreferences();
		this.log(enyo.json.stringify(enyo.windowParams));
	},
	applicationRelaunchHandler: function(inSender) {
		var c = enyo.windows.getActiveWindow();
		var params = enyo.windowParams;
		// squelch needless banner clicks
		if (params.dontLaunch) return true;
		if (params.sendDataToShare !== undefined) {
			this.$.stService.call({data: {target: c.enyo.$.browserApp.getUrl(), type: "rawdata", mimetype: "text/html"}}, {method: "shareData"});
			return true;
		} else if (params.toasterOpen) {
			this.$.toaster.open();
			this.$.radioGroup.setValue(params.toasterOpen);
			this.$.drawerPane.selectViewByPane(params.toasterOpen);
		} else {
			enyo.windows.openWindow("index.html", null, params);
			return true;
		}
	},
	rendered: function() {
		this.inherited(arguments);
		this.log();
		var p = window.PalmSystem ? enyo.windowParams : this.processQueryString();
		var url = p.target || p.url;
		if (url) {
			this.setUrl(url); // this opens the browser view
		} else if (p.webviewId) {
			this.$.pane.selectViewByName("browser");
		} else {
			this.$.pane.selectViewByName("startPage");
		}
		this.showBookmarks();
		//this.showAppMenu();
		//this.resize();
	},
	processQueryString: function() {
		var q = location.search.slice(1), queryArgs = {};
		if (q) {
			var args = q.split("&");
			for (var i=0, a, nv; a=args[i]; i++) {
				var nv = args[i] = a.split("=");
				if (nv) {
					queryArgs[nv[0]] = unescape(nv[1]);
				}
			}
		}
		if (queryArgs.query) {
			queryArgs.url = "http://www.google.com/search?q=" + queryArgs.query;
		}
		return queryArgs;
	},
	isBrowserShowing: function() {
		return this.$.pane.getViewName() === "browser";
	},
	isStartPageShowing: function() {
		return this.$.pane.getViewName() === "startPage";
	},
	isPreferencesShowing: function() {
		return this.$.pane.getViewName() === "preferences";
	},
	isDownloadListShowing: function() {
		return this.$.toaster.isOpen && this.$.drawerPane.getViewName() === "downloads";
	},
	isBrowserLoading: function() {
		if (this.$.browser) {
			return this.$.browser.isLoading();
		} else {
			return false;
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		if (this.isBrowserShowing()) {
			this.$.browser.resize();
		} else if (this.isStartPageShowing()) {
			this.$.startPage.resize();
		}
	},
	windowActivatedHandler: function() {
		//this.$.browser.hasKind();
		if (this.isBrowserShowing()) {
			this.$.browser.viewCall("activate");
		}
		this.refreshDownloads();
	},
	windowDeactivatedHandler: function() {
		if (this.isBrowserShowing()) {
			this.$.browser.viewCall("deactivate");
		}
	},
	refreshPanes: function() {
		this.inherited(arguments);
		var i = this.$.drawerPane.getViewByIndex();
		this.$.drawerPane.selectViewByIndex(i);
	},
	browserShown: function(inSender, inShowing, inRefresh) {
		enyo.keyboard.setResizesWindow(false);
		// FIXME: there's a transition skag. trying to eliminate.
		setTimeout(enyo.hitch(this, function() {
			this.$.browser.viewCall("activate");
			if (inRefresh || !this.$.browser.getUrl()) {
				this.$.browser.setUrl(this.url);
			}
		}), 1);
	},
	browserHidden: function() {
		enyo.keyboard.setResizesWindow(true);
		this.$.browser.viewCall("deactivate");
	},
	browserClosed: function() {
		this.gotoView("startPage");
	},
	downloadListShown: function(inSender) {
		this.$.downloads.setDownloads(this.downloads);
	},
	preferencesShown: function(inSender) {
		this.$.preferences.updatePreferences(this.preferences);
	},
	startPageShown: function() {
		this.$.startPage.setUrl("");
	},
	toggleAppMenuItems: function() {
		var browser = this.isBrowserShowing();
		this.$.printMenuItem.setDisabled(!browser || this.isBrowserLoading());
		this.$.preferencesItem.setDisabled(this.isPreferencesShowing());
	},
	applyPreference: function(inPreference, inValue) {
		this.log(inPreference, inValue);
		var preferenceMap = {
			enableJavascript: "setEnableJavascript",
			blockPopups: "setBlockPopups",
			acceptCookies: "setAcceptCookies",
		}
		this.$.pane.viewByName("browser");
		var o = inPreference == "clearHistory" || inPreference == "clearBookmarks" ? this : this.$.browser;
		this.log(preferenceMap[inPreference] || inPreference);
		this.log(o);
		this.log(o[preferenceMap[inPreference] || inPreference]);
		if (o[preferenceMap[inPreference] || inPreference]) {
			this.log(preferenceMap[inPreference || inPreference], inValue);
			o[preferenceMap[inPreference] || inPreference](inValue);
		}
	},
	systemPreferencesChanged: function() {
		for (var key in this.systemPreferences) {
			this.log(key, this.systemPreferences[key]);
			this.applyPreference(key, this.systemPreferences[key]);
		}
		this.$.pane.viewByName("preferences").setSystemPreferences(this.systemPreferences);
	},
	browserPreferencesChanged: function() {
		for (var key in this.browserPreferences) {
			this.applyPreference(key, this.browserPreferences[key]);
		}
		this.$.pane.viewByName("preferences").setBrowserPreferences(this.browserPreferences);
	},
	searchPreferencesChanged: function() {
		var views = ["browser", "startPage", "preferences"];
		for (var i=0, v;v=views[i];i++) {
			this.$.pane.viewByName(v).setSearchPreferences(this.searchPreferences);
		}
	},
	defaultSearchChanged: function() {
		this.log(this.defaultSearch);
		var views = ["browser", "startPage", "preferences"];
		for (var i=0, v;v=views[i];i++) {
			this.$.pane.viewByName(v).setDefaultSearch(this.defaultSearch);
		}
	},
	gotSystemPreferences: function(inSender, inResponse) {
		delete inResponse.returnValue;
		this.setSystemPreferences(inResponse);
	},
	gotBrowserPreferences: function(inSender, inResponse) {
		for (var i=0,p;p=inResponse.results[i];i++) {
			this.browserPreferences[p.key] = p.value;
		}
		this.browserPreferencesChanged();
	},
	gotInitialBrowserPreferences: function(inSender, inResponse) {
		var kind = this.$.browserPrefsService.dbKind;
		var defaultBrowserPreferences = [
			{_kind: kind, key: "blockPopups", value: true},
			{_kind: kind, key: "acceptCookies", value: true},
			{_kind: kind, key: "enableJavascript", value: true},
			{_kind: kind, key: "rememberPasswords", value: true}
		];
		if (inResponse.results.length == 0) {
			this.$.browserPrefsService.call({objects: defaultBrowserPreferences}, {method: "put", onSuccess: "fetchPreferences"});
		} else {
			this.fetchPreferences();
		}
	},
	fetchInitialPreferences: function() {
		this.$.browserPrefsService.call(undefined, {method: "find", onSuccess: "gotInitialBrowserPreferences"});
	},
	fetchPreferences: function(inSuccessCallback, inSubscribe) {
		var systemPreferences = [
			"flashplugins",
			"click2play"
		];
		this.$.systemPrefsService.call({keys: systemPreferences}, {method: "getPreferences", onSuccess: "gotSystemPreferences", subscribe: true});
		this.$.browserPrefsService.call(undefined, {method: "find", onSuccess: "gotBrowserPreferences", subscribe: true});
		this.$.universalSearchService.call();
	},
	gotUniversalSearchList: function(inSender, inResponse) {
		this.searchPreferences = [];
		for (var i=0, s;s=inResponse.UniversalSearchList[i];i++) {
			if (s.type === "web" && s.enabled) {
				this.searchPreferences.push(s);
			}
		}
		this.searchPreferencesChanged();
		this.setDefaultSearch(inResponse.defaultSearchEngine);
	},
	preferenceChanged: function(inSender, inPreference, inType, inValue) {
		if (inType === "System") {
			this.systemPreferences[inPreference] = inValue;
			var p = {};
			p[inPreference] = inValue;
			this.$.systemPrefsService.call(p, {method: "setPreferences"});
			this.applyPreference(inPreference, inValue);
		} else if (inType === "Browser") {
			this.browserPreferences[inPreference] = inValue;
			this.$.browserPrefsService.call({props: {value: inValue}, query: {from: this.$.browserPrefsService.dbKind, where: [{prop:"key","op":"=","val":inPreference}]}}, {method: "merge"});
			this.applyPreference(inPreference, inValue);
		} else if (inType === "Search") {
			this.$.setSearchPreferenceService.call({key: "defaultSearchEngine", value: inValue});
			this.setDefaultSearch(inValue);
		} else {
			this.applyPreference(inPreference, inValue);
		}
	},
	processUrlChange: function(inSender, inUrl) {
		this.setUrl(inUrl);
	},
	urlChanged: function() {
		if (this.isBrowserShowing()) {
			this.browserShown(this, true, true);
		} else {
			this.gotoView("browser");
		}
	},
	selectItem: function(inSender, inItem) {
		this.setUrl(inItem.url);
		this.closeToaster();
	},
	gotoView: function(inName) {
		this.closeToaster();
		this.$.pane.selectViewByName(inName);
	},
	pageTitleChanged: function(inSender, inTitle, inUrl) {
		this.url = inUrl;
		this.title = inTitle;
	},
	pageLoadStopped: function(inSender, inUrl) {
		this.updateHistory(this.title, this.url);
	},
	handleResource: function(inSender, inMimeType, inUrl) {
		this.$.resourceInfoService.call({uri: inUrl, mime: inMimeType});
	},
	gotResourceInfo: function(inSender, inResponse, inRequest) {
		var uri = enyo.uri.parseUri(inResponse.uri);
		if (inResponse.appIdByExtension == enyo.fetchAppId()) {
			this.downloadResource(inResponse.uri, inRequest.params.mime);
		} else if (inResponse.canStream) {
			this.openResourceWithApp(inResponse.appIdByExtension, inResponse.uri, inRequest.params.mime);
		} else if (uri.scheme != "http" && uri.scheme != "https" && uri.scheme != "ftp") {
			this.openResource(inResponse.uri);
		} else {
			this.downloadResource(inResponse.uri, inRequest.params.mime);
		}
	},
	gotResourceError: function(inSender, inResponse) {
		this.$.toaster.close();
		this.$.downloadError.openPopup();
	},
	downloadResource: function(inUrl, inMime) {
		this.downloads.unshift({url: inUrl, mimetype: inMime});
		this.$.downloadService.call({target: inUrl, mime: inMime});
		this.showDownloads();
		this.$.toaster.open();
	},
	openDownloadedFile: function(inSender, inIndex) {
		var d = this.downloads[inIndex];
		if (d.completed && !d.aborted && !d.interrupted) {
			this.$.launchApplicationService.call({target: d.destPath + d.destFile});
		}
	},
	cancelDownload: function(inSender, inIndex) {
		var d = this.downloads[inIndex];
		this.$.cancelDownloadService.call({ticket: d.ticket});
	},
	retryDownload: function(inSender, inIndex) {
		var u = this.downloads[inIndex].url;
		this.downloads[inIndex] = {url: u};
		this.$.downloadService.call({target: u});
	},
	deleteDownload: function(inSender, inIndex) {
	},
	showClearDownloadsDialog: function() {
		this.$.clearDownloadsDialog.openAtCenter();
	},
	clearDownloads: function() {
		var newDownloads = [];
		for (var i=0,d;d=this.downloads[i];i++) {
			if (!d.completed) {
				newDownloads.push(d);
			}
		}
		this.downloads = newDownloads;
		this.$.downloads.setDownloads(this.downloads);
		this.$.clearDownloadsService.call({owner: enyo.fetchAppId()});
	},
	findDownload: function(inObj, inSkipUrl) {
		for (var i=0, d; d=this.downloads[i]; i++) {
			if (d.ticket && d.ticket == inObj.ticket) {
				return d;
			}
			if (!inSkipUrl && d.url && d.url == inObj.url) {
				return d;
			}
		}
	},
	gotDownloadStatus: function(inSender, inResponse) {
		var d = this.findDownload(inResponse);
		if (d) {
			// download manager returns the wrong mimetype
			inResponse.mimetype = d.mimetype;
			enyo.mixin(d, inResponse);
			if (!this.$.downloads.showing && d.completed) {
				var filename = d.destFile.replace(/%20/g, " ");
				var params = enyo.json.stringify({toasterOpen:"downloads"});
				if (d.completionStatusCode == 200) {
					enyo.windows.addBannerMessage(filename + ' ' + $L("finished downloading"), params);
				} else {
					enyo.windows.addBannerMessage($L("There was a problem downloading ") + filename, params);
				}
			}
			if (this.$.downloads.showing) {
				this.$.downloads.setDownloads(this.downloads);
			}
		}
	},
	gotDownloadFailure: function(inSender, inResponse) {
		this.log(inResponse);
	},
	refreshDownloads: function() {
		this.$.downloadHistoryService.call({owner: enyo.fetchAppId()});
	},
	gotDownloadHistory: function(inSender, inResponse) {
		// inResponse is sorted by ticket in ascending order
		var iidx = this.downloads.length;
		for (var i=0,d;d=inResponse.items[i];i++) {
			if (d.state == "completed" && d.fileExistsOnFilesys) {
				iidx = this.insertIntoDownloads(enyo.json.parse(d.recordString), iidx);
			}
		}
		if (this.isDownloadListShowing()) {
			this.$.downloads.setDownloads(this.downloads);
		}
	},
	insertIntoDownloads: function(inObj, inStartIndex) {
		for (var i=inStartIndex,d;d=this.downloads[i-1];i--) {
			if (d.ticket == inObj.ticket) {
				return i;
			}
			if (d.ticket > inObj.ticket) {
				this.downloads.splice(i, 0, inObj);
				return i;
			}
		}
		this.downloads.unshift(inObj);
		return 0;
	},
	openResource: function(inSender, inUrl) {
		this.$.launchApplicationService.call({target: inUrl});
	},
	openResourceWithApp: function(inAppId, inUrl, inMime) {
		this.$.launchApplicationService.call({id: inAppId, params: {target: inUrl, mime: inMime}});
	},
	updateHistory: function(inTitle, inUrl) {
		this.$.historyService.call(
			{query: {where: [{prop:"url",op:"=",val:inUrl}]}},
			{method: "delByQuery"});
		var history = {
			_kind: this.$.historyService.dbKind,
			url: inUrl,
			title: inTitle,
			date: (new Date()).getTime()
		}
		this.$.historyService.call({objects: [history]}, {method: "put"});
	},
	deleteHistory: function(inSender, inHistory) {
		this.$.historyService.call({ids: [inHistory._id]}, {method: "del"});
	},
	clearHistory: function() {
		this.$.historyService.call(undefined, {method: "delByQuery"});
		if (this.$.browser) {
			this.$.browser.clearHistory();
		}
		// remove when open search is redesigned - clearing history
		// also clears user added search engines
		this.$.clearOptionalSearchListService.call();
	},
	showFindOnPage: function() {
		if (this.isBrowserShowing()) {
			this.$.browser.showFind();
		}
	},
	printClick: function() {
		this.$.printDialog.openAtCenter();
	},
	renderDocument: function(inSender, inJobID, inPrintParams) {
		if (this.isBrowserShowing()) {
			this.$.browser.printFrame(inJobID, inPrintParams);
		}
	},
	setupBookmarkDialog: function() {
	},
	showAddtoLauncherDialog: function() {
		this.$.bookmarkDialog.setTitle(this.$.browser.title);
		this.$.bookmarkDialog.setUrl(this.$.browser.url);
		this.$.bookmarkDialog.setIcons(this.$.browser.createPageImages());
		this.$.bookmarkDialog.setAcceptCaption($L("Add to Launcher"));
		this.$.bookmarkDialog.acceptAction = "addToLauncher";
		this.$.bookmarkDialog.openAtCenter();
	},
	addToLauncher: function(inTitle, inUrl, inIcons, inId) {
		this.$.addToLauncherService.call({id: enyo.fetchAppId(), icon: inIcons.iconFile64, title: inTitle, params: {url: inUrl}});
	},
	showEditBookmarkDialog: function(inSender, inBookmark) {
		this.$.bookmarkDialog.setTitle(inBookmark.title);
		this.$.bookmarkDialog.setUrl(inBookmark.url);
		this.$.bookmarkDialog.setIcons({thumbnailFile: inBookmark.thumbnailFile, iconFile32: inBookmark.iconFile32, iconFile64: inBookmark.iconFile64});
		this.$.bookmarkDialog.setId(inBookmark._id);
		this.$.bookmarkDialog.setAcceptCaption($L("Save"));
		this.$.bookmarkDialog.acceptAction = "editBookmark";
		this.$.bookmarkDialog.openAtCenter();
	},
	bookmarkAccept: function(inSender, inTitle, inUrl, inIcons, inId) {
		var a = inSender.acceptAction;
		if (this[a]) {
			this[a](inTitle, inUrl, inIcons, inId);
		}
	},
	addBookmark: function() {
		var date = (new Date()).getTime();
		var b = {
			_kind: this.$.bookmarksService.dbKind,
			title: this.$.browser.title,
			url: this.$.browser.url,
			date: date,
			lastVisited: date,
			defaultEntry: false,
			visitCount: 0,
			idx: null
		};
		enyo.mixin(b, this.$.browser.createPageImages());
		this.$.bookmarksService.call({objects: [b]}, {method: "put"});
	},
	editBookmark: function(inTitle, inUrl, inIcons, inId) {
		var date = (new Date()).getTime();
		var b = {
			_id: inId,
			title: inTitle,
			url: inUrl,
			date: date,
		};
		enyo.mixin(b, inIcons);
		this.$.bookmarksService.call({objects: [b]}, {method: "merge"});
	},
	deleteBookmark: function(inSender, inBookmark) {
		this.$.bookmarksService.call({ids: [inBookmark._id]}, {method: "del"});
	},
	clearBookmarks: function() {
		this.$.bookmarksService.call(undefined,{method:"delByQuery"});
	},
	newCardClick: function() {
		enyo.windows.openWindow("index.html");
	},
	shareClick: function() {
		this.$.browser.shareLink(this.url, this.title);
	},
	bookmarksClick: function() {
		this.$.toaster.open();
		this.$.drawerPane.selectView(this.$.drawerPane.getView());
	},
	preferencesClick: function() {
		this.gotoView("preferences");
	},
	helpClick: function() {
		this.$.launchApplicationService.call({params: {target: "http://help.palm.com/web/index.html"}, id: "com.palm.app.help"});
	},
	showBookmarks: function() {
		this.$.radioGroup.setValue("bookmarks");
		this.$.drawerPane.selectViewByName("bookmarks");
	},
	showHistory: function() {
		this.$.radioGroup.setValue("history");
		this.$.drawerPane.selectViewByName("history");
	},
	showDownloads: function() {
		this.$.radioGroup.setValue("downloads");
		this.$.drawerPane.selectViewByName("downloads");
	},
	closeToaster: function() {
		this.$.toaster.close();
	},
	backHandler: function(inSender, e) {
		var n = this.$.pane.getViewName();
		switch (n) {
			case "browser":
				this.$.browser.goBack();
				e.preventDefault();
				break;
			case "startPage":
				break;
			default:
				this.$.pane.back(e);
		}
	}
});
