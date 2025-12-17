<?php
session_start();
$_SESSION['username'] = 'nisal';


$newCity = 'bhaktapur';
$newCity = str_replace(' ', '+', $newCity);

$oldCity = 'india';
if (isset($_POST['city']) && isset($_POST['oldCity'])) {
	$newCity = $_POST['city'];
	$newCity = str_replace(' ', '+', $newCity);
	$oldCity = $_POST['oldCity'];
	$oldCity = str_replace(' ', '+', $oldCity);
}

$oldJsonText = '';
// echo json_encode(["status" => $city.$oldCity]);
// 	die();
//for old city double checking through server side
$url = "https://geocoding-api.open-meteo.com/v1/search?name=" . $oldCity . "&count=1";
$data = file_get_contents($url);
$result = json_decode($data, true);
// echo "hello by the way";
if (isset($result['results'])) {
	try {
		require_once "../.includes/dbh.inc.php";

		$city = $result['results'][0]['name'];
		$latitude = $result['results'][0]['latitude'];
		$longitude = $result['results'][0]['longitude'];
		$query = "SELECT count,id FROM users where username = ?";
		$oldJsonText = json_encode([
			"city" => [$city],
			"latitude" => [$latitude],
			"longitude" => [$longitude],

		]);

		$stmt = $pdo->prepare($query);
		$stmt->execute([$_SESSION['username']]);

		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$result) {
			echo json_encode(["status" => "notUser"]);

			die();
		}
		$count = $result['count'];
		$id = $result['id'];
		if ($count  < 1) {
			echo json_encode(["status" => "noFavorites"]);
			die();
		}
		$query = "SELECT id from favoritecities where json = ?";
		$stmt = $pdo->prepare($query);
		$stmt->execute([$oldJsonText]);
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$result) {
			echo json_encode(["status" => "notMatched"]);
			die();
		}
		$fid = $result['id'];
	} catch (Exception $e) {
		echo $e->getMessage();
		echo json_encode(["status" => "error"]);
	}
} else {
	echo json_encode(["status" => "notMatched"]);
	die();
}





// for validating new city
$url = "https://geocoding-api.open-meteo.com/v1/search?name=" . $newCity . "&count=1";
$data = file_get_contents($url);
$result = json_decode($data, true);
if (isset($result['results'])) {
	try {
		require_once "../.includes/dbh.inc.php";

		$city = $result['results'][0]['name'];
		$latitude = $result['results'][0]['latitude'];
		$longitude = $result['results'][0]['longitude'];
		$jsonText = json_encode([
			"city" => [$city],
			"latitude" => [$latitude],
			"longitude" => [$longitude],

		]);
		if ($oldJsonText === $jsonText) {
			echo json_encode(["status" => "sameCity"]);
			die();
		}
		$query = "SELECT count,id FROM users where username = ?";

		$stmt = $pdo->prepare($query);
		$stmt->execute([$_SESSION['username']]);

		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$result) {
			echo json_encode(["status" => "notUser"]);

			die();
		}
		$count = $result['count'];
		$id = $result['id'];
		$query = 'SELECT json FROM favoritecities where user_id = ?';
		$stmt = $pdo->prepare($query);
		$stmt->execute([$id]);
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		// print_r($result);
		$alreadyExists = false;
		for ($i = 0; $i < $count; $i++) {
			$checkJson = $result[$i]['json'];
			if ($jsonText === $checkJson)
				$alreadyExists = true;
		}
		if ($alreadyExists) {
			echo json_encode(["status" => "alreadyExists"]);
			die();
		}
		if ($count <= 2) {
			$query = "UPDATE favoritecities SET json = ?, cityName =? where id = ?";
			$stmt = $pdo->prepare($query);
			$stmt->execute([$jsonText,$city, $fid]);
			echo json_encode(["city" =>$city,"status" => "success"]);
		}
	} catch (Exception $e) {
		// echo $e->getMessage();
		echo json_encode(["status" => "error"]);
	}
} else
	echo json_encode(["status" => "notFound"]);
