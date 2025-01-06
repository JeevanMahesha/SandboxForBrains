package com.RedditClone.SpringBootAngular.Models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
@Builder
public class Users {

    @Id
    private String id;

    @NotNull(message = "Username is required")
    @Indexed(unique = true)
    private String username;

    @NotNull(message = "Password is required")
    @Min(value = 6)
    private String password;

    @NotNull(message = "Email is required")
    @Indexed(unique = true)
    @Email(message = "Email should be valid")
    private String email;

    @CreatedDate
    private Instant createdDate;
    private boolean enabled = false;


}
