<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db_connection.php';
include_once '../objects/registration.php';

$database = new Database();
$db = $database->getConnection();

$all_student_registerted = new Registration($db);

$stmt = $all_student_registerted->read();
$num = $stmt->rowCount();

if($num>0){ 

    $products_arr=array();
    $products_arr["all_student_registerted"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_item=array(
            "Kalam_id" => $Kalam_id,
            "event_id" => $event_id,
            "email" => $email,
            "full_name" => $full_name,
            
            "college" => $college,
           
            "mob_no" => $mob_no,
            "event_name" => $event_name,
            "description" => $description,
            "event_rules" => $event_rules,
            "event_date" => $event_date,
            "event_start_time" => $event_start_time,
            "event_end_time" => $event_end_time,
            "venue" => $venue,
            

        );
        array_push($products_arr["all_student_registerted"], $product_item);
    }
     http_response_code(200);
     echo json_encode($products_arr);
}
 
else{
    http_response_code(404);
     echo json_encode(
        array("status"=>"404","message" => "No Service Found"));
}

?>