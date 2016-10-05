// a global variable for this page, so we can keep track whether we're showing data for
// offices or official. True: officials; False: offices
var showing_officials = true;


// define some reusable components for showing the officials
var Officials = React.createClass({
  displayName: "Officials",

  render: function render() {

  	// console.log(this.props.data);

	var officials = [];
  	for(var i = 0; i < this.props.data["officials"].length; i++){

  		var display = true;
  		if(i < 10) display = true;
  		else display = false;

  		officials.push(React.createElement(Official, {info: this.props.data["officials"][i], display: display, key: i}));
  	}

  	// remove show me more button if the button is not neccessary
  	if (officials.length <= 10){
  		$('#more-officials-wrap button').remove();
  	}

  	return React.createElement("div", null, officials);

  }

});


var Official = React.createClass({

  displayName: "Official",

  render: function render() {

  	var info = this.props.info;
  	var img_url = info['photoUrl'];
  	// console.log(this.props.info);
  	var official_style = {}

  	if (!this.props.display) official_style['display'] = 'none';

    return React.createElement("div", {className:'col-md-5 official-wrap', style:official_style}, 
    	React.createElement("div", {className: 'official'}, 
    	React.createElement(OfficialPic, {img_url: img_url}),
    	React.createElement(OfficialInfo, {info:this.props.info})
    ));
  }
});


var OfficialInfo = React.createClass({

	displayName: 'OfficialInfo',

	render: function render(){
		
		// unpack the variables here
		var name = this.props.info.name;
		var party = this.props.info.party;
		// var title = 
		// var office = 
		var address = this.props.info.address;
		var phones = this.props.info.phones;
		var channels = this.props.info.channels;

		return React.createElement("div", {className: "official-info"}, 
			React.createElement(NameAndParty, {className:"name-party", name:name, party:party}),
			// React.createElement("div", {className:"title-office", title:title, office: office}),
			React.createElement(Address, {className:"address", address:address}),
			React.createElement(Phones, {className:"phone", phones:phones}),
			React.createElement(Channels, {className:"channels", channels: channels})
			)
	}


});


var NameAndParty = React.createClass({

	displayName: 'NameAndParty',

	render: function render(){

		return React.createElement("div", null,
			React.createElement("div", {className: "name"}, this.props.name),
			React.createElement("div", {className: "party"}, this.props.party)
			);

	}

})

var Address = React.createClass({

	displayName: 'Address',

	render: function render(){
		var render_address = this.props.address[0]['line1']

		if ("line2" in this.props.address[0]){
			render_address = render_address + " "+ this.props.address[0]["line2"];
			// console.log(this.props.address);
		}
		return React.createElement("div", {className: "address"}, 
			React.createElement("span", null, render_address.toLowerCase() ));

	}
});


var Phones = React.createClass({

	displayName: 'Phones',

	render: function render(){
		// console.log(this.props.phones);
		var render_phones = this.props.phones[0];
		return React.createElement('div', {className:'phone'}, render_phones);
	}
});


var Channels = React.createClass({

	displayName: 'Channels',



	render: function render(){

		// put all the social medias into array and show all of them together
		var channels = []
		for (c in this.props.channels){
			channels.push(React.createElement(SocialMedia, {channel: this.props.channels[c], key: c}));
		}

		return React.createElement("div", {className: "social-medias"}, channels);
	}
});

var SocialMedia = React.createClass({

	displayName: 'SocialMedia',

	render: function render(){

		var social_media = this.props.channel['type'];
		var sm_id = this.props.channel['id'];

		console.log(social_media);

		return React.createElement("div", {className: 'social-media'}, 
			React.createElement("div", {className: 'social-media-wrap'},
				React.createElement('img', {src: 'img/' + social_media + '-icon.png'})),
			React.createElement("span", {className: 'social-media-id'}, sm_id))

	}
});

var OfficialPic = React.createClass({

	displayName: "OfficialPic",

	render: function render(){

		return React.createElement("div", {className: "official-pic-wrap"}, 
				React.createElement("div", {className: "official-pic", style:{backgroundImage: 'url(' + this.props.img_url + ')' }}));
			
	}
});



