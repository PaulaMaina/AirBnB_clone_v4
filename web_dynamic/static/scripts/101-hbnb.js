const $ = window.$;

$('document').ready(init);
const amenityObject = {};
const stateObject = {};
const cityObject = {};
let obj = {};

function init () {
  $('.amenities .popover input').change(function () {
    obj = amenityObject;
    objectsChecked.call(this, 1);
  });
  $('.state_input').change(function () { obj = stateObject; objectsChecked.call(this, 1); });
  $('.city_input').change(function () { obj = cityObject; objectsChecked.call(this, 1); });
  apiStatus();
  filterPlacesByAmenities();
  displayReviews();
}

function objectsChecked (nObject) {
  if ($(this).is(':checked')) {
    obj[$(this).attr('data-name')] = $(this).attr('data-id');
  } else if ($(this).is(':not(:checked)')) {
    delete obj[$(this).attr('data-name')];
  }
  const names = Object.keys(obj);
  if (nObject === 1) {
    $('.amenities h4').text(names.sort().join(', '));
  } else if (nObject === 2) {
    $('.locations h4').text(names.sort().join(', '));
  }
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

function displayReviews (obj) {
  if (obj === undefined) {
    return;
  }
  if (obj.textContent === 'Show') {
    obj.textContent = 'Hide';
    $.get(`http://0.0.0.0:5001/api/v1/places/${obj.id}/reviews`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${obj.id}n`).html(data.length + ' Reviews');
        for (const review of data) {
          printReview(review, obj);
        }
      }
    });
  } else {
    obj.textContent = 'Show';
    $(`#${obj.id}n`).html('Reviews');
    $(`#${obj.id}r`).empty();
  }
}

function printReview (review, obj) {
  const date = new Date(review.created_at);
  const month = date.toLocaleString('en', { month: 'long' });
  const day = dateOrdinal(date.getDate());

  if (review.user_id) {
    $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`, (data, textStatus) => {
      if (textStatus === 'success') {
        $(`#${obj.id}r`).append(
        `<li><h3>From ${data.first_name} ${data.last_name} the ${day + ' ' + month + ' ' + date.getFullYear()}</h3>
         <p>${review.text}</p>
         </li>`);
      }
    });
  }
}

function dateOrdinal (dom) {
  if (dom === 31 || dom === 21 || dom === 1) return dom + 'st';
  else if (dom === 22 || dom === 2) return dom + 'nd';
  else if (dom === 23 || dom === 3) return dom + 'rd';
  else return dom + 'th';
}
