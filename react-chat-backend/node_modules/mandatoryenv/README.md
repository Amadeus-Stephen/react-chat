## Mandatory Env

Find loads and verifies your enviroment variables wherever they are! (.env files for example)


https://www.npmjs.com/package/mandatoryenv


·Disclaimer: This module uses dotenv in the background, adding only extra checking for the variables it loads.

Example usage:
````javascript
// *** .env < Be careful with spacing
DB_USER=mySecureDbUser
DB_PASSWORD=123
PORT=3000

````

````javascript
// *** src/index.js  <<< You only need to require mandatoryenv once
require('mandatoryenv').load([
    'DB_USER',
    'DB_PASSWORD',
    'PORT']);

console.log(process.env); // {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'PORT': '3000'}
console.log(env); // {'DB_USER': 'mySecureDbUser', 'DB_PASSWORD': '123', 'PORT': '3000'}
````

````javascript
// *** src/server.js < It's not necessary to require it again as we already did on index.js so we just use values directly
app.listen(env.PORT, () => console.log(`Serverl listening on port ${env.PORT}`));

````

````javascript
// *** src/model/database.js
mysql.createConnection({
    user: env.DB_USER,
    password: env.DB_PASSWORD
})
````