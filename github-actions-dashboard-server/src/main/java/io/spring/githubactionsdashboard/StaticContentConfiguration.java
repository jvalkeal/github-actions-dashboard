package io.spring.githubactionsdashboard;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

import org.springframework.beans.factory.annotation.Value;

@Configuration
public class StaticContentConfiguration {

	@Bean
	public RouterFunction<ServerResponse> indexRouter(@Value("classpath:/static/index.html") Resource html) {
		return route(GET("/"), request -> ok().contentType(MediaType.TEXT_HTML).bodyValue(html));
	}

	@Bean
	RouterFunction<ServerResponse> staticResourceRouter(){
		return RouterFunctions.resources("/**", new ClassPathResource("static/"));
	}
}
