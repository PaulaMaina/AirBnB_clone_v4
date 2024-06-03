const $ = window.$;

$('document').ready(init);
const amenityObject = {};

function init () {
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
  filterPlacesByAmenities();
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

function filterPlacesByAmenities () {
  const placesUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
  $.ajax({
    url: placesUrl,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ amenities: Object.values(amenityObject) }),
    success: function (response) {
      $('section.places').empty();
      for (const res of response) {
        const article = ['<article>',
          '<div class="title_box">',
          `<h2>${res.name}</h2>`,
          `<div class="price_by_night">$${res.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${res.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${res.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${res.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${res.description}`,
          '</div>',
          '<article>'];
        $('SECTION.places').append(article.join(''));
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}
