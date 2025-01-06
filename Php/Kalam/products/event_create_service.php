<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db_connection.php';
include_once '../objects/events_details.php';

$database = new Database();
$db = $database->getConnection();

$events_details_create = new events_details($db);
$data = json_decode(file_get_contents("php://input"));

if( !empty($data->admin_id)&&
    !empty($data->category)){
        
        $events_details_create->admin_id = $data->admin_id;
        $events_details_create->event_id = $data->event_id;
        $events_details_create->category = $data->category;
        $events_details_create->event_name = $data->event_name;
        $events_details_create->description = $data->description;
        $events_details_create->event_rules = $data->event_rules;
        $events_details_create->student_coordinator_name = $data->student_coordinator_name;
        $events_details_create->student_coordinator_number = $data->student_coordinator_number;
        $events_details_create->staff_coordinator_name = $data->staff_coordinator_name;
        $events_details_create->staff_coordinator_number = $data->staff_coordinator_number;
        $events_details_create->event_date = $data->event_date;
        $events_details_create->event_start_time = $data->event_start_time;
        $events_details_create->event_end_time = $data->event_end_time;
        $events_details_create->venue = $data->venue;
        $events_details_create->status = 1;
    
    // create the events_details_create
    if($events_details_create->create_events_details()){
 
    // set response code - 201 created
        http_response_code(201);

    // tell the user
        echo json_encode(array("status"=> "201","message"=>"Created"));  
    }
    // if unable to create the events_details_create, tell the user
        else{

        // set response code - 503 service unavailable
            http_response_code(503);
            echo json_encode(array("status"=> "503","message"=>"503 service unavailable"));


        // tell the user
        
        }
    }else{
        http_response_code(404);
        echo json_encode(array("status"=> "404","message"=>"data incomplet"));

}

?>