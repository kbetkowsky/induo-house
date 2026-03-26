package com.induohouse.induo_house.repository;

import com.induohouse.induo_house.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findByUserEmailOrderByCreatedAtDesc(String email);
}