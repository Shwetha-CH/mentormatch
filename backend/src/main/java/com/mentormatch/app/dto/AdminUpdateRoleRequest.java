package com.mentormatch.app.dto;

import com.mentormatch.app.entity.Role;
import jakarta.validation.constraints.NotNull;

public class AdminUpdateRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;

    public AdminUpdateRoleRequest() {}

    public AdminUpdateRoleRequest(Role role) {
        this.role = role;
    }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}