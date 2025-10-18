package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.comment.Comment;
import com.myhomelibrary.library_system.domains.comment.CommentRequest;
import com.myhomelibrary.library_system.domains.comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.entities.CommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentConverter {
    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID())")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "bookId", source = "bookId")
    CommentEntity toCommentEntity(CommentRequest commentRequest, Long bookId, Long userId);

    Comment toComment(CommentEntity commentEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pk", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateCommentEntity(CommentUpdateRequest commentUpdateRequest, @MappingTarget CommentEntity commentEntity);
}