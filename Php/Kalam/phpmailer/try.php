<?php

require 'PHPMailer/PHPMailerAutoload.php';

		$mail = new PHPMailer;

		$mail->isSMTP();                                      // Set mailer to use SMTP

		$mail->Host = 'smtp.gmail.com';                       // Specify main and backup server

		$mail->SMTPAuth = true;                               // Enable SMTP authentication

		$mail->Username = 'kalam2020siet@gmail.com';                   // SMTP username

		$mail->Password = 'Kalam@siet';               // SMTP password

		$mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted

		$mail->Port = 587;                                    //Set the SMTP port number - 587 for authenticated TLS

		$mail->setFrom('kalam2020@gmail.com', 'Kalam');     //Set who the message is to be sent from

		/* $mail->addReplyTo('ashokkumar@siet.ac.in', 'Sri Shakthi Talent !');  //Set an alternative reply-to address

 */

		//$mail->addBCC('bcc@example.com');



		$mail->isHTML(true);	// Set email format to HTML
/* 
        $mail->addAddress("jeevanjeenu007@gmail.com");  
        $mail->addAddress("varshamuthuraj1999@gmail.com"); */

        

       
        $mail->addAddress('aswathimuruganandan2001@gmail.com');
        $mail->addAddress('ravipranesh2@gmail.com');
        $mail->addAddress('anandhavarshinik@gmail.com');
        $mail->addAddress('mathanmohan762@gmail.com');
        $mail->addAddress('mourishvs@gmail.com');
        $mail->addAddress('maselvam1@gmail.com');
        $mail->addAddress('gowthamgandhi123@gmail.com');
        $mail->addAddress('sivahacker.cbe@gmail.com');
        $mail->addAddress('kamaleshkumar.ee18@bitsathy.ac.in');

        

        

        


        
		$mail->Subject = 'Welcome to Kalam' ;

		$mail->Body    = createMail();

		if(!$mail->send()) {
			echo 'Mailer Error: ' . $mail->ErrorInfo;
			exit;

        }
        function createMail(){
            $message_templet = file_get_contents('../phpmailer/email_templet.html');
            $message_templet = str_replace('%name%','To Kalam',$message_templet);
            return $message_templet;
          }
    


?>