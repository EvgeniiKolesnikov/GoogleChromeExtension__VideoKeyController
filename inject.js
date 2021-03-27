// P.S. Kolesnikov E.A. JS Academy 2021
// console.log('=== Video Keys Controller ===');
// console.log('=== for learn.dataart.com ===');
// focus variables
let targetFocus;
let isTargetFocus = false;
let isGlobalFocus = true;

// for observe
let isLoadedContent = false;
let lastTypeOfVideo;

// buttons & sliders
let buttonF;
let buttonPlayPause;
let stepTime = 5;

let buttonSpeed1;
let buttonSpeed2;
let buttonSpeed3;
let buttonSpeed4;

let button1Video;
let button2Video;

let sliderTimeHandle;
let sliderTimeRange;
let sliderVolume;

let buttonV;

//timer
let stepVolume = 5;
let timerVolume = null;
let ms = 500;

// init =====================================
window.onload = function () {
	loadSettings()
	checkPage()
}

function loadSettings() {
	chrome.storage.sync.get({
    globalFocus: true,
    stepTime: 5,
    stepVolume: 5
  }, function (result) {
		isGlobalFocus = result.globalFocus;
    stepTime = result.stepTime;
    stepVolume = result.stepVolume;
		//console.log('stepTime = ', stepTime);
  }); 
}

function checkPage() {
	let targetField = document.getElementById("seq_content");
	if (targetField !== null) {
		eyeOfSauron();
	}
}

function eyeOfSauron() {
	var seqContent = document.getElementById("seq_content");
	const config = { attributes: true, childList: true,	subtree: true	};
	const callback = function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				//console.log(mutation);
				let vp = getE("video-player")[0];
				//console.log('Type vp = ', typeof  vp);
				if (lastTypeOfVideo != typeof vp) {
					lastTypeOfVideo = typeof vp;
					isLoadedContent = false;
				}
				if (!isLoadedContent) {	
					if (lastTypeOfVideo === 'object') {
						// LOAD Video Controller script. load all here ... 
						loadVideoController();
					} else if (lastTypeOfVideo === 'undefined') {
						// RESET Video Controller script. load all here ...
						resetVideoController();
					}
					isLoadedContent = true;
				}
			} 
		}
	};
	
	const observer = new MutationObserver(callback);
	observer.observe(seqContent, config);
	// Later, you can stop observing
	//observer.disconnect();
}

function loadVideoController () {
	//console.log('loadVideoController');
	//console.log('====LOAD=====');
  //console.log('=============');
	loadElements(); 
	loadEvents();
	window.addEventListener('keydown', keyController, false)
}

function resetVideoController() {
	//console.log('resetVideoController');
	//console.log('====RESET====');
  //console.log('=============');
	window.removeEventListener('keydown', keyController, false)
}

function getE(name) {
	return document.getElementsByClassName(name);
}

function loadElements() {
	//console.log('load Elements');
	buttonF = 					getE("control add-fullscreen")[0];
	buttonPlayPause = 	getE("control video_control")[0];

	buttonSpeed1 = 			getE("control speed-option")[0];
	buttonSpeed2 = 			getE("control speed-option")[1];
	buttonSpeed3 = 			getE("control speed-option")[2];
	buttonSpeed4 = 			getE("control speed-option")[3];

	button1Video = 			getE("seq_video")[0];
	button2Video =			getE("seq_video")[2];

	buttonV = 					getE("volume")[0];
	sliderVolume = 			getE('ui-slider-handle volume-handle')[0];

	sliderTimeHandle =	getE('ui-slider-handle progress-handle')[0];
	sliderTimeRange = 	getE('ui-slider-range ui-widget-header')[0];
	targetFocus = 			getE("video closed is-initialized")[0];
}

function loadEvents() {
	sliderTimeHandle.addEventListener("click", refocusOnTarget, false);
	sliderTimeRange.addEventListener("click", refocusOnTarget, false);
	sliderVolume.addEventListener("mouseout", refocusOnTarget, false);
	buttonSpeed1.addEventListener("mouseout", refocusOnTarget, false);
	buttonSpeed2.addEventListener("mouseout", refocusOnTarget, false);
	buttonSpeed3.addEventListener("mouseout", refocusOnTarget, false);
	buttonSpeed4.addEventListener("mouseout", refocusOnTarget, false);
	if (button1Video != undefined) 
		button1Video.addEventListener("click", reloadElements, false);
	if (button2Video != undefined) 
		button2Video.addEventListener("click", reloadElements, false);
}

function refocusOnTarget() {
	//console.log('Button Speed Mouse Out');
	targetFocus.focus();
}

function reloadElements() {
	//console.log("click button 1 or 2 isLoadedContent = false");
	isLoadedContent = false;
}

function checkTargetFocus() {
	targetFocus = getE("video closed is-initialized")[0];
	isTargetFocus = (targetFocus === document.activeElement)	? true : false;
	//hack slider & buttons focus
	if (sliderTimeHandle === document.activeElement) isTargetFocus = true;
	if (buttonPlayPause === document.activeElement) isTargetFocus = true;
	if (sliderVolume === document.activeElement) isTargetFocus = true;
	if (isGlobalFocus) isTargetFocus = true;
	return isTargetFocus;
}

function keyController(e) {
	if (checkTargetFocus()) {
		if ((e.keyCode == '37') || (e.keyCode == '39')) {
			//console.log('Key left - 37 || Key right - 39');
			e.preventDefault();
			switchSliderTime(e.keyCode);	
		}
		if ((e.keyCode == '38') || (e.keyCode == '40')) {
			//console.log('Key up - 38 || Key down - 40');
			e.preventDefault();
			switchSliderVolume(e.keyCode);
		}	
		if (e.keyCode == '32') {
			//console.log('Key space');
			e.preventDefault();
			switchPlayPause();
		}
		if (e.keyCode == '70') {
			//console.log('Key f');
			e.preventDefault();
			switchFullscreen();
		}
	}
}

function switchPlayPause() {
	//console.log('press SPACE for switch');
	buttonPlayPause.click();
}

function switchFullscreen() {
	//console.log('press F for switch');
	buttonF.click();
}

function switchSliderTime(keyCode) {
	//console.log('press Arrow Left/Right for switch Time');
	sliderTimeHandle.focus();
	simulateKeyRepeatPresses(sliderTimeHandle, keyCode, stepTime);
	//targetFocus.focus();
}
function simulateKeyRepeatPresses(element, keyCode, loops) {
	for (let i=1; i<=loops; i++){
		element.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':keyCode} ));
		element.dispatchEvent(new KeyboardEvent('keypress' , {'keyCode':keyCode} ));
	}
}

function switchSliderVolume(keyCode) {
	buttonV.addEventListener('mouseover', function(){});
	buttonV.dispatchEvent(new MouseEvent("mouseover",{}));
  sliderVolume.focus();
	simulateKeyRepeatPresses(sliderVolume, keyCode, stepVolume);
	clearTimeout(timerVolume);
	timerVolume = setTimeout(sliderVolumeHide, ms);
}

function sliderVolumeHide() {
	buttonV.addEventListener("mouseout", function(){});
	buttonV.dispatchEvent(new MouseEvent("mouseout",{}));
	targetFocus.focus();
}