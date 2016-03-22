
(function(){
	window.addEventListener('load', init, false);

	var cs, tmpFolderPath, imageCanvas, loader, loaderCover, imagePanArea, originalFileSize,saveImageBut, currentImageSelected = '', customColourInput;
	var fs = require('fs');

	function init(){
		cs = new CSInterface();
		var extPath = cs.getSystemPath(SystemPath.EXTENSION);
		var jsxPath = extPath + "/ext/tool.jsx";
		cs.evalScript( '$.evalFile( "' +jsxPath+ '")' );

		saveImageBut = document.querySelector('#saveImageBut');
		saveImageBut.addEventListener('click', onSaveClicked, false);
		loader = document.querySelector('#loader');
		loaderCover = document.querySelector('#loader-cover');

		imageCanvas = document.querySelector('#imageCanvas');
		imageCanvas.width = 800;
		imageCanvas.height = 600;

		setAppTheme(null);
		cs.addEventListener( CSInterface.THEME_COLOR_CHANGED_EVENT, setAppTheme );

		var reloadBut = document.querySelector('#reload');
		reloadBut.addEventListener('click', function(){window.location.reload();}, false);

		var getImageBut = document.querySelector('#getImageBut');
		getImageBut.addEventListener('click', function(){
			loader.classList.add('show');
			loaderCover.classList.add('show');
			setTimeout(function(){
				deleteFolderRecursive(getTmpFolderPath());
				var js = "$.saveCurrPSImage('"+getTmpFolderPath()+"')";
				cs.evalScript( js , onPSImageSaved);
			},10);
		}, false);

		var colourButtons = document.querySelectorAll('.colourBut');

		for(var i=0; i< colourButtons.length; i++){
			colourButtons[i].addEventListener('click',onColourButClicked,false);
		}

		var zoomInButton = document.querySelector('#zoom-in');
		var zoomOutButton = document.querySelector('#zoom-out');
		var zoomResetButton = document.querySelector('#zoom-reset');
		var zoom100PercButton = document.querySelector('#zoom-100perc');

		zoomInButton.addEventListener('click', function(){
			imagePanArea.zoomIn();
		}, false);

		zoomOutButton.addEventListener('click', function(){
			imagePanArea.zoomOut();
		}, false);

		zoomResetButton.addEventListener('click', function(){
			var quantFilePath = getTmpFolderPath() + "orig-tmp"+currentImageSelected+".png";
			imagePanArea.resetImage( quantFilePath );
		}, false);

		zoom100PercButton.addEventListener('click', function(){
			imagePanArea.zoom1to1();
		}, false);

		var bgColorTrans = document.querySelector('.bg-color-button.transparent');
		bgColorTrans.addEventListener('click', function(){
			imageCanvas.removeAttribute('style');
		}, false);
		var bgColorGrey = document.querySelector('.bg-color-button.grey');
		bgColorGrey.addEventListener('click', function(){
			imageCanvas.style.background = "#818181";
		}, false);
		var bgColorRed = document.querySelector('.bg-color-button.red');
		bgColorRed.addEventListener('click', function(){
			imageCanvas.style.background = "red";
		}, false);
		var bgColorGreen = document.querySelector('.bg-color-button.green');
		bgColorGreen.addEventListener('click', function(){
			imageCanvas.style.background = "green";
		}, false);
		var bgColorBlue = document.querySelector('.bg-color-button.blue');
		bgColorBlue.addEventListener('click', function(){
			imageCanvas.style.background = "blue";
		}, false);
		var bgColorBlack = document.querySelector('.bg-color-button.black');
		bgColorBlack.addEventListener('click', function(){
			imageCanvas.style.background = "black";
		}, false);
		var bgColorWhite = document.querySelector('.bg-color-button.white');
		bgColorWhite.addEventListener('click', function(){
			imageCanvas.style.background = "white";
		}, false);

		customColourInput = document.querySelector("#custom-colour-input");
		customColourInput.addEventListener('keydown', function(e){
			if( e.keyCode != 13 ) return;
			if(!checkValidColour(e.target.value)) return;
			resetColourDepthButtons();
			document.querySelector('#custom').classList.add('pressed');
			checkIfQuantFileExists(e.target.value);
		}, false);

	}

	function checkValidColour(colorValue){
		if(colorValue > 256 || colorValue < 2){
			alert("Only numbers between 2 and 256 are allowed!");
			customColourInput.value = 2;
			return false;
		}
		if(colorValue % 1 > 0){
			alert("Only whole numbers are allowed!");
			customColourInput.value = 2;
			return false;
		}
		return true;

	}

	function onSaveClicked(){
		var js = "$.saveDialog()";
		cs.evalScript( js, function(result){
			if(result == 'cancelled'){
				console.log('nothing entered');
			}else{
				console.log(result);

				var source = fs.createReadStream(getTmpFolderPath()+'orig-tmp'+currentImageSelected+'.png');
				var dest = fs.createWriteStream(result);

				source.pipe(dest);
				source.on('end', function() { console.log('Finished'); });
				source.on('error', function(err) { console.log('Error = '+err); });

			}
		});

	}

	function deleteFolderRecursive(path) {
		if( fs.existsSync(path) ) {
			fs.readdirSync(path).forEach(function(file,index){
				var curPath = path + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}

	function onColourButClicked(e){
		resetColourDepthButtons();
		e.target.classList.add('pressed');
		var butId = e.target.innerHTML;

		if(butId === "Custom"){
			butId = customColourInput.value;
			if(!checkValidColour(butId)) return;
		}
		checkIfQuantFileExists(butId);

	}

	function checkIfQuantFileExists(butId){
		var quantFilePath = getTmpFolderPath() + "orig-tmp-"+butId+".png";
		if(fs.existsSync(quantFilePath)){
			console.log(butId+' exists ');
			imagePanArea.updateImage( quantFilePath );
			var stats = fs.statSync(quantFilePath);
			calculatePercentages(stats.size);
			currentImageSelected = (butId === 'original')? "" : "-"+butId;
		}else{
			loader.classList.add('show');
			loaderCover.classList.add('show');
			generateQuantisedImage(butId);
			console.log(butId+' does not exist');
		}
	}

	function generateQuantisedImage(colourDepth){
		console.log(colourDepth);
		if(colourDepth === 'original'){
			imagePanArea.updateImage( getTmpFolderPath() + "orig-tmp.png" );
			loader.classList.remove('show');
			loaderCover.classList.remove('show');
			var stats = fs.statSync(getTmpFolderPath() + "orig-tmp.png")
			calculatePercentages(stats.size);
			currentImageSelected = '';
			return;
		}
		var osInfo = cs.getOSInformation();

		var pngQuantBinName;

		if(osInfo.indexOf('Windows') > -1){
			console.log('This is windows');
			pngQuantBinName = '/pngquant/pngquant.exe';
		}else if(osInfo.indexOf('Mac') > -1){
			console.log('This is mac');
			pngQuantBinName = '/pngquant/pngquant';
		}

		var arg0 = cs.getSystemPath(SystemPath.EXTENSION) + pngQuantBinName;
		var arg1 = "--ext";
		var arg2 = "-"+ colourDepth + ".png";
		var arg3 = ""+colourDepth+"";
		var arg4 = getTmpFolderPath()+"orig-tmp.png";
		currentImageSelected = "-"+colourDepth;

		var proc = window.cep.process.createProcess(arg0, arg1, arg2, arg3, arg4);

		window.cep.process.onquit(proc.data, function(){
			console.log('process finished');
			var quantFilePath = getTmpFolderPath() + "orig-tmp-"+colourDepth+".png";
			imagePanArea.updateImage( quantFilePath );
			loader.classList.remove('show');
			loaderCover.classList.remove('show');

			var stats = fs.statSync(quantFilePath);
			calculatePercentages(stats.size);
		});

		window.cep.process.stdout(proc.data,function(line){
			console.log("stdout");
			console.log(line);
		});
		window.cep.process.stderr(proc.data,function(line){
			console.log("stderr");
			console.log(line);
		});
	}

	function calculatePercentages(noOfBytes){
		var fileSizes = noOfBytes + " Bytes<br>"+ (noOfBytes/1024).toPrecision(3) + " KBytes<br>"+ (noOfBytes/1024/1024).toPrecision(2) + " MBytes";
		document.querySelector('#file-size').innerHTML = fileSizes;
		var percSaved = 100 - ((noOfBytes / originalFileSize )*100);
		document.querySelector('#perc-saved').innerHTML = Math.floor(percSaved) + "% Saved";
	}

	function onPSImageSaved(tmpImgPath){
		//console.log(imageCanvas);
		//console.log(tmpImgPath);

		if(tmpImgPath === 'no doc open'){
			alert('There is no document open');
			loader.classList.remove('show');
			loaderCover.classList.remove('show');
			return;
		}

		var buttons = document.querySelectorAll('button');
		for(var i=0; i<buttons.length; i++){
			buttons[i].removeAttribute('disabled');
		}


		customColourInput.removeAttribute('disabled');

		var stats = fs.statSync(tmpImgPath)
		originalFileSize = stats.size;
		//calculatePercentages(originalFileSize);

		resetColourDepthButtons();
		document.querySelector('#default').classList.add('pressed');

		loader.classList.remove('show');
		loaderCover.classList.remove('show');

		if(imagePanArea){
			imagePanArea.resetImage(tmpImgPath);
		}else{
			imagePanArea = PanZoom(imageCanvas, tmpImgPath);
		}
		// default to 256 compression
		generateQuantisedImage('256');

	}

	function resetColourDepthButtons(){
		var colourButtons = document.querySelectorAll('.colourBut');
		for(var i=0; i< colourButtons.length; i++){
			if(colourButtons[i].classList.contains('pressed')){
				colourButtons[i].classList.remove('pressed')
			}
		}
	}

	function getTmpFolderPath() {
		if (tmpFolderPath == null) {
			//tmpFolderPath = cs.getSystemPath(SystemPath.EXTENSION) + '/tmp/';
			tmpFolderPath = cs.getSystemPath(SystemPath.USER_DATA) + '/tmp/';
			console.log(tmpFolderPath);
		}
		return tmpFolderPath;
	}

	function setAppTheme(e) {
		var hostEnv = window.__adobe_cep__.getHostEnvironment();
		var skinInfo = JSON.parse(hostEnv).appSkinInfo;
		var color = skinInfo.panelBackgroundColor.color;
		var avg = (color.red+color.blue+color.green) / 3;
		var type = (avg > 128) ? "light" : "dark";
		document.getElementById("topcoat-style").href = "css/topcoat-desktop-" + type + ".css";
		document.getElementById("main-style").href = "css/main-" + type + ".css";
		var rgb = "rgb(" +
		Math.round(color.red) 	+ "," +
		Math.round(color.green)	+ "," +
		Math.round(color.blue)	+ ")";
		document.body.style.backgroundColor = rgb;
	}

})();
