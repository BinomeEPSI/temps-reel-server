<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../../keys.php");
require_once("../../func.php");

$start = time();
$su = isset($_REQUEST['k']);

define ("V_GET" , "GET");
define ("V_DELETE" , "DELETE");

$verb = $_SERVER['REQUEST_METHOD'];
$uri_request = substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], "?"));
$req = array_slice(explode('/', $uri_request), 2);

$response=[];

if($su && isset($keys[$_REQUEST['k']])) {
    switch($req[0]) {
        case 'players':
            require("../../pages/players.php");
            break;
        case 'help':
            require("../../pages/help.php");
            die;    
            break;
        case 'php':
            require("../../pages/php.php");
            break;
        case 'md5':
            require("../../pages/md5.php");
            break;
        case 'msgs':
            require("../../pages/msgs.php");
            break;
        case 'pings':
            require("../../pages/pings.php");
            break;
    }
} else {
    err(400, "Bad requet, no or bad k");
}

header("Content-Type: application/json");
echo json_encode($response);
