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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Branch;
import io.spring.githubactionsdashboard.domain.CheckRun;
import io.spring.githubactionsdashboard.domain.PullRequest;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.domain.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Default implementation of a {@link GithubApi}.
 *
 * @author Janne Valkealahti
 *
 */
@Component
public class DefaultGithubApi implements GithubApi {

	private final static Logger log = LoggerFactory.getLogger(DefaultGithubApi.class);
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
	public Flux<Repository> repositories(String query) {
		return Mono.justOrEmpty(query)
			.map(q -> RepositoriesQuery.builder()
				.query(q)
				.build())
			.flatMap(githubGraphqlClient::query)
			.map(data -> {
				List<Repository> repositories = new ArrayList<>();
				data.search().nodes().stream().forEach(n -> {
					if (n instanceof RepositoriesQuery.AsRepository) {
						RepositoriesQuery.AsRepository r = ((RepositoriesQuery.AsRepository) n);
						repositories.add(new Repository(r.owner().login(), r.name, null));
					}
				});
				return repositories;
			})
			.flatMapMany(repositories -> Flux.fromIterable(repositories));
	}

	@Override
	public Flux<Repository> branchAndPrWorkflows(List<Workflow> workflows) {
		return Flux.concat(branchRepos(workflows), prRepos(workflows))
			.reduce(new HashMap<Repository, Repository>(), (map, r) -> {
				Repository repository = map.get(r);
				if (repository == null) {
					repository = r;
				} else {
					log.debug("Merging repositories {} {}", repository, r);
					repository = repository.merge(r);
				}
				map.put(r, repository);
				return map;
			})
			.flux()
			.flatMap(map -> {
				List<Repository> repos = new ArrayList<>(map.values());
				repos.forEach(r -> {
					Collections.sort(r.getBranches(), Collections.reverseOrder());
				});
				Collections.sort(repos);
				return Flux.fromIterable(repos);
			});
	}

	private Flux<Repository> branchRepos(List<Workflow> workflows) {
		return branchQueries(workflows)
			.flatMap(githubGraphqlClient::query)
			.map(data -> {
				log.debug("Branch query returned data {}", data);
				List<Branch> branches = new ArrayList<>();
				Branch branch = Branch.of(data.repository().ref().name(),
						(String) data.repository().url() + "/tree/" + data.repository().ref().name());
				branches.add(branch);
				BranchLastCommitStatusQuery.Target target = data.repository().ref().target();
				if (target instanceof BranchLastCommitStatusQuery.AsCommit) {
					BranchLastCommitStatusQuery.AsCommit asCommit = (BranchLastCommitStatusQuery.AsCommit)target;
					asCommit.checkSuites().nodes().stream().forEach(n -> {
						List<CheckRun> checkRuns = new ArrayList<>();
						n.checkRuns().nodes().stream().forEach(node -> {
							log.debug("Checkrun node {}", node);
							CheckRun checkRun = CheckRun.of(node.name(), node.status().rawValue());
							if (node.conclusion() != null) {
								checkRun.setConclusion(node.conclusion().rawValue());
							}
							if (node.checkSuite() != null) {
								checkRun.setUrl((String)node.checkSuite().url());
							}
							checkRuns.add(checkRun);
						});
						log.debug("For branch {} setting checkruns {}", branch, checkRuns);
						checkRuns.addAll(branch.getCheckRuns());
						branch.setCheckRuns(checkRuns);
					});
				}
				return Repository.of(data.repository().owner().login(), data.repository().name(),
						(String) data.repository().url(), branches, null);
			});
	}

	private Flux<Repository> prRepos(List<Workflow> workflows) {
		return prQueries(workflows)
			.flatMap(githubGraphqlClient::query)
			.map(data -> {
				PullRequest pr = null;
				Optional<PrLastCommitStatusQuery.Node> findFirst = data.repository().pullRequests().nodes().stream().findFirst();
				if (findFirst.isPresent()) {
					pr = new PullRequest();
					pr.setName(findFirst.get().title());
					pr.setNumber(findFirst.get().number());
					pr.setUrl((String)findFirst.get().url());
					Optional<PrLastCommitStatusQuery.Node1> findFirst2 = findFirst.get().commits().nodes().stream().findFirst();
					if (findFirst2.isPresent()) {
						Optional<PrLastCommitStatusQuery.Node2> findFirst3 = findFirst2.get().commit().checkSuites().nodes().stream().findFirst();
						if (findFirst3.isPresent()) {
							Optional<PrLastCommitStatusQuery.Node3> findFirst4 = findFirst3.get().checkRuns().nodes().stream().findFirst();
							if (findFirst4.isPresent()) {
								CheckRun checkRun = new CheckRun();
								checkRun.setName(findFirst4.get().name());
								checkRun.setStatus(findFirst4.get().status().rawValue());
								if (findFirst4.get().conclusion() != null) {
									checkRun.setConclusion(findFirst4.get().conclusion().rawValue());
								}
								if (findFirst4.get().checkSuite() != null) {
									checkRun.setUrl((String)findFirst4.get().checkSuite().url());
								}
								List<CheckRun> checkRuns = new ArrayList<>();
								checkRuns.add(checkRun);
								pr.setCheckRuns(checkRuns);
							}
						}

					}
				}
				List<PullRequest> pullRequests = new ArrayList<>();
				if (pr != null) {
					pullRequests.add(pr);
				}
				return Repository.of(data.repository().owner().login(), data.repository().name(),
						(String) data.repository().url(), null, pullRequests);
			});
	}

	private Flux<BranchLastCommitStatusQuery> branchQueries(List<Workflow> workflows) {
		return Flux.fromIterable(workflows)
			.flatMap(workflow -> {
				return Flux.fromIterable(workflow.getBranches())
					.map(branch -> {
						return BranchLastCommitStatusQuery.builder()
							.owner(workflow.getOwner())
							.name(workflow.getName())
							.branch(branch)
							.build();
					});
			});
	}

	private Flux<PrLastCommitStatusQuery> prQueries(List<Workflow> workflows) {
		return Flux.fromIterable(workflows)
			.map(workflow -> PrLastCommitStatusQuery.builder()
				.owner(workflow.getOwner())
				.name(workflow.getName())
				.build());
	}
}
