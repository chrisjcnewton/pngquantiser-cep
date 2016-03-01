
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
