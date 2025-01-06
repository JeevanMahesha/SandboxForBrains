<?php

class participant_login{

    // Database Connection
    private $conn;
    private $participant_login = 'participant_login';
    private $events_registration = 'events_registration';

    //object properties
    public $email;
    public $Kalam_id;
    public $full_name;
    public $department;
    public $year;
    public $college;
    public $password;
    public $status;
    public $mob_no;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
 
        $query = "SELECT
                       *
                   FROM
                       " . $this->participant_login;
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
       }
       
       function signup($email){
        $query = "SELECT
                      email 
                    FROM
                        " . $this->participant_login . "
                    WHERE  email = '".$email."'";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->email = $row['email'];
        }
    

            
        function read_one($email){
           $query = "SELECT 
           events_registration.*,
           participant_login.department,
           participant_login.year
           FROM 
           participant_login INNER JOIN events_registration
           WHERE 
           participant_login.email ='".$email."'
           AND 
           events_registration.email ='".$email."'";
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
        }


    function login($email,$password){

        //SELECT * FROM `participant_login` WHERE email = 'Jeevan@gmail.com' AND password = 'pwd'
        $query = "SELECT
                       *
                   FROM
                       " . $this->participant_login . "
                    WHERE  email = '".$email."'
                    AND password = '".$password."'";
        
           $stmt = $this->conn->prepare($query);
           $stmt->execute();
           return $stmt;
    }

    function create(){	
        // try {	
         $query = "INSERT INTO    " . $this->participant_login ."	
                 SET	
                      Kalam_id=:Kalam_id,
                      email=:email,	
                      full_name=:full_name,	
                      department=:department,	
                      year=:year,	
                      college=:college,	
                      password=:password,	
                      status =:status,	
                      mob_no=:mob_no";	

         $stmt = $this->conn->prepare($query);	

         // sanitize	
         
         $this->Kalam_id=htmlspecialchars(strip_tags($this->Kalam_id));	
         $this->email=htmlspecialchars(strip_tags($this->email));	
         $this->full_name=htmlspecialchars(strip_tags($this->full_name));	
         $this->department=htmlspecialchars(strip_tags($this->department));	
         $this->year=htmlspecialchars(strip_tags($this->year));	
         $this->college=htmlspecialchars(strip_tags($this->college));	
         $this->password=htmlspecialchars(strip_tags($this->password));	
         $this->status=htmlspecialchars(strip_tags($this->status));	
         $this->mob_no=htmlspecialchars(strip_tags($this->mob_no));	

         // bind new values	
         $stmt->bindParam(":Kalam_id", $this->Kalam_id);	
         $stmt->bindParam(":email", $this->email);	
         $stmt->bindParam(":full_name", $this->full_name);	
         $stmt->bindParam(":department", $this->department);	
         $stmt->bindParam(":year", $this->year);	
         $stmt->bindParam(":college", $this->college);	
         $stmt->bindParam(':password', $this->password);	
         $stmt->bindParam(":status", $this->status);	
         $stmt->bindParam(":mob_no", $this->mob_no);	

         // execute query	
         if($stmt->execute()){	
             return true;	
         }	
            return false;	
    }

    function update(){
        
            // try {	
             $query = "UPDATE  " . $this->participant_login ."	
                     SET	
                          Kalam_id=:Kalam_id,
                          email=:email,	
                          full_name=:full_name,	
                          department=:department,	
                          year=:year,	
                          college=:college,	
                          
                          status =:status,	
                          mob_no=:mob_no
                          WHERE
                          Kalam_id=:Kalam_id";	
    
             $stmt = $this->conn->prepare($query);	
    
             // sanitize	
             
             
             $this->email=htmlspecialchars(strip_tags($this->email));	
             $this->full_name=htmlspecialchars(strip_tags($this->full_name));	
             $this->department=htmlspecialchars(strip_tags($this->department));	
             $this->year=htmlspecialchars(strip_tags($this->year));	
             $this->college=htmlspecialchars(strip_tags($this->college));	
            
             $this->status=htmlspecialchars(strip_tags($this->status));	
             $this->mob_no=htmlspecialchars(strip_tags($this->mob_no));	
             $this->Kalam_id=htmlspecialchars(strip_tags($this->Kalam_id));	
    
             // bind new values	
             	
             $stmt->bindParam(":email", $this->email);	
             $stmt->bindParam(":full_name", $this->full_name);	
             $stmt->bindParam(":department", $this->department);	
             $stmt->bindParam(":year", $this->year);	
             $stmt->bindParam(":college", $this->college);	
             $stmt->bindParam(":status", $this->status);	
             $stmt->bindParam(":mob_no", $this->mob_no);	
             $stmt->bindParam(":Kalam_id", $this->Kalam_id);
    
             // execute query	
             if($stmt->execute()){	
                 return $stmt;	
             }	
                return false;
    }

    function update_number(){
        $query = "UPDATE events_registration,participant_login SET events_registration.mob_no = participant_login.mob_no WHERE events_registration.Kalam_id = participant_login.Kalam_id";
            $stmt = $this->conn->prepare($query);
           if($stmt->execute()){
            return true;
        }
           return false;
    }

    function password_change(){
        
        // try {	
            $query = "UPDATE  " . $this->participant_login ."	
            SET	
                
                 email=:email,	
                
                 password=:password
                 WHERE
                 email=:email";	

    $stmt = $this->conn->prepare($query);	

    // sanitize	
    
    
    $this->email=htmlspecialchars(strip_tags($this->email));	
    
    $this->password=htmlspecialchars(strip_tags($this->password));	
   

    // bind new values	
        
    $stmt->bindParam(":email", $this->email);	
   
    $stmt->bindParam(':password', $this->password);	
  
         if($stmt->execute()){	
             return $stmt;	
         }	
            return false;
    }


}
?>