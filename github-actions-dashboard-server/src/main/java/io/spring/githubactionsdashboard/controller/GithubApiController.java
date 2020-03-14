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

import java.util.Collections;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.config.DashboardProperties;
import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.domain.User;
import io.spring.githubactionsdashboard.github.GithubApi;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/github")
public class GithubApiController {

	private final GithubApi api;
	private final DashboardProperties dashboardProperties;

	public GithubApiController(GithubApi api, DashboardProperties dashboardProperties) {
		this.api = api;
		this.dashboardProperties = dashboardProperties;
	}

	@RequestMapping(path = "/me")
	@ResponseBody
	public Mono<User> me() {
		return this.api.me();
	}

	@RequestMapping(path = "/dashboard/global/{name}")
	@ResponseBody
	public Flux<Repository> dashboardGlobal(@PathVariable("name") String name) {
		return Flux.defer(() -> {
			List<Workflow> workflows = dashboardProperties.getViews().stream()
				.filter(v -> v.getName().equals(name))
				.map(v -> v.getWorkflows())
				.findFirst()
				.orElse(Collections.emptyList());
			return this.api.branchAndPrWorkflows(workflows);
		});
	}

	@RequestMapping(path = "/dashboard/user/{id}")
	@ResponseBody
	public Flux<Repository> dashboardUser(@PathVariable("id") Long id) {
		return Flux.empty();
	}
}
