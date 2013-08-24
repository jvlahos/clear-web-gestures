
<html>
<head>
	<title>Demo - A Gesture Experiment Based on Clear | Jeff Vlahos</title>
	<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="stylesheet" href="clear.css"/>
</head>

<body>
	<!--Pull to create item-->
	<div class="item-mod" id="new-item-top">
		<div class="item">
				<input disabled="disabled" type="text" value="Pull to Create Task"/>
		</div>
	</div>
	<!--Mod is where all the items go-->
	<div id="mod" class="mod">
		<?php
			$itemsText = array("Welcome!", "Drag me to the right.", "Drag me to the left.", "Tap to edit me.", "Drag down for new item.");
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
		<!--Spacer is used as a DOM marker to know where to move items-->
		<!--Incomplete items stay above it. Complete items move below it-->
		<div id="spacer"></div>
	</div><!--eo mod-->

	<!--An old space that would be used to trigger a new item at bottom-->
	<!-- <div id="new-item-trigger">
		<div class="item-mod hanger">
			<div class="item">
				<input type="text" value=""/>
			</div>
		</div>
	</div> -->

	<!--Item template cloned for new items-->
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
	<!--<script src="_js/libs/jquery-ui-1.10.3.custom.min.js"></script>-->
	<script src="_js/clear.js"></script>

	<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-22169597-2', 'jeffvlahos.com');
  ga('send', 'pageview');
	</script>

</body>
</html>
