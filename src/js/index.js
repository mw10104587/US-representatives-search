

// not the best way to do it...
var API_KEY = "AIzaSyBqWr2Jr7lJvv3MYR4zdftl7Wcp7XuGY4g";
// var DEV_MODE = true;
var DEV_MODE = false;


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


	if (DEV_MODE){
		$("#address-input input").val('1263 Pacific Ave. Kansas City KS');
	}



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

	// address=50+West+34th+Street&includeOffices=true&levels=country&levels=subLocality1&levels=regional&levels=administrativeArea1&levels=administrativeArea2&roles=judge&roles=deputyHeadOfGovernment&roles=schoolBoard&roles=executiveCouncil&roles=headOfGovernment&fields=divisions%2Ckind%2CnormalizedInput%2Coffices%2Cofficials&key={YOUR_API_KEY}
	var multiple_parameters = ['levels', 'roles'];
	var all_params = {
		'levels': ["administrativeArea1", "administrativeArea2", "country", "international", "locality", "regional", "special", "subLocality1", "subLocality2"],
		'roles': ["deputyHeadOfGovernment", "executiveCouncil", "governmentOfficer", "headOfGovernment", "headOfState", "highestCourtJudge", "judge", "legislatorLowerBody", "legislatorUpperBody", "schoolBoard", "specialPurposeOfficer"]
	};

	for (mp in multiple_parameters){
		var key = multiple_parameters[mp];
		var value = localStorage.getItem(key);
		console.log(value);
		var values;
		if (value){
			values = value.split(",");
			console.log(values);
		}else{
			console.log('no data of ' + multiple_parameters[mp] + " given!");
			console.log('all parameters would be passed in!');

			// values = all_params[multiple_parameters[mp]];
			values = [];
			// continue
		}
		for (v in values){
			url = url + "&" + key + "=" + values[v];
		}

	}

	// add api key to it.
	url = url + '&key=' + API_KEY;

	console.log(url);

	$.get(url, function(e){

		// IF DEV MODE
		// we fake a lot more office data here
		console.log(e['officials']);
		console.log(e);


		if (DEV_MODE){
			e['officials'] = e['officials'].concat(e['officials'].slice());
			e['officials'] = e['officials'].concat(e['officials'].slice());	
			e['offices'] = e['offices'].concat(e['offices'].slice());
			e['offices'] = e['offices'].concat(e['offices'].slice());
		} 

		console.log(e['officials']);

		// save it for next page
		localStorage.setItem('result', JSON.stringify(e));

		if (!('officials' in e) && (localStorage.getItem('levels') && (localStorage.getItem('roles') )) ){

			// show the error message in the levels page and roles page
			// ask the user to add more fields in it. 
			$('.not-enough-input').css({display: 'block'});
			// redirect user back to levels page
			$.fn.fullpage.moveTo(2, 0);

			return 
		}else{
			// redirect to new page.
			window.location = 'result.html';	
		}

		

	});

}



