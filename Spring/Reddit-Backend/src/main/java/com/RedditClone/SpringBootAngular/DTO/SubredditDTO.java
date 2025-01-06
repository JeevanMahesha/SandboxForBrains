package com.RedditClone.SpringBootAngular.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubredditDTO {
    private String name ;
    private String description;
    private String userId;
    private Integer numberOfPosts;
}
