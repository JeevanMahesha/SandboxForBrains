<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db_connection.php';
include_once '../objects/participant_login.php';

$database = new Database();
$db = $database->getConnection();

$participant_login_get = new participant_login($db);

$stmt = $participant_login_get->read();
$num = $stmt->rowCount();

if($num>0){ 

    $products_arr=array();
    $products_arr["participant_login_get"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_item=array(
            "Kalam_id" =>$Kalam_id,
            "email" => $email,
            "full_name" => $full_name,
            "department" => $department,
            "year" => $year,
            "college" => $college,
            "password" => $password,
            "status" => $status,
            "mob_no" => $mob_no

        );
        array_push($products_arr["participant_login_get"], $product_item);
    }
     http_response_code(200);
     echo json_encode($products_arr);
}
 
else{
    http_response_code(404);
     echo json_encode(
        array("status"=>"404","message" => "No services found.")
    );
}

?>