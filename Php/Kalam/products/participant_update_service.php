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
 
$participant_login_update = new participant_login($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));

 $participant_login_update->Kalam_id=$data->Kalam_id;
$participant_login_update->email = $data->email;
$participant_login_update->full_name = $data->full_name;
$participant_login_update->department = $data->department;
$participant_login_update->year = $data->year;
$participant_login_update->college = $data->college;
$participant_login_update->status = 1;
$participant_login_update->mob_no = $data->mob_no;


if($participant_login_update->update()){
     // set response code - 200 ok
    http_response_code(200);
    $participant_login_update->update_number();
    // tell the user
    echo json_encode(array("status"=>"200","message" => "Profile Details updated."));
}else{
 
    // set response code - 503 service unavailable
    http_response_code(503);
    // tell the user
    echo json_encode(array("status"=>"503","message" => "Unable to Update Profile Details."));
}
        
?>