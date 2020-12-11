# PhotoRama

Photorama is a social media application for photographers to show their amazing photos. It was created as a project defence for the Angular course in the Software University.
The application is fully responsive for mobile and desktop devices.

![Homepage](https://i.imgur.com/ZOfMQ17.png)

## Non-authenticated user view / Public pages

A user that is not authenticated can see the login and register pages. Also they have access to the new page, where they can see the 20 latest photos that were uploaded on the website.
![Public Pages](https://i.imgur.com/SATMOiW.png)

## Authenticated user view / Private pages

A user that is authenticated can access all pages which are Profile, Community, New and they have buttons for `Upload` (photo upload) and `Logout`

## Profile page

The profile page of the authenticated user shows all of his information and a portfolio of their photos. The user information that is shown:
* Full name
* Username
* Location and age
* Website
* Biography or short quote
* Social media links for Facebook, Flickr, Instagram, Twitter and Youtube
* Counter for followers and for accounts that the user is following

![User Profile](https://i.imgur.com/IkwItvd.png)

Additionally if the user is viewing their own profile they have a `Edit Profile` button available, and if they are viewing some else's profile they will see a button to follow that user

![User Settings/Follow](https://i.imgur.com/2C3BgN6.png)

### Edit Profile

Тhe `Edit Profile` button shows a modal with all the information that a user can edit, including Avatar Upload and Reset.

![Edit Profile](https://i.imgur.com/cQhZEvf.png)

## Development server

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

