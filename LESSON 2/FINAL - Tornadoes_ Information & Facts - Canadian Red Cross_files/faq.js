(() => {
  const questions = $('.accordion .question');

  if (questions.length < 1) return;

  questions.on('click', (e) => {
    const currentQuestion = $(e.currentTarget);

    // If question is already expanded, collapse it.
    if (currentQuestion.attr('aria-expanded') === 'true') {
      currentQuestion.attr('aria-expanded', 'false');
      currentQuestion.next().slideUp(300);
    }
    // If question is collapsed, expand it.
    else {
      const previousExpandedFAQ = $('.faq:has([aria-expanded=true]');
      const previousExpandedQuestion = previousExpandedFAQ.find('.question');
      const previousExpandedAnswer = previousExpandedFAQ.find('.answer');

      // Check if the current question is below the previous expanded question.
      const previousExpandedQuestionIsAbove = previousExpandedQuestion.length > 0
        ? parseInt(currentQuestion.attr('id').split('-')[1], 10)
        > parseInt(previousExpandedQuestion.attr('id').split('-')[1], 10)
        : false;

      const previousExpandedAnswerHeight = previousExpandedAnswer.outerHeight();

      // Get the position of the question relative to the window.
      const currentScroll = window.scrollY;
      const currentScreenY = currentQuestion.offset().top - currentScroll;

      // Calculate some scroll adjustment to position the newly expanded question slightly above the middle of the screen.
      const screenYThreshold = ($(window).height() / 2) - 100;
      const screenYAdjustment = currentScreenY > screenYThreshold ? currentScreenY - screenYThreshold : 0;

      // Calculate ideal scroll value.
      const idealScroll = currentScroll - (previousExpandedQuestionIsAbove ? previousExpandedAnswerHeight : 0) + screenYAdjustment;

      // Scroll to the ideal scroll value.
      if (idealScroll !== currentScroll) {
        $('html, body').animate({ scrollTop: idealScroll }, 300);
      }

      // Collapse all questions.
      questions.attr('aria-expanded', 'false');
      questions.next().slideUp(300);

      // Expand the current question.
      currentQuestion.attr('aria-expanded', 'true');
      currentQuestion.next().slideDown(300);
    }
  });

  // Show the answers for pre-expanded questions.
  $('.accordion .question[aria-expanded=true] + .answer').show();
})();
