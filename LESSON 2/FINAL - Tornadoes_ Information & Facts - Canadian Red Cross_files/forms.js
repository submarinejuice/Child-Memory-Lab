/**
 * Customization for forms created via Kentico's Form Builder. This is mainly to allow JQuery validation (unobtrusive) to work properly.
 * - Uses observers to detect async changes to the form to reapply all customizations. The form can change due to 2 reasons: 
 *   form submission by user or change due to a field dependency. Each change happens as a full reload of the form DOM.
 * - Keeps track of "dirty" fields so they can be revalidated each time the form changes. This way error messages which were visible
 *   prior the change won't just disappear.
 * - Replaces the default submit handler with a custom one that prevents submissions when the form is invalid.
 * - Uses a flag to prevent double submissions. The flag gets set each time the user submits and removed when the form either reloads
 *   or fails validation.
 * - Fixes and adjustments for specific form components that are either just not working as expected or that need special validation.
 */
(function () {
  const dirtyFields = [];

  // Get all direct containers/parents of form builder forms.
  const formContainers = $("*:has(> form.form-builder)");

  for(const formContainer of formContainers) {
    observeForm(formContainer);
  }

  function observeForm(formContainer) {
    initializeForm($(formContainer).find('form'));

    const formObserverConfig = { childList: true, subtree: false };
    const formObserver = new MutationObserver(formObserverCallback);

    // Detect if form reloads.
    formObserver.observe(formContainer, formObserverConfig);

    function formObserverCallback(mutationList, observer) {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          const form = $(formContainer).find('form');
          const submitButton = form.find('input[type=submit]');

          if (form.length > 0) {
            initializeForm(form);

            // Reparse the form to reapply unobtrusive validation.
            $.validator.unobtrusive.parse(form);

            // Revalidate all "dirty" fields.
            for (const dirtyField of dirtyFields) {
              if (dirtyField == null || dirtyField.trim() === '') {
                continue;
              }

              const field = $(`[name="${dirtyField}"]`) || $(`[id="${dirtyField}"]`);
              if (field.length > 0) {
                field.valid();
              }
            }
          }

          // Re-enable the submit button after each submission (if it's still there).
          if (submitButton.length > 0) {
            submitButton.removeProp('disabled');
          }

          // If TY message is added, remove the form headings and scroll to top.
          if (mutation.addedNodes && Array.from(mutation.addedNodes).find(node => node.className == "formwidget-submit-text")) {
            window.scrollTo(0, 0);
          }
        }
      }
    };
  }

  function makeFieldDirty(element) {
    if (dirtyFields.indexOf(element.name) === -1 && dirtyFields.indexOf(element.id) === -1) {
      if ((element.name !== null && element.name.trim() !== '')
        || element.id !== null && element.id.trim() !== '') {
        dirtyFields.push(element.name || element.id);
      }
    }
  }

  function initializeForm(form) {
    const submitButton = form.find('input[type=submit');

    // Take off existing submit handlers.
    form.prop('onsubmit', '');
    form.off('submit');

    // Create custom submit handler that checks for form validity prior to submitting.
    form.on('submit', (e) => {
      e.preventDefault();

      // Validate all fields.
      const valid = $(e.currentTarget).valid();

      // All fields have been validated so consider them all as "dirty".
      $(e.currentTarget).find('.form-field input, .form-field select, .form-field textarea').each((index, element) => {
        makeFieldDirty(element);
      });

      // If all are valid, then submit the form.
      if (valid) {
        // Disable the submit button to prevent double submission.
        submitButton.prop('disabled', 'disabled');

        // Trigger Kentico's submit form action.
        window.kentico.updatableFormHelper.submitForm(e);
        return;
      }

      return false;
    });

    // Keep track of "dirty" fields so we can revalidate them each time the form reloads. 
    $(form).find('input, select, textarea').each((index, element) => {
      $(element).on('change', (e) => {
        makeFieldDirty(e.currentTarget);
      });
    });

    /**
     * ReCaptcha
     */
    const captchaField = form.find('.field-RecaptchaComponent');
    const captchaInput = captchaField.find('input');
    const captchaValidationMessage = captchaField.find('.field-validation-valid');

    captchaValidationMessage.attr('data-valmsg-for', captchaInput.attr('name'));

    const captchaObserverConfig = { childList: true, subtree: true };
    const captchaObserver = new MutationObserver(captchaObserverCallback);

    // Detect when captcha elements are rendered.
    captchaObserver.observe(captchaField[0], captchaObserverConfig);

    function captchaObserverCallback(mutationList, observer) {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          const captchaTextArea = captchaField.find('textarea');
          if (captchaTextArea.length > 0) {
            /**
             * Watch for any value changes of the captcha textarea. If it is not empty, that means that the 
             * Captcha is valid so we pass a "valid" flag to the component's main input, otherwise leave it empty.
             */
            if (captchaTextArea.prop('redifined') != "true") {
              const { get, set } = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
              Object.defineProperty(captchaTextArea[0], 'value', {
                get() {
                  return get.call(this);
                },
                set(newValue) {
                  captchaInput.val(newValue ? 'valid' : '');
                  captchaInput.valid();
                  return set.call(this, newValue);
                }
              });
              captchaTextArea.prop('redifined', 'true');
            }
            break;
          }
        }
      }
    }

    /**
     * Multiple Choice
     */
    const multipleChoiceFields = form.find('.field-MultipleChoiceComponent');

    for (const multipleChoiceField of multipleChoiceFields) {
      const multipleChoiceInputs = $(multipleChoiceField).find('input[type=checkbox]');

      for (const multipleChoiceInput of multipleChoiceInputs) {
        $(multipleChoiceInput).removeAttr('data-val-required');
        $(multipleChoiceInput).removeData('val-required');
        $(multipleChoiceInput).removeAttr('data-msg-required');
        $(multipleChoiceInput).removeData('msg-required');
        /**
         * For some reason there is no "on the fly" validation until after the entire form has been validated,
         * so I'll just add this so it's consistent with the other field types.
         */
        $(multipleChoiceInput).on('change', (e) => {
          $(e.currentTarget).valid();
        });
      }

      const multipleChoiceMessage = $(multipleChoiceField).find('.field-validation-valid').eq(0);

      if (multipleChoiceMessage.length > 0) {
        // Assign the validation message to the first checkbox only.
        $(multipleChoiceMessage).attr('data-valmsg-for', multipleChoiceInputs[0].name);
      }
    }

    /**
     * File Input
     */
    const fileInputFields = form.find('.field-FileUploaderComponent');

    for (const fileInputField of fileInputFields) {
      const fileInput = $(fileInputField).find('input[type=file]');
      const fileInputValue = $(fileInputField).find('.ktc-uploader-replacement');

      if (fileInput.length === 0) {
        continue;
      }

      // Give the input a name.
      fileInput.attr('name', fileInput.attr('id'));

      // Remove the default required rule.
      fileInput.removeAttr('required');

      // Observe any changes to the file input control and validate accordingly. 
      const fileInputCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          const deleteButton = $(fileInputField).find('a:not([hidden])');

          // If there is a delete button, add an "href" attribute so it is tabbable and focus it.
          if (deleteButton.length > 0) {
            deleteButton.attr('href', 'javascript:void(0);');
            setTimeout(() => {
              deleteButton.focus();
            });
          }
          // Else, focus the file input.
          else {
            setTimeout(() => {
              fileInput.focus();
            });
          }

          fileInput.valid();
          break;
        }
      };

      const fileInputObserver = new MutationObserver(fileInputCallback);
      const fileInputConfig = { childList: true, attributes: true, subtree: false };
      fileInputObserver.observe(fileInputValue[0], fileInputConfig);

      const fileValidationMessage = $(fileInputField).find('.field-validation-valid').eq(0);

      if (fileValidationMessage.length > 0) {
        // Assign the validation message to the file input.
        $(fileValidationMessage).attr('data-valmsg-for', fileInput[0].name);
      }
    }

    /**
     * Consolidated File Input
     */
    const consolidatedFileInputFields = form.find('.field-FileUploadConsolidatorInputComponent');

    for (const consolidatedFileInputField of consolidatedFileInputFields) {
      const consolidatedFileInputInput = $(consolidatedFileInputField).find('input');

      if (consolidatedFileInputInput.length === 0) {
        continue;
      }

      // Detect value changes and revalidate accordingly.
      const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      Object.defineProperty(consolidatedFileInputInput[0], 'value', {
        get() {
          return get.call(this);
        },
        set(newValue) {
          setTimeout(() => consolidatedFileInputInput.valid());
          return set.call(this, newValue);
        }
      });
    }

    /**
     * Email Input
     */
    const emailInputFields = form.find('.field-EmailInputComponent');

    for (const emailInputField of emailInputFields) {
      const emailInput = $(emailInputField).find('input[type=email]');

      if (emailInput.length === 0) {
        continue;
      }

      // Remove the default email rule (it is too lax).
      $(emailInput).removeAttr('data-val-email');
      $(emailInput).removeData('val-email');
    }

    /**
     * Dropdown Input
     */
    const dropdownInputFields = form.find('.field-DropDownComponent');

    for (const dropdownInputField of dropdownInputFields) {
      const dropdownInput = $(dropdownInputField).find('select');

      if (dropdownInput.length === 0) {
        continue;
      }

      // Validate on change.
      $(dropdownInput).on('change', () => {
        $(dropdownInput).valid();
      });
    }

    /**
     * Rich Text Input
     */

    // Once a CKEditor instance finishes loading, it will call this function.
    window.ckEditorLoaded = window.ckEditorLoaded || function (id) {
      const richTextTextArea = $(`#${id}`);
      const richTextInputField = richTextTextArea.closest('.field-RichTextInputComponent');
      const richTextEditableContent = $(richTextInputField).find('[contenteditable]');

      /**
       *  Create a custom "change" event for the rich text editor using a combination of focus and blur events.
       *  Basically save a snapshot of the content on focus then check if the content has changed on blur.
       *  This allows us to trigger "on the fly" validation for the rich text editor.
       */
      richTextEditableContent
        .on('focus', (e) => {
          $(e.currentTarget).data('before', $(e.currentTarget).html());
        })
        .on('blur', (e) => {
          if ($(e.currentTarget).data('before') !== $(e.currentTarget).html()) {
            $(e.currentTarget).data('before', $(e.currentTarget).html());
            richTextTextArea.data('dirty', true);
            richTextTextArea.valid();
          }
        });
    };

    // Once a CKEditor instance changes (not just on blur), it will call this function.
    window.ckEditorChanged = window.ckEditorChanged || function (id) {
      const richTextTextArea = $(`#${id}`);
      if (richTextTextArea.data('dirty') || richTextTextArea.hasClass('input-validation-error')) {
        richTextTextArea.valid();
      }
    }

    /**
     * Non-required fields
     */

    // For some reason, Kentico still adds required validation attributes to inputs even if the field is not required.
    const nonRequiredFields = form.find('.form-field:not(.field-required)');
    for (const nonRequiredField of nonRequiredFields) {
      const nonRequiredInputs = $(nonRequiredField).find('input, select, textarea');
      // Remove required rule.
      for (const nonRequiredInput of nonRequiredInputs) {
        $(nonRequiredInput).removeAttr('data-val-required');
      }
    }
  }
})();
