<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/db_connection.php';

// instantiate product object
include_once '../objects/events_details.php';


// get database connection
$database = new Database();
$db = $database->getConnection();

$events_details_update = new events_details($db);

 
// get posted data
$data = json_decode(file_get_contents("php://input"));

        $events_details_update->admin_id = $data->admin_id;
        $events_details_update->event_id = $data->event_id;     
        $events_details_update->category = $data->category;
        $events_details_update->event_name = $data->event_name;
        $events_details_update->description = $data->description;
        $events_details_update->event_rules = $data->event_rules;
        $events_details_update->student_coordinator_name = $data->student_coordinator_name;
        $events_details_update->student_coordinator_number = $data->student_coordinator_number;
        $events_details_update->staff_coordinator_name = $data->staff_coordinator_name;
        $events_details_update->staff_coordinator_number = $data->staff_coordinator_number;
        $events_details_update->event_date = $data->event_date;
        $events_details_update->event_start_time = $data->event_start_time;
        $events_details_update->event_end_time = $data->event_end_time;
        $events_details_update->venue = $data->venue;
        $events_details_update->status = 1;

// update the product
if($events_details_update->update()){
 
    // set response code - 200 ok
    http_response_code(200);
 
    // tell the user
    echo json_encode(array("status" => "200","message" => "events_details_update was updated."));
    //(echo json_encode(array());
}
 
// if unable to update the product, tell the user
else{
 
    // set response code - 503 service unavailable
    http_response_code(503);
    echo json_encode(array("status" => "503","message" => "Unable to update events_details_update."));
    // tell the user
    //echo json_encode(array("message" => "Unable to update events_details_update."));
}

?>