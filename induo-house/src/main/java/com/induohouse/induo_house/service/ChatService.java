package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.ChatRequestDto;
import com.induohouse.induo_house.dto.response.ChatResponseDto;
import com.induohouse.induo_house.entity.ChatMessage;
import com.induohouse.induo_house.entity.ChatSession;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.repository.ChatMessageRepository;
import com.induohouse.induo_house.repository.ChatSessionRepository;
import com.induohouse.induo_house.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatResponseDto chat(ChatRequestDto request, String email) {
        // 1. Pobierz lub stwórz sesję
        ChatSession session = getOrCreateSession(request.sessionId(), email);

        // 2. Zapisz wiadomość użytkownika
        saveMessage(session, "USER", request.message());

        // 3. Pobierz historię (ostatnie 10 wiadomości)
        List<Message> history = messageRepository
                .findTop10BySessionOrderByCreatedAtAsc(session)
                .stream()
                .map(m -> m.getRole().equals("USER")
                        ? new UserMessage(m.getContent())
                        : new AssistantMessage(m.getContent()))
                .collect(Collectors.toList());

        // 4. Szukaj relevantnych dokumentów w pgvector
        List<String> docs = vectorStore
                .similaritySearch(SearchRequest.builder()
                        .query(request.message())
                        .topK(3)
                        .build())
                .stream()
                .map(d -> d.getText())
                .toList();

        String context = docs.isEmpty() ? "" :
                "Kontekst z dokumentów:\n" + String.join("\n\n", docs) + "\n\n";

        // 5. Wywołaj Ollama przez Spring AI
        String answer = chatClient.prompt()
                .system("""
                Jesteś asystentem platformy nieruchomości Induo House.
                Odpowiadaj zawsze po polsku, pomocnie i konkretnie.
                Jeśli nie znasz odpowiedzi, powiedz o tym wprost.
                """ + context)
                .messages(history)
                .user(request.message())
                .call()
                .content();

        // 6. Zapisz odpowiedź
        saveMessage(session, "ASSISTANT", answer);

        return ChatResponseDto.builder()
                .sessionId(session.getId())
                .answer(answer)
                .build();
    }

    private ChatSession getOrCreateSession(UUID sessionId, String email) {
        if (sessionId != null) {
            return sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Sesja nie istnieje"));
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
        return sessionRepository.save(ChatSession.builder()
                .user(user)
                .title("Nowa rozmowa")
                .build());
    }

    private void saveMessage(ChatSession session, String role, String content) {
        messageRepository.save(ChatMessage.builder()
                .session(session)
                .role(role)
                .content(content)
                .build());
    }
}