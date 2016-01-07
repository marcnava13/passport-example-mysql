var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.table.users + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `displayName` TEXT, \
    `email` TEXT, \
    `password` CHAR(60), \
    `provider` VARCHAR(65), \
    `provider_id` TEXT, \
    `token` TEXT, \
    	PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) \
)');

console.log('Success: Database Created!');

connection.end();
