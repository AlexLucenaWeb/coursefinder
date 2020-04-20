$( document ).ready(function() {
  $(function() {
    $('.card').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });

    $('.card-img-top').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });

    $('.card-title').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });

    $('.card-text').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
    $('.card-btn').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });

  });


});

