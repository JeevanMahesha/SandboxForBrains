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

$admin_get = new admin($db);
$stmt = $admin_get->admin_get();
$num = $stmt->rowCount();

if($num>0){ 

    $products_arr=array();
    $products_arr["admin_get"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_item=array(
            "admin_id" =>$admin_id,
            "email_id" => $email_id,
            "password" => $password
        );
        array_push($products_arr["admin_get"], $product_item);
    }
     http_response_code(200);
     echo json_encode($products_arr);
}
else{
    http_response_code(405);
    echo json_encode(array("status"=>"405","message"=>"no event"));
}
?>