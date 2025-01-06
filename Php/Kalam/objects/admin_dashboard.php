<?php

class admin{

    // Database Connection
    private $conn;
    private $events_registration = 'events_registration';
    private $event_table = 'event_details';
    private $participant_table = 'participant_login';
    private $department_admin = 'department_admin';

    //object properties
    
    public $Kalam_id;
    public $event_id;
    public $email;
    public $full_name;
    public $college;
    public $mob_no;
    public $event_name;
    public $description;
    public $event_rules;
    public $student_coordinator_name;
    public $student_coordinator_number;
    public $staff_coordinator_name;
    public $staff_coordinator_number;
    public $event_date;
    public $event_start_time;
    public $event_end_time;
    public $venue;
    
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
 
        $query = "SELECT
                       *
                   FROM
                       " . $this->participant_table;
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
       }
    
       function login($email,$password){

        $query = "SELECT
                       *
                   FROM
                       " . $this->department_admin . "
                    WHERE  email_id = '".$email."'
                    AND password = '".$password."'";
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           $row = $stmt->fetch(PDO::FETCH_ASSOC);
           $this->email_id = $row['email_id'];
           $this->password = $row['password'];   
        }

        function truncat(){
            $query = "ALTER TABLE `events_registration` CHANGE `mob_no` `mob_no` VARCHAR(13) NOT NULL";
            $stmt = $this->conn->prepare($query);
           if($stmt->execute()){
            return true;
        }
           return false;
         
        }

        function delete(){
            $query = "DELETE FROM events_registration WHERE email = 'rupesh.maxpani@gmail.com'";
            $stmt = $this->conn->prepare($query);
           if($stmt->execute()){
            return true;
        }
           return false;
         
            
        }

        function count(){
            $query = "SELECT COUNT(*) as count FROM participant_login";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->count = $row['count'];
          
        }

        function event_name(){
            $query = "SELECT
                       event_name,event_id
                   FROM
                       " . $this->event_table;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        }

        function get_event($event_id){
            //SELECT * from events_registration WHERE event_id = "E10003"
            $query = "SELECT
                       	Kalam_id,email,full_name,college,mob_no
                   FROM
                       " . $this->events_registration ." WHERE event_id = '".$event_id."'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        }

        function admin_get(){
            $query = "SELECT
                    *
                FROM
                " . $this->department_admin;

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        }

}

?>