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
	name: "CertificateDetail",
	kind: enyo.VFlexBox,
	published: {
		cert: ""
	},
	components: [
		{name: "commonName"},
		{kind:"RowGroup", caption:$L("Issued By"), components:[
			{name:"displayIssuerCommonName"}
		]},
		{kind:"RowGroup", caption:$L("Start Date"), components:[
			{name:"startDate"}
		]},
		{kind:"RowGroup", caption:$L("Expiration Date"), components:[
			{name:"expirationDate"}
		]},
		{kind: "Divider", caption: $L("Subject information")},
		{kind:"RowGroup", name:"subjectAltNameGroup", caption:$L("Subject Alt Name"), components:[
			{name:"subjectAltName"}
		]},
		{kind:"RowGroup", name:"subjectCountryGroup", caption:$L("Country"), components:[
			{name:"subjectCountry"}
		]},
		{kind:"RowGroup", name:"subjectStateGroup", caption:$L("State/Province"), components:[
			{name:"subjectState"}
		]},
		{kind:"RowGroup", name:"subjectLocationGroup", caption:$L("Location"), components:[
			{name:"subjectLocation"}
		]},
		{kind:"RowGroup", name:"subjectOrganizationGroup", caption:$L("Organization"), components:[
			{name:"subjectOrganization"}
		]},
		{kind:"RowGroup", name:"subjectCommonNameGroup", caption:$L("Common Name"), components:[
			{name:"subjectCommonName"}
		]},
		{kind: "Divider", caption: $L("Issuer Information")},
		{kind:"RowGroup", name:"issuerCountryGroup", caption:$L("Country"), components:[
			{name:"issuerCountry"}
		]},
		{kind:"RowGroup", name:"issuerStateGroup", caption:$L("State/Province"), components:[
			{name:"issuerState"}
		]},
		{kind:"RowGroup", name:"issuerLocationGroup", caption:$L("Location"), components:[
			{name:"issuerLocation"}
		]},
		{kind:"RowGroup", name:"issuerOrganizationGroup", caption:$L("Organization"), components:[
			{name:"issuerOrganization"}
		]},
		{kind:"RowGroup", name:"issuerCommonNameGroup", caption:$L("Common Name"), components:[
			{name:"issuerCommonName"}
		]},
		{kind:"RowGroup", caption:$L("Serial Number"), components:[
			{name:"serialNumber"}
		]},
		{kind:"RowGroup", caption:$L("Version"), components:[
			{name:"version"}
		]},
		{kind:"RowGroup", caption:$L("Signature Algorithm"), components:[
			{name:"signatureAlgorithm"}
		]},
//		{kind:"RowGroup", caption:$L("Signature"), components:[
//			{name:"signature", kind: "RichText", richContent: false}
//		]},
		{kind:"RowGroup", caption:$L("Public Key Algorithm"), components:[
			{name:"publicKeyAlgorithm"}
		]}
//		{kind:"RowGroup", caption:$L("Public Key"), components:[
//			{name:"publicKey", kind: "RichText", richContent: false}
//		]}
	],
	certChanged: function() {
		var alternate_name="";
		this.cert.displayCommonName = "";
		this.cert.displayIssuerCommonName = "";
		
		if(this.cert.subject) {
			this.cert.displayCommonName = this.cert.subject.commonname ? this.cert.subject.commonname : this.cert.subject.organization;
		}
		if(this.cert.issuer) {
			this.cert.displayIssuerCommonName = this.cert.issuer.commonname ? this.cert.issuer.commonname : this.cert.issuer.organization;
		}
		
		if(this.cert.displayCommonName) {
			this.$.commonName.setContent(enyo.string.escapeHtml(this.cert.displayCommonName));
		}
		else {
			for(var j in this.cert.subject.altname){
				alternate_name += this.cert.subject.altname[j] + ' ';
			}
			this.$.certName.setContent(enyo.string.escapeHtml(alternate_name));
		}
		
		if(this.cert.displayIssuerCommonName) {
			this.$.displayIssuerCommonName.setContent(enyo.string.escapeHtml(this.cert.displayIssuerCommonName));
		}
		
		if(this.cert.startdate) {
			var dateFormatter = new enyo.g11n.DateFmt({date:'long'});
			this.$.startDate.setContent(dateFormatter.format(new Date(this.cert.startdate)));
		}
		
		if(this.cert.expiredate) {
			var dateFormatter = new enyo.g11n.DateFmt({date:'long'});
			this.$.expirationDate.setContent(dateFormatter.format(new Date(this.cert.expiredate)));
		}
		
		if(this.cert.subject) {
		
			alternate_name="";
			for(var j in this.cert.subject.altname) {
				alternate_name += this.cert.subject.altname[j] + ' ';
			}
			this.$.subjectAltNameGroup.setShowing(alternate_name ? true : false);
			this.$.subjectAltName.setContent(enyo.string.escapeHtml(alternate_name));
		
			this.$.subjectCountryGroup.setShowing(this.cert.subject.country ? true : false)
			this.$.subjectCountry.setContent(enyo.string.escapeHtml(this.cert.subject.country));
		
			this.$.subjectStateGroup.setShowing(this.cert.subject.state ? true : false);
			this.$.subjectState.setContent(enyo.string.escapeHtml(this.cert.subject.state));
		
			this.$.subjectLocationGroup.setShowing(this.cert.subject.location ? true : false);
			this.$.subjectLocation.setContent(enyo.string.escapeHtml(this.cert.subject.location));
		
			this.$.subjectOrganizationGroup.setShowing(this.cert.subject.organization);
			this.$.subjectOrganization.setContent(enyo.string.escapeHtml(this.cert.subject.organization));
		
			this.$.subjectCommonNameGroup.setShowing(this.cert.subject.commonname ? true : false);
			this.$.subjectCommonName.setContent(enyo.string.escapeHtml(this.cert.subject.commonname));
		}
		
		if(this.cert.issuer) {
			this.$.issuerCountryGroup.setShowing(this.cert.issuer.country ? true : false);
			this.$.issuerCountry.setContent(enyo.string.escapeHtml(this.cert.issuer.country));
		
			this.$.issuerStateGroup.setShowing(this.cert.issuer.state ? true : false);
			this.$.issuerState.setContent(enyo.string.escapeHtml(this.cert.issuer.state));
		
			this.$.issuerLocationGroup.setShowing(this.cert.issuer.location ? true : false);
			this.$.issuerLocation.setContent(enyo.string.escapeHtml(this.cert.issuer.location));
		
			this.$.issuerOrganizationGroup.setShowing(this.cert.issuer.organization ? true : false);
			this.$.issuerOrganization.setContent(enyo.string.escapeHtml(this.cert.issuer.organization));
		
			this.$.issuerCommonNameGroup.setShowing(this.cert.issuer.commonname ? true : false);
			this.$.issuerCommonName.setContent(enyo.string.escapeHtml(this.cert.issuer.commonname));
		}
		
		this.$.serialNumber.setContent(enyo.string.escapeHtml(this.cert.serialNumber));
		this.$.version.setContent(enyo.string.escapeHtml(this.cert.version));
		
		if(this.cert.signature) {
			if(this.cert.signature.algorithm) {
				this.$.signatureAlgorithm.setContent(enyo.string.escapeHtml(this.cert.signature.algorithm));
			}
//			this.$.signature.setValue(enyo.string.escapeHtml(this.cert.signature.hexValue));
		}
		
		if(this.cert.publicKey) {
			if(this.cert.publicKey.algorithm) {
				this.$.publicKeyAlgorithm.setContent(enyo.string.escapeHtml(this.cert.publicKey.algorithm));
			}
//			this.$.publicKey.setValue(enyo.string.escapeHtml(this.cert.publicKey.hexValue));
		}
	}
});


