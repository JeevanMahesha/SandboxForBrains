package com.RedditClone.SpringBootAngular.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.time.LocalDateTime;

@Document(collection = "tokens")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationToken {

    @Id
    private String id;
    private String token;
    private String userId;
    private LocalDateTime expiryDate;

}
