package com.myhomelibrary.library_system.domains.Book;

import com.myhomelibrary.library_system.domains.Comment.Comment;
import lombok.*;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class BookWithComments extends Book {
    private List<Comment> comments;

    public BookWithComments(Book book, List<Comment> comments) {
        super(book.getId(), book.getTitle(), book.getAuthor(), book.getIsbn(),
                book.getReleaseDate(), book.getDescription(), book.getLanguage(),
                book.getPages(), book.getPublisher(), book.getGenre(),
                book.getCoverImageUrl(), book.getCreatedAt(), book.getUpdatedAt());
        this.comments = comments;
    }
}