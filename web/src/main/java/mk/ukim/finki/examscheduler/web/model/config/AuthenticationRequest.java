package mk.ukim.finki.examscheduler.web.model.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import mk.ukim.finki.examscheduler.web.model.enumerations.Role;

@Data
public class AuthenticationRequest {

    @JsonProperty("username")
    private String username;

    @JsonProperty("password")
    private String password;

    @JsonProperty("role")
    private Role role;
}