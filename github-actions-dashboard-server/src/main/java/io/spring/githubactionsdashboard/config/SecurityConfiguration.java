package io.spring.githubactionsdashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.HttpStatusReturningServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;

@EnableWebFluxSecurity
public class SecurityConfiguration {

	@Bean
	public SecurityWebFilterChain configure(ServerHttpSecurity http) {
		return http
			.authorizeExchange()
				.pathMatchers("/", "/dashboard/**", "/oauth2/**", "/login/**", "/logout/**", "/user/**").permitAll()
				.anyExchange().authenticated()
				.and()
			.csrf()
				.disable()
			.oauth2Login()
				.and()
			.logout()
				.logoutSuccessHandler(logoutSuccessHandler())
				.and()
			.build();
	}

	@Bean
	public ServerLogoutSuccessHandler logoutSuccessHandler() {
		return new HttpStatusReturningServerLogoutSuccessHandler();
	}
}
