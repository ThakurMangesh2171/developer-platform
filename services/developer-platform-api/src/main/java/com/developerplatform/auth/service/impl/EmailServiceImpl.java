package com.developerplatform.auth.service.impl;

import com.developerplatform.auth.service.interfaces.EmailService;
import com.developerplatform.common.constants.ApiPaths;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.api-base-url:http://localhost:8080}")
    private String apiBaseUrl;

    @Override
    @Async("mailExecutor")
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Verify your email address - Developer Platform");

            String verificationUrl = apiBaseUrl + ApiPaths.AUTH + ApiPaths.VERIFY_EMAIL + "?token=" + token;

            String htmlContent = "<h3>Welcome to Developer Platform!</h3>" +
                    "<p>Thank you for registering. Please verify your email by clicking the link below:</p>" +
                    "<p><a href=\"" + verificationUrl + "\" style=\"display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;\">Verify Email Address</a></p>" +
                    "<br/>" +
                    "<p>This link is valid for 24 hours.</p>";

            helper.setText(htmlContent, true);

            log.info("[EMAIL] Sending verification email to {} with link: {}", toEmail, verificationUrl);
            mailSender.send(message);
            log.info("[EMAIL] Verification email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL] Failed to send verification email to {}", toEmail, e);
        }
    }

    @Override
    @Async("mailExecutor")
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Reset your password - Developer Platform");

            // Frontend URL for password reset (would typically point to frontend, not API directly)
            // But for simplicity in this MVP, we log it
            String resetUrl = "http://localhost:3000/reset-password?token=" + token;

            String htmlContent = "<h3>Password Reset Request</h3>" +
                    "<p>You requested to reset your password. Click the link below to set a new password:</p>" +
                    "<p><a href=\"" + resetUrl + "\" style=\"display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;\">Reset Password</a></p>" +
                    "<br/>" +
                    "<p>This link is valid for 15 minutes.</p>";

            helper.setText(htmlContent, true);

            log.info("[EMAIL] Sending password reset email to {} with link: {}", toEmail, resetUrl);
            mailSender.send(message);
            log.info("[EMAIL] Password reset email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL] Failed to send password reset email to {}", toEmail, e);
        }
    }
}
