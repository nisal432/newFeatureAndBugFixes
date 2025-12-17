<?php
session_start();
$_SESSION['username'] = 'nisal';
$city = "Atlanta";
if (isset($_POST['city'])) {
	$city = $_POST['city'];
}
try {
	require_once "../.includes/dbh.inc.php";
	$query = "SELECT count,id from users where username = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$_SESSION['username']]);
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	if (!$result) {
		echo json_encode(["status" => "notUser"]);
		die();
	}
	$id = $result['id'];
	$count = $result['count'];


	$query = "DELETE FROM favoritecities where cityName =? and user_id = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$city, $id]);
	if ($stmt->rowCount() > 0) {
		$count--;
		$query = "UPDATE users SET count = ? where id = ?";
		$stmt = $pdo->prepare($query);
		$stmt->execute([$count, $id]);
		echo json_encode(["status" => "success"]);
	} else {
		echo json_encode(["status" => "failure","city" => $city]);
	}
} catch (Exception $e) {
	echo $e->getMessage();
	echo json_encode(["status" => "error"]);
}
