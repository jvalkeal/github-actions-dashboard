package io.spring.githubactionsdashboard;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@EnableWebFluxSecurity
public class SecurityConfiguration {

	@Bean
	public SecurityWebFilterChain configure(ServerHttpSecurity http) {
		return http
			.authorizeExchange()
				.pathMatchers("/", "/index.html", "/*.js", "/login/**").permitAll()
				.anyExchange().authenticated()
				.and()
			.oauth2Login()
				.and()
			.build();
	}
}
