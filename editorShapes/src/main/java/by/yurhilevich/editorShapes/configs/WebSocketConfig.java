package by.yurhilevich.editorShapes.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/lab1").setAllowedOriginPatterns("*").withSockJS();
        registry.addEndpoint("/lab2").setAllowedOriginPatterns("*").withSockJS();
        registry.addEndpoint("/polygon").setAllowedOriginPatterns("*").withSockJS();
        registry.addEndpoint("/lab7").setAllowedOriginPatterns("*").withSockJS();
    }
}

