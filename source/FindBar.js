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
	name: "FindBar",
	kind: enyo.HFlexBox,
	events: {
		onFind: "",
		onGoToPrevious: "",
		onGoToNext: ""
	},
	components: [
		{kind: "Input", name: "input", flex: 2, autoCapitalize: "lowercase", changeOnKeypress: true, onchange: "inputChange"},
		{flex: 1},
		{kind: "NoFocusButton", name: "prev", caption: $L("prev"), disabled: true, onclick: "findPrevious"},
		{kind: "NoFocusButton", name: "next", caption: $L("next"), disabled: true, onclick: "findNext"},
		{kind: "NoFocusButton", caption: "done", onclick: "close"}
	],
	//* @protected
	showingChanged: function() {
		this.inherited(arguments);
		if (this.showing) {
			this.$.input.forceFocus();
		}
	},
	inputChange: function() {
		var value = this.$.input.getValue();
		var disabled = value.length < 2;
		this.$.prev.setDisabled(disabled);
		this.$.next.setDisabled(disabled);
		if (!disabled) {
			this.doFind(value);
		}
	},
	findPrevious: function() {
		this.doGoToPrevious();
	},
	findNext: function() {
		this.doGoToNext();
	},
	close: function() {
		this.log();
		this.$.input.forceBlur();
		this.hide();
	}
});
