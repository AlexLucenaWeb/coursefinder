$(document).ready(function() {

  setTimeout(
    function() {
      $('.card-img-top').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('.card__title').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('#card-text').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('#card-icons').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('.card__wrap-btn').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('.why__title').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('.why').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

      $('.card').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      });

    }, 1500);


});