# Bike Rental System

It is a Full Stack Bike Rental System Web Application created using ReactJS, Bootstrap 5, CSS, HTML as Frontend and NodeJS with Express, Mongoose library as Backend and MongoDB as Database. 

# Features 

**1.** Data is sync accross different devices.

**2.** It has category feature through which you can group the tasks.

**3.** Secure authenticated account. (No one can access your data except you)

**4.** Has searching feature. (You can search a category from a very wide list of category)

**5.** UI is fully responsive on different types of devices.

**6.** User Details/Data can be deleted anytime.


# To use this app follow the below steps:

**Step 1:** First of all fork this repositoy and run `npm install` command in both Frontend and Backend directory which will install all dependencies and librarys.

**Step 2:** Then go to Frontend Directory then build the react app using `npm run dev`.

**Step 3:** Install MongoDB **(skip this step if you already have)**

**Step 4:** Now you have to create a `config.ts` on `backend/config` folder and set your jwt secret on an js object. <br>
**_Format_**: `export default { "jwtSecret": YOUR_JWT_SECRET }`

**Step 5:** After that run `npx ts-node app.ts` command in Backend which will run the main server.

**Step 6:** Then go to frontend folder and run `npm run dev` to run the vite server.

**Step 7:** Now finally open this **URL**: `http://localhost:5173/` in your browser to use the app.
