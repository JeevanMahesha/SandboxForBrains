<?php

require 'PHPMailer/PHPMailerAutoload.php';

		$mail = new PHPMailer;

		$mail->isSMTP();                                      // Set mailer to use SMTP

		$mail->Host = 'smtp.gmail.com';                       // Specify main and backup server

		$mail->SMTPAuth = true;                               // Enable SMTP authentication

		$mail->Username = 'kalam@siet.ac.in';                   // SMTP username

		$mail->Password = 'kalam20202727';               // SMTP password

		$mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted

		$mail->Port = 587;                                    //Set the SMTP port number - 587 for authenticated TLS

		$mail->setFrom('kalam@siet.ac.in', 'Sri Shakthi Talent !');     //Set who the message is to be sent from

		/* $mail->addReplyTo('ashokkumar@siet.ac.in', 'Sri Shakthi Talent !');  //Set an alternative reply-to address

 */

		//$mail->addBCC('bcc@example.com');



		$mail->isHTML(true);	// Set email format to HTML

		$mail->addAddress("jeevanjeenu007@gmail.com", "Jeevan");  // Add a recipient   

		$mail->Subject = "This is Sample Subject";

		$mail->Body    = "Dear Name <br> ";

		if(!$mail->send()) {
			echo 'Mailer Error: ' . $mail->ErrorInfo;
			exit;

		}
    


?>