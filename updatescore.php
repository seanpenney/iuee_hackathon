<?php
	include('common.inc.php');
	$score = $_POST['score'];
	$username = $_POST['username'];

	$query = "select *
					from hiscores AS H
					where H.name = '$username'";
	$result = mysqli_query($link, $query);
	$row_count = mysqli_num_rows($result); // to check if name exists
	if ($row_count > 0) {
		$record = mysqli_fetch_array($result);
		$previousscore = $record['maxlevel']; // get their previous max level
	}
	mysqli_free_result($result);
	
	if ($row_count == 0) { // add name and score
		$query = "insert into hiscores(name, maxlevel)
					values('$username', $score)";
		$result = mysqli_query($link, $query);
	} else { // update best score
		if ($score > $previousscore){ 
			$query = "update hiscores
						set maxlevel = $score
						where name = '$username'";
			$result = mysqli_query($link, $query);
		}
	}
	mysqli_free_result($result);
?>