var Offices = React.createClass({
	displayName: 'Offices',
	render: function render(){

		// var offices = this.props.data['offices'];

		var offices_data = [];
		for (od in this.props.data['offices']){
			// loop through the roles

			for(var i = 0; i < this.props.data['offices'][od]['roles'].length; i++){
				for(var j = 0; j < this.props.data['offices'][od]['levels'].length; j++){
					offices_data.push({
						'name': this.props.data['offices'][od]['name'],
						'role': this.props.data['offices'][od]['roles'][i],
						'level': this.props.data['offices'][od]['levels'][j]
					});
				}
			}

		}

		// remove the show more button for offices if it's not necessary
		if(offices_data.length <= 10){
			$('#more-offices-wrap button').remove();
		}

		var offices = [];
		for( o in offices_data){
			offices.push(React.createElement(Office, {office: offices_data[o], key: o}));
		}

		return React.createElement("table", {className: 'table table-hover'}, 
			React.createElement("thead",null, 
				React.createElement('tr', null, 
					React.createElement('th', null, 'Office Name'),
					// React.createElement('th', null, 'Address'),
					React.createElement('th', null, 'Levels'),
					React.createElement('th', null, 'Roles')))
			,React.createElement('tbody', null, offices));

	}
});


var Office = React.createClass({
	displayName: 'Office',
	render: function render(){

		var office_data = this.props.office;
		console.log(office_data);

		var office_name = office_data['name'];
		// var office_addres = office_data['address'];
		var office_role = office_data['role'];

		var office_level = office_data['level'];

		return React.createElement('tr', null, 
					React.createElement('th', null, office_name),
					React.createElement('th', null, office_level),
					React.createElement('th', null, office_role)
				);

	}


});





$(document).ready(function(){

	// if the user didn't require for offices, we hide it
	if(localStorage.getItem('includeOffices') == 'false') $('#tab .include-offices').css({display: 'none'});

	
	// check if the result value is stored
	var data = localStorage.getItem('result');
	data = JSON.parse(data);

	// display the result value in this scroll page.
	ReactDOM.render(React.createElement(Officials, {data:data}), document.getElementById("officials-table"));
	ReactDOM.render(React.createElement(Offices, {data:data}), document.getElementById("offices-table"));

	$('div#tab button').click(function(){

		var tab_type = $(this).attr("id");
		console.log(tab_type);
		// if the clicked tab is the current displaying tag
		if ((tab_type == 'officials-tab') && ( showing_officials)) return false;
		if ((tab_type == 'offices-tab')   && (!showing_officials)) return false;

		// update the data display
		$('.data-table').each(function(){

			// show the clicked, hide the other.
			if ($(this).attr('id') == tab_type + 'le') $(this).css({display: "table"});
			else $(this).css({display: 'none'});

		});

		// change the variable
		showing_officials = !showing_officials;

		// switch show more button
		if (tab_type == 'officials-tab'){
			$('#more-officials-wrap').css({display: "block"});
			$('#more-offices-wrap').css({display: "none"});	
		} 
		else if(tab_type == 'offices-tab'){
			$('#more-offices-wrap').css({display: "block"});
			$('#more-officials-wrap').css({display: "none"});
		}
	});


	$("#more-officials-wrap button").click(function(){

		// find the next ten not displayed officials and show them
		$('#officials-table .official-wrap').filter(function(){
			return $(this).css('display') == 'none';
		}).slice(0, 10).css({display: 'block'});

		var more_undisplayed_officials = $('#more-officials-wrap .official-wrap')
											.filter(function(){ return $(this).css('display') == 'none'});


		// if no more, remove the button
		if (more_undisplayed_officials.length == 0){
			$('#more-officials-wrap button').remove();
		}

	});



	$("#back-wrap button").click(function(){
		backToSearchPage();
	});


});


function backToSearchPage(){

	// clean localStorage
	window.localStorage.clear();

	// redirect to page
	window.location = 'index.html';
}

function imgError(image){
	image.onerror = '';
	image.src = 'img/avatar.png';
	return true;
}

