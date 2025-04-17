package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "location_coordinates")
    private String locationCoordinates; // Store as "latitude,longitude"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "permission")
    private Set<String> permissions = new HashSet<>();

    private boolean enabled = true;

    private boolean verified = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Role {
        FARMER, DISTRIBUTOR, RETAILER, CONSUMER, ADMIN
    }

    // Add methods to work with permissions
    public void addPermission(String permission) {
        this.permissions.add(permission);
    }

    public void removePermission(String permission) {
        this.permissions.remove(permission);
    }

    public boolean hasPermission(String permission) {
        return this.permissions.contains(permission);
    }

    // Helper method to set default permissions based on role
    public void setDefaultPermissions() {
        this.permissions.clear();

        // Common permissions for all users
        this.permissions.add("VIEW_OWN_PROFILE");
        this.permissions.add("EDIT_OWN_PROFILE");

        switch (this.role) {
            case FARMER:
                this.permissions.add("CREATE_PRODUCT");
                this.permissions.add("EDIT_OWN_PRODUCT");
                this.permissions.add("DELETE_OWN_PRODUCT");
                this.permissions.add("VIEW_OWN_ANALYTICS");
                break;

            case DISTRIBUTOR:
                this.permissions.add("CREATE_SHIPMENT");
                this.permissions.add("EDIT_OWN_SHIPMENT");
                this.permissions.add("VIEW_PRODUCT_DETAILS");
                this.permissions.add("LOG_TRANSPORT_CONDITIONS");
                break;

            case RETAILER:
                this.permissions.add("RECEIVE_PRODUCT");
                this.permissions.add("SELL_PRODUCT");
                this.permissions.add("VIEW_PRODUCT_HISTORY");
                this.permissions.add("VIEW_OWN_INVENTORY");
                break;

            case CONSUMER:
                this.permissions.add("VIEW_PRODUCT_JOURNEY");
                this.permissions.add("VIEW_PRODUCT_DETAILS");
                this.permissions.add("RATE_PRODUCT");
                break;

            case ADMIN:
                this.permissions.add("MANAGE_USERS");
                this.permissions.add("VIEW_ALL_PRODUCTS");
                this.permissions.add("EDIT_ANY_PRODUCT");
                this.permissions.add("VIEW_SYSTEM_ANALYTICS");
                this.permissions.add("MANAGE_SYSTEM_SETTINGS");
                break;
        }
    }
}