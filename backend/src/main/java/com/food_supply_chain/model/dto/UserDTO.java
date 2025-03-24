package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String password; // Only for registration/login
    private String role; // FARMER, DISTRIBUTOR, etc.
    private String email;
}