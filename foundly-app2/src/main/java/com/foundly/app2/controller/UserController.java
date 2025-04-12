package com.foundly.app2.controller;

import com.foundly.app2.entity.User;
import com.foundly.app2.dto.UserRegistrationRequest;
import com.foundly.app2.dto.UserLoginRequest;
import com.foundly.app2.exception.UserNotFoundException;
import com.foundly.app2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Get a user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        throw new UserNotFoundException("User not found with email: " + email);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        User createdUser = userService.registerUser(registrationRequest);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // Login a user
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserLoginRequest loginRequest) {
        Optional<User> user = userService.loginUser(loginRequest);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        throw new UserNotFoundException("Invalid credentials");
    }

    // Create a new user (if you want to keep this method for other purposes)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.saveUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

   // Update an existing user
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
    // Fetch the existing user for validation or logging
    User existingUser = userService.getUserById(id);
    if (existingUser == null) {
        throw new UserNotFoundException("User not found with ID: " + id);
    }

    // Log the existing user details (optional)
    System.out.println("Updating user: " + existingUser);

    // Update the user details
    user.setUserId(id);
    User updatedUser = userService.saveUser(user);
    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
}

// Delete a user
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
    // Fetch the existing user for validation or logging
    User existingUser = userService.getUserById(id);
    if (existingUser == null) {
        throw new UserNotFoundException("User not found with ID: " + id);
    }

    // Log the existing user details (optional)
    System.out.println("Deleting user: " + existingUser);

    // Proceed with deletion
    userService.deleteUser(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
}
}