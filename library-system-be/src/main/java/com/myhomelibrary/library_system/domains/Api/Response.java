package com.myhomelibrary.library_system.domains.Api;

public record Response<T>(String status, T data) {
    public static <T> Response<T> success(T data) {
        return new Response<>("OK", data);
    }

    public static <T> Response<T> error(T data) {
        return new Response<>("Error", data);
    }
}
