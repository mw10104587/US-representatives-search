# Civic API
This is a web app that uses the Google Civic API to show people the offices and officials in their address. 

# Design
## Index Page
In my opinion, I always felt that to let users fill in all these information is like filling up a form, and that is quite boring. I wanted to make it like an interactive dialogue that guides the user through the process of retreiving the information of the officials.


#### Address
Inputing the address is one of the most annoying experience to me. Also, the inconsistent format makes the page messy rightaway. According to some experiment with the API, I believe Google geolocates the address on its own, so for my side, I just tried to make sure that the input value isn't an empty string. For better usability, I assume that a lot of people are using Chrome, Firefox and Safari that are supporting autocomplete, so by adding "street-address" as an attribute value for the input text, the users can see autocomplete options. 

For data integrity, we have to use `encodeURIComponent()` to make sure that all parameters are legit. 


*REF*
Google Dev: https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill?hl=en



#### Levels and Roles
In the level page, I showed all the options and let user pick. By doing so, I get to add more information to introduce each variable. For example, I don't think special means anything to anyone.


## Result page
In the result page, while offices being requested, I have two tabs one for offices as a table, the other with two columns of officials information. 

#### Images
The images of different officials were of different size, I used the most common way to make them all preserve ratio. I put them in a `<div>` element as background image with attribute `background-size` as `cover`. 

#### Fonts
To add style to the page, I used some web fonts provided by Google.





## Problems Encountered
#### Listener to form instead of the input
In the first page of the application, I wanted to trigger nextpage after user pressed Enter (after users fill in the address). At first, I set the keydown listener on the <input> element. However, the page always reloads itself and cleans up the form. After some Googling, the problem was setting the listener on the wrong element. Instead of setting the listener on the input, we should set it on the <form> element. This inlcudes both 1. pressing Enter while focusing on the input. 2. Clicking the `Go!` button with mouse.



## To Do List
1. Add detail on each options
3. Implement the show me more function for offices.
4. Add placeholer images for not loading images


## Future improvements
1. It would be better if the tabs in the result page has an active and un-active state. Users could identify which page they're watching right away.
2. 


## Test Address
1. more than 10 officials 
207 Willey St, Morgantown, WV 26505, United States

2. 

