const timerMs = 30;
const formNameKey = 'woi-popup-2025';
const formName = 'WOI Live Live Event-0710';
const pageName = 'WOI-blog';
const TEST = 0;
var popupTimer = null;
// const bd = document.querySelector('body')
// for WOI blog, $ is used..
const jQuery = $;
const formEl = jQuery('#popupForm')
const signupModal = jQuery('#signupModal')
const emailIframeId = 'bf-signup-iframe';
const formId = '296';
const formUrl = 'https://new-tourapi.walks.org/blog/357';
let g_FormData;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/i;
const _dataLayer = window.dataLayer || [];
const actionStr = "Black Friday form sign-up WOI - " + location.href
function trackFormSubmit() {
  jQuery('#signupModal').trigger('FormSubmit');
}

function initPopup() {
  if (TEST && !location.href.includes('preview=true')) {
    console.log('Popup Test Mode');
    return;
  }
  jQuery('body').mouseleave(() => tryPopupForm())
  jQuery('#popupForm .overlay').click(() => hidePopupForm());
  jQuery('#popupForm .close-circle-icon').click(() => hidePopupForm());
  jQuery('#signupModal .overlay').click(() => closeModal());
  jQuery('#popupSignBtn').click(() => signup());

  setupPopupTimer()
  
  // jQuery('.footer__copy').click(() => displayPopupForm());
}



async function tryPopupForm () {
  // console.log('try popup')
  // return
  if (TEST && !location.href.includes('preview=true')) {
    return;
  }
  if (checkFormPopped()) {
    console.log('form already poped')
    return;
  }
  
  displayPopupForm();
}

function setupPopupTimer () {
  clearTimeout(popupTimer)
  const timer = timerMs * 1000
  popupTimer = setTimeout(() => tryPopupForm(), timer)
  console.debug('timer set ', timerMs, 's')
}

function checkFormPopped () {
  const formsStr = localStorage.getItem(formNameKey)
  const formsMap = JSON.parse(formsStr) || {}
  // console.log('checking formsMap:', formsMap)
  // return formsMap[formName] && formsMap[formName].includes(pageName)
  return formsMap[formName]
}

function setFormPopped() {
  const formsStr = localStorage.getItem(formNameKey)
  const formsMap = JSON.parse(formsStr) || {}
  if (!formsMap[formName]) {
    formsMap[formName] = []
  }
  if (!formsMap[formName].includes(pageName)) {
    formsMap[formName].push(pageName)
    localStorage.setItem(formNameKey, JSON.stringify(formsMap))
  }
}

function displayPopupForm () {
  setFormPopped()
  formEl.removeClass('nodisplay')
}

function hidePopupForm () {
  formEl.addClass('nodisplay')
}

function setLoading () {
  jQuery('#popupSignBtn').text('Please wait...')
}

function cancelloading () {
  jQuery('#popupSignBtn').text('Yes, I want early access!')
}

function showModal (isSuccess) {
  if (isSuccess) {
    jQuery('#signupModal .modal-title').text('Thank you for signing up.');
    jQuery('#signupModal .modal-text').text('Thank you for signing up. Keep an eye on your email! Happy travels!');
	jQuery('#signupModal .modal-btn').click(() => {
		closeModal();
		hidePopupForm();
	});
  } else {
    jQuery('#signupModal .modal-title').text('Sorry');
    jQuery('#signupModal .modal-text').text('but you don’t seem to have entered a valid email address. Can you please check and try it again. Thanks');
	jQuery('#signupModal .modal-btn').click(() => closeModal());
  }
  signupModal.removeClass('nodisplay')
}

function closeModal () {
  signupModal.addClass('nodisplay')
}


function signup() {
	// WOI / Blog pop up for live event  https://walks-llc.atlassian.net/browse/WLK-7679 
	const liveEventUrl = 'https://walks.webinargeek.com/good-tourist-tips?cst=woi_popup_blog';
	window.open(liveEventUrl, '_blank');
}



initPopup();

