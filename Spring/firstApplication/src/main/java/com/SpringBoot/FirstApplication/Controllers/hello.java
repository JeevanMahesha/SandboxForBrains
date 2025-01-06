package com.SpringBoot.FirstApplication.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class hello {

    @RequestMapping("/")
    public String welcome(){
        return  "Welcome to Spring Boot";
    }
}
