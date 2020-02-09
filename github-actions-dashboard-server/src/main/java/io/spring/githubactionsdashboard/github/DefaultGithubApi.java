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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import io.spring.githubactionsdashboard.config.DashboardProperties;
import io.spring.githubactionsdashboard.domain.User;
import io.spring.githubactionsdashboard.domain.WorkflowRun;
import reactor.core.publisher.Flux;
// import io.spring.githubactionsdashboard.github.LastCheckrunStatusQuery.AsCommit;
// import io.spring.githubactionsdashboard.github.LastCheckrunStatusQuery.Node;
// import io.spring.githubactionsdashboard.github.LastCheckrunStatusQuery.Target;
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
	private final DashboardProperties dashboardProperties;

	public DefaultGithubApi(WebClient webClient, GithubGraphqlClient githubGraphqlClient,
			DashboardProperties dashboardProperties) {
		this.webClient = webClient;
		this.githubGraphqlClient = githubGraphqlClient;
		this.dashboardProperties = dashboardProperties;
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
		MyRepositoriesQuery query = MyRepositoriesQuery.builder()
			.limit(12)
			.build();
		Mono<MyRepositoriesQuery.Data> data = this.githubGraphqlClient.query(query);
		return data.map(r -> {
			Stream<MyRepositoriesQuery.Node> nodes = r.viewer().repositories().nodes().stream();
			List<String> repoNames = nodes.map(n -> n.name()).collect(Collectors.toList());
			return repoNames;
		});
	}

	@Override
	public Mono<Map<String, WorkflowRun>> workflows() {
		return workflowQueries()
			.flatMap(q -> this.githubGraphqlClient.query(q))
			.collectMap(
				r -> {
					return r.repository().name();
				},
				r -> {
					WorkflowRun run = new WorkflowRun();
					LastCheckrunStatusQuery.Target target = r.repository().defaultBranchRef().target();
					if (target instanceof LastCheckrunStatusQuery.AsCommit) {
						LastCheckrunStatusQuery.AsCommit asCommit = (LastCheckrunStatusQuery.AsCommit)target;
						LastCheckrunStatusQuery.Node node = asCommit.checkSuites().nodes().get(0);
						run.setConclusion(node.conclusion().rawValue());
						run.setStatus(node.status().rawValue());
					}
					return run;
				})
			;
	}

	private Flux<LastCheckrunStatusQuery> workflowQueries() {
		return Flux.fromIterable(this.dashboardProperties.getWorkflows())
			.map(workflow -> LastCheckrunStatusQuery.builder()
				.owner(workflow.getOwner())
				.name(workflow.getName())
				.build());
	}
}
