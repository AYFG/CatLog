package com.catlog.catlog_spring_back.common;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonValueMapper {

    private final ObjectMapper objectMapper;

    public JsonValueMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String toStoredString(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.isTextual()) {
            return node.asText();
        }
        return node.toString();
    }

    public Object toResponseValue(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            try {
                return objectMapper.readTree(trimmed);
            } catch (JsonProcessingException e) {
                return value;
            }
        }
        return value;
    }
}
