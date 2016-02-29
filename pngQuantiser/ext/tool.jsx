
if (typeof($)=='undefined') {
	$ = {};
}


/*
* Photoshop
*/

$.saveCurrPSImage = function(thePath) {
	var tmpFolder = new Folder(thePath);
	if(!tmpFolder.exists){
		tmpFolder.create();
	}
	try{
		var currDoc = app.activeDocument;
		var currDialogs = app.displayDialogs;
		app.displayDialogs = DialogModes.NO;

		var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
		exportOptionsSaveForWeb.format = SaveDocumentType.PNG;
		exportOptionsSaveForWeb.PNG8 = false;
		exportOptionsSaveForWeb.quality = 100;

		var documentPath = thePath+'orig-tmp.png';
		var file = new File(documentPath);

		currDoc.exportDocument (file, ExportType.SAVEFORWEB, exportOptionsSaveForWeb);

		app.displayDialogs = currDialogs;
		return documentPath;
	}catch(e){
		//$.writeln('no doc open');
		return 'no doc open';
	}
};

$.saveDialog = function(){
	var savedfileObj = File.saveDialog ('Choose a location to save your quantised PNG');
	if(savedfileObj){
		return savedfileObj.fsName;
	}
	return 'cancelled';
};


//
// var xLib;
// try {
// 	xLib = new ExternalObject("lib:\PlugPlugExternalObject");
// } catch(e) { alert("Missing ExternalObject: "+e); }
//
// // ツールVMからカスタムイベントを発送
// $.sendEvent = function(type) {
// 	if (xLib) {
// 		var eventObj = new CSXSEvent();
// 		eventObj.type = type;
// 		eventObj.data = app.toString();
// 		eventObj.dispatch();
// 	}
// }
//
//
//
//
//
// $.run_ILST = function() {
// 	alert("ハローワールド！ \n by Illustrator")
// }
//
// $.run_AEFT = function() {
// 	alert("ハローワールド！ \n by After Effects")
// }
//
// $.run_PPRO = function() {
// 	alert("ハローワールド！ \n by Premiere Pro")
// }
//
// $.run_PRLD = function() {
// 	alert("ハローワールド！ \n by Prelude")
// }
//
// $.run_IDSN = function() {
// 	alert("ハローワールド！ \n by InDesign")
// }
//
// $.run_AICY = function() {
// 	alert("ハローワールド！ \n by InCopy")
// }
