package com.developerplatform.featureflag.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeatureFlagRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Key is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Key can only contain lowercase letters, numbers, and hyphens")
    @Size(min = 2, max = 100, message = "Key must be between 2 and 100 characters")
    private String key;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private boolean enabled;
}
