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
package io.spring.githubactionsdashboard.domain;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import io.spring.githubactionsdashboard.entity.DashboardEntity;

/**
 * Domain class for dashboard.
 *
 * @author Janne Valkealahti
 */
public class Dashboard {

	private String name;
	private String description;
	private String team;
	private List<Repository> repositories;

	public Dashboard() {
	}

	public Dashboard(String name, String description, String team, List<Repository> repositories) {
		this.name = name;
		this.description = description;
		this.team = team;
		this.repositories = repositories;
	}

	/**
	 * Convenient method building a {@code Dashboard} out from {@link DashboardEntity}.
	 *
	 * @param dashboard the dashboard entity
	 * @return a dashboard out from dashboard entity
	 */
	public static Dashboard of(DashboardEntity dashboard) {
		return new Dashboard(dashboard.getName(), dashboard.getDescription(), dashboard.getTeam(),
				StreamSupport.stream(dashboard.getRepositories().spliterator(), false).map(Repository::of)
						.collect(Collectors.toList()));
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTeam() {
		return team;
	}

	public void setTeam(String team) {
		this.team = team;
	}

	public List<Repository> getRepositories() {
		return repositories;
	}

	public void setRepositories(List<Repository> repositories) {
		this.repositories = repositories;
	}
}
