package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.entities.OwnableResource;
import com.myhomelibrary.library_system.exceptions.ForbiddenException;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.exceptions.UnauthorizedException;
import com.myhomelibrary.library_system.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GenericAccessService {
    public <T extends OwnableResource> void assertOwner(ResourceFinder<T> finder, UUID resourceId) {
        T resource = finder.find(resourceId)
                .orElseThrow(UnauthorizedException::new);
        Long currentUserPk = SecurityUtils.getAuthenticatedUserPk();
        if (!resource.getOwnerId().equals(currentUserPk)) {
            throw new UnauthorizedException();
        }
    }

    public void assertAdmin() {
        if (!SecurityUtils.isCurrentUserAdmin()) {
            throw new ForbiddenException();
        }
    }

    public <T extends OwnableResource> void assertOwnerOrAdmin(ResourceFinder<T> finder, UUID resourceId) {
        Long currentUserPk = SecurityUtils.getAuthenticatedUserPk();
        T resource = finder.find(resourceId)
                .orElseThrow(NotFoundException::new);
        boolean isOwner = resource.getOwnerId().equals(currentUserPk);
        boolean isAdmin = SecurityUtils.isCurrentUserAdmin();
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException();
        }
    }

    public <T extends OwnableResource> void assertOwnerOrModeratorOrAdmin(ResourceFinder<T> finder, UUID resourceId) {
        Long currentUserPk = SecurityUtils.getAuthenticatedUserPk();
        T resource = finder.find(resourceId)
                .orElseThrow(NotFoundException::new);
        boolean isOwner = resource.getOwnerId().equals(currentUserPk);
        boolean isModeratorOrAdmin = SecurityUtils.isCurrentUserModerator() || SecurityUtils.isCurrentUserAdmin();
        if (!isOwner && !isModeratorOrAdmin) {
            throw new ForbiddenException();
        }
    }
}
