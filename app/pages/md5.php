<?php
switch($verb) {
    case V_GET:
        check(array(), 2);
        $response = array(
            'in' => $req[1],
            'out' => md5($req[1])
        );
        break;
    default:
        err(405, "Invalid method");
}