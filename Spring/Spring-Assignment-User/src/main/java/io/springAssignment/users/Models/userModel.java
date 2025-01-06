package io.springAssignment.users.Models;

import org.springframework.lang.Nullable;

import javax.persistence.*;

@Entity
@Table(name = "Users")
public class userModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String Name;
    private String email;

    public userModel() {    }

    public userModel(long id, String name, String email) {
        this.id = id;
        Name = name;
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
