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

import java.util.List;

import io.spring.githubactionsdashboard.config.DashboardProperties.Workflow;
import io.spring.githubactionsdashboard.domain.Repository;
import io.spring.githubactionsdashboard.domain.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Generic interface for {@code Github}. Actual implementation will decide how
 * data is retrieved from Github's API's.
 *
 * @author Janne Valkealahti
 *
 */
public interface GithubApi {

	/**
	 * Gets info about logged in user.
	 *
	 * @return the info about me
	 */
	Mono<User> me();

	/**
	 * Gets info about branches and pr's workflows..
	 *
	 * @param workflows a workflows
	 * @return the info about branches and pr's workflows.
	 */
	Flux<Repository> branchAndPrWorkflows(List<Workflow> workflows);

	/**
	 * Gets info about repositories based on a query.
	 *
	 * @param query the repository query
	 * @return the info about repositories
	 */
	Flux<Repository> repositories(String query);
}
