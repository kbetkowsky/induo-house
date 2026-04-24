package com.induohouse.induo_house.service;

import com.induohouse.induo_house.dto.request.ChatRequestDto;
import com.induohouse.induo_house.dto.response.ChatMessageDto;
import com.induohouse.induo_house.dto.response.ChatResponseDto;
import com.induohouse.induo_house.dto.response.ChatSessionSummaryDto;
import com.induohouse.induo_house.dto.response.ChatStatusDto;
import com.induohouse.induo_house.entity.ChatMessage;
import com.induohouse.induo_house.entity.ChatSession;
import com.induohouse.induo_house.entity.User;
import com.induohouse.induo_house.exception.AiChatUnavailableException;
import com.induohouse.induo_house.exception.ChatSessionNotFoundException;
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
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private static final int SESSION_TITLE_LENGTH = 48;

    private final ObjectProvider<ChatClient> chatClientProvider;
    private final ObjectProvider<VectorStore> vectorStoreProvider;
    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Value("${app.ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${app.ai.rag.enabled:false}")
    private boolean ragEnabled;

    @Value("${app.ai.assistant-name:Induo Assistant}")
    private String assistantName;

    @Value("${spring.ai.ollama.chat.model:${spring.ai.ollama.chat.options.model:}}")
    private String configuredModel;

    @Transactional(readOnly = true)
    public ChatStatusDto getStatus() {
        boolean modelConfigured = chatClientProvider.getIfAvailable() != null;

        String message;
        if (!aiEnabled) {
            message = "Moduł AI jest wyłączony. Ustaw APP_AI_ENABLED=true, aby włączyć chat.";
        } else if (!modelConfigured) {
            message = "Model nie jest jeszcze skonfigurowany. Sprawdź ustawienia Ollama i nazwę modelu.";
        } else if (ragEnabled && vectorStoreProvider.getIfAvailable() == null) {
            message = "Chat działa, ale RAG jest niedostępny. Sprawdź konfigurację pgvector lub embedding model.";
        } else {
            message = "Chat jest gotowy do użycia.";
        }

        return new ChatStatusDto(
                aiEnabled,
                ragEnabled,
                modelConfigured,
                assistantName,
                configuredModel == null || configuredModel.isBlank() ? "nieustawiony" : configuredModel,
                message
        );
    }

    @Transactional(readOnly = true)
    public List<ChatSessionSummaryDto> getSessions(String email) {
        return sessionRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(session -> new ChatSessionSummaryDto(
                        session.getId(),
                        session.getTitle(),
                        session.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getMessages(UUID sessionId, String email) {
        ChatSession session = getOwnedSession(sessionId, email);

        return messageRepository.findBySessionOrderByCreatedAtAsc(session).stream()
                .map(message -> new ChatMessageDto(
                        message.getId(),
                        message.getRole(),
                        message.getContent(),
                        message.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public ChatResponseDto chat(ChatRequestDto request, String email) {
        ensureAiEnabled();

        ChatClient chatClient = chatClientProvider.getIfAvailable();
        if (chatClient == null) {
            throw new AiChatUnavailableException("Model AI nie jest dostępny. Sprawdź konfigurację Ollama i nazwę modelu.");
        }

        ChatSession session = getOrCreateSession(request.sessionId(), request.message(), email);
        List<Message> history = messageRepository.findTop10BySessionOrderByCreatedAtDesc(session).stream()
                .sorted(Comparator.comparing(ChatMessage::getCreatedAt))
                .map(message -> (Message) (message.getRole().equals("USER")
                        ? new UserMessage(message.getContent())
                        : new AssistantMessage(message.getContent())))
                .toList();

        saveMessage(session, "USER", request.message());

        String context = loadContext(request.message());

        String answer;
        try {
            answer = chatClient.prompt()
                    .system(buildSystemPrompt(context))
                    .messages(history)
                    .user(request.message())
                    .call()
                    .content();
        } catch (Exception ex) {
            log.error("Chat model call failed", ex);
            throw new AiChatUnavailableException(
                    "Nie udało się uzyskać odpowiedzi modelu. Upewnij się, że Ollama działa i model został pobrany.",
                    ex
            );
        }

        saveMessage(session, "ASSISTANT", answer);

        return ChatResponseDto.builder()
                .sessionId(session.getId())
                .answer(answer)
                .build();
    }

    private String loadContext(String userMessage) {
        if (!ragEnabled) {
            return "";
        }

        VectorStore vectorStore = vectorStoreProvider.getIfAvailable();
        if (vectorStore == null) {
            log.warn("RAG enabled but VectorStore bean is unavailable");
            return "";
        }

        try {
            List<String> docs = vectorStore.similaritySearch(
                            SearchRequest.builder()
                                    .query(userMessage)
                                    .topK(3)
                                    .build()
                    ).stream()
                    .map(document -> document.getText())
                    .filter(text -> text != null && !text.isBlank())
                    .toList();

            if (docs.isEmpty()) {
                return "";
            }

            return "Dodatkowy kontekst z bazy wiedzy:\n" + String.join("\n\n", docs) + "\n\n";
        } catch (Exception ex) {
            log.warn("Failed to load RAG context, continuing without it", ex);
            return "";
        }
    }

    private String buildSystemPrompt(String context) {
        return """
                Jesteś pomocnym asystentem platformy nieruchomości Induo House.
                Odpowiadaj zawsze po polsku, konkretnie i naturalnie.
                Jeśli pytanie dotyczy nieruchomości, tłumacz jasno i bez marketingowego tonu.
                Jeśli nie znasz odpowiedzi, powiedz o tym wprost.
                """
                + (context.isBlank() ? "" : "\n\n" + context);
    }

    private void ensureAiEnabled() {
        if (!aiEnabled) {
            throw new AiChatUnavailableException(
                    "Moduł AI jest wyłączony. Ustaw APP_AI_ENABLED=true, aby włączyć chat."
            );
        }
    }

    private ChatSession getOrCreateSession(UUID sessionId, String firstMessage, String email) {
        if (sessionId != null) {
            return getOwnedSession(sessionId, email);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ChatSessionNotFoundException("Użytkownik nie istnieje."));

        return sessionRepository.save(ChatSession.builder()
                .user(user)
                .title(buildSessionTitle(firstMessage))
                .build());
    }

    private ChatSession getOwnedSession(UUID sessionId, String email) {
        return sessionRepository.findByIdAndUserEmail(sessionId, email)
                .orElseThrow(() -> new ChatSessionNotFoundException("Sesja czatu nie istnieje albo nie masz do niej dostępu."));
    }

    private String buildSessionTitle(String message) {
        String normalized = message == null ? "" : message.trim().replaceAll("\\s+", " ");
        if (normalized.isBlank()) {
            return "Nowa rozmowa";
        }

        return normalized.length() > SESSION_TITLE_LENGTH
                ? normalized.substring(0, SESSION_TITLE_LENGTH - 1) + "…"
                : normalized;
    }

    private void saveMessage(ChatSession session, String role, String content) {
        messageRepository.save(ChatMessage.builder()
                .session(session)
                .role(role)
                .content(content)
                .build());
    }
}