enyo.kind({
	name: "CertificateDialog",
	kind: "ModalDialog",
	caption: $L("View Certificate"),
	width: "450px",
	layoutKind: "VFlexLayout",
	published: {
		certFile: ""
	},
	events: {
		onCertLoad: "",
		onClose: ""
	},
	components: [
		{name: "getCertificateDetails", kind:"PalmService", service:"palm://com.palm.certificatemanager/",
			method:"getcertificatedetails",
			onResponse:"handleCertificate"
		},
		{kind: "Scroller", height: "500px", flex: 1,  horizontal: false, autoHorizontal: false, components: [
			{name: "certDetail", kind: "CertificateDetail"}
		]},
		{kind: "HFlexBox", pack: "justify", align: "center", components: [
			{kind: "Button", caption: $L("Done"), flex: 1, className: "enyo-button-dark", onclick: "doClose"}
		]}
	],
	certFileChanged: function() {
//		this.warn("cert file: ", this.certFile);
		this.validateComponents();
		if(this.certFile) {
			this.$.getCertificateDetails.call({'certificateFilename': this.certFile});
		}
	},
	handleCertificate: function(inSender, inResponse) {
//		this.warn("cert details: ", enyo.json.stringify(inResponse));
		if(inResponse.returnValue) {
			this.$.certDetail.setCert(inResponse);
			this.doCertLoad();
		}
	}
});
