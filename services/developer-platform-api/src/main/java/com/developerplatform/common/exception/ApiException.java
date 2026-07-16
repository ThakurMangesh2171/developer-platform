package com.developerplatform.common.exception;

import com.developerplatform.common.enums.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class ApiException extends RuntimeException {

    private final HttpStatus httpStatus;

    private final ErrorCode errorCode;

    protected ApiException(
            HttpStatus httpStatus,
            ErrorCode errorCode,
            String message
    ) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

}