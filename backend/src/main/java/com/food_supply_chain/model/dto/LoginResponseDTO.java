package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Set<String> permissions;
    private String message;

    // Constructor with core authentication info
    public LoginResponseDTO(String token, Long id, String username, String email,
                            String firstName, String lastName, String role,
                            Set<String> permissions, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.permissions = permissions;
        this.message = message;
    }
}