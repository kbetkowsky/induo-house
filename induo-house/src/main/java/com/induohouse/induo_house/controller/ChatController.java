package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.request.ChatRequestDto;
import com.induohouse.induo_house.dto.response.ChatMessageDto;
import com.induohouse.induo_house.dto.response.ChatResponseDto;
import com.induohouse.induo_house.dto.response.ChatSessionSummaryDto;
import com.induohouse.induo_house.dto.response.ChatStatusDto;
import com.induohouse.induo_house.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/status")
    public ResponseEntity<ChatStatusDto> getStatus() {
        return ResponseEntity.ok(chatService.getStatus());
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSessionSummaryDto>> getSessions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getSessions(userDetails.getUsername()));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getMessages(sessionId, userDetails.getUsername()));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponseDto> sendMessage(
            @Valid @RequestBody ChatRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                chatService.chat(request, userDetails.getUsername())
        );
    }
}
