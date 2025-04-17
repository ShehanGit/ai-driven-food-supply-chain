package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password; // Used for registration/login requests only
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profileImageUrl;
    private String role; // String representation of Role enum
    private String companyName;
    private String companyAddress;
    private String locationCoordinates;
    private Set<String> permissions = new HashSet<>();
    private boolean enabled;
    private boolean verified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor without sensitive information (password) for responses
    public UserDTO(Long id, String username, String email, String firstName, String lastName,
                   String phoneNumber, String profileImageUrl, String role, String companyName,
                   String companyAddress, String locationCoordinates, Set<String> permissions,
                   boolean enabled, boolean verified, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.locationCoordinates = locationCoordinates;
        this.permissions = permissions;
        this.enabled = enabled;
        this.verified = verified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}