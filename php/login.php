<?php
session_start();
// require_once "../.includes/checkRequestMethod.php";
$enteredenteredUsername = 'nisal';
if (!($_POST['username'] && $_POST['pswd'])) {
	header("Location:../htmls/authentication.html?message=incomplete");
	die();
}
$userPassword = $_POST['pswd'];
$enteredUsername = $_POST['username'];
// $_SESSION['username'] = $username;
try {
	require_once "../.includes/dbh.inc.php";
	$query = "SELECT pswd FROM users where username =?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$enteredUsername]);
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	echo $result . "hello";
	echo $enteredUsername;
	if (!$result) {
		// header("Location:../htmls/authentication.html?message=wrongUsername");
		die();
	}
	$hashed = $result['pswd'];
	$hashed = $userPassword;
	if ($userPassword !== $hashed) {
		header("Location:../htmls/authentication.html?message=invalid");
		die();
	}
			header("Location:../mainPage/mainPage.php");
			$_SESSION['username'] = $username;

} catch (Exception $e) {
	header("Location:../htmls/authentication.html?message=error");
}
