<?php
function err($code, $msg) {
    header("HTTP/1.1 $code $msg");
    die;
}
function check($params, $url_segments=1) {
    global $req;

    if(count($req)<$url_segments) {
        err(400, "Bad request, missing url items");
    }
    foreach($params as $param) {
        if(!isset($_REQUEST[$param])) {
            err(400, "Bad request, $param expected");
        }
    }    
}
function k2q($k) {
    global $keys;

    if(!isset($keys[$k])) {
        err(400, 'Bad request, unknown player $k');
    }
    return ftok(__FILE__, $keys[$k]['projid']);
}
function initq($k) {
    return msg_get_queue(k2q($k));
}
function player($k) {
    global $keys;

    $stat = msg_stat_queue(initq($k));
    $stat = $stat ? array_merge($keys[$k], $stat) : $keys[$k];
    unset($stat['projid']);
    $stat['id'] = $k;
    return $stat;
}