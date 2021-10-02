package com.RedditClone.SpringBootAngular.Models;

import com.RedditClone.SpringBootAngular.DTO.CommentFlag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "comments")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Comments {

    @Id
    private String id;
    @NotNull
    private String text;
    @NotNull
    private String postId;
    @NotNull
    private String userId;
    @Nullable
    private List<CommentFlag> commentFlags;
    @CreatedDate
    private LocalDateTime createdDate;
}
