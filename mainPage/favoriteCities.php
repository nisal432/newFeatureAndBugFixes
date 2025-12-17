<?php



session_start();
$_SESSION['username'] = 'nisal';
try {
	require_once "../.includes/dbh.inc.php";
	$query = "SELECT  count,id FROM users where username = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$_SESSION['username']]);
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	// print_r($result);
	if ($result) {
		if ($result['count'] < 1) {
			echo json_encode(["status" => "noFavorites"]);
			die();
		}
		$query = "SELECT json FROM favoritecities where user_id = ?";
		$stmt = $pdo->prepare($query);
		$stmt->execute([$result['id']]);
		$results= $stmt->fetchAll(PDO::FETCH_ASSOC);
		// print_r($results);
		$length = count($results);
		$allJson = '';
		$i = 0;
		// echo $length;
		foreach($results as $result){
			if($i ===0)
				$allJson = json_decode($result['json'], true);
			else{
				$allJson['city'][] = json_decode($result['json'],true)['city'][0];
				$allJson['latitude'][] = json_decode($result['json'],true)['latitude'][0];
				$allJson['longitude'][] = json_decode($result['json'],true)['longitude'][0];

			}
			$i++;
		}
		// print_r($allJson);
		$allJson['status'] = "success";
		echo json_encode($allJson);

	} else
		echo json_encode(["status" => "noUser"]);
} catch (Exception $e) {
	echo json_encode(["status" => "error"]);
}
