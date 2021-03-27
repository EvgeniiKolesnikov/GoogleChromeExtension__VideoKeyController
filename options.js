//chrome.storage.sync.clear();

var checkStatus = false;
var buttonCheck;
var buttonImg;
var timeSelect;
var volumeSelect;

document.addEventListener('DOMContentLoaded', restore_options);
getElements();

function getElements() {
  buttonCheck = document.getElementsByClassName('buttonSettings-check')[0];
  buttonImg = document.getElementById("buttonSettings-check-pic");
  timeSelect = document.getElementById("timeSelect");
  volumeSelect = document.getElementById('volumeSelect');

  buttonCheck.addEventListener('click', checkUncheck);
  timeSelect.addEventListener('change', save_options);
  volumeSelect.addEventListener('change', save_options);
}

function checkUncheck() {
	checkStatus = !checkStatus;
	save_options();
}

function restore_options() {
  chrome.storage.sync.get({
    globalFocus: true,
    stepTime: 5,
    stepVolume: 5
  }, function (result) {
    checkStatus = result.globalFocus;
    timeSelect.value = result.stepTime;
    volumeSelect.value = result.stepVolume;
    chooseSwitchPic();
  }); 
}

function save_options() {
  let stepTime = Number(timeSelect.value);
  let stepVolume = Number(volumeSelect.value);
  chrome.storage.sync.set({
      globalFocus: checkStatus,
      stepTime: stepTime,
      stepVolume: stepVolume
    },
    function (result) {
      chooseSwitchPic();
    });
}

function chooseSwitchPic() {
  if (checkStatus) {
    //console.log('checked');
    buttonImg.src="/pics/checkOn.png";
  } else {
    //console.log('unchecked');
    buttonImg.src="/pics/checkOff.png";
  }
}


