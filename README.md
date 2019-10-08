# MMS Photo Board API

## *A truly "mobile first" social photo web application*

### Live application
[MMS Photo Board client hosted at Zeit](https://mms-photo-board.cwilliams.now.sh)

### Screenshots
App shot 1 | App shot 2 | App shot 3
-|-|-
<img src='https://user-images.githubusercontent.com/26190276/66362047-db6f5580-e946-11e9-8918-f8b7c1bfb16a.png' width='500' style='display:block;'/> |<img src='https://user-images.githubusercontent.com/26190276/66362109-16718900-e947-11e9-8757-758dbd982e48.png' width='500' /> | <img src='https://user-images.githubusercontent.com/26190276/66362749-85e87800-e949-11e9-8928-04f07063028a.png' width='500' />

### Summary
*This is the API for MMS Photo Board. The client web application can be found at this [repo](https://github.com/Williams-Christopher/mms-photo-board).*

MMS Photo Board is based around submission of photos with captions to a shared "photo board" via MMS (text messaging photos) and consuming them via a web application. Aside from being a relatively novel way to post to a website, the idea is that many times we might want to share a photo without having to deal with the stream of information and distration that comes to us when we open our social media applicaiton of choice. Let's explore a clean and easy way to upload photos with a mobile first application that is a core part of every mobile device and that most everyone, even grandma, can use.

The goals of the project were:
* Utilization of the Twilio SMS/MMS API to provide a more meaningful and interesting interface to a web application than account validation and password recovery.
* Explore methods to implement a 'like' system.
* Personal practice, growth, and learning.

### API Endpoints
Path | Method | Authorization | Description | Parameters or body | On sucess | On failure
-|-|-|-|-|-|-|
/api/users | POST | Public | Receives a JSON body containing the data to create a new user. | A JSON body with the keys listed in the _Object Formats_ section below | Returns status 204 | Returns status 400 with a JSON formatted error message
/api/media | GET | Public | Returns an array of JSON objects describing the images in the database | None | Returns status 200 with an array of JSON formatted objects describing the media records in the database, see _Object Formats_ below | Returns status 400 with a JSON formatted error message
/api/media | POST | Private | Called when a user clicks the thumbs up 'like' button. If the user has already liked the media, the like will be removed. Conversely, if the user has not liked the media, a like will be added | A JSON formatted body with the keys listed in the _Object Formats_ section below | Returns status 200 with the new like count in a JSON formatted body, see _Object Formats_ section below | Returns status 400 with a JSON formatted error message
/api/auth | POST | Public | Recevies login credentials | A JSON formatted body with the keys listed in the _Object Formats_ section below | Returns status 200 with a JSON body containing a JSON Web Token, see _Object Formats_ section below | Returns status 400 with a JSON formatted error message
/api/mms | POST | Public | This end point is used by the Twilio webhook | A JSON body containing deatils of the incoming SMS message. See the [Twilio documentation](https://www.twilio.com/docs/sms/api/message-resource) for more details

### Object formats
**All fields for POST endpoints are required unless otherwise noted**

Response body for GET /api/media
```
[
    {
        id: <number>,                 // The unique id for this media record
        user_id: <number>,            // The numeric user id of the user that contributed the photo
        media_url: <string>,          // The URL of the actual photo
        media_caption: <string>,      // The text caption for the photo
        media_location: <string>,     // The city or geographic placename associated with the phone
        created: <ISO8601 date>,      // The date and time the media record was created
    },
    ...
]
```

Request body for a new user creation request submitted to POST /api/users
```
{
    user_first_name: <string>,    // The first name of the user
    user_name: <string>,          // The requested user name
    user_last_name: <string>,     // OPTIONAL - The users' last name
    user_password: <string>,      // The users' password
    user_phone: <string>,         // The users' SMS capable phone number in the format +12223334444
}
```

Request body for POST /api/auth
```
{
    user_name,          // The user name attempting to sign in
    password,           // The password for the above user
}
```

Response body for POST /api/auth
```
{
    authToken: <JWT>,          // Contains the JSON Web Token generated for a successful login request
}
```

Request body for POST /api/media
```
{
    media_id: <number>,           // The id of the media to toggle a like for
}
```

Response body for POST /api/media
```
{
    newLikes: <number>,        // The new total likes for the media id given in the request body
}
```

Response body for errors
```
{
    error: <message>,       // An error message describing the reason for the server returning status 400
}
```
### Tech stack
This client application utilizes the following technologies and libraries:
* JavaScript
* Express.js
* CORS
* JWT
* knex
* postgrator
* PostgreSQL
