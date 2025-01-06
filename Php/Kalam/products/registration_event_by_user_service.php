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

$Registration_user = new Registration($db);
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $data = json_decode(file_get_contents("php://input"));
    $get_Kalam_id = $data->Kalam_id;
    $get_event_id = $data->event_id;
    $count = (int)$Registration_user->check_event_count($get_Kalam_id);
    if($count<5 and $count>=0){
        $Registration_user->check_event_already_registered($get_Kalam_id,$get_event_id);
        if($Registration_user->event_id != $data->event_id){
           if($Registration_user->event_and_Kalam_id_check($get_Kalam_id,$get_event_id)){
                $stmt = $Registration_user->event_registration($get_Kalam_id,$get_event_id);
                $num = $stmt->rowCount();
                if($num>0){ 
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                    extract($row);
                        $product_item=array(
                        "Kalam_id" => $Kalam_id,
                        "event_id" => $event_id,
                        "email" => $email,
                        "full_name" => $full_name,
                        "college" =>$college,
                        "mob_no" => $mob_no,
                        "event_name" => $event_name,
                        "description" => $description,
                        "event_rules" => $event_rules,
                        "event_date"=>$event_date,
                        "event_start_time" =>$event_start_time,
                        "event_end_time" => $event_end_time,
                        "venue" => $venue
                        );            
                    }
                    $Kalam_id          = $product_item["Kalam_id"]; 
                    $event_id          = $product_item['event_id'];
                    $email             = $product_item["email"];  
                    $full_name         = $product_item["full_name"];  
                    $college           = $product_item["college"]; 
                    $mob_no            = $product_item["mob_no"];  
                    $event_name        = $product_item["event_name"];  
                    $description       = $product_item["description"];  
                    $event_rules       = $product_item["event_rules"]; 
                    $event_date        = $product_item["event_date"];
                    $event_start_time  = $product_item["event_start_time"]; 
                    $event_end_time    = $product_item["event_end_time"];  
                    $venue             = $product_item["venue"];  
                    if( !empty($Kalam_id)&&!empty($event_id)){
                            $Registration_user->Kalam_id = $Kalam_id;
                            $Registration_user->event_id =$event_id;
                            $Registration_user->email = $email;
                            $Registration_user->full_name = $full_name;
                            $Registration_user->college = $college;
                            $Registration_user->mob_no = $mob_no;
                            $Registration_user->event_name = $event_name;
                            $Registration_user->description = $description;
                            $Registration_user->event_rules = $event_rules;
                            $Registration_user->event_date = $event_date;
                            $Registration_user->event_start_time = $event_start_time;
                            $Registration_user->event_end_time = $event_end_time;
                            $Registration_user->venue = $venue;
        
                            if ($Registration_user->registration_success()){
                                // set response code - 201 created
                                    http_response_code(201);
                                    echo json_encode(array("status"=>"201","message" => "Registration Successfull."));  
                            }else{
                                    http_response_code(503);
                                    echo json_encode(array("status"=>"503","message" => "Unable to  Register the event  ."));
                            }                      
                    }else{
                        http_response_code(204);
                        echo json_encode(array("status"=>"204","message" => "No Content"));                
                    }
                }else{
                        http_response_code(404);
                        echo json_encode(array("status"=>"404","message" => "Please Signup/Login."));
                }
            }else{
                http_response_code(404);
                echo json_encode(array("status"=>"404","message" => " NO found."));
            }  
        }else{
            http_response_code(406);
            echo json_encode(array("status"=>"406","message" => " You already Registered This Event."));
        }
    }else{
        http_response_code(406);
        echo json_encode(array("status"=>"406","message" => " You Registration Limit is Exceeded."));
    }
        
}else{
    http_response_code(405);
    echo json_encode(array("status"=>"405","message"=>"Method Not Allowed"));
}
?>