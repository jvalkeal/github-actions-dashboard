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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockOAuth2Login;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.web.reactive.server.FluxExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import io.spring.githubactionsdashboard.domain.RepositoryDispatch;
import io.spring.githubactionsdashboard.domain.Team;
import io.spring.githubactionsdashboard.github.GithubApi;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

@AutoConfigureWebTestClient
@SpringBootTest(properties = { "spring.security.oauth2.client.registration.github.client-id=fake",
		"spring.security.oauth2.client.registration.github.client-secret=fake" })
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RepositoryDispatchControllerTests {

	@Autowired
	private WebTestClient client;

	@MockBean
	private GithubApi api;

	@Test
	public void testDispatches() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.expectBodyList(RepositoryDispatch.class).hasSize(0);
	}

	@Test
	public void testSaveDispatches() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("eventType", "eventType1")
				.build())
			.bodyValue("{}")
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isEmpty();
			})
			.verifyComplete();
	}

	@Test
	public void testSaveDispatchesNoClientPayload() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("eventType", "eventType1")
				.build())
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isNull();
			})
			.verifyComplete();
	}

	@Test
	public void testUpdateDispatchesNoClientPayload() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("eventType", "eventType1")
				.build())
			.bodyValue("{}")
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result1 = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result1.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isEmpty();
			})
			.verifyComplete();

		this.client
			.mutateWith(mockOAuth2Login())
			.patch()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("eventType", "eventType1")
				.build())
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result2 = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result2.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isNull();
			})
			.verifyComplete();
	}

	@Test
	public void testSaveTeamDispatches() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team2", "team2", 0)));

		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name2")
				.queryParam("team", "team2")
				.queryParam("eventType", "eventType1")
				.build())
			.bodyValue("{}")
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name2");
				assertThat(rp.getTeam()).isEqualTo("team2");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isEmpty();
			})
			.verifyComplete();
	}

	@Test
	public void testSaveTeamDispatchesNoClientPayload() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("team", "team1")
				.queryParam("eventType", "eventType1")
				.build())
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getClientPayload()).isNull();
			})
			.verifyComplete();
	}

	@Test
	public void testUpdateTeamDispatchesNoClientPayload() {
		Mockito.when(api.teams()).thenReturn(Flux.just(Team.of("team1", "team1", 0)));
		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("team", "team1")
				.queryParam("eventType", "eventType1")
				.build())
			.bodyValue("{}")
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result1 = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result1.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getTeam()).isEqualTo("team1");
				assertThat(rp.getClientPayload()).isEmpty();
			})
			.verifyComplete();

		this.client
			.mutateWith(mockOAuth2Login())
			.patch()
			.uri(builder -> builder
				.path("/user/dispatches")
				.queryParam("name", "name1")
				.queryParam("team", "team1")
				.queryParam("eventType", "eventType1")
				.build())
			.exchange()
			.expectStatus().is2xxSuccessful();
		FluxExchangeResult<RepositoryDispatch> result2 = this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dispatches")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.returnResult(new ParameterizedTypeReference<RepositoryDispatch>(){});
		StepVerifier.create(result2.getResponseBody())
			.assertNext(rp -> {
				assertThat(rp.getName()).isEqualTo("name1");
				assertThat(rp.getEventType()).isEqualTo("eventType1");
				assertThat(rp.getTeam()).isEqualTo("team1");
				assertThat(rp.getClientPayload()).isNull();
			})
			.verifyComplete();
	}

}
