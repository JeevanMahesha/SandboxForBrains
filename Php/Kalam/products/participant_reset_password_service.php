<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/db_connection.php';

// instantiate product object
include_once '../objects/participant_login.php';

$database = new Database();
$db = $database->getConnection();
 
$participant_password_change = new participant_login($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));


$participant_password_change->email = $data->email;
$participant_password_change->password = $data->password;

if($participant_password_change->password_change()){
     // set response code - 200 ok
    http_response_code(200);
    
    // tell the user
    echo json_encode(array("message" => "participant_password_change was updated."));
}else{
 
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("message" => "Unable to update participant_password_change."));
}
        
?>