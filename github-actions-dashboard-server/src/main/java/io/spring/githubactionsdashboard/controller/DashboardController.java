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
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.spring.githubactionsdashboard.config.DashboardProperties;
import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Branch;
import io.spring.githubactionsdashboard.domain.Dashboard;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.domain.RepositoryDispatch;
import io.spring.githubactionsdashboard.domain.Team;
import io.spring.githubactionsdashboard.entity.DashboardEntity;
import io.spring.githubactionsdashboard.entity.RepositoryEntity;
import io.spring.githubactionsdashboard.github.GithubApi;
import io.spring.githubactionsdashboard.repository.DashboardRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/user/dashboards")
public class DashboardController {

	private final static Logger log = LoggerFactory.getLogger(DashboardController.class);
	private final DashboardRepository repository;
	private final DashboardProperties properties;
	private final GithubApi api;

	public DashboardController(DashboardRepository repository, DashboardProperties properties, GithubApi api) {
		this.repository = repository;
		this.properties = properties;
		this.api = api;
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
			.fromIterable(this.repository.findByUsernameAndTeamIsNull(oauth2User.getName()))
			.map(Dashboard::of);
	}

	/**
	 * Save a given {@link Dashboard}.
	 *
	 * @param oauth2User the user
	 * @param dashboard the dashboard
	 * @return Mono for completion
	 */
	@RequestMapping(path = "/user", method = RequestMethod.POST)
	public Mono<Void> saveUserDashboard(@AuthenticationPrincipal OAuth2User oauth2User, @RequestBody Dashboard dashboard) {
		return Mono.just(dashboard)
			.map(d -> {
				DashboardEntity entity = this.repository.findByUsernameAndName(oauth2User.getName(), dashboard.getName());
				log.debug("Existing user dashboard entity {}", entity);
				if (entity == null) {
					entity = DashboardEntity.from(dashboard);
					log.debug("Created user dashboard new entity {}", entity);
				} else {
					entity.setRepositories(dashboard.getRepositories().stream().map(RepositoryEntity::from).collect(Collectors.toSet()));
					log.debug("Updated user dashboard entity {}", entity);
				}
				return entity;
			})
			.doOnNext(e -> {
				e.setUsername(oauth2User.getName());
				this.repository.save(e);
			})
			.then();
	}

	@RequestMapping(path = "/user", method = RequestMethod.DELETE)
	public Mono<Void> deleteUserDashboard(@AuthenticationPrincipal OAuth2User oauth2User, @RequestParam("name") String name) {
		return Mono.just(name)
			.doOnNext(e -> {
				DashboardEntity entity = this.repository.findByUsernameAndName(oauth2User.getName(), name);
				if (entity != null) {
					this.repository.delete(entity);
				}
			})
			.then();
	}

	/**
	 * Gets all teams {@link Dashboard}'s visible to a user.
	 *
	 * @param oauth2User the user
	 * @return team dashboars
	 */
	@RequestMapping(path = "/team", method = RequestMethod.GET)
	@ResponseBody
	public Flux<Dashboard> getTeamDashboards(@AuthenticationPrincipal OAuth2User oauth2User) {
		return this.api.teams()
			.collectMap(team -> team.getCombinedSlug())
			.flatMapMany(teamMap -> Flux.fromIterable(repository.findByTeamIn(teamMap.keySet())))
			.map(Dashboard::of);
	}

	/**
	 * Save a given team {@link Dashboard}.
	 *
	 * @param oauth2User the user
	 * @param id the team id
	 * @param dashboard the dashboard
	 * @return Mono for completion
	 */
	@RequestMapping(path = "/team", method = RequestMethod.POST)
	public Mono<Void> saveTeamDashboard(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestParam("team") String team, @RequestBody Dashboard dashboard) {
		return Mono.just(dashboard)
			.map(d -> {
				DashboardEntity entity = this.repository.findByTeamAndName(team, dashboard.getName());
				log.debug("Existing team dashboard entity {}", entity);
				if (entity == null) {
					entity = DashboardEntity.from(dashboard);
					log.debug("Created team dashboard new entity {}", entity);
				} else {
					entity.setRepositories(dashboard.getRepositories().stream().map(RepositoryEntity::from).collect(Collectors.toSet()));
					log.debug("Updated team dashboard entity {}", entity);
				}
				return entity;
			})
			.doOnNext(e -> {
				e.setUsername(oauth2User.getName());
				this.repository.save(e);
			})
			.then();
	}

	/**
	 * Delete a given team {@link Dashboard}.
	 *
	 * @param oauth2User the user
	 * @param name the dashboard name
	 * @return Mono for completion
	 */
	@RequestMapping(path = "/team", method = RequestMethod.DELETE)
	public Mono<Void> deleteTeamDashboard(@AuthenticationPrincipal OAuth2User oauth2User,
			@RequestParam("name") String name) {
		return Mono.empty();
	}

	private Flux<Dashboard> globals() {
		return Flux.fromIterable(properties.getViews())
			.map(view -> {
				List<Repository> repositories = view.getWorkflows().stream()
						.map(workFlow -> {
							List<Branch> branches = workFlow.getBranches().stream().map(b -> Branch.of(b, null)).collect(Collectors.toList());
							List<RepositoryDispatch> dispatches = workFlow.getDispatches().stream().map(d -> RepositoryDispatch.of(d.getName(), d.getEventType(), d.getClientPayload())).collect(Collectors.toList());
							return Repository.of(workFlow.getOwner(), workFlow.getName(), workFlow.getTitle(), repoUrl(workFlow), branches, null, dispatches, null);
						})
						.collect(Collectors.toList());

				return new Dashboard(view.getName(), view.getDescription(), null, repositories);
			});
	}

	private String repoUrl(Workflow workflow) {
		return String.format("http://github.com/%s/%s", workflow.getOwner(), workflow.getName());
	}
}
