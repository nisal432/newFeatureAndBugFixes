<?php
session_start();
$_SESSION['username'] = 'nisal';
try{
	require_once".includes/dbh.inc.php";
	$query = "SELECT * FROM users where username =?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$_SESSION['username']]);
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	if(!$result){
		echo json_encode(["status" =>"noUser"]);
		die();

	}
	echo json_encode(["status" =>"success",
	"username" => $result['username'],
	"email" => $result['email'],
	"createdAt" =>$result['created_at']

]);

}
catch(Exception $e){
echo json_encode(["status" =>"error"]);
}

