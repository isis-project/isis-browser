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
	name: "BookmarkList",
	kind: enyo.VFlexBox,
	flex: 1, 
	className: "basic-back",
	events: {
		onSelectItem: "",
		onEditItem: "",
		onDeleteItem: "",
		onAddBookmark: "",
		onClose: "",
	},
	components: [
		{name: "bookmarksService", kind: "DbService", dbKind: "com.palm.browserbookmarks:1", reCallWatches: true, method: "find", onSuccess: "gotBookmarksData", subscribe: true, onWatch:"refreshList"},
		{name: "list", kind: "DbList", flex: 1, desc: true, onQuery:"bookmarksQuery", onSetupRow: "listSetupRow", components: [
			{name: "item", kind: "SwipeableItem", className: "toaster-item", layoutKind: "HFlexLayout", align: "center", tapHighlight: true, onclick: "itemClick", onConfirm: "deleteItem", components: [
				{className: "item-thumb-container", components: [
					{name: "icon", className: "item-image", kind: "Image"},
					{className: "item-image-frame"}
				]},
				{kind: "VFlexBox", flex: 1, pack: "center", components: [
					{name: "title", className: "url-item-title enyo-text-ellipsis"},
					{name: "url", className: "url-item-url enyo-item-ternary enyo-text-ellipsis"}
				]},
				{name: "infoIcon", className: "bookmark-edit", kind: "Image", src: "images/bookmark-info-icon.png", onclick: "itemEdit"}
			]}
		]},
		{kind: "Toolbar", components: [
			{kind: "GrabButton", onclick: "doClose"},
			{flex: 1, kind: "Control"},
			{icon: "images/chrome/menu-icon-add.png", onclick: "doAddBookmark", style: "margin-right:10px; top:1px"}
		]}
	],
	listSetupRow: function(inSender, inRowItem, inIndex) {
		this.$.item.domStyles["border-top"] = inIndex == 0 ? "0" : null;
		var icon = inRowItem.iconFile32 || inRowItem.thumbnailFile;
		this.$.icon.showing = Boolean(icon);
		this.$.icon.domAttributes.src = icon;
		this.$.title.content = inRowItem.title || "";
		this.$.url.content = inRowItem.url || "";
	},
	itemClick: function(inSender, inEvent, inIndex) {
		var msg = this.$.list.fetch(inIndex);
		this.doSelectItem(msg);
	},
	itemEdit: function(inSender, inEvent) {
		var msg = this.$.list.fetch(inEvent.rowIndex);
		this.doEditItem(msg);
		return true;
	},
	deleteItem: function(inSender, inIndex) {
		var msg = this.$.list.fetch(inIndex);
		this.doDeleteItem(msg);
	},
	gotBookmarksData: function(inSender, inResponse, inRequest) {
		this.$.list.queryResponse(inResponse,inRequest);
	},
	bookmarksQuery: function(inSender, inQuery) {
		return this.$.bookmarksService.call({query:inQuery});
	},
	refreshList: function(inSender, inWatch) {
		this.$.list.refresh();
	}
});
