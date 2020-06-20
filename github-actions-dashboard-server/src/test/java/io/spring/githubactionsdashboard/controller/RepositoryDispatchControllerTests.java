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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.test.web.reactive.server.FluxExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import io.spring.githubactionsdashboard.domain.RepositoryDispatch;
import reactor.test.StepVerifier;

@AutoConfigureWebTestClient
@SpringBootTest(properties = { "spring.security.oauth2.client.registration.github.client-id=fake",
		"spring.security.oauth2.client.registration.github.client-secret=fake" })
public class RepositoryDispatchControllerTests {

	@Autowired
	private WebTestClient client;

	@Test
	public void testDispatches() {
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
}
