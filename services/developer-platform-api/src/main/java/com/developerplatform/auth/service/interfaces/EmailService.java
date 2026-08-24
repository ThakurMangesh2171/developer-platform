package com.developerplatform.auth.service.interfaces;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String token);

    void sendPasswordResetEmail(String to, String token);

}
