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
package io.spring.githubactionsdashboard.github;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import io.spring.githubactionsdashboard.domain.User;
import io.spring.githubactionsdashboard.github.MyRepositoriesQuery.Data;
import io.spring.githubactionsdashboard.github.MyRepositoriesQuery.Node;
import reactor.core.publisher.Mono;

/**
 * Default implementation of a {@link GithubApi}.
 *
 * @author Janne Valkealahti
 *
 */
@Component
public class DefaultGithubApi implements GithubApi {

	private final static String BASE_V3_API = "https://api.github.com";
	private final static String V3_USER_API = BASE_V3_API + "/user";
	private final WebClient webClient;
	private final GithubGraphqlClient githubGraphqlClient;

	public DefaultGithubApi(WebClient webClient, GithubGraphqlClient githubGraphqlClient) {
		this.webClient = webClient;
		this.githubGraphqlClient = githubGraphqlClient;
	}

	@Override
	public Mono<User> me() {
		return this.webClient
	        .get()
	        .uri(V3_USER_API)
			.retrieve()
	        .bodyToMono(User.class);
	}

	@Override
	public Mono<List<String>> repos() {
		MyRepositoriesQuery query = MyRepositoriesQuery.builder().build();
		Mono<Data> data = this.githubGraphqlClient.query(query);
		return data.map(r -> {
			Stream<Node> nodes = r.viewer().repositories().nodes().stream();
			List<String> repoNames = nodes.map(n -> n.name()).collect(Collectors.toList());
			return repoNames;
		});
	}
}
