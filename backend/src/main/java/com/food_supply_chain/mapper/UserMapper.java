package com.food_supply_chain.mapper;

import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                null, // Don't include password in DTO
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getProfileImageUrl(),
                user.getRole().toString(),
                user.getCompanyName(),
                user.getCompanyAddress(),
                user.getLocationCoordinates(),
                user.getPermissions(),
                user.isEnabled(),
                user.isVerified(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public User toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        User user = new User();

        // Only set ID if it's not a new user (for updates)
        if (userDTO.getId() != null) {
            user.setId(userDTO.getId());
        }

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());

        // Password will be encoded in the service layer
        user.setPassword(userDTO.getPassword());

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setProfileImageUrl(userDTO.getProfileImageUrl());

        // Convert role string to enum
        if (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) {
            user.setRole(User.Role.valueOf(userDTO.getRole()));
        }

        user.setCompanyName(userDTO.getCompanyName());
        user.setCompanyAddress(userDTO.getCompanyAddress());
        user.setLocationCoordinates(userDTO.getLocationCoordinates());

        // Set permissions if provided, otherwise use default permissions based on role
        if (userDTO.getPermissions() != null && !userDTO.getPermissions().isEmpty()) {
            user.setPermissions(userDTO.getPermissions());
        } else if (user.getRole() != null) {
            user.setDefaultPermissions();
        }

        user.setEnabled(userDTO.isEnabled());
        user.setVerified(userDTO.isVerified());

        return user;
    }

    // Updates existing User entity with values from DTO, excluding null fields
    public void updateEntityFromDTO(UserDTO userDTO, User user) {
        if (userDTO == null || user == null) {
            return;
        }

        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getPassword() != null) {
            // Password will be encoded in the service layer
            user.setPassword(userDTO.getPassword());
        }

        if (userDTO.getFirstName() != null) {
            user.setFirstName(userDTO.getFirstName());
        }

        if (userDTO.getLastName() != null) {
            user.setLastName(userDTO.getLastName());
        }

        if (userDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }

        if (userDTO.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userDTO.getProfileImageUrl());
        }

        if (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) {
            User.Role newRole = User.Role.valueOf(userDTO.getRole());
            if (user.getRole() != newRole) {
                user.setRole(newRole);
                user.setDefaultPermissions(); // Reset permissions when role changes
            }
        }

        if (userDTO.getCompanyName() != null) {
            user.setCompanyName(userDTO.getCompanyName());
        }

        if (userDTO.getCompanyAddress() != null) {
            user.setCompanyAddress(userDTO.getCompanyAddress());
        }

        if (userDTO.getLocationCoordinates() != null) {
            user.setLocationCoordinates(userDTO.getLocationCoordinates());
        }

        if (userDTO.getPermissions() != null && !userDTO.getPermissions().isEmpty()) {
            user.setPermissions(userDTO.getPermissions());
        }
    }
}