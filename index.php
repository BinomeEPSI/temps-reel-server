<?php
require_once("keys.php");

$start = time();
$su = isset($_REQUEST['k']) && md5($_REQUEST['k']) == 'f1c1592588411002af340cbaedd6fc33';

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

$verb = $_SERVER['REQUEST_METHOD'];
$uri_request = substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], "By"));
$req = explode('/', $uri_request);

if(!$su && !isset($keys[$_REQUEST['k']])) {
    err(400, "Bad requet, no or bad k");
}

switch($req[0]) {
    case 'players':
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
        break;
    case 'help':
?>      <dt>/PTRE839/help [GET] <dd>This help
        <dt>/PTRE839/players?k=123 [GET] <dd>All players info
        <dt>/PTRE839/players/456?k=123 [GET] <dd>Player 456 info
        <dt>/PTRE839/msgs?k=123&timeout=5000 [GET] <dd>Get the first message of 123 or wait 5s max
        <dt>/PTRE839/msgs?k=123&to=456&data=hello [POST] <dd>Send message hello from player 123 to 456
        <dt>/PTRE839/pings?k=123&t0=123456 [GET] <dd>Get ping information giving t0, t1, t2 timestamps
<?php
        die;    
        break;
    case 'php':
        phpinfo();
        break;
    case 'md5':
        check(array(), 2);
        $response = array(
            'in' => $req[1],
            'out' => md5($req[1])
        );
        break;
    case 'msgs':
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
        break;

    case 'pings':
        if($verb!='GET') {
            err(405, "Invalid method");
        }
        check(array('t0'));
        $response = array(
            't0' => (int)$_REQUEST['t0'],
            't1' => $start,
            't2' => time()
        );
        break;
}

header("Content-Type: application/json");
echo json_encode($response);
