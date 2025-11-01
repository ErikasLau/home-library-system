package com.myhomelibrary.library_system.domains.firebase;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public record UserCustomClaims(
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Long userPk,
        String userId,
        String username,
        String name,
        String surname,
        String role,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC")
        String dateOfBirth
) {
    public static UserCustomClaims fromMap(Map<String, Object> claims) {
        if (claims == null) return new UserCustomClaims(null, null, null, null, null, null, null);
        return new UserCustomClaims(
                claims.get("userPk") != null ? ((BigDecimal) claims.get("userPk")).longValue() : null,
                getString(claims, "userId"),
                getString(claims, "username"),
                getString(claims, "name"),
                getString(claims, "surname"),
                getString(claims, "role"),
                getString(claims, "dateOfBirth")
        );
    }

    private static String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userPk", userPk);
        claims.put("username", username);
        claims.put("name", name);
        claims.put("surname", surname);
        claims.put("role", role);
        claims.put("dateOfBirth", dateOfBirth);
        return claims;
    }
}
