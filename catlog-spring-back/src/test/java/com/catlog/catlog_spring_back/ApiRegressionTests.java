package com.catlog.catlog_spring_back;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiRegressionTests {

    @LocalServerPort
    private int port;

    private final TestRestTemplate restTemplate = new TestRestTemplate();

    @Test
    void full_api_regression_flow_keeps_legacy_response_shape() {
        String email = "api-regression-" + System.nanoTime() + "@example.com";
        String password = "password123";

        JsonNode signup = post("/auth/signup", Map.of(
                "email", email,
                "name", "test",
                "password", password), null, HttpStatus.CREATED);
        assertThat(signup.get("ok").asInt()).isEqualTo(1);
        String userId = signup.get("userId").asText();

        JsonNode login = post("/auth/login", Map.of(
                "email", email,
                "password", password), null, HttpStatus.OK);
        assertThat(login.get("ok").asInt()).isEqualTo(1);
        assertThat(login.at("/item/userId").asText()).isEqualTo(userId);
        String accessToken = login.at("/item/accessToken").asText();
        String refreshToken = login.at("/item/refreshToken").asText();
        assertThat(accessToken).isNotBlank();
        assertThat(refreshToken).isNotBlank();

        JsonNode refresh = post("/auth/refresh", Map.of("refreshToken", refreshToken), null, HttpStatus.OK);
        assertThat(refresh.get("ok").asInt()).isEqualTo(1);
        assertThat(refresh.get("accessToken").asText()).isNotBlank();

        JsonNode cat = post("/cat", Map.of(
                "name", "nabi",
                "birthDate", "2024-01-01",
                "catType", "korean",
                "owner", userId), accessToken, HttpStatus.CREATED);
        assertThat(cat.get("ok").asInt()).isEqualTo(1);
        String catId = cat.at("/cat/_id").asText();
        assertThat(cat.at("/cat/owner").asText()).isEqualTo(userId);

        JsonNode cats = get("/cat/" + userId, accessToken, HttpStatus.OK);
        assertThat(cats.get("ok").asInt()).isEqualTo(1);
        assertThat(cats.get("cats")).hasSize(1);

        JsonNode firstDailyLog = post("/dailyLog/" + catId, Map.of(
                "cat", Map.of("catName", "nabi"),
                "defecation", true,
                "vitamin", false,
                "weight", 4.2,
                "etc", Map.of("memo", "first"),
                "logDate", "2026-06-29"), accessToken, HttpStatus.CREATED);
        String dailyLogId = firstDailyLog.at("/dailyLog/_id").asText();

        JsonNode updatedDailyLog = post("/dailyLog/" + catId, Map.of(
                "cat", Map.of("catName", "nabi"),
                "defecation", false,
                "vitamin", true,
                "weight", 4.3,
                "etc", "updated",
                "logDate", "2026-06-29"), accessToken, HttpStatus.CREATED);
        assertThat(updatedDailyLog.at("/dailyLog/_id").asText()).isEqualTo(dailyLogId);
        assertThat(updatedDailyLog.at("/dailyLog/weight").asDouble()).isEqualTo(4.3);

        JsonNode dailyLogs = get("/dailyLog?logDate=2026-06-29", accessToken, HttpStatus.OK);
        assertThat(dailyLogs.get("dailyLogs")).hasSize(1);

        JsonNode everyLogDates = get("/dailyLog/everyLogDates", accessToken, HttpStatus.OK);
        assertThat(everyLogDates.get("everyLogDates")).hasSize(1);

        JsonNode firstMedicalLog = post("/medicalLog/" + catId, Map.of(
                "cat", Map.of("catName", "nabi"),
                "healthCheckupDate", "2026-06-01",
                "healthCycle", 12,
                "heartWorm", "Y",
                "heartWormCycle", 1), accessToken, HttpStatus.CREATED);
        String medicalLogId = firstMedicalLog.at("/medicalLog/_id").asText();

        JsonNode updatedMedicalLog = post("/medicalLog/" + catId, Map.of(
                "cat", Map.of("catName", "nabi"),
                "healthCheckupDate", "2026-06-02",
                "healthCycle", 6,
                "heartWorm", "N",
                "heartWormCycle", 2), accessToken, HttpStatus.CREATED);
        assertThat(updatedMedicalLog.at("/medicalLog/_id").asText()).isEqualTo(medicalLogId);
        assertThat(updatedMedicalLog.at("/medicalLog/healthCycle").asText()).isEqualTo("6");

        JsonNode catsAfterMedicalLog = get("/cat/" + userId, accessToken, HttpStatus.OK);
        assertThat(catsAfterMedicalLog.at("/cats/0/medicalLogs/_id").asText()).isEqualTo(medicalLogId);

        JsonNode updatedCat = put("/cat/" + catId, Map.of(
                "name", "choco",
                "birthDate", "2024-01-02",
                "catType", "mix"), accessToken, HttpStatus.CREATED);
        assertThat(updatedCat.at("/cat/name").asText()).isEqualTo("choco");

        JsonNode dailyLogsAfterCatUpdate = get("/dailyLog?logDate=2026-06-29", accessToken, HttpStatus.OK);
        assertThat(dailyLogsAfterCatUpdate.at("/dailyLogs/0/cat/catName").asText()).isEqualTo("choco");

        JsonNode deleteDailyLog = delete("/dailyLog/" + dailyLogId, accessToken, HttpStatus.OK);
        assertThat(deleteDailyLog.get("ok").asInt()).isEqualTo(1);

        JsonNode deleteCat = delete("/cat/" + catId, accessToken, HttpStatus.OK);
        assertThat(deleteCat.get("ok").asInt()).isEqualTo(1);

        JsonNode deleteUser = delete("/auth/deleteUser/" + userId, accessToken, HttpStatus.OK);
        assertThat(deleteUser.get("ok").asInt()).isEqualTo(1);
    }

    @Test
    void protected_api_requires_bearer_token() {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url("/cat/1"), JsonNode.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void login_failure_response_contains_name_fields() {
        JsonNode response = post("/auth/login", Map.of(
                "email", "missing-" + System.nanoTime() + "@example.com",
                "password", "password123"), null, HttpStatus.UNAUTHORIZED);

        assertThat(response.get("ok").asInt()).isEqualTo(0);
        assertThat(response.get("name").asText()).isEqualTo("email");
        assertThat(response.get("errorName").asText()).isEqualTo("email");
    }

    @Test
    void signup_validation_error_contains_legacy_data_shape() {
        JsonNode response = post("/auth/signup", Map.of(
                "email", "not-email",
                "name", "x",
                "password", "123"), null, HttpStatus.UNPROCESSABLE_ENTITY);

        assertThat(response.get("ok").asInt()).isEqualTo(0);
        assertThat(response.get("data")).isNotEmpty();
        assertThat(response.at("/data/0/path").asText()).isNotBlank();
        assertThat(response.at("/data/0/msg").asText()).isNotBlank();
    }

    @Test
    void cors_preflight_allows_frontend_authorization_header() {
        HttpHeaders headers = new HttpHeaders();
        headers.setOrigin("http://localhost:19006");
        headers.setAccessControlRequestMethod(HttpMethod.POST);
        headers.setAccessControlRequestHeaders(java.util.List.of("Authorization", "Content-Type"));

        ResponseEntity<Void> response = restTemplate.exchange(
                url("/cat"),
                HttpMethod.OPTIONS,
                new HttpEntity<>(headers),
                Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getAccessControlAllowOrigin()).isEqualTo("http://localhost:19006");
        assertThat(response.getHeaders().getAccessControlAllowHeaders()).contains("Authorization", "Content-Type");
        assertThat(response.getHeaders().getAccessControlAllowMethods()).contains(HttpMethod.POST);
    }

    @Test
    void openapi_docs_are_publicly_accessible() {
        JsonNode response = get("/v3/api-docs", null, HttpStatus.OK);

        assertThat(response.at("/info/title").asText()).isEqualTo("CatLog Spring Backend API");
        assertThat(response.at("/components/securitySchemes/bearerAuth/type").asText()).isEqualTo("http");
    }

    @Test
    void openapi_docs_expose_all_legacy_paths() {
        JsonNode response = get("/v3/api-docs", null, HttpStatus.OK);
        List<String> legacyPaths = List.of(
                "/auth/signup",
                "/auth/login",
                "/auth/refresh",
                "/auth/deleteUser/{userId}",
                "/cat",
                "/cat/{userId}",
                "/cat/{catId}",
                "/dailyLog/{catId}",
                "/dailyLog",
                "/dailyLog/everyLogDates",
                "/dailyLog/{dailyLogId}",
                "/medicalLog/{catId}");

        legacyPaths.forEach(path -> assertThat(response.at("/paths/" + path.replace("/", "~1")).isMissingNode())
                .as("OpenAPI path %s", path)
                .isFalse());
    }

    private JsonNode get(String path, String token, HttpStatus expectedStatus) {
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url(path),
                HttpMethod.GET,
                new HttpEntity<>(headers(token)),
                JsonNode.class);
        assertThat(response.getStatusCode()).isEqualTo(expectedStatus);
        return response.getBody();
    }

    private JsonNode post(String path, Object body, String token, HttpStatus expectedStatus) {
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url(path),
                HttpMethod.POST,
                new HttpEntity<>(body, headers(token)),
                JsonNode.class);
        assertThat(response.getStatusCode()).isEqualTo(expectedStatus);
        return response.getBody();
    }

    private JsonNode put(String path, Object body, String token, HttpStatus expectedStatus) {
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url(path),
                HttpMethod.PUT,
                new HttpEntity<>(body, headers(token)),
                JsonNode.class);
        assertThat(response.getStatusCode()).isEqualTo(expectedStatus);
        return response.getBody();
    }

    private JsonNode delete(String path, String token, HttpStatus expectedStatus) {
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url(path),
                HttpMethod.DELETE,
                new HttpEntity<>(headers(token)),
                JsonNode.class);
        assertThat(response.getStatusCode()).isEqualTo(expectedStatus);
        return response.getBody();
    }

    private HttpHeaders headers(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return headers;
    }

    private String url(String path) {
        return "http://localhost:" + port + path;
    }
}
