<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db_connection.php';
include_once '../objects/admin_dashboard.php';

$database = new Database();
$db = $database->getConnection();

$admin_login_user = new admin($db);


/* ========================= student count  ====================================== */
     $admin_login_user->count();
    echo json_encode(array("count"=> $admin_login_user->count));    




?>