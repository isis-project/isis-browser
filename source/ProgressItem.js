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
	name: "ProgressItem",
	kind: enyo.ProgressBar,
	className: "",
	layoutKind: "VFlexLayout",
	create: function() {
		this.inherited(arguments);
		this.$.bar.setClassName("download-progress-item-inner");
		this.$.client.setLayoutKind("HFlexLayout");
		this.$.client.addClass("enyo-progress-pill-client");
		this.$.client.addClass("download-progress-item-client");
		this.$.client.flex = 1;
		this.$.client.align = "center";
	}
});
