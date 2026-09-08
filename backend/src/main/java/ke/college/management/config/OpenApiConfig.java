package ke.college.management.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI collegeErpOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("College Management System REST API")
                        .description("Enterprise Multi-Tenant College ERP REST API specification. Powered by Java 21, Spring Boot 3, and PostgreSQL.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Enterprise College Management")
                                .email("support@apex.edu"))
                        .license(new License()
                                .name("Proprietary Institutional License")));
    }
}
