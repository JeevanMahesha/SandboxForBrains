package com.RedditClone.SpringBootAngular.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {

    private String postId;
    @NotNull
    private String postName;
    @URL
    private String url;
    @Nullable
    private String description;
    private Integer voteCount = 0;
    @NotNull
    private String subredditName;
    @CreatedDate
    private LocalDateTime createdDate;

}
