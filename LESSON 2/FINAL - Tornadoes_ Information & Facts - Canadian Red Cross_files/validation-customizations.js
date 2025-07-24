/**
 * Settings and customizations for jQuery validation.
 */

// Ignore only when explicitly assigned the ignore class.
$.validator.setDefaults({ ignore: ['.ignore'] });

// Validation method for required multiple choice fields.
$.validator.addMethod('requiredmultiplechoice',
  function (value, element, params) {
    const firstChoice = $(element).closest('.form-field').find('input[type=checkbox]')[0];
    if (element !== firstChoice) {
      setTimeout(() => { $(firstChoice).valid() }, 0);
    }
    return $(element).closest('.form-field').find('input[type=checkbox]:checked').length > 0;
  },
  ""
);

// Validation method for file input fields.
$.validator.addMethod('requiredfile',
  function (value, element, params) {
    const filename = $(element).closest('.form-field').find('.ktc-uploader-replacement')[0];
    return filename && !filename.hasAttribute('hidden') && filename.innerHTML !== '';
  },
  ""
);
