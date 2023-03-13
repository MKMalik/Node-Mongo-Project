## Node-Mongo Project

This is a Node.js project with MongoDB database. It provides APIs for user authentication and creating, retrieving and updating posts.

# API Endpoints
The following are the API endpoints:

# Login
- Endpoint: /login
- Method: POST
- Body:

```json
{
  "email": "connect@mkmalik.com",
  "password": "abcd1234"
}
```
- Headers: none
- Parameters: none

# Register
- Endpoint: /register
- Method: POST
- Body:
```json
{
  "email": "connect2@mkmalik.com",
  "password": "abcd1234"
}
```
- Headers: none
- Parameters: none

# Create Post
- Endpoint: /posts
- Method: POST
- Body:
```json
{
  "title": "This will give you Goosebumps!!!",
  "body": "Read a book of your choise. If book is greate, you'll get Goosebumps.",
  "location": {
    "latitude": 26.085409,
    "longitude": 83.297951
  }
}
```
- Headers:
- - Authorization: Bearer JWT token
- Parameters: none

# Get Post by ID
- Endpoint: /posts/:id
- Method: GET
- Body: none
- Headers:
- - Authorization: Bearer JWT token
- Parameters:
- - id: ID of the post to retrieve


# Update Post by ID
- Endpoint: /posts/:id
- Method: PUT
- Body:
```json
{
  "title": "updated title",
  "location": {
    "latitude": 26.085409,
    "longitude": 83.297951
  }
}
```

- Headers:
- - Authorization: Bearer JWT token
- Parameters:
- - id: ID of the post to update

# Delete Post by ID
- Endpoint: /posts/:id
- Method: DELETE
- Body: none
- Headers:
- - Authorization: Bearer JWT token
- Parameters:
- - id: ID of the post to delete


# Tools Used
- Thunder Client (API testing tool)
- Node.js
- Express.js
- MongoDB

# How to Run
1. Clone this repository.
2. Install dependencies with npm install.
3. Rename .env.sample file to .env and replace the values with your own MongoDB configuration.
4. Run the server with npm start.