package mk.ukim.finki.examscheduler.web.model.config;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationResponse {
    private String jwt;
    private String role; // Add role field

    public AuthenticationResponse(String jwt, String role) {
        this.jwt = jwt;
        this.role = role; // Initialize role
    }

    public String getJwt() {
        return jwt;
    }

    public String getRole() {
        return role; // Getter for role
    }
}