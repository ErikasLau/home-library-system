package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.Comment.Comment;
import com.myhomelibrary.library_system.domains.Comment.CommentRequest;
import com.myhomelibrary.library_system.domains.User.UserShort;
import com.myhomelibrary.library_system.entities.CommentEntity;

import java.util.UUID;

public class CommentConverter {
    public static CommentEntity toCommentEntity(CommentRequest commentRequest, Long bookId, Long userId) {
        return CommentEntity.builder()
                .id(UUID.randomUUID())
                .text(commentRequest.getText())
                .rating(commentRequest.getRating())
                .userId(userId)
                .bookId(bookId)
                .build();
    }

    public static Comment toComment(CommentEntity commentEntity) {
        UserShort user = null;
        if (commentEntity.getUser() != null) {
            user = UserShort.builder()
                    .id(commentEntity.getUser().getId())
                    .username(commentEntity.getUser().getUsername())
                    .build();
        }

        return Comment.builder()
                .id(commentEntity.getId())
                .text(commentEntity.getText())
                .rating(commentEntity.getRating())
                .createdAt(commentEntity.getCreatedAt())
                .updatedAt(commentEntity.getUpdatedAt())
                .user(user)
                .build();
    }
}