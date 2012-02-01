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
	name: "ItemButton",
	kind: enyo.Button,
	mouseholdHandler: function() {
		return true;
	}
});

enyo.kind({
	name: "DownloadList",
	kind: enyo.VFlexBox,
	flex: 1, 
	className: "basic-back",
	published: {
		downloads: [],
	},
	events: {
		onOpenItem: "",
		onRetryItem: "",
		onCancelItem: "",
		onDeleteItem: "",
		onClearAll: "",
		onClose: ""
	},
	components: [
		{kind: enyo.Scroller, flex: 1, components: [
			{name: "list", kind: enyo.VirtualRepeater, flex: 1, onSetupRow: "listSetupRow", components: [
				{name: "item", kind: "Item", className: "dl-toaster-item", layoutKind: "HFlexLayout", align: "center", tapHighlight: true, onConfirm: "itemDelete", components: [
					{name: "icon", kind: "MimeIcon", className: "dl-item-image"},
					{name: "filename", className: "dl-item-title enyo-text-ellipsis", flex: 1},
					{name: "progressItem", kind: "ProgressButton", flex: 1, className: "item-progress blue", animatePosition: false, onCancel: "itemCancel", components: [
						{name: "progressContent", flex: 1, className: "enyo-text-ellipsis"}
					]},
					
					{name: "openButton", kind: "ItemButton", caption: $L("Open"), className: "enyo-button-dark", onclick: "itemOpen", onMousehold: "consumeEvent", showing: false},
					{name: "refreshButton", kind: "ItemButton", caption: $L("Download"), onclick: "itemRetry", onMousehold: "consumeEvent", showing: false}
				]}
				
			]}
		]},
		{kind: "Toolbar", align: "center", components: [
			{kind: "GrabButton", onclick: "doClose"},
			{flex: 1, kind: "Control"},
			{name: "clear", kind: "ToolButton", content: $L("Clear"), disabled: true, onclick: "doClearAll", style: "margin-right: 10px"}
		]}
	],
	//* @protected
	downloadsChanged: function() {
		this.$.list.render();
		this.$.clear.setDisabled(this.downloads == null || this.downloads.length == 0);
	},
	renderItem: function(inObject) {
		var d = inObject;
		var c = d.target || d.url;
		var s = c.lastIndexOf("/") + 1;
		this.$.filename.setContent(c.substring(s).replace(/%20/g, " "));
		this.$.icon.setMimeType(d.mimetype);
		if (d.ticket) {
			if (d.aborted || d.completed && d.completionStatusCode != 200) {
				this.$.progressItem.setShowing(false);
				this.$.filename.setShowing(true);
				this.$.refreshButton.setShowing(true);
			} else if (d.completed) {
				this.$.filename.setContent(d.destFile.replace(/%20/g, " "));
				this.$.filename.setShowing(true);
				this.$.progressItem.setShowing(false);
				this.$.openButton.setShowing(true);
				this.$.refreshButton.setShowing(false);
			} else {
				this.$.progressItem.setMaximum(d.amountTotal || 100);
				this.$.progressItem.setPosition(d.amountReceived || 0);
				this.$.progressContent.setContent(c.substring(s).replace(/%20/g, " "));
				this.$.filename.setShowing(false);
				this.$.refreshButton.setShowing(false);
			}
		} else {
			this.$.progressItem.setMaximum(100);
			this.$.progressItem.setPosition(1);
			this.$.refreshButton.setShowing(false);
		}
	},
	listSetupRow: function(inSender, inIndex) {
		var d = this.downloads[inIndex];
		if (d) {
			this.renderItem(d);
			return true;
		}
	},
	itemClick: function(inSender, inEvent, inIndex) {
		this.doOpenItem(inIndex);
		return true;
	},
	itemCancel: function(inSender, inEvent) {
		this.doCancelItem(this.$.list.fetchRowIndex());
		this.$.progressItem.setShowing(false);
		this.$.filename.setShowing(true);
		this.$.refreshButton.setShowing(true);
		return true;
	},
	itemDelete: function() {
		this.doDeleteItem(this.$.list.fetchRowIndex());
	},
	itemRetry: function(inSender, inEvent) {
		this.$.progressItem.setShowing(true);
		this.$.filename.setShowing(false);
		this.$.refreshButton.setShowing(false);
		this.doRetryItem(this.$.list.fetchRowIndex());
	},
	itemOpen: function(inSender, inEvent) {
		this.doOpenItem(this.$.list.fetchRowIndex());
		return true;
	},
	consumeEvent: function() {
		return true;
	}
});
