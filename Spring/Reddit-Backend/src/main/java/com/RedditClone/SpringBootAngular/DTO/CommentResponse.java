package com.RedditClone.SpringBootAngular.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CommentResponse {
    private String commentId;
    private String text;
    private String postId;
    private String username;
    private String duration;
    private List<CommentFlag> commentFlags;
    private Integer commentFlagsCount;
    private boolean iFlagged;
}
