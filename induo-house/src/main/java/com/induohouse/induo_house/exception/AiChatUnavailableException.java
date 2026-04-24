package com.induohouse.induo_house.exception;

public class AiChatUnavailableException extends RuntimeException {

    public AiChatUnavailableException(String message) {
        super(message);
    }

    public AiChatUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
