<?php
switch($verb) {
    case V_GET:
        check(array('t0'));
        $response = array(
            't0' => (int)$_REQUEST['t0'],
            't1' => $start,
            't2' => time()
        );
        break;
    default:
        err(405, "Invalid method");
}