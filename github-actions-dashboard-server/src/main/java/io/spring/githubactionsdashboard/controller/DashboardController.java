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

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.config.DashboardProperties;
import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Branch;
import io.spring.githubactionsdashboard.domain.Dashboard;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.repository.DashboardRepository;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/user/dashboards")
public class DashboardController {

	private final DashboardRepository repository;
	private final DashboardProperties properties;

	public DashboardController(DashboardRepository repository, DashboardProperties properties) {
		this.repository = repository;
		this.properties = properties;
	}

	/**
	 * Gets all global {@link Dashboard}'s visible to a user.
	 *
	 * @return global dashboars visible to a user
	 */
	@RequestMapping(path = "/global", method = RequestMethod.GET)
	@ResponseBody
	public Flux<Dashboard> getGlobalDashboards() {
		return globals();
	}

	/**
	 * Gets all users owned {@link Dashboard}'s.
	 *
	 * @param oauth2User the user
	 * @return users dashboars
	 */
	@RequestMapping(path = "/user", method = RequestMethod.GET)
	@ResponseBody
	public Flux<Dashboard> getUserDashboards(@AuthenticationPrincipal OAuth2User oauth2User) {
		return Flux
		 	.fromIterable(this.repository.findByUsername(oauth2User.getName()))
			.map(Dashboard::of);
	}

	private Flux<Dashboard> globals() {
		return Flux.fromIterable(properties.getViews())
			.map(view -> {
				List<Repository> repositories = view.getWorkflows().stream()
						.map(workFlow -> {
							List<Branch> branches = workFlow.getBranches().stream().map(b -> Branch.of(b, null)).collect(Collectors.toList());
							return Repository.of(workFlow.getOwner(), workFlow.getName(), repoUrl(workFlow), branches, null);
						})
						.collect(Collectors.toList());
				return new Dashboard(view.getName(), view.getDescription(), repositories);
			});
	}

	private String repoUrl(Workflow workflow) {
		return String.format("http://github.com/%s/%s", workflow.getOwner(), workflow.getName());
	}
}
