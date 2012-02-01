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
	name: "Preferences",
	kind: enyo.VFlexBox,
	className: "basic-back",
	published: {
		browserPreferences: {},
		systemPreferences: {},
		searchPreferences: [],
		defaultSearch: ""
	},
	events: {
		onPreferenceChanged: "",
		onClose: ""
	},
	components: [
		{name: "header", kind: "PageHeader", className: "preferences-header", pack: "center", components: [
			{kind: "Image", src: "images/header-icon-prefs.png", className: "preferences-header-image"},
			{content: $L("Preferences")}
		]},
		{kind: "Scroller", flex: 1, components: [
			{kind: "Control", className: "enyo-preferences-box", components: [
				{kind: "RowGroup", caption: $L("Default Web Search Engine"), components: [
					{kind: "ListSelector", name: "searchPreference", value: $L("Google"), onChange: "searchPreferenceChange"}
				]},
				{kind: "RowGroup", caption: $L("Content"), style: "margin-bottom: 10px", components: [
					{kind: "LabeledContainer", caption: $L("Block Popups"), components: [
						{kind: "ToggleButton", name: "blockPopups", onChange: "togglePreferenceClick", preference: "blockPopups", type: "Browser"}
					]},
					{kind: "LabeledContainer", caption: $L("Accept Cookies"), components: [
						{kind: "ToggleButton", name: "acceptCookies", onChange: "togglePreferenceClick", preference: "acceptCookies", type: "Browser"}
					]},
					{kind: "LabeledContainer", caption: $L("Enable JavaScript"), components: [
						{kind: "ToggleButton", name: "enableJavascript", onChange: "togglePreferenceClick", preference: "enableJavascript", type: "Browser"}
					]},
					{kind: "LabeledContainer", caption: $L("Enable Flash"), components: [
						{kind: "ToggleButton", name: "flashplugins", onChange: "togglePreferenceClick", preference: "flashplugins", type: "System"}
					]},
				]},
				{kind: "Button", caption: $L("Clear Bookmarks"), onclick: "promptButtonClick", dialog: "clearBookmarksPrompt"},
				{kind: "Button", caption: $L("Clear History"), onclick: "promptButtonClick", dialog: "clearHistoryPrompt"},
				{kind: "Button", caption: $L("Clear Cookies"), onclick: "promptButtonClick", dialog: "clearCookiesPrompt"},
				{kind: "Button", caption: $L("Clear Cache"), onclick: "promptButtonClick", dialog: "clearCachePrompt"},
				/*
				{kind: "RowGroup", caption: $L("Autofill"), components: [
					{kind: "LabeledContainer", caption: $L("Names and Passwords"), components: [
						{kind: "ToggleButton", name: "rememberPasswords", onChange: "togglePreferenceClick", preference: "rememberPasswords"}
					]}
				]},
				{kind: "Button", caption: $L("Clear Autofill Information"), onclick: "", dialog: ""},
				*/
			]},
		]},
		{kind: "Toolbar", pack: "center", className: "enyo-toolbar-light", components: [
	 	   	{kind: "Button", caption: $L("Done"), onclick: "doClose", className: "enyo-preference-button enyo-button-dark"}
		]},
		{name: "clearBookmarksPrompt", kind: "BrowserPreferencePrompt",
			caption: $L("Would you like to clear your bookmarks?"),
			message: "",
			acceptCaption: $L("Clear Bookmarks"),
			onAccept: "completePrompt",
			preference: "clearBookmarks"
		},
		{name: "clearHistoryPrompt", kind: "BrowserPreferencePrompt",
			caption: $L("Would you like to clear your browser history?"),
			message: "",
			acceptCaption: $L("Clear History"),
			onAccept: "completePrompt",
			preference: "clearHistory"
		},
		{name: "clearCookiesPrompt", kind: "BrowserPreferencePrompt",
			caption: $L("Would you like to clear your browser cookies and local plug-in data?"),
			message: "",
			acceptCaption: $L("Clear All"),
			onAccept: "completePrompt",
			preference: "clearCookies"
		},
		{name: "clearCachePrompt", kind: "BrowserPreferencePrompt",
			caption: $L("Would you like to clear your browser cache?"),
			message: "",
			acceptCaption: $L("Clear Cache"),
			onAccept: "completePrompt",
			preference: "clearCache"
		}
	],
	create: function() {
		this.inherited(arguments);
	},
	browserPreferencesChanged: function() {
		this.log();
		this.updatePreferences(this.browserPreferences);
	},
	systemPreferencesChanged: function() {
		this.log();
		this.updatePreferences(this.systemPreferences);
	},
	searchPreferencesChanged: function() {
		var items = [];
		for (var i=0,s;s=this.searchPreferences[i];i++) {
			items.push({caption: s.displayName, value: s.id});
			this.$.searchPreference.setItems(items);
		}
	},
	defaultSearchChanged: function() {
		this.$.searchPreference.setValue(this.defaultSearch);
	},
	updatePreferences: function(inPreferences) {
		for (key in inPreferences) {
			var value = inPreferences[key];
			if (this.$[key] !== undefined) {
				if (this.$[key].inverted) {
					this.$[key].setState(!value);
				} else {
					this.$[key].setState(value);
				}
			}
		}
	},
	togglePreferenceClick: function(inSender, inState) {
		if (inSender.inverted) {
			this.fireChange(inSender.preference, inSender.type, !inState);
		} else {
			this.fireChange(inSender.preference, inSender.type, inState);
		}
	},
	promptButtonClick: function(inSender) {
		this.$[inSender.dialog].openAtCenter();
	},
	completePrompt: function(inSender) {
		this.fireChange(inSender.preference);
	},
	searchPreferenceChange: function(inSender, inValue) {
		this.fireChange("defaultSearch", "Search", inSender.getValue());
	},
	fireChange: function(inPreference, inType, inValue) {
		this.doPreferenceChanged(inPreference, inType, inValue);
	}
});
