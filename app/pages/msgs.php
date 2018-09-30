<?php
switch($verb) {
    case 'GET':
        check(array('timeout'));
        if(@msg_receive(initq($_REQUEST['k']), 0, $msgtype, 1024, $message, FALSE, MSG_NOERROR, $error)) {
            $response = array(
                'from' => $msgtype,
                'data' => $message
            );
        }
        else {
            err(500, "Server error, $error");
        }
        break;
    case 'POST':
        check(array('data', 'to'));
        if(@msg_send(initq($_REQUEST['to']), $_REQUEST['k'], $_REQUEST['data'], FALSE, true, $error)) {
            err(201, "Message sent");
        }
        else {
            err(500, "Server error, $error");
        }
        break;
    default:
        err(405, "Invalid method");
}