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
package io.spring.githubactionsdashboard.controller;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.apollographql.apollo.ApolloClient;
import com.apollographql.apollo.ApolloQueryCall;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.request.RequestHeaders;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.github.MyRepositoriesQuery;
import io.spring.githubactionsdashboard.github.MyRepositoriesQuery.Data;
import io.spring.githubactionsdashboard.github.MyRepositoriesQuery.Node;
import io.spring.githubactionsdashboard.utils.ReactorApollo;
import okhttp3.OkHttpClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class GithubController {

	@RequestMapping(path = "/repositories")
	@ResponseBody
	public Mono<Repositories> repositories(@RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,
			@AuthenticationPrincipal OAuth2User oauth2User) {
		OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
		ApolloClient apolloClient = ApolloClient.builder()
			.serverUrl("https://api.github.com/graphql")
			.okHttpClient(okHttpClient)
			.build();
		MyRepositoriesQuery query = MyRepositoriesQuery.builder().build();
		RequestHeaders headers = RequestHeaders.builder()
			.addHeader("Authorization", "Bearer " + authorizedClient.getAccessToken().getTokenValue())
			.build();
		ApolloQueryCall<Data> queryCall = apolloClient.query(query).requestHeaders(headers);
		Mono<Response<Data>> response = ReactorApollo.from(queryCall);
		return response.map(r -> {
			Stream<Node> nodes = r.data().viewer().repositories().nodes().stream();
			List<String> repoNames = nodes.map(n -> n.name()).collect(Collectors.toList());
			return new Repositories(repoNames);
		});
	}

	public static class Repositories {
		private List<String> repositories;

		public Repositories(List<String> repositories) {
			this.repositories = repositories;
		}

		public List<String> getRepositories() {
			return repositories;
		}
	}
}
