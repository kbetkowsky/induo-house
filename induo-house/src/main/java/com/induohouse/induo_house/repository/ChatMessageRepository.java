package com.induohouse.induo_house.repository;

import com.induohouse.induo_house.entity.ChatMessage;
import com.induohouse.induo_house.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findTop10BySessionOrderByCreatedAtAsc(ChatSession session);
    List<ChatMessage> findTop10BySessionOrderByCreatedAtDesc(ChatSession session);
    List<ChatMessage> findBySessionOrderByCreatedAtAsc(ChatSession session);
}
