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
    acceptCaption: "", // Don't want the accept button, set caption to ""
    events: {
        onShareClicked: ""
    },
    SHARE_LINK_LIST: [{
        title: "Email", 
        image: "images/icons/email-32x32.png", 
        type: "email"
    },{
        title: "Messaging", 
        image: "images/icons/messaging-32x32.png",
        type: "messaging"
    },{
        title: "Facebook",
        image: "images/icons/facebook-32x32.png",
        type: "facebook"
    }],
    components: [{
        name: "shareMessage",
        content: "Share Link",
        className: "enyo-modaldialog-title"
    },{
        kind: "Control",
        className:"box-center",
        style:"margin-top:24px",
        components: [{
            name: "shareList", 
            kind: "VirtualRepeater", 
            onclick: "shareButtonClicked", 
            onSetupRow: "getItem", 
            components: [{
                kind: "Button",
                layoutKind: "HFlexLayout",
                align:"center",
                components: [{
                    kind: "Image",
                    name: "icon",
                    className: "icon-image"
                }, {
                    name: "caption",
                }]   
            }]
        }]
    }],
    url: "",
    title: "",
    init: function (url, title) {
        this.url = url;
        this.title = title;
    },
    getItem: function (inSender, inIndex) {
        if (inIndex < this.SHARE_LINK_LIST.length) {
            if (!this.$.shareMessage.getContent()) {
                this.$.shareMessage.setContent("Share link via");
            }

            var itemDefinition = this.SHARE_LINK_LIST[inIndex];
            this.$.icon.setSrc(itemDefinition.image);
            this.$.caption.setContent(itemDefinition.title);
            return true;
        }
    },
    shareButtonClicked: function (inSender, inEvent) {
        var shareServiceType = this.SHARE_LINK_LIST[inEvent.rowIndex].type;
        this.log("share service type - " + shareServiceType);
        this.doShareClicked(shareServiceType);
        this.close();
    }
});
