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

$admin_event_name_get = new admin($db);
$stmt = $admin_event_name_get->event_name();
$num = $stmt->rowCount();

if($num>0){ 

    $products_arr=array();
    $products_arr["admin_event_name_get"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_item=array(
            "event_name" =>$event_name,
            "event_id" => $event_id
        );
        array_push($products_arr["admin_event_name_get"], $product_item);
    }
     http_response_code(200);
     echo json_encode($products_arr);
}
else{
    http_response_code(405);
    echo json_encode(array("status"=>"405","message"=>"no event"));
}
?>