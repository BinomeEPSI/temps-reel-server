<?php
switch($verb) {
    case V_GET:
    echo <<<EOT
    <dt>/PTRE839/help [GET] <dd>This help
    <dt>/PTRE839/players?k=123 [GET] <dd>All players info
    <dt>/PTRE839/players/456?k=123 [GET] <dd>Player 456 info
    <dt>/PTRE839/msgs?k=123&timeout=5000 [GET] <dd>Get the first message of 123 or wait 5s max
    <dt>/PTRE839/msgs?k=123&to=456&data=hello [POST] <dd>Send message hello from player 123 to 456
    <dt>/PTRE839/pings?k=123&t0=123456 [GET] <dd>Get ping information giving t0, t1, t2 timestamps
EOT;
        break;
    default:
        err(405, "Invalid method");
}