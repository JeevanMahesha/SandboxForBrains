package io.application.user.mongodb.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "Users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsersModel {

    @Id
    private Long id;
    private String name;
    private Map<String,String> userDetails = new HashMap<>();
    private Date createdDate = new Date();


}
