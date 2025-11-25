package com.example.demo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API HuertoHogar",
                version = "1.0",
                description = "Documentación de la API para la tienda HuertoHogar: autenticación JWT, productos, categorías, pedidos y subida de imágenes a S3."
        )
)
public class SwaggerConfig {
}