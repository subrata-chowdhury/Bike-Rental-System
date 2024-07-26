# Bike Rental System

It is a Full Stack Bike Rental System Web Application created using ReactJS, Bootstrap 5, CSS, HTML as Frontend and NodeJS with Express, Mongoose library as Backend and MongoDB as Database and TypeScript in both side.

# Features 

**1.** Data is sync accross different devices.

**2.** You can filter bikes based on Brand, Type, CC, Horse Power etc from the wide numbers of bikes.

**3.** You can see your booking history.

**4.** You can easily see you which bike you have to return from profile section.

**5.** Also it has user friendly alerts to return the bike on current date.

**6.** Secure authenticated account. (No one can access your data except you)

**7.** Has searching feature. (You can search a bike using bike model)

**8.** UI is fully responsive on different types of devices.

**9.** User Details/Data can be updated, deleted anytime.


# To use this app follow the below steps:

**Step 1:** First of all fork this repositoy and run `npm install` command in both Frontend and Backend directory which will install all dependencies and librarys.

**Step 2:** Then go to Frontend Directory then build the react app using `npm run dev`.

**Step 3:** Install MongoDB and MongoDB Compass. **(skip this step if you already have)**

**Step 5:** Next Open the MongoDB compass and create a database called bikeRentalSystem and a collection in it called bike.

![Screenshot 2024-07-26 080554](https://github.com/user-attachments/assets/ef7cca73-50fa-4dc6-9eab-496a73536d7d)

**Step 6:** Now navigate to the bike collection. <br>
Then add the below data (click the below link to download the bike data) using `MonogoDB Compass` -> `ADD DATA` -> `import JSON or CSV file` -> `Select the Downloaded JSON file` then click `select` to initilize the database.<br>
[bikeRentalSystem.bikes.json](https://github.com/user-attachments/files/16385930/bikeRentalSystem.bikes.json)

![Screenshot 2024-07-26 080907](https://github.com/user-attachments/assets/c230df24-17e4-4f20-b3cf-601e594d5216)

**Step 7:** Now you have to create a `config.ts` on `backend/config` folder and set your jwt secret on an js object. <br>

**_Format_**: `export default { "jwtSecret": YOUR_JWT_SECRET }`

**Step 8:** After that run `npx ts-node app.ts` command in Backend which will run the main server.

**Step 9:** Then go to frontend folder and run `npm run dev` to run the vite server.

**Step 10:** Now finally open this **URL**: `http://localhost:5173/` in your browser to use the app.
