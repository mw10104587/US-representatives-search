

// not the best way to do it...
var API_KEY = "AIzaSyBqWr2Jr7lJvv3MYR4zdftl7Wcp7XuGY4g";


$(document).ready(function(){


	/*************************/
	// Document      Setting //
	/*************************/

	// detect typing A key during section 2 and section 3
	$(document).keyup(function(event){
		// console.log(event.keyCode)
		if (event.keyCode == 65){
			if ($("div.active").attr('id') == 'address-section'){
				$('div#level-grid .level').click();
			}
			else if($("div.active").attr('id') == 'roles-section'){
				$('div#role-grid .role').click();
			}	
		}
	});

	// initialize fullpage
	$('#fullpage').fullpage();

	/*************************/
	// First Section Setting //
	/*************************/

	// set the check box to checked, because it doesn't really make sense if you don't check it
	$('div.check-box input').prop('checked', true);


	$("form#address-form").submit(function(event){
		address_done();
		return false;
	});


	/**************************/
	// Second Section Setting //
	/**************************/

	var levels_var = {
		'administrativeArea1': false,
		'administrativeArea2': false,
		'country': false,
		'international': false,
		'locality': false,
		'regional': false,
		'special': false,
		'subLocality1': false,
		'subLocality2': false
	};

	// a function for update images while being clicked
	$("#section2-container .level").click(function(){

		// toggle data setting
		// use the text to access data in the levels_var dictionary
		var key = $(this).find('.level-content').text();
		key = key.split(' ');
		if (key.length == 3)
			key[1][0] = 
			key = key[0] + key[1].charAt(0).toUpperCase() + key[1].slice(1) + key[2];
		else if (key.length == 2)
			key = key[0] + key[1];
		else
			key = key[0];

		levels_var[key] = !levels_var[key];

		// toggle image, with animation
		$(this).find('img').fadeOut(100, function(){

			// change image and fadeIn
			var target_img;

			// change according to the data status
			if (levels_var[key]) target_img = 'img/checked.png';
			else target_img = 'img/not-checked.png';

			$(this).attr('src', target_img);
			$(this).fadeIn(100);

		});

	});


	// button on click to collect the saved levels and go to next page
	$('#levels-btn').click(function(){

		// collect the data into an array and save to localStorage
		var selected_levels = [];
		for (k in levels_var){
			if (levels_var[k]) selected_levels.push(k);
		}

		localStorage.setItem('levels', selected_levels);

		// scroll to next page
		$.fn.fullpage.moveTo(3, 0);

	});



	/**************************/
	// Third Section Setting  //
	/**************************/

	var roles_var = {
		"deputyHeadOfGovernment": false,
		"executiveCouncil": false,
		"governmentOfficer": false,
		"headOfGovernment": false,
		"headOfState": false,
		"highestCourtJudge": false,
		"judge": false,
		"legislatorLowerBody": false,
		"legislatorUpperBody": false,
		"schoolBoard": false,
		"specialPurposeOfficer": false
	};


	$("#section3-container .role").click(function(){

		// toggle the data
		var key = $(this).find(".level-content").text();
		key = key.split(" ");

		// make key from the string
		key = key[0].charAt(0).toLowerCase() + key[0].slice(1) + key.slice(1).map(function(pon){
			return pon.charAt(0).toUpperCase() + pon.slice(1);
		}).join('');

		roles_var[key] = !roles_var[key];

		// update UI
		$(this).find('img').fadeOut(100, function(){

			// change image and fadeIn
			var target_img;

			// change according to the data status
			if (roles_var[key]) target_img = 'img/checked.png';
			else target_img = 'img/not-checked.png';

			$(this).attr('src', target_img);
			$(this).fadeIn(100);

		});


	});

	// button on click to collect the saved levels and go to next page
	$('#roles-btn').click(function(){

		// collect the data into an array and save to localStorage
		var roles = [];
		for (k in roles_var){
			if (roles_var[k]) roles.push(k);
		}

		localStorage.setItem('roles', roles);

		// since it's the last button
		// send query, save result, 
		// open new page
		queryAndProcess();


	});





});


// while in first page.
// on click for button or key down for enter
// save the value and move to the next page

function address_done(){

	// save the variable to local storage
	var address_str = $('div#address-input>input').val();
	address_str = address_str.trim();

	// prevent empty string
	if(address_str == ""){

		// show red text to remind addind address
		console.log("user didn't give valid address.");
		return
	}

	// save the address
	localStorage.setItem("address", address_str);

	// save the checkbox value
	localStorage.setItem("includeOffices", $("div#include-offices-wrap input").prop("checked"));

	// console.log('In address_done');

	// scroll to next page.
	$.fn.fullpage.moveTo(2, 0);

}



function queryAndProcess(){

	// get all the input var from localStorage	
	// url will look something like this

	var url = "https://www.googleapis.com/civicinfo/v2/representatives?";
	var parameters = ["address"];

	for(par in parameters){
		if (url[url.length-1] != "?") url = url + "&";

		var key = parameters[par];
		url = url + key + '=' + encodeURIComponent(localStorage.getItem(key));
	}

	// always include offices
	url = url + '&includeOffices=true'


	// add api key to it.
	// address=50+West+34th+Street&includeOffices=true&levels=country&levels=subLocality1&levels=regional&levels=administrativeArea1&levels=administrativeArea2&roles=judge&roles=deputyHeadOfGovernment&roles=schoolBoard&roles=executiveCouncil&roles=headOfGovernment&fields=divisions%2Ckind%2CnormalizedInput%2Coffices%2Cofficials&key={YOUR_API_KEY}

	var multiple_parameters = ['levels', 'roles'];
	for (mp in multiple_parameters){
		var key = multiple_parameters[mp];
		var values = localStorage.getItem(key).split(",");
		for (v in values){
			url = url + "&" + key + "=" + values[v];
		}

	}

	url = url + '&key=' + API_KEY;
	// console.log(url);
	// url = encodeURIComponent(url)

	$.get(url, function(e){
		localStorage.setItem('result', JSON.stringify(e));
		console.log(localStorage.getItem("result"));

		// redirect to new page.
		window.location = 'result.html';

	});

}



