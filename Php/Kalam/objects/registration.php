<?php

class Registration{

    // Database Connection
    private $conn;
    private $events_registration = 'events_registration';
    private $event_table = 'event_details';
    private $participant_table = 'participant_login';

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
                       " . $this->events_registration;
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
       }

    
       function read_one($event_id){
        $query = "SELECT
                       *
                   FROM
                       " . $this->events_registration . "
                    WHERE  event_id = '".$event_id."'";
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
    }

    function event_and_Kalam_id_check($Kalam_id,$event_id){
        $query = "SELECT
                     Kalam_id,event_id
                    FROM
                        " . $this->event_table . ',' .$this->participant_table ." WHERE  Kalam_id = '".$Kalam_id."' AND event_id = '".$event_id."'" ;
        $stmt = $this->conn->prepare($query);
        if($stmt->execute()){
            return true;
        }
           return false;
    }

    function check_event_count($Kalam_id){
        $query = "SELECT
                      COUNT(*) as count
                   FROM
                       " . $this->events_registration . "
                    WHERE  Kalam_id = '".$Kalam_id."'";
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           $row = $stmt->fetch(PDO::FETCH_ASSOC);
           return $row['count'];
    }

    function check_event_already_registered($Kalam_id,$event_id){
        $query = "SELECT
                      Kalam_id,event_id
                   FROM
                       " . $this->events_registration . " WHERE  Kalam_id = '".$Kalam_id."' AND event_id = '".$event_id."'";
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           $row = $stmt->fetch(PDO::FETCH_ASSOC);
           $this->event_id = $row['event_id'];

    }
    


    function event_registration($Kalam_id,$event_id){
        $query = "SELECT 
        Kalam_id,
        event_id,
        email,	
        full_name,	
        college,	
        mob_no,
        event_name,
        description,
        event_rules,
        event_date,
        event_start_time,
        event_end_time,
        venue
        
                   FROM
                       " . $this->event_table . ',' .$this->participant_table ." WHERE  Kalam_id = '".$Kalam_id."' AND event_id = '".$event_id."'" ;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
     
    

    function registration_success(){
        // try {      
         $query = "INSERT INTO    " . $this->events_registration ."
                 SET  
                 Kalam_id=:Kalam_id,
                 event_id=:event_id,
                 email=:email,	
                 full_name=:full_name,	
                 college=:college,	
                 mob_no=:mob_no,
                 event_name=:event_name,
                 description=:description,
                 event_rules=:event_rules,
                 event_date=:event_date,
                 event_start_time=:event_start_time,
                 event_end_time=:event_end_time,
                 venue =:venue
                 ";	

    $stmt = $this->conn->prepare($query);	

    // sanitize	
    
    $this->Kalam_id=htmlspecialchars(strip_tags($this->Kalam_id));	
    $this->event_id=htmlspecialchars(strip_tags($this->event_id));	
    $this->email=htmlspecialchars(strip_tags($this->email));	
    $this->full_name=htmlspecialchars(strip_tags($this->full_name));	
    $this->college=htmlspecialchars(strip_tags($this->college));	
    $this->mob_no=htmlspecialchars(strip_tags($this->mob_no));
    $this->event_name=htmlspecialchars(strip_tags($this->event_name));
    $this->description=htmlspecialchars(strip_tags($this->description));
    $this->event_rules=htmlspecialchars(strip_tags($this->event_rules));
    $this->event_date=htmlspecialchars(strip_tags($this->event_date));
    $this->event_start_time=htmlspecialchars(strip_tags($this->event_start_time));
    $this->event_end_time=htmlspecialchars(strip_tags($this->event_end_time));
    $this->venue=htmlspecialchars(strip_tags($this->venue));	


    // bind new values	
    $stmt->bindParam(":Kalam_id", $this->Kalam_id);	
    $stmt->bindParam(":event_id",$this->event_id);
    $stmt->bindParam(":email", $this->email);	
    $stmt->bindParam(":full_name", $this->full_name);	
    $stmt->bindParam(":college", $this->college);	
    $stmt->bindParam(":mob_no", $this->mob_no);	
    $stmt->bindParam(":event_name", $this->event_name);
    $stmt->bindParam(":description", $this->description);
    $stmt->bindParam(":event_rules", $this->event_rules);
    $stmt->bindParam(":event_date", $this->event_date);
    $stmt->bindParam(":event_start_time",$this->event_start_time);
    $stmt->bindParam(":event_end_time",$this->event_end_time);
    $stmt->bindParam(":venue",$this->venue);
 
         // execute query
         if($stmt->execute()){
             return true;
         }
            return false;
    }
}
?>