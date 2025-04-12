package com.foundly.app2.exception;

import java.io.Serializable;

public class UserNotFoundException extends RuntimeException implements Serializable {
    private static final long serialVersionUID = 1L; // Unique identifier for serialization

    public UserNotFoundException(String message) {
        super(message);
    }
}