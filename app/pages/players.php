<?php
switch($verb) {
    case 'GET':
        if(!isset($req[1])) {
            $response = array();
            foreach(array_keys($keys) as $k) {
                $response[] = player($k);
            }
        }
        else if(isset($keys[$req[1]])) {
            $response = player($req[1]);
        }
        else {
            err(404, "Player not found");
        }
        break;
    case 'DELETE':
        if($su) {
            foreach(array_keys($keys) as $k) {
                msg_remove_queue(initq($k));
            }
        }
        break;
    default:
        err(405, "Invalid method");
}