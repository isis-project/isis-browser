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
	name: "HistoryList",
	kind: enyo.VFlexBox,
	className: "basic-back",
	dayInMilli:86400000,
	events: {
		onSelectItem: "",
		onDeleteItem: "",
		onClose: ""
	},
	components: [
		{name: "historyService", kind: "DbService", dbKind: "com.palm.browserhistory:1", reCallWatches: true, method: "find", onSuccess: "gotHistoryData", subscribe: true, onWatch:"refreshList"},
		{name:"list", kind:"DbList", flex:1, onQuery:"historyQuery", onSetupRow: "listSetupRow", desc:true, components: [
			{name: "divider", kind: "Divider", showing: false},
			{name: "item", kind: "SwipeableItem", layoutKind: "HFlexLayout", tapHighlight: true, onclick: "itemClick", onConfirm: "deleteItem", components: [
				{name: "icon", kind: "Image", src: "images/header-icon-history.png"},
				{flex: 1, components: [
					{name: "title", className: "url-item-title enyo-text-ellipsis"},
					{name: "url", className: "url-item-url enyo-item-ternary enyo-text-ellipsis"}
				]}
			]}
		]},
		{kind: "Toolbar", components: [
			{kind: "GrabButton", onclick: "doClose"},
			{flex: 1, kind: "Control"}
		]}
	],
	historyQuery: function(inSender, inQuery) {
		inQuery.orderBy = "date";
		return this.$.historyService.call({query:inQuery});
	},
	gotHistoryData: function(inSender, inResponse, inRequest) {
		this.$.list.queryResponse(inResponse,inRequest);
	},
	getDivider: function(inItem) {
		var now = new Date(), then = new Date(inItem.date),ago;
		this.zeroDate(now);
		this.zeroDate(then);
		// days ago
		ago = Math.ceil((now.getTime() - then.getTime()) / this.dayInMilli);
		if (ago < 7) {
			return {divider:'d', ago:ago};
		}
		// weeks ago
		ago = Math.ceil((now.getTime() - then.getTime()) / (this.dayinMilli*7));
		ago = (now.getMonth() == then.getMonth()) ? ago : 4;
		if (ago < 4) {
			return {divider:'w', ago:ago};
		}
		// months ago
		ago = (now.getMonth() - then.getMonth());
		ago = (now.getFullYear() === then.getFullYear()) ? ago : 12;
		if (ago < 12) {
			return {divider:'m', ago:ago};
		}
		// years ago
		ago = (now.getFullYear() - then.getFullYear());
		return {divider:'y', ago:ago};
	},
	getCurrentDivider: function(inPrev, inCur) {
		var divCur = this.getDivider(inCur);
		var divPrev;
		if (inPrev) {
			divPrev = this.getDivider(inPrev);
		}
		if (!divPrev || divPrev.ago != divCur.ago || divPrev.divider != divCur.divider) {
			return divCur;
		}
	},
	listSetupRow: function(inSender, inItem, inIndex) {
		var prev = this.$.list.fetch(inIndex - 1);
		var divider = this.getCurrentDivider(prev,inItem);
		if (divider) {
			this.$.divider.show();
			this.$.divider.setCaption(this.formatDivider(divider).toUpperCase());
			this.$.item.domStyles["border-top"] = "0";
		} else {
			this.$.divider.hide();
			this.$.item.domStyles["border-top"] = null;
		}
		this.$.icon.showing = Boolean(inItem.title);
		this.$.title.content = inItem.title || "";
		this.$.url.content = inItem.url;
	},
	itemClick: function(inSender, inEvent, inIndex) {
		var item = this.$.list.fetch(inIndex);
		this.doSelectItem(item);
	},
	deleteItem: function(inSender, inIndex) {
		var item = this.$.list.fetch(inIndex);
		this.doDeleteItem(item);
	},
	// make a date represent a rounded down day
	zeroDate: function(inDate) {
		inDate.setHours(0);
		inDate.setMinutes(0);
		inDate.setSeconds(0);
		inDate.setMilliseconds(0);
		return inDate;
	},
	formatDivider: function(inDivider) {
		if (!this._formatter) {
			this._formatter = {
				day:new enyo.g11n.DateFmt(),
				week:new enyo.g11n.Template($L('1#Last Week|##{num} Weeks Ago')),
				month:new enyo.g11n.DateFmt('MMMM')
			};
		}
		var now = new Date(), then = new Date();
		this.zeroDate(now);
		if (inDivider.divider === 'd') {
			then.setTime(now.getTime() - (inDivider.ago * this.dayInMilli));
			this.zeroDate(then);
			return this._formatter.day.formatRelativeDate(then,{relativeDate:now});
		} else if (inDivider.divider === 'w') {
			return this._formatter.week.formatChoice(inDivider.ago,{num: inDivider.ago});
		} else if (inDivider.divider === 'm') {
			then.setMonth(now.getMonth() - inDivider.ago);
			this.zeroDate(then);
			return this._formatter.month.format(then);
		} else {
			return String(now.getFullYear() - inDivider.ago);
		}
	},
	refreshList: function(inSender, inWatch) {
		this.$.list.refresh();
	}
});
