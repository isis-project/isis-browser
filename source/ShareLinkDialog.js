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
    events: {
        onShareClicked: ""
    },
    SHARE_LINK_LIST: [
        {title: "Email", image: "/email.png", type: "email"},
        {title: "Messaging", image: "/messaging.png", type: "messaging"},
        {title: "Facebook", image: "/facebook.png", type: "facebook"},
        {title: "Twitter", image: "/twitter.png", type: "twitter"} 
    ],
    components: [
        {name: "shareMessage", content: "Share link via", className: "enyo-modaldialog-title"},
        {name: "shareList", kind: "VirtualRepeater", onSetupRow: "getItem", components: [{
                kind: "HFlexBox",
                components: [{
                    name: "caption",
                    flex: 1
                }, {
                    name: "button",
                    kind: "Button",
                    onclick: "buttonClick"
                }]   
            }]
        }
    ],
    url: "",
    title: "",
    init: function (url, title) {
        this.url = url;
        this.title = title;
    },
    getItem: function (inSender, inIndex) {
        if (inIndex < this.SHARE_LINK_LIST.length) {
            this.$.shareMessage.setContent("Share link via");

            var itemDefinition = this.SHARE_LINK_LIST[inIndex];
            this.$.caption.setContent(itemDefinition.title);
            this.$.button.setCaption("ok");
            this.$.button.type = itemDefinition.type;
            return true;
        }
    },
    buttonClick: function (inSender, inEvent) {
        var shareServiceType = this.SHARE_LINK_LIST[inEvent.rowIndex].type;
        this.log("share service type - " + shareServiceType);
        this.doShareClicked(shareServiceType);
        this.close();
    }
});
