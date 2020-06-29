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

import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockOAuth2Login;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

import io.spring.githubactionsdashboard.domain.Dashboard;
import reactor.test.StepVerifier;

@AutoConfigureWebTestClient
@SpringBootTest(properties = { "spring.security.oauth2.client.registration.github.client-id=fake",
		"spring.security.oauth2.client.registration.github.client-secret=fake" })
public class DashboardControllerTests {

	@Autowired
	private WebTestClient client;

	@Autowired
	private DashboardController controller;

	@Test
	public void testGlobal() {
		StepVerifier.create(controller.getGlobalDashboards())
			.expectNextCount(0)
			.verifyComplete();
	}

	@Test
	public void testUserDashboards() {
		this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dashboards/user")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.expectBodyList(Dashboard.class).hasSize(0);

		this.client
			.mutateWith(mockOAuth2Login())
			.post()
			.uri("/user/dashboards/user")
			.bodyValue(new Dashboard("foo", "bar", null, new ArrayList<>()))
			.exchange()
			.expectStatus().is2xxSuccessful();

		this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dashboards/user")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.expectBodyList(Dashboard.class).hasSize(1);

		this.client
			.mutateWith(mockOAuth2Login())
			.delete()
			.uri(builder -> builder.path("/user/dashboards/user").queryParam("name", "foo").build())
			.exchange()
			.expectStatus().is2xxSuccessful();

		this.client
			.mutateWith(mockOAuth2Login())
			.get()
			.uri("/user/dashboards/user")
			.exchange()
			.expectStatus().is2xxSuccessful()
			.expectBodyList(Dashboard.class).hasSize(0);
	}
}
