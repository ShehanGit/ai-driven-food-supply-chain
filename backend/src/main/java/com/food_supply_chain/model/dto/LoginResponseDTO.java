package com.food_supply_chain.model.dto;

public class LoginResponseDTO {
    private String token;
    private String message;

    public LoginResponseDTO(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}