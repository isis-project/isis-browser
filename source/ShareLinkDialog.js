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
    name: "ShareLinkDialog",
    kind: "AcceptCancelPopup",
    onResponse: "shareLinkResponse",
    onClose: "closeShareLink",
    events: {
        onShareClicked: ""
    },
    components: [
        {name: "shareMessage", className: "enyo-modaldialog-title"},
        {name: "shareList", kind: "VirtualRepeater", onSetupRow: "getItem", components: [{
                kind: "HFlexBox",
                components: [{
                    name: "caption",
                    flex: 1
                }, {
                    name: "button",
                    kind: "Button",
                    type: "",
                    onclick: "buttonClick"
                }]   
            }]
        }
    ],
    getItem: function (inSender, inIndex) {
        this.$.shareMessage.setContent("Share link via");
        if (inIndex < 1) {
            this.$.caption.setContent("Email");
            this.$.button.type = "email",
            this.$.button.setCaption("ok");
            return true
        }
    },
    buttonClick: function (inSender, inEvent) {
        var button = inSender;
        this.log("in button click");
        this.log("button type - " + button.type);
        this.doShareClicked(button.type);
        this.close();
    },
    shareLinkResponse: function(inAccept) {
        this.log("response");
    },
    closeShareLink: function() {
        this.log("close share");
    }
});
