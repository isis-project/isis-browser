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
        title: $L("Email"), 
        image: "images/icons/email-32x32.png", 
        type: "email"
    },{
        title: $L("Messaging"), 
        image: "images/icons/messaging-32x32.png",
        type: "messaging"
    },{
        title: "Facebook",
        image: "images/icons/facebook-32x32.png",
        type: "facebook"
    }],
    components: [{
		name: "launchApplicationService",
        kind: enyo.PalmService,
        service: enyo.palmServices.application,
        method: "open"
    },{
        name: "shareMessage",
        content: $L("Share Link"),
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
                    name: "icon",
                    kind: "Image",
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
        if (shareServiceType === "email") {
            this.shareLinkViaEmail();
        } else if (shareServiceType === "messaging") {
            this.shareLinkViaMessaging();
        } else if (shareServiceType === "facebook") {
            this.shareLinkViaFacebook();
        }
        this.close();
    },
    shareLinkViaEmail: function () {
	    var msg = $L("Here's a website I think you'll like: <a href=\"{$src}\">{$title}</a>");
		msg = enyo.macroize(msg, {src: this.url, title: this.title || this.url});
		var params = {
			summary: $L("Check out this web page..."),
			text: msg
		};
		this.log(params.text);
		this.$.launchApplicationService.call({id: "com.palm.app.email", params: params});
    },
    shareLinkViaMessaging: function () {
        var params = {
            compose: {
                messageText: $L("Check out this web page: ") + this.url
            }
        };
        this.log(params.compose.messageText);
        this.$.launchApplicationService.call({id: "com.palm.app.messaging", params: params});
    },
    shareLinkViaFacebook: function () {
        this.log("sharing via facebok");
        var params = {
            type: "status",
            statusText: $L("Check out this web page: ") + this.url
        };
        this.log(params.statusText);
        this.$.launchApplicationService.call({id: "com.palm.app.enyo-facebook", params: params});
    }
});
