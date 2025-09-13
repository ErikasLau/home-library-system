package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.Comment.Comment;
import com.myhomelibrary.library_system.domains.Comment.CommentRequest;
import com.myhomelibrary.library_system.entities.CommentEntity;

public class CommentConverter {
    public static CommentEntity toCommentEntity(CommentRequest commentRequest, Long bookId, Long userId) {
        return CommentEntity.builder()
                .text(commentRequest.getText())
                .rating(commentRequest.getRating())
                .userId(userId)
                .bookId(bookId)
                .build();
    }

    public static Comment toComment(CommentEntity commentEntity) {
        return Comment.builder()
                .id(commentEntity.getId())
                .text(commentEntity.getText())
                .rating(commentEntity.getRating())
                .createdAt(commentEntity.getCreatedAt())
                .updatedAt(commentEntity.getUpdatedAt())
                .build();
    }
}
