/*
 * Copyright 2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.spring.githubactionsdashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.HttpStatusReturningServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;

import reactor.core.publisher.Mono;

/**
 * Security related configs.
 *
 * @author Janne Valkealahti
 *
 */
@EnableWebFluxSecurity
public class SecurityConfiguration {

	private final static String[] PERMIT_PATHS = {
			"/",
			"/dashboard/**",
			"/oauth2/**",
			"/login/**",
			"/logout/**",
			"/user/whoami" };

	@Bean
	public SecurityWebFilterChain configure(ServerHttpSecurity http) {
		return http
			.authorizeExchange()
				.pathMatchers(PERMIT_PATHS).permitAll()
				.anyExchange().authenticated()
				.and()
			// TODO: figure out how to keep csrf enabled
			.csrf()
				.disable()
			.oauth2Login()
				.and()
			.exceptionHandling()
				.authenticationEntryPoint((exchange, e) -> {
					return Mono.fromRunnable(() -> {
						exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
					});
				})
				.and()
			.logout()
				.logoutSuccessHandler(logoutSuccessHandler())
				.and()
			.build();
	}

	@Bean
	public ServerLogoutSuccessHandler logoutSuccessHandler() {
		// As logout is used by a simple request from an angular app,
		// just return ok so that we don't need to handle response content.
		return new HttpStatusReturningServerLogoutSuccessHandler();
	}
}
