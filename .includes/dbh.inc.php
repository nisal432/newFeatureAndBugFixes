<?php
$host = "localhost";
$dbName = "weatherproject";
$username = "root";
$pswd = '';
$dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
try{
	$pdo = new PDO($dsn, $username, $pswd);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
}
catch(PDOException $e){
	 echo"failure is sfa";
}