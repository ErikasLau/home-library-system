package com.myhomelibrary.library_system.configs;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@Component
@ConfigurationProperties(prefix = "firebase")
public class FirebaseProperties {
    private String webApiKey;
    private String identityToolkitSignInWithPasswordUrl;
    private String identityToolkitSignInWithCustomTokenUrl;
    private long customTokenLifetimeSeconds = 3600;
}
