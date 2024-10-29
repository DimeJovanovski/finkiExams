package mk.ukim.finki.examscheduler.web.model;

import jakarta.persistence.*;
import lombok.*;
import mk.ukim.finki.examscheduler.web.model.enumerations.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "auth_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    @Enumerated(value = EnumType.STRING)
    private Role role;
}