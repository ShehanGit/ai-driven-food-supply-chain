package com.food_supply_chain.service;

import com.food_supply_chain.exception.DuplicateResourceException;
import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.mapper.UserMapper;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.LoginResponseDTO;
import com.food_supply_chain.model.dto.RegistrationRequest;
import com.food_supply_chain.model.dto.UserDTO;
import com.food_supply_chain.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, JwtService jwtService,
                       PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserDTO register(RegistrationRequest registrationRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        // Create new user from registration request
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());
        user.setPhoneNumber(registrationRequest.getPhoneNumber());
        user.setRole(User.Role.valueOf(registrationRequest.getRole()));
        user.setCompanyName(registrationRequest.getCompanyName());
        user.setCompanyAddress(registrationRequest.getCompanyAddress());
        user.setLocationCoordinates(registrationRequest.getLocationCoordinates());

        // Set default permissions based on role
        user.setDefaultPermissions();

        // Save user
        User savedUser = userRepository.save(user);

        // Convert back to DTO for response
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public LoginResponseDTO login(UserDTO userDTO) {
        User user = userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // Check if user is enabled
        if (!user.isEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponseDTO(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().toString(),
                user.getPermissions(),
                "Login successful"
        );
    }

    @Transactional
    public UserDTO getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check if the current user is authorized to update this user
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Only allow users to update their own profile or admins to update any profile
        if (!currentUser.getRole().equals(User.Role.ADMIN) && !user.getUsername().equals(currentUsername)) {
            throw new org.springframework.security.access.AccessDeniedException("You can only update your own profile");
        }

        // Check if username is being changed and is already taken
        if (userDTO.getUsername() != null && !userDTO.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(userDTO.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        // Check if email is being changed and is already taken
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        // Update user fields
        userMapper.updateEntityFromDTO(userDTO, user);

        // If password is being updated, encode it
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // Save updated user
        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        // Check if user exists
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        // Check if the current user is authorized to delete this user
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Only allow admins to delete users
        if (!currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new org.springframework.security.access.AccessDeniedException("Only admins can delete users");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public List<UserDTO> getUsersByRole(String role) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());

        return userRepository.findByRole(userRole)
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Page<UserDTO> getUsersByRole(String role, String search, Pageable pageable) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());

        Page<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByRoleAndSearch(userRole, search.trim(), pageable);
        } else {
            users = userRepository.findByRole(userRole, pageable);
        }

        return users.map(userMapper::toDTO);
    }

    @Transactional
    public UserDTO enableDisableUser(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setEnabled(enabled);
        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }

    @Transactional
    public UserDTO verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setVerified(true);
        User updatedUser = userRepository.save(user);

        return userMapper.toDTO(updatedUser);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Create authorities from user's role and permissions
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Add role as an authority with ROLE_ prefix (Spring Security convention)
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));

        // Add each permission as an authority
        user.getPermissions().forEach(permission ->
                authorities.add(new SimpleGrantedAuthority(permission))
        );

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true, // account non-expired
                true, // credentials non-expired
                true, // account non-locked
                authorities
        );
    }
}