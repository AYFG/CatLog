package com.catlog.catlog_spring_back.common;

public class ApiException extends RuntimeException {

    private final int status;
    private final String name;
    private final Object data;

    public ApiException(int status, String message) {
        this(status, message, null, null);
    }

    public ApiException(int status, String message, String name) {
        this(status, message, name, null);
    }

    public ApiException(int status, String message, String name, Object data) {
        super(message);
        this.status = status;
        this.name = name;
        this.data = data;
    }

    public int status() {
        return status;
    }

    public String name() {
        return name;
    }

    public Object data() {
        return data;
    }
}
