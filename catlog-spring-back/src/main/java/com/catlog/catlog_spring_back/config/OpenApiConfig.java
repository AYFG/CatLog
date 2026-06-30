package com.catlog.catlog_spring_back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI catlogOpenApi() {
        String bearerAuth = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("CatLog Spring Backend API")
                        .version("1.0.0")
                        .description("CatLog_back API를 Spring Boot로 이식한 API 문서입니다."))
                .components(new Components()
                        .addSecuritySchemes(bearerAuth, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(bearerAuth));
    }
}
