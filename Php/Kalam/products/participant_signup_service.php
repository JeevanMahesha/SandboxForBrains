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
 
$participant_login_insert = new participant_login($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
$get_email = $data->email;


if( !empty($data->email)&&
    !empty($data->full_name)&&
    !empty($data->department)&&
    !empty($data->year)&&
    !empty($data->college)&&
    !empty($data->password)&&
    !empty($data->mob_no)){
    $participant_login_insert->signup($get_email);
    if ($participant_login_insert->email != $data->email){
        $participant_login_insert->Kalam_id=$data->Kalam_id;
        $participant_login_insert->email = $data->email;
        $participant_login_insert->full_name = $data->full_name;
        $participant_login_insert->department = $data->department;
        $participant_login_insert->year = $data->year;
        $participant_login_insert->college = $data->college;
        $participant_login_insert->password = $data->password;
        $participant_login_insert->status = 1;
        $participant_login_insert->mob_no = $data->mob_no;
        if($participant_login_insert->create()){
            $participant_signup_data["participant_signup_data"]=array(); 
            $product_arr = array(
                "Kalam_id" => $data->Kalam_id,
                "email" => $data->email,
                "full_name" => $data->full_name,
                "department" => $data->department,
                "year" => $data->year,
                "college" => $data->college,
                "mob_no" => $data->mob_no);
                array_push($participant_signup_data["participant_signup_data"], $product_arr);
            // set response code - 201 created
            http_response_code(201);
            
            // tell the user
            echo json_encode(array("status"=>"201","Data" => $participant_signup_data));  
            }else{
                // set response code - 503 service unavailable
                http_response_code(200);
                // tell the user
                echo json_encode(array("status"=>"503","message" => "Oops! Your Signup is unsuccessfull."));
            }
    }else{  
        http_response_code(200);
        echo json_encode(array("status"=>"400","message" => "User already exist."));
    }
}else{
    // set response code - 400 bad request
    http_response_code(200);
    // tell the user
    echo json_encode(array("status"=>"406","message" => "Unable to create participant_login_insert. Data is incomplete."));
}
?>