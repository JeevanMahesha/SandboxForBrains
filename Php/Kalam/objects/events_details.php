<?php

class events_details{

    // Database Connection
    private $conn;
   
    private $table_name = 'event_details';

    //object properties
    public $admin_id;
    public $event_id;
    public $category;
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
    public $status;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read_one($admin_id){
 
        $query = "SELECT
                       *
                   FROM
                       " . $this->table_name . "
                    WHERE  admin_id = '".$admin_id."'";
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
    }

    function read(){
 
        $query = "SELECT
                       *
                   FROM
                       " . $this->table_name;
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
       }
    
    

    function create_events_details(){
        // try {
      
         $query = "INSERT INTO    " . $this->table_name ."
                 SET
                      admin_id=:admin_id,
                      event_id=:event_id,
                      category=:category,
                      event_name=:event_name,
                      description=:description,
                      event_rules=:event_rules,
                      student_coordinator_name=:student_coordinator_name,
                      student_coordinator_number=:student_coordinator_number,
                      staff_coordinator_name=:staff_coordinator_name,
                      staff_coordinator_number=:staff_coordinator_number,
                      event_date=:event_date,
                      event_start_time=:event_start_time,
                      event_end_time=:event_end_time,
                      venue =:venue,
                      status =:status";
      
         $stmt = $this->conn->prepare($query);
     
         // sanitize
         $this->admin_id=htmlspecialchars(strip_tags($this->admin_id));
         $this->event_id=htmlspecialchars(strip_tags($this->event_id));
         $this->category=htmlspecialchars(strip_tags($this->category));
         $this->event_name=htmlspecialchars(strip_tags($this->event_name));
         $this->description=htmlspecialchars(strip_tags($this->description));
         $this->event_rules=htmlspecialchars(strip_tags($this->event_rules));
         $this->student_coordinator_name=htmlspecialchars(strip_tags($this->student_coordinator_name));
         $this->student_coordinator_number=htmlspecialchars(strip_tags($this->student_coordinator_number));
         $this->staff_coordinator_name=htmlspecialchars(strip_tags($this->staff_coordinator_name));
         $this->staff_coordinator_number=htmlspecialchars(strip_tags($this->staff_coordinator_number));
         $this->event_date=htmlspecialchars(strip_tags($this->event_date));
         $this->event_start_time=htmlspecialchars(strip_tags($this->event_start_time));
         $this->event_end_time=htmlspecialchars(strip_tags($this->event_end_time));
         $this->venue=htmlspecialchars(strip_tags($this->venue));
         $this->status=htmlspecialchars(strip_tags($this->status));
        
     
         // bind new values
         $stmt->bindParam(":admin_id", $this->admin_id);
         $stmt->bindParam(":event_id", $this->event_id);
         $stmt->bindParam(":category", $this->category);
         $stmt->bindParam(":event_name", $this->event_name);
         $stmt->bindParam(":description", $this->description);
         $stmt->bindParam(":event_rules", $this->event_rules);
         $stmt->bindParam(":student_coordinator_name",$this->student_coordinator_name);
         $stmt->bindParam(":student_coordinator_number",$this->student_coordinator_number);
         $stmt->bindParam(":staff_coordinator_name",$this->staff_coordinator_name);
         $stmt->bindParam(":staff_coordinator_number",$this->staff_coordinator_number);
         $stmt->bindParam(":event_date", $this->event_date);
         $stmt->bindParam(":event_start_time",$this->event_start_time);
         $stmt->bindParam(":event_end_time",$this->event_end_time);
         $stmt->bindParam(":venue",$this->venue);
         $stmt->bindParam(":status", $this->status);
             
         // execute query
         if($stmt->execute()){
             return true;
         }
            return false;
    }

    function update(){
 
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                admin_id=:admin_id,
                event_id=:event_id,
                category=:category,
                event_name=:event_name,
                description=:description,
                event_rules=:event_rules,
                student_coordinator_name=:student_coordinator_name,
                student_coordinator_number=:student_coordinator_number,
                staff_coordinator_name=:staff_coordinator_name,
                staff_coordinator_number=:staff_coordinator_number,
                event_date=:event_date,
                event_start_time=:event_start_time,
                event_end_time=:event_end_time,
                venue =:venue,
                status =:status
                WHERE
                event_id=:event_id";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
         // sanitize
         $this->admin_id=htmlspecialchars(strip_tags($this->admin_id));
         $this->event_id=htmlspecialchars(strip_tags($this->event_id));
         $this->category=htmlspecialchars(strip_tags($this->category));
         $this->event_name=htmlspecialchars(strip_tags($this->event_name));
         $this->description=htmlspecialchars(strip_tags($this->description));
         $this->event_rules=htmlspecialchars(strip_tags($this->event_rules));
         $this->student_coordinator_name=htmlspecialchars(strip_tags($this->student_coordinator_name));
         $this->student_coordinator_number=htmlspecialchars(strip_tags($this->student_coordinator_number));
         $this->staff_coordinator_name=htmlspecialchars(strip_tags($this->staff_coordinator_name));
         $this->staff_coordinator_number=htmlspecialchars(strip_tags($this->staff_coordinator_number));
         $this->event_date=htmlspecialchars(strip_tags($this->event_date));
         $this->event_start_time=htmlspecialchars(strip_tags($this->event_start_time));
         $this->event_end_time=htmlspecialchars(strip_tags($this->event_end_time));
         $this->venue=htmlspecialchars(strip_tags($this->venue));
         $this->status=htmlspecialchars(strip_tags($this->status));
        
        
     
         // bind new values
         $stmt->bindParam(":admin_id", $this->admin_id);
         $stmt->bindParam(":event_id", $this->event_id);
         $stmt->bindParam(":category", $this->category);
         $stmt->bindParam(":event_name", $this->event_name);
         $stmt->bindParam(":description", $this->description);
         $stmt->bindParam(":event_rules", $this->event_rules);
         $stmt->bindParam(":student_coordinator_name",$this->student_coordinator_name);
         $stmt->bindParam(":student_coordinator_number",$this->student_coordinator_number);
         $stmt->bindParam(":staff_coordinator_name",$this->staff_coordinator_name);
         $stmt->bindParam(":staff_coordinator_number",$this->staff_coordinator_number);
         $stmt->bindParam(":event_date", $this->event_date);
         $stmt->bindParam(":event_start_time",$this->event_start_time);
         $stmt->bindParam(":event_end_time",$this->event_end_time);
         $stmt->bindParam(":venue",$this->venue);
         $stmt->bindParam(":status", $this->status);
     
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }
    
}
?>