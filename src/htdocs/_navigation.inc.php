<?php
$section = '/hazards/postfire_debrisflow';

echo navGroup(navItem('/index.php', 'Post-fire Debris-flow Hazards'),
  navItem("${section}/background2016.php", 'Scientific Background') .
  navItem("${section}/request.php", 'Assessment Request') .
  navItem("${section}/disclaimer.php", 'Disclaimer') .
  navItem("${section}/updates.php", 'Updates')
);
?>
