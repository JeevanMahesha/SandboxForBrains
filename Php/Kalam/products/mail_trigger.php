<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 

// instantiate product object
include_once '../phpmailer/mailer.php';


$Mail_trigger = new Mailer();
 
// get posted data
 $data = json_decode(file_get_contents("php://input")); 


$Mail_trigger->to_address = $data->email;

$Mail_trigger->name = $data->name;

/* $Mail_trigger->to_address = 'raghulrage@gmail.com';
$Mail_trigger->name = 'raghul'; */

$Mail_trigger->sendMail();
?>