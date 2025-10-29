package com.RedditClone.SpringBootAngular.Services;

import com.RedditClone.SpringBootAngular.AOP.SpringRedditException;
import com.RedditClone.SpringBootAngular.Config.UtilityFunctions;
import com.RedditClone.SpringBootAngular.DTO.AuthenticationResponse;
import com.RedditClone.SpringBootAngular.DTO.LoginRequest;
import com.RedditClone.SpringBootAngular.DTO.RefreshTokenRequest;
import com.RedditClone.SpringBootAngular.DTO.RegisterRequest;
import com.RedditClone.SpringBootAngular.Models.NotificationEmail;
import com.RedditClone.SpringBootAngular.Models.Users;
import com.RedditClone.SpringBootAngular.Models.VerificationToken;
import com.RedditClone.SpringBootAngular.Repository.UserRepository;
import com.RedditClone.SpringBootAngular.Repository.VerificationTokenRepository;
import com.RedditClone.SpringBootAngular.Security.JwtProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthServices {

    private final UtilityFunctions utilityFunctions;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServicesImpl userDetailsServices;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;



    public void signup(RegisterRequest registerRequest){
        Users users = new Users();
        users.setId(utilityFunctions.generateID("USER"));
        users.setEmail(registerRequest.getEmail());
        users.setUsername(registerRequest.getUsername());
        users.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        users.setCreatedDate(Instant.now());
        userRepository.insert(users);
        String token = generateVerificationToken(users);
        mailService.sendMail(new NotificationEmail("Please Activate your Account",
                users.getEmail(), "Thank you for signing up to Spring Reddit, " +
                " This Link will Expire in 10 minutes "+
                "please click on the below url to activate your account : " +
                "http://localhost:8080/api/auth/accountVerification/" + token ));
    }

    public String getCurrentUser() {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        Users users = userRepository.findByUsername(principal.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
        return users.getId();
    }


    private String generateVerificationToken(Users users) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserId(users.getId());
        verificationToken.setExpiryDate(LocalDateTime.now().plus(10, ChronoUnit.MINUTES));
        verificationTokenRepository.insert(verificationToken);
        return token;
    }

    public void verifyAccount(String token) {
      Optional<VerificationToken> verificationTokenFromDB = verificationTokenRepository.findByToken(token);
      verificationTokenFromDB.orElseThrow(() -> new SpringRedditException("Invalid Token"));
      if (!verificationTokenFromDB.get().getExpiryDate().isAfter(LocalDateTime.now())){
          throw new SpringRedditException("Token Expired");
      }
      fetchUserAndActivateAccount(verificationTokenFromDB.get());
    }

    @Transactional
    private void fetchUserAndActivateAccount(VerificationToken verificationToken) {
        String userId = verificationToken.getUserId();
        Users user = userRepository.findById(userId).orElseThrow(
                () -> new SpringRedditException("User Not Found"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    public AuthenticationResponse login(LoginRequest loginRequest)  {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                       loginRequest.getUsername(),
                       loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String token = jwtProvider.generateToken(authenticate);
        return AuthenticationResponse
                .builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(loginRequest.getUsername())
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String tokenWithUserName = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse
                .builder()
                .authenticationToken(tokenWithUserName)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build() ;
    }
}
