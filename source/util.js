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

enyo.uri = {
	parseUri: function(inText) {
		var keys = ["source","scheme","authority","userinfo","host","tld","port","path","query","fragment"];
		var re = /^(?:([^:\/\?#@\d]+):)?(?:\/\/)?((?:([^\/\?#]*)@)?([^\/\?#:]*\.([^\/\?#:]*))(?::(\d*))?)?([^\?#]*)(?:\\\?([^#]*))?(?:#(.*))?/;
		var a = re.exec(inText);
		var parsed = {};
		for (var i=0; i<keys.length; i++) {
			parsed[keys[i]] = a[i];
		}
		return parsed;
	},
	isValidUri: function(inUri) {
		// consider valid if user specified a scheme
		if (inUri.scheme) {
			return true;
		}
		// consider inHost valid if the host looks like an IP
		if (inUri.host) {
			var re = /^((?:\d){1,3})\.((?:\d){1,3})\.((?:\d){1,3})\.((?:\d){1,3})$/;
			var a = re.exec(inUri.host);
			if (a && a[1] < 256 && a[2] < 256 && a[3] < 256 && a[4] < 256) {
				return true;
			}
		}
		// consider inHost valid if its suffix is a valid TLD
		if (inUri.tld) {
			for (var i=0,t;t=enyo.uri.tld[i];i++) {
				if (inUri.tld.toLowerCase() === t) {
					return true;
				}
			}
		}
	},
	isValidScheme: function(inUri) {
		var scheme = inUri.scheme ? inUri.scheme.toLowerCase() : "";
		if (!scheme || scheme === "http" || scheme === "https" || scheme === "data" || scheme === "ftp" || scheme === "about") {
			return true;
		}
	}
};
