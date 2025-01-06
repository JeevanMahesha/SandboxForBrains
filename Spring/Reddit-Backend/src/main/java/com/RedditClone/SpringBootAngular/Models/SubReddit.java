package com.RedditClone.SpringBootAngular.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "subreddit")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubReddit {


    @Id
    private String id;

    @NotNull(message = "subReddit name is required")
    @Indexed(unique = true)
    private String subRedditName;

    @NotNull(message = "Description is required")
    private String description;

    @Nullable
    private String userId;

    @CreatedDate
    private LocalDateTime createdDate;








}
