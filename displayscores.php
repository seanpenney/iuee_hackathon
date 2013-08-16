<!DOCTYPE HTML>
<html>
	<head>
		<title>Hi Score Information</title>
	</head>

	<?php
		include('common.inc.php');	
		$query =	"select *
						from hiscores
						order by maxlevel desc";
							
		$result = mysqli_query($link, $query);
	?>

	<body>
		<h1 style="font-weight:normal;">Highest level reached for each player:</h1>

		<table border="1">
			<tr>
				<th>Name</th>
				<th>Highest level</th>
			</tr>
				
			<?php while ($record = mysqli_fetch_array($result)): ?>
			<tr>
				<td><?php print $record['name'];?></td>
				<td><?php print $record['maxlevel'];?></td>
			</tr>
			<?php endwhile; mysqli_free_result($result);?>
			
		</table>
		<br>
		<a href="steakout.html">Go back to main page</a>
	</body>
</html>
