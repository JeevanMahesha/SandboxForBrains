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

$events_details_profile = new events_details($db);

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $data = json_decode(file_get_contents("php://input"));
    $admin_id = $data->admin_id;
    $stmt = $events_details_profile->read_one($admin_id);
    $num = $stmt->rowCount();

    if($num>0){ 

        $products_arr=array();
        $products_arr["events_details_profile"]=array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $product_item=array(
                "admin_id" => $admin_id,
                "event_id" => $event_id,
                "category" => $category,
                "event_name" => $event_name,
                "description" => $description,
                "event_rules" => $event_rules,
                "student_coordinator_name" => $student_coordinator_name,
                "student_coordinator_number" => $student_coordinator_number,
                "staff_coordinator_name" => $staff_coordinator_name,
                "staff_coordinator_number" => $staff_coordinator_number,
                "event_date" => $event_date,
                "event_start_time" => $event_start_time,
                "event_end_time" => $event_end_time,
                "venue" => $venue,
                "status" => $status

            );
            array_push($products_arr["events_details_profile"], $product_item);
        }
        http_response_code(200);
        echo json_encode($products_arr);
    }
    
    else{
        http_response_code(404);
        echo json_encode(
            array("status"=>"404","message" => "No Data Found")
        );
    }
}
else{
    http_response_code(404);
    echo json_encode(array("status"=>"404","message" => "Method Error"));
}

?>