const $ = window.$;

$('document').ready(init);

function init () {
  const amenityObject = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityObject[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityObject[$(this).attr('data-name')];
    }
    const names = Object.keys(amenityObject);
    $('.amenities h4').text(names.sort().join(', '));
  });
  apiStatus();
}

function apiStatus () {
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, function (data, textStat) {
    if (textStat === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('api_status').removeClass('available');
    }
  });
}
