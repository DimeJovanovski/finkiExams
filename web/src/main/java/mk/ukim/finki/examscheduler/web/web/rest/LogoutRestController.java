package mk.ukim.finki.examscheduler.web.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logout")
public class LogoutRestController {

    @GetMapping
    public ResponseEntity<String> logout() {
        // Ideally, you would also handle any necessary cleanup, but for JWTs, just inform the client
        return ResponseEntity.ok("You have been logged out successfully. Please delete your JWT token.");
    }
}


