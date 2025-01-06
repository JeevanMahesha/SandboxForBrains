package com.RedditClone.SpringBootAngular.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {
    @Id
    private String voteId;
    @NotNull
    private Integer voteType;
    @NotNull
    private String postId;
    @NotNull
    private String userId;
}
