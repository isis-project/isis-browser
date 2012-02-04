enyo.kind({
    name: "ShareLinkDialog",
    kind: "AcceptCancelPopup",
    onResponse: "shareLinkResponse",
    onClose: "closeShareLink",
    components: [
        {name: "shareMessage", className: "browser-dialog-body enyo-text-body "}
    ],
    shareLinkResponse: function(inAccept) {
        this.log("response");
    },
    closeShareLink: function() {
        this.log("close share");
    }
});
