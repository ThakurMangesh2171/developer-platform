package com.developerplatform.common.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut that matches all repositories, services and Web REST endpoints.
     */
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *) || " +
            "within(@org.springframework.stereotype.Service *)")
    public void springBeanPointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Pointcut that matches all Spring beans in the application's main packages.
     */
    @Pointcut("within(com.developerplatform..*)")
    public void applicationPackagePointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Advice that logs methods throwing exceptions.
     */
    @AfterThrowing(pointcut = "applicationPackagePointcut() && springBeanPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("Exception in {}.{}() with cause = '{}' and exception = '{}'",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                e.getCause() != null ? e.getCause() : "NULL",
                e.getMessage());
    }

    /**
     * Advice that logs when a method is entered and exited.
     */
    @Around("applicationPackagePointcut() && springBeanPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();

        if (log.isDebugEnabled()) {
            log.debug("Enter: {}.{}()", className, methodName);
        } else {
            log.info("Enter: {}.{}()", className, methodName);
        }

        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - start;
            
            if (log.isDebugEnabled()) {
                log.debug("Exit: {}.{}() in {} ms", className, methodName, elapsedTime);
            } else {
                log.info("Exit: {}.{}() in {} ms", className, methodName, elapsedTime);
            }
            
            return result;
        } catch (IllegalArgumentException e) {
            log.error("Illegal argument: {} in {}.{}()", e.getMessage(), className, methodName);
            throw e;
        }
    }
}
