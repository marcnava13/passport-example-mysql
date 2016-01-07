# Node Authentication with MySQL

Following steps the [scotch.io] tutorial series, I've done the authentication local, Facebook and Google but with MySQL.

### Installation
* Download and install dependencies node and assets:
```sh
$ git clone https://github.com/marcnava13/passport-mysql-example.git <folder>
$ npm install
$ bower install
```
* Edit the database configuration file: `config/database.js`  
* Create database in your server MySQL.
```sh
$ node scripts/create_database.js
```
Edit file the keys provider `config/auth.js`.
Launch server:
```sh
$ sudo npm start
```
In your browser at: `http://localhost:8080`

[scotch.io]: <https://scotch.io/tutorials/easy-node-authentication-setup-and-local>
