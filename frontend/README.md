This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`
this will run the node js bulid 
the port should be port 9000

### `npm run dev`
Runs the app in the development mode.<br />
the port will be localhost 3000

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

this will update the current bulid that I have setup to any chages that you might have made 
the build i have setup uses an `.env` to set the backend server location in my case it it localhost:8080
to change it run `REACT_APP_PROXY=*your server location* npm run build ` this will update the bulid version and the 
create-react-app , you can also just hard code the servers location in the react-app and not use the .env,
it is up to you 
