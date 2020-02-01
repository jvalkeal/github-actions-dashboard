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
