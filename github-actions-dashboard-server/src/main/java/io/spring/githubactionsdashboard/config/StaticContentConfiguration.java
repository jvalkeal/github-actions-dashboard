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
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

import org.springframework.beans.factory.annotation.Value;

/**
 * Configuration for angular static resources.
 *
 * @author Janne Valkealahti
 *
 */
@Configuration
public class StaticContentConfiguration {

	@Bean
	public RouterFunction<ServerResponse> indexRouter(@Value("classpath:/static/dashboard/index.html") Resource html) {
		return route()
			.GET("/", request -> ok().contentType(MediaType.TEXT_HTML).bodyValue(html))
			.GET("/dashboard", request -> ok().contentType(MediaType.TEXT_HTML).bodyValue(html))
			.build();
	}

	@Bean
	RouterFunction<ServerResponse> staticResourceRouter(){
		return RouterFunctions.resources("/**", new ClassPathResource("static/"));
	}
}
