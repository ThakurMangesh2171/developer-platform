package com.developerplatform.common.exception;

import com.developerplatform.common.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {

    public BadRequestException(ErrorCode errorCode, String message) {
        super(HttpStatus.BAD_REQUEST, errorCode, message);
    }

}