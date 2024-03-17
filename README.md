# commodity_backend
This is Backend for commodity digital QC

## How to setup

1. clone the folder in your workspace by `git clone https://github.com/ramsingh10497/Commodity_crop_PWA_backend.git`
2. Go into folder `cd Commodity_crop_PWA_backend`
3. Install important packages `npm install`
4. Create a .env file and copy and pase the code from .env.example

## Setting up database

1. You can change your mysql database configuration in file `./config/database.js` such as username and password for MYsql server
2. Enter into mysql shell and create a database name `commodity_db`
3. Make sure mysql server is running as service

## Launching Server
1. If all above steps are done correctly, then we are ready to start the server
2. Default port is set to 8000 but it can be changed in `.env`
3. run server by `node app.js` or `npm run dev`
4. Your server should be up and running

## Demo records
1. Whenever the server is launched it will create some dummy records for hot start
2. 6 crops will be automatically inserted into tables
3. Due to time limitation i haven't used any encryption on password but it can be easily done.
4. Check the api `http://localhost:8000/api/users/login` by sending following payload

<pre>
  {
    "email": "demo@gmail.com",
    "password": "Test@123"
  }
</pre>

You should get a response like this 
<pre>
  {
    "success": true,
    "message": "login success.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik............truncated",
    "data": {
        "id": 1,
        "name": "demo",
        "email": "demo@gmail.com",
        "password": "Test@123",
        "createdAt": "2024-03-05T11:00:08.000Z",
        "updatedAt": "2024-03-05T11:00:08.000Z"
    }
}
</pre>
5. I am using jsonwebtoken for authentication and session management, This token will be saved in Frontend for protected urls

## Endpoints

1. `http://localhost:8000/api/users/login`
2. `http://localhost:8000/api/reports/generate`
3. `http://localhost:8000/api/crops/`
