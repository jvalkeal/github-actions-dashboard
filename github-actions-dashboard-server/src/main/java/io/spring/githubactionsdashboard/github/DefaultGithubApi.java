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
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Branch;
import io.spring.githubactionsdashboard.domain.CheckRun;
import io.spring.githubactionsdashboard.domain.PullRequest;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.domain.RepositoryDispatch;
import io.spring.githubactionsdashboard.domain.RepositoryDispatchRequest;
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
	private final static String V3_DISPATCH_API = BASE_V3_API + "/repos/{owner}/{name}/dispatches";
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
	public Mono<Void> dispatch(String owner, String name, RepositoryDispatchRequest request) {
		return this.webClient
			.post()
			.uri(V3_DISPATCH_API, uriBuilder -> uriBuilder.build(owner, name))
			.bodyValue(request)
			.exchange()
			.then();
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
						List<Branch> branches = r.refs().nodes().stream()
							.map(refNode -> Branch.of(refNode.name)).collect(Collectors.toList());
						repositories.add(new Repository(r.owner().login(), r.name, "", null, branches, null, null, null));
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
			.flatMap(wq -> Mono.zip(
				Mono.just(wq.workflow),
				githubGraphqlClient.query(wq.query)
					.map(data -> WorkflowBranchLastCommitStatusQueryResult.of(data))
					// query resulter error so we pass it on to return some errors to a client
					.onErrorResume(t -> Mono.just(WorkflowBranchLastCommitStatusQueryResult.of(t)))
				)
			)
			.map(tuple -> {
				BranchLastCommitStatusQuery.Data data = tuple.getT2().data;
				Throwable error = tuple.getT2().throwable;
				log.debug("Branch query returned data {}, error {}", data, error);
				List<Branch> branches = new ArrayList<>();

				if (data != null) {
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
				}

				List<RepositoryDispatch> dispatches = tuple.getT1().getDispatches().stream()
						.map(d -> RepositoryDispatch.of(d.getName(), d.getEventType(), d.getClientPayload()))
						.collect(Collectors.toList());
				log.debug("Dispatches {}", dispatches);

				return Repository.of(tuple.getT1().getOwner(), tuple.getT1().getName(), tuple.getT1().getTitle(),
					String.format("https://github.com/%s/%s", tuple.getT1().getOwner(), tuple.getT1().getName()),
					branches, null, dispatches, error != null ? Arrays.asList(error.toString()) : null);
			});
	}

	private Flux<Repository> prRepos(List<Workflow> workflows) {
		return prQueries(workflows)
			.flatMap(wq -> Mono.zip(Mono.just(wq.workflow), githubGraphqlClient.query(wq.query)))
			.onErrorContinue((t,d) -> Flux.empty())
			.map(tuple -> {
				PrLastCommitStatusQuery.Data data = tuple.getT2();
				List<PullRequest> pullRequests = new ArrayList<>();
				data.repository().pullRequests().nodes().stream().forEach(prNode -> {
					PullRequest pr = new PullRequest();
					pr.setName(prNode.title());
					pr.setNumber(prNode.number());
					pr.setUrl((String)prNode.url());
					Optional<PrLastCommitStatusQuery.Node1> node1 = prNode.commits().nodes().stream().findFirst();
					if (node1.isPresent()) {
						Optional<PrLastCommitStatusQuery.Node2> node2 = node1.get().commit().checkSuites().nodes().stream().findFirst();
						if (node2.isPresent()) {
							Optional<PrLastCommitStatusQuery.Node3> node3 = node2.get().checkRuns().nodes().stream().findFirst();
							if (node3.isPresent()) {
								CheckRun checkRun = new CheckRun();
								checkRun.setName(node3.get().name());
								checkRun.setStatus(node3.get().status().rawValue());
								if (node3.get().conclusion() != null) {
									checkRun.setConclusion(node3.get().conclusion().rawValue());
								}
								if (node3.get().checkSuite() != null) {
									checkRun.setUrl((String)node3.get().checkSuite().url());
								}
								List<CheckRun> checkRuns = new ArrayList<>();
								checkRuns.add(checkRun);
								pr.setCheckRuns(checkRuns);
							}
						}
					}
					pullRequests.add(pr);
				});
				return Repository.of(data.repository().owner().login(), data.repository().name(),
						tuple.getT1().getTitle(), (String) data.repository().url(), null, pullRequests, null, null);
			});
	}

	private Flux<WorkflowBranchLastCommitStatusQuery> branchQueries(List<Workflow> workflows) {
		return Flux.fromIterable(workflows)
			.flatMap(workflow -> {
				return Flux.fromIterable(workflow.getBranches())
					.map(branch -> {
						return WorkflowBranchLastCommitStatusQuery.of(
							workflow,
							BranchLastCommitStatusQuery.builder()
								.owner(workflow.getOwner())
								.name(workflow.getName())
								.branch(branch)
								.build());
					});
			});
	}

	private Flux<WorkflowPrLastCommitStatusQuery> prQueries(List<Workflow> workflows) {
		return Flux.fromIterable(workflows)
			.map(workflow -> WorkflowPrLastCommitStatusQuery.of(
				workflow,
				PrLastCommitStatusQuery.builder()
					.owner(workflow.getOwner())
					.name(workflow.getName())
					.build()));
	}

	private static class WorkflowBranchLastCommitStatusQueryResult {
		BranchLastCommitStatusQuery.Data data;
		Throwable throwable;

		WorkflowBranchLastCommitStatusQueryResult(BranchLastCommitStatusQuery.Data data, Throwable throwable) {
			this.data = data;
			this.throwable = throwable;
		}

		static WorkflowBranchLastCommitStatusQueryResult of(BranchLastCommitStatusQuery.Data data) {
			return new WorkflowBranchLastCommitStatusQueryResult(data, null);
		}

		static WorkflowBranchLastCommitStatusQueryResult of(Throwable throwable) {
			return new WorkflowBranchLastCommitStatusQueryResult(null, throwable);
		}
	}

	private static class WorkflowBranchLastCommitStatusQuery {
		Workflow workflow;
		BranchLastCommitStatusQuery query;

		WorkflowBranchLastCommitStatusQuery(Workflow workflow, BranchLastCommitStatusQuery query) {
			this.workflow = workflow;
			this.query = query;
		}

		static WorkflowBranchLastCommitStatusQuery of(Workflow workflow, BranchLastCommitStatusQuery query) {
			return new WorkflowBranchLastCommitStatusQuery(workflow, query);
		}
	}

	private static class WorkflowPrLastCommitStatusQuery {
		Workflow workflow;
		PrLastCommitStatusQuery query;

		WorkflowPrLastCommitStatusQuery(Workflow workflow, PrLastCommitStatusQuery query) {
			this.workflow = workflow;
			this.query = query;
		}

		static WorkflowPrLastCommitStatusQuery of(Workflow workflow, PrLastCommitStatusQuery query) {
			return new WorkflowPrLastCommitStatusQuery(workflow, query);
		}
	}
}
