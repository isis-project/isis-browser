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
	name: "BrowserPrompt",
	kind: "VerticalAcceptCancelPopup",
	published: {
		message: ""
	},
	components: [
		{name: "message", className: "browser-dialog-body enyo-text-body"}
	],
	componentsReady: function() {
		this.inherited(arguments);
		this.messageChanged();
	},
	messageChanged: function() {
		this.$.message.setShowing(this.message);
		this.$.message.setContent(this.message);
	}
});

enyo.kind({
	name: "BrowserPreferencePrompt",
	kind: "BrowserPrompt",
	chrome: [
		{className: "enyo-modaldialog-container preference-prompt", components: [
			{name: "modalDialogTitle", className: "enyo-modaldialog-title"},
			{name: "client"},
			{name: "accept", kind: "NoFocusButton", flex: 1, onclick: "acceptClick", className: "enyo-button-negative"},
			{name: "cancel", kind: "NoFocusButton", flex: 1, onclick: "cancelClick"}
		]}
	]
});