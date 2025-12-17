<?php
// require_once".includes/checkRequestMethod.php";


session_start();
$_SESSION['username'] = "nisal";


$city = 'bhaktapur';
if (isset($_POST['city'])) {
	$city = $_POST['city'];
	$city = str_replace(' ', '+', $city);
}

$url = "https://geocoding-api.open-meteo.com/v1/search?name=" . $city . "&count=1";
$data = file_get_contents($url);
$result = json_decode($data, true);
// print_r($result);

if (isset($result['results'])) {
	try {
		require_once "../.includes/dbh.inc.php";

		$city = $result['results'][0]['name'];
		$latitude = $result['results'][0]['latitude'];
		$longitude = $result['results'][0]['longitude'];
		$query = "SELECT count,id FROM users where username = ?";

		$stmt = $pdo->prepare($query);
		$stmt->execute([$_SESSION['username']]);

		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$result)
			die();
		$count = $result['count'];
		$id = $result['id'];
		if ($count >= 2) {
			echo json_encode(["status" => "limitReached"]);
			die();
		}

		if ($count < 2) {
			if ($count === 1) {
				$query = "SELECT json FROM favoritecities where user_id = ?";
				$stmt = $pdo->prepare($query);
				$stmt->execute([$id]);
				$result = $stmt->fetch(PDO::FETCH_ASSOC);
				$data = json_decode($result['json'], true);
				if ($data['city'][0] === $city) {
					echo json_encode(["city" => $city, "status" => "alreadyExists"]);
					die();
				}
			}
			$query = "INSERT INTO favoritecities(json, user_id, cityName) VALUES(?,?,?)";
			$stmt = $pdo->prepare($query);
			$stmt->execute([
				json_encode([
					"city" => [$city],
					"latitude" => [$latitude],
					"longitude" => [$longitude],

				]),
				$id,
				$city

			]);
		}
		$count++;
		$query = "UPDATE users SET count = ? WHERE id = ?";
		$stmt = $pdo->prepare($query);
		$stmt->execute([$count, $id]);
		echo json_encode(["city" => $city, "status" => "success"]);
	} catch (PDOException $e) {
		echo $e->getMessage();
		echo json_encode(["status" => "error"]);
	}
} else
	echo json_encode(["status" => "notFound"]);
