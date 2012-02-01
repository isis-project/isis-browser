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
	name: "BrowserContextMenu",
	kind: "PopupSelect",
	published: {
		view: ""
	},
	events: {
		onItemClick: ""
	},
	tapInfo: {link: true, image: true},
	linkItems: [
		{caption: $L("Open In New Card"), value:"newCardClick"},
		{caption: $L("Share Link"), value:"shareLinkClick"},
		{caption: $L("Copy URL"), value:"copyLinkClick"}
	],
	imageItems: [
		{caption: $L("Copy To Photos"), value: "copyToPhotosClick"},
		{caption: $L("Share Image"), value: "shareImageClick"},
		{caption: $L("Set Wallpaper"), value: "setWallpaperClick"}
	],
	openAtTap: function(inEvent, inTapInfo) {
		this.tapPosition = {left: inEvent.pageX, top: inEvent.pageY};
		this.tapInfo = inTapInfo;
		if (!this.view) {
			return;
		}
		var items = this.makeItems();
		if (items) {
			this.setItems(items);
			this.openNear(this.tapPosition);
		}
	},
	makeItems: function() {
		var items;
		if (this.tapInfo.isLink) {
			var uri = enyo.uri.parseUri(this.tapInfo.linkUrl);
			if (uri.scheme && enyo.uri.isValidScheme(uri)) {
				items = [].concat(this.linkItems);
			}
		}
		if (this.tapInfo.isImage) {
			items = (items || []).concat(this.imageItems);
		}
		return items;
	},
	menuItemClick: function(inSender) {
		this.doItemClick(inSender.getValue(), this.tapInfo, this.tapPosition);
		this.close();
	}
});
