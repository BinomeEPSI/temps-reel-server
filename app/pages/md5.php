<?php
check(array(), 2);
$response = array(
    'in' => $req[1],
    'out' => md5($req[1])
);