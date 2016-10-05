# Google civil API Project
This is a web app that uses the [Google Civic API](https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress) to show people the offices and officials in their address. You can test out the API [here](https://developers.google.com/apis-explorer/#p/civicinfo/v2/civicinfo.representatives.representativeInfoByAddress).

## Design
### Index Page
In my opinion, I always felt that to let users fill in all these information is like filling up a form, and that is quite boring. I wanted to make it like an interactive dialogue that guides the user through the process of retreiving the information of the officials. I used **fullpage.js** to add interaction feeling and breaking down different sections for users to fill in the parameters for the query.


#### Address
Inputing the address is one of the most annoying experience to me. Also, the inconsistent format makes the page messy rightaway. According to some experiment with the API, I believe Google geolocates the address on its own, so for my side, I just tried to make sure that the input value isn't an empty string. For better usability, I assume that a lot of people are using Chrome, Firefox and Safari that are supporting autocomplete, so by adding "street-address" as an attribute value for the input text, the users can see autocomplete options. 

For data integrity, we have to use `encodeURIComponent()` to make sure that all parameters are legit.

Here, I also made one of the **most important design decision** about whether to let user see offices information. I kind of hide it under the search bar as a default option, since I don't think this would be a heavy query that slows down the loading of the page. It also won't be a bother for people who doesn't want to see the table in my [result page](#result-page). 


*REF*
- [Google Dev](https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill?hl=en)



#### Levels and Roles
In the level page, I showed all the options and let user pick. By doing so, it adds a lot of trouble for users who might want to search for a lot of levels and roles. To avoid a lot of manual work, I added the short cut, "A" key, to toggle all options at the same time. I considered whether to switch page after people pick, but decided not to, since people might want to unselect one or two after selecting all of them, therefore granting user the control of switching to next question.

Although this kind of interface takes a larger amount of space, but compared to dropdown list, I would say this saves a lot more time, and gives user a quick instinct about what they are picking rightaway.

If the user didn't select any of the levels, I will assume they are not really sure what they care about, or they simply wants all of them here. I would say it's a fair argument since the representatives that people will be voting for, all of them belongs to an office. I will do the same thing for roles.

On the other hand, if the query that user input doesn't get back any result, I will redirect our users to the parameter page and ask them to add more input to their query. The error message will be styled by `Bootstrap` by using the `<p class="bg-gander">`, which will definitely catch users eye.




### Result page
In the result page, while offices being requested, I have two tabs, one for offices as a table, the other showing two columns view of officials. I put the officials tab as default tab and users would need to click on the other one to see offices. The reason is that I think people are more visual, they would be more interested in the face of the politicians.

For officials, I used React to render the same structure of elements only by passing different data. It gains usability of my code. To add a little more visual to the page, I added social media icons in front of their social media ID. 


**REF:** 
+ [Flat Icon](http://www.flaticon.com/)


#### Images
The images of different officials were of different size, I used the most common way to make them all preserve ratio. I put them in a `<div>` element as background image with attribute `background-size` as `cover`. 

In order to prevent politicians missing profile pictures, I added a placeholder image under all of the images. If the real image fails to load, then users will only see the place holder.
The place holder looks like this.

![No Politician Image received](.tmp/img/avatar.png)



#### Fonts
To add style to the page, I used some web fonts provided by Google. I believe the names are the most important part, so I enlarged the fonts and I gave party name another font since I believe it is a different category of information compared to address and phone numbers.


**REF**
[Google Font](https://fonts.google.com/)


## Problems Encountered
#### Listener to form instead of the input
In the first page of the application, I wanted to trigger nextpage after user pressed Enter (after users fill in the address). At first, I set the keydown listener on the `<input>` element. However, the page always reloads itself and cleans up the form. After some Googling, the problem was setting the listener on the wrong element. Instead of setting the listener on the input, we should set it on the `<form>` element. This inlcudes both 1. pressing Enter while focusing on the input. 2. Clicking the `Go!` button with mouse.


## Package Management
I used **Gulp** to pipeline all my resources, including copying them into production directoy and compiling higher level languages like **Jade**. It also helped me to re-render every time I update my source files, saving development time and better control of my own package.

I have three main directories including
1. **src**, the folder where I program.
2. **.tmp**, the folder where I put compiled js, css and html files for local testing.
3. **build**, the folder where I put the compressed and concatenated version of code for production.

I use **bower** to install up-to-date packages and use **gulp-inject** to include them into header of my html files.


## To Do List
1. Add detail on each options
3. Implement the show me more function for offices?

## Future improvements
1. It would be better if the tabs in the result page has an active and un-active state. Users could identify which page they're watching right away.
2. Catch error when no result were returned or, internet problem.
3. Error prevention, input validation
4. Hide the secret key somewhere else.
5.


## Test Address
1. more than 10 officials 
207 Willey St, Morgantown, WV 26505, United States

2. 

