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

/* ============  Delete single user ================== */
if($admin_login_user->delete()){
    
    http_response_code(200);
    echo json_encode(array("status"=>"200","message" => "successfully."));
}

else{
    http_response_code(400);
    echo json_encode(
        array("status"=>"404","message" => "Unsuccessfully.")
    );
}



?>