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

import java.util.Optional;

import com.apollographql.apollo.ApolloClient;
import com.apollographql.apollo.api.Operation;
import com.apollographql.apollo.api.Query;
import com.apollographql.apollo.api.Response;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.web.server.ServerWebExchange;

import io.spring.githubactionsdashboard.utils.ReactorApollo;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import reactor.core.publisher.Mono;

/**
 * GraphQL client for Github v4 api handling oauth authentication.
 *
 * @author Janne Valkealahti
 *
 */
public class GithubGraphqlClient {

	private static final AnonymousAuthenticationToken ANONYMOUS_USER_TOKEN = new AnonymousAuthenticationToken("anonymous", "anonymousUser",
			AuthorityUtils.createAuthorityList("ROLE_USER"));

	private ReactiveOAuth2AuthorizedClientManager authorizedClientManager;

	public GithubGraphqlClient(ReactiveClientRegistrationRepository clientRegistrationRepository,
			ServerOAuth2AuthorizedClientRepository authorizedClientRepository) {
		this.authorizedClientManager = createDefaultAuthorizedClientManager(clientRegistrationRepository, authorizedClientRepository);
	}

	public <D extends Operation.Data, T, V extends Operation.Variables> Mono<T> query(final Query<D, T, V> call) {

		Mono<String> clientRegistrationId = Mono.just("github");
		Mono<Authentication> authentication = currentAuthentication();
		Mono<Optional<ServerWebExchange>> serverWebExchange = currentServerWebExchange()
			.map(Optional::of)
			.defaultIfEmpty(Optional.empty());

		Mono<OAuth2AuthorizeRequest> authorizeRequest = Mono.zip(clientRegistrationId, authentication, serverWebExchange)
			.map(t3 -> {
				OAuth2AuthorizeRequest.Builder builder = OAuth2AuthorizeRequest.withClientRegistrationId(t3.getT1()).principal(t3.getT2());
				if (t3.getT3().isPresent()) {
					builder.attribute(ServerWebExchange.class.getName(), t3.getT3().get());
				}
				return builder.build();
			});

		Mono<ApolloClient> apolloClient = apolloClient(authorizeRequest);
		Mono<Response<T>> response = apolloClient.map(client -> client.query(call)).flatMap(c -> ReactorApollo.from(c));
		return response.map(r -> r.data());
	}

	private Mono<ApolloClient> apolloClient(Mono<OAuth2AuthorizeRequest> authorizeRequest) {
		return authorizeRequest
			.map(this.authorizedClientManager::authorize)
			.flatMap(c -> c)
			.map(t -> {
				OkHttpClient okHttpClient = new OkHttpClient.Builder()
					.addInterceptor(chain -> {
						Request original = chain.request();
						Request.Builder builder = original.newBuilder().method(original.method(), original.body());
						builder.header("Authorization", "Bearer " + t.getAccessToken().getTokenValue());
						return chain.proceed(builder.build());
					})
					.build();
				ApolloClient apolloClient = ApolloClient.builder()
					.serverUrl("https://api.github.com/graphql")
					.okHttpClient(okHttpClient)
					.build();
				return apolloClient;
			})
			;
	}

	private static Mono<Authentication> currentAuthentication() {
		return ReactiveSecurityContextHolder.getContext()
			.map(SecurityContext::getAuthentication)
			.defaultIfEmpty(ANONYMOUS_USER_TOKEN);
	}

	private static Mono<ServerWebExchange> currentServerWebExchange() {
		return Mono.subscriberContext()
			.filter(c -> c.hasKey(ServerWebExchange.class))
			.map(c -> c.get(ServerWebExchange.class));
	}

	private static ReactiveOAuth2AuthorizedClientManager createDefaultAuthorizedClientManager(
			ReactiveClientRegistrationRepository clientRegistrationRepository,
			ServerOAuth2AuthorizedClientRepository authorizedClientRepository) {

		ReactiveOAuth2AuthorizedClientProvider provider = ReactiveOAuth2AuthorizedClientProviderBuilder.builder()
			.authorizationCode()
			.refreshToken()
			.clientCredentials()
			.password()
			.build();

		DefaultReactiveOAuth2AuthorizedClientManager manager = new DefaultReactiveOAuth2AuthorizedClientManager(
				clientRegistrationRepository, authorizedClientRepository);
		manager.setAuthorizedClientProvider(provider);

		return manager;
	}

}
