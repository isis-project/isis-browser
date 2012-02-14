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
	name: "AddressInput",
	kind: enyo.HFlexBox,
	align: "center", 
	published: {
		url: "",
		loading: false
	},
	events: {
		onBlur: "",
		onInputChange: "",
		onGo: "",
		onStop: "",
		onRefresh: ""
	},
	chrome: [
		
		{kind: "InputBox", layoutKind: "HFlexLayout", flex: 1, className: "enyo-tool-input", focusClassName: "enyo-tool-input-focus", spacingClassName: "enyo-tool-input-spacing", components: [
			{name: "secureLock", kind: enyo.CustomButton, showing: false, className: "secure-lock"},
			
			{name: "userinput", kind: "Input", flex: 1, styled: false, inputType: "url", width: "100%", spellcheck: false, autocorrect: false, autoCapitalize: "lowercase", autoWordComplete: false, hint: $L("Enter URL or search terms"), selectAllOnFocus: true,
				onfocus: "selectInput",
				onblur: "deselectInput",
				onkeydown: "inputKeydown",
				oninput: "inputChange",
			},
			{name: "refreshButton", kind: "CustomButton", showing: false, className: "addressbar-button refresh-button", onclick: "doRefresh"},
			{name: "clearButton", kind: "CustomButton", showing: true, className: "addressbar-button stop-button", onmousedown: "clearInput"},
			{name: "stopButton", kind: "CustomButton", showing: false, className: "addressbar-button stop-button", onclick: "doStop"}
		]}
	],
	//* @protected
	_leftButton: "",
	_rightButton: "clearButton",
	selectInput: function() {
		this.changeButtons();
	},
	deselectInput: function() {
		if (this.$.userinput.getValue() === "") {
			this.$.userinput.setValue(this.url);
		}
		this.changeButtons();
		this.doBlur();
	},
	inputChange: function(inSender, inEvent, inValue) {
		this.changeButtons();
		this.doInputChange(inValue);
	},
	inputKeydown: function(inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.go();
		}
	},
	urlChanged: function() {
		if (this.url) {
			if (!this.hasFocus()) {
				this.$.userinput.setValue(this.url);
			}
			this.changeButtons();
		}
	},
	loadingChanged: function() {
		this.changeButtons();
	},
	changeButtons: function() {
		this.showLeftButton("");
		if (this.hasFocus() && this.$.userinput.getValue().length >= 0) {
			this.showRightButton("clearButton");
		} else {
			if (this.url.toLowerCase().substring(0, 8) === "https://") {
				this.showLeftButton("secureLock");
			}
			if (this.loading) {
				this.showRightButton("stopButton");
			} else {
				this.showRightButton("refreshButton");
			}
		}
	},

	// need an IxD for secure lock icon (wireframe b5)
	showLeftButton: function(inButton) {
		this.showButton(inButton, this._leftButton);
		this._leftButton = inButton;
	},

	showRightButton: function(inButton) {
		this.showButton(inButton, this._rightButton);
		this._rightButton = inButton;
	},
	showButton: function(inButton, inOldButton) {
		if (inOldButton !== "") {
			this.$[inOldButton].hide();
		}
		if (inButton !== "") {
			this.$[inButton].show();
		}
	},
	go: function() { 
		this.setLoading(true);
		var value = this.getUserInput(true);
		this.doGo(value);
		document.activeElement.blur();
	},
	getUserInput: function(inRaw) {
		var value = enyo.string.trim(this.$.userinput.getValue());
		if (!inRaw) {
			return enyo.string.escapeHtml(value);
		} else {
			return value;
		}
	},
	clearInput: function() {
		this.$.userinput.setValue("");
		// input is blurred here causing the keyboard to reappear
		this.$.userinput.forceFocus();
	},
	forceFocus: function() {
		this.$.userinput.forceFocus();
	},
	//* public
	hasFocus: function() {
		return document.activeElement.tagName == "INPUT";
	}
});
