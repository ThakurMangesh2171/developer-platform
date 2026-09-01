package com.developerplatform.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendVerificationEmail(String toEmail, String token) {
        // In a real production environment, we would inject JavaMailSender
        // and send an actual email via SMTP/SendGrid/SES.
        
        String verificationUrl = "http://localhost:3000/verify-email?token=" + token;
        
        log.info("==========================================================================");
        log.info("📧 EMAIL SENT (Mock)");
        log.info("To: {}", toEmail);
        log.info("Subject: Please verify your email address");
        log.info("Body:");
        log.info("Welcome to Developer Platform!");
        log.info("Please click the link below to verify your email address:");
        log.info("{}", verificationUrl);
        log.info("==========================================================================");
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        
        log.info("==========================================================================");
        log.info("📧 EMAIL SENT (Mock)");
        log.info("To: {}", toEmail);
        log.info("Subject: Password Reset Request");
        log.info("Body:");
        log.info("We received a request to reset your password.");
        log.info("Please click the link below to set a new password:");
        log.info("{}", resetUrl);
        log.info("If you did not request this, please ignore this email.");
        log.info("==========================================================================");
    }
}
