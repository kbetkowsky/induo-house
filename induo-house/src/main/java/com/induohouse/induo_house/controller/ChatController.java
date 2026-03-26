package com.induohouse.induo_house.controller;

import com.induohouse.induo_house.dto.request.ChatRequestDto;
import com.induohouse.induo_house.dto.response.ChatResponseDto;
import com.induohouse.induo_house.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponseDto> sendMessage(
            @RequestBody ChatRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                chatService.chat(request, userDetails.getUsername())
        );
    }
}