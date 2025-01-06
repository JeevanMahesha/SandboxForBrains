package amigoscode.springboot.application.SprintBoot.Models;


import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;


@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class StudentModel {

    @Id
    @SequenceGenerator(
            name = "student_sequence",
            sequenceName = "student_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "student_sequence"
    )
    private Long id;
    private String name;
    private String email;
    private LocalDate dob;
    @Transient
    @Getter(AccessLevel.NONE)
    private Integer age;

    public Integer getAge() {
        return Period.between(this.dob,LocalDate.now()).getYears();
    }
}
