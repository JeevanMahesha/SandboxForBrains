package com.RedditClone.SpringBootAngular.Controllers;

import com.RedditClone.SpringBootAngular.DTO.AuthenticationResponse;
import com.RedditClone.SpringBootAngular.DTO.LoginRequest;
import com.RedditClone.SpringBootAngular.DTO.RefreshTokenRequest;
import com.RedditClone.SpringBootAngular.DTO.RegisterRequest;
import com.RedditClone.SpringBootAngular.Services.AuthServices;
import com.RedditClone.SpringBootAngular.Services.RefreshTokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthServices authServices;
    private final RefreshTokenService refreshTokenService;


    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest){
        authServices.signup(registerRequest);
        return new ResponseEntity<>("User Registration Successful", HttpStatus.OK);
    }

    @GetMapping("accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token){
        authServices.verifyAccount(token);
        return new ResponseEntity<>("Account Activated Successfully",HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest loginRequest){
         return new ResponseEntity<>(authServices.login(loginRequest),HttpStatus.OK);
    }

    @PostMapping("/refresh/token")
    public AuthenticationResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
        return authServices.refreshToken(refreshTokenRequest) ;
    }

    @PostMapping("/logout")
     public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        return new ResponseEntity<String>("Logout Successfully",HttpStatus.OK) ;
    }
}
