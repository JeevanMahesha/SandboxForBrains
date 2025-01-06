package com.RedditClone.SpringBootAngular.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostResponse {
    private String id;
    private String postName;
    private String url;
    private String description;
    private Integer voteCount;
    private String userName;
    private String subredditName;
    private Integer commentCount;
    private LocalDateTime createdDate;
    private boolean upVote;
    private boolean downVote;
}
