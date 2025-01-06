package com.RedditClone.SpringBootAngular.Models;

import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;

@Document(collection = "posts")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Posts {

    @Id
    private String postId;
    @NotNull(message = "Post Name cannot be empty")
    private String postName;

    @Nullable
    @URL
    private String url;
    @Nullable
    private String description;
    private Integer voteCount = 0;

    @NotNull
    private String userId;
    @NotNull
    private String subredditId;
    @CreatedDate
    private LocalDateTime createdDate;
}
