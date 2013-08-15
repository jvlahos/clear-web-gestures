
<html>
<head>
	<title>Clear for Web</title>
	<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="stylesheet" href="clear.css"/>
	<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
</head>

<body>
	<div class="item-mod" id="new-item-top">
		<div class="item">
				<input disabled="disabled" type="text" value="Pull to Create Task"/>
		</div>
	</div>
	<div id="mod" class="mod">
		<?php

			$itemsText = array("Drag me to the right.", "Drag me to the left.", "Tap to edit me.", "Drag down for new item.", "Tap below for new item.");
			$items = 5;
			for ($i=1; $i<=$items; $i++) {
				$hue = (30 / $items)*$i;
				echo '<div class="item-mod">';
					echo '<div class="item" ';
					echo 'style="';
					echo 'background-color: hsl('.$hue.', 100%, 50%);';
					echo ' border-top-color: hsl('.$hue.', 100%, 70%);';
					echo ' border-bottom-color: hsl('.$hue.', 100%, 30%);';
					echo '">';
						echo'<input disabled="disabled" type="text" value="'.$itemsText[($i-1)].'"/>';
				echo '</div></div>';
			}
		?>
		<div id="spacer"></div>
	</div><!--eo mod-->

	<!--Space for triggering new item-->
	<div id="new-item-trigger">
		<div class="item-mod hanger">
			<div class="item">
				<input type="text" value=""/>
			</div>
		</div>
	</div>

	<!--Item template for spawning new item-->
	<div id="item-mod-template">
		<div class="item-mod new">
			<div class="item">
				<input type="text" value=""/>
			</div>
		</div>
	</div>

	<!--Scripts-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	<script src="_js/libs/jquery.hammer.min.js"></script>
	<script src="_js/libs/jquery-ui-1.10.3.custom.min.js"></script>
	<script src="_js/clear.js"></script>

</body>
</html>
