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
	name: "MimeIcon",
	kind: enyo.Image,
	published: {
		mimeType: ""
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.mimeTypeChanged();
	},
	iconsByMimeType: {
		"audio": "audio",
		"image": "image",
		"video": "video",
		"text": {
			"x-vcard": "vcard"
		},
		"application": {
			"msword": "word",
			"pdf": "pdf",
			"vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
			"excel": "xls",
			"x-excel": "xls",
			"x-msexcel": "xls",
			"vnd.ms-excel": "xls",
			"vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xls",
			"vnd.openxmlformats": "xls",
			"powerpoint": "ppt",
			"mspowerpoint": "ppt",
			"x-mspowerpoint": "ppt",
			"vnd.ms-powerpoint": "ppt",
			"vnd.openxmlformats-officedocument.presentationml.presentation": "ppt"
		}
	},
	mimeTypeChanged: function() {
		if (this.mimeType) {
			var m = this.mimeType.split("/", 2);
			var r = this.iconsByMimeType[m[0]];
			if (r && typeof r !== "string") {
				r = r[m[1]];
			}
			if (r) {
				this.setSrc("images/mime-icon-" + r + ".png");
			} else {
				this.setSrc("images/mime-icon-download.png");
			}
		} else {
			this.setSrc("images/mime-icon-download.png");
		}
	}
});
