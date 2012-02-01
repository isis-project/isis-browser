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
	name: "ActionBar",
	kind: enyo.VFlexBox,
	defaultKind: "ToolButton",
	pack: "center",
	className: "enyo-toolbar actionbar",
	published: {
		url: "",
		title: "",
		canGoBack: false,
		canGoForward: false,
		canShare: true,
		searchPreferences: {},
		defaultSearch: "",
		progress: 0,
		loading: false
	},
	events: {
		onBack: "",
		onForward: "",
		onLoad: "",
		onStopLoad: "",
		onRefresh: "",
		onAddBookmark: "",
		onAddToLauncher: "",
		onShareLink: "",
		onOpenBookmarks: "",
		onNewCard: ""
	},
	components: [
    	{kind: "Control", showing: false, name: "title", className: "page-title enyo-text-ellipsis", content: "Untitled"},
		{kind: enyo.HFlexBox, className: "menu-container", align: "center", components: [
			{kind: "ToolButton", name: "back", className: "actionbar-tool-button", icon: "images/chrome/menu-icon-back.png", onclick: "doBack"},
			{kind: "ToolButton", name: "forward", className: "actionbar-tool-button", icon: "images/chrome/menu-icon-forward.png", onclick: "doForward"},
			{kind: "ToolButton", name: "search", className: "actionbar-tool-button", flex: 1, kind: "URLSearch", onLoad: "doLoad", onStopLoad: "doStopLoad", onRefresh: "doRefresh"},
			{kind: "ToolButton", name: "share", className: "actionbar-tool-button", icon: "images/chrome/menu-icon-share.png", onclick: "showSharePopup"},
			{kind: "ToolButton", className: "actionbar-tool-button", icon: "images/chrome/menu-icon-newcard.png", onclick: "doNewCard"},
			{kind: "ToolButton", className: "actionbar-tool-button", icon: "images/chrome/menu-icon-bookmark.png", onclick: "doOpenBookmarks"},
		]},	
		{name: "sharePopup", className: "launch-popup",  kind: "Menu", components: [
			{caption: $L("Add Bookmark"), onclick: "doAddBookmark"},
			{caption: $L("Share Link"), onclick: "doShareLink"},
			{caption: $L("Add to Launcher"), onclick: "doAddToLauncher"}
		]},
		{name: "progressBar", kind: "ProgressBar", className: "url-progress invisible", animatePosition: false},
	],
	//* @public
	resize: function() {
		this.$.search.resize();
	},
	forceFocus: function() {
		this.$.search.forceFocus();
	},
	forceBlur: function() {
		this.$.search.closeSearchPopup();
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.urlChanged();
		this.titleChanged();
		this.canGoBackChanged();
		this.canGoForwardChanged();
		this.canShareChanged();
		this.loadingChanged();
	},
	urlChanged: function() {
		this.$.search.setUrl(this.url);
	},
	titleChanged: function() {
		this.$.title.setContent(this.title || $L("Untitled"));
	},
	canGoBackChanged: function() {
		this.$.back.setDisabled(!this.canGoBack);
	},
	canGoForwardChanged: function() {
		this.$.forward.setDisabled(!this.canGoForward);
	},
	canShareChanged: function() {
		this.$.share.setDisabled(!this.canShare);
	},
	searchPreferencesChanged: function() {
		this.$.search.setSearchPreferences(this.searchPreferences);
	},
	defaultSearchChanged: function() {
		this.$.search.setDefaultSearch(this.defaultSearch);
	},
	showSharePopup: function(inSender, inEvent) {
		this.$.sharePopup.openAt({top: -1000});
		var pop = this.$.sharePopup.getBounds(); 
		this.$.sharePopup.close();
		this.$.sharePopup.openAtControl(this.$.share, {left: -pop.width+10, top: 26});
	},
	progressChanged: function() {
		this.$.progressBar.setPosition(this.progress);
	},
	loadingChanged: function() {
		this.$.search.setLoading(this.loading);
		if (this.loading) {
			if (this.$.progressBar.hasClass("invisible")) {
				this.$.progressBar.removeClass("invisible");
			}
		} else {
			if (!this.$.progressBar.hasClass("invisible")) {
				this.$.progressBar.addClass("invisible"); 
			}
		}
	},
});
