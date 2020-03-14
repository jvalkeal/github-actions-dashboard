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
package io.spring.githubactionsdashboard.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "dashboard")
public class DashboardEntity extends AbstractUserEntity {

	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;

	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinTable(
		foreignKey = @ForeignKey(name = "fk_dashboard_repositories_t"),
		inverseForeignKey = @ForeignKey(name = "fk_dashboard_repositories_a"))
	private Set<RepositoryEntity> repositories;

	public DashboardEntity() {
	}

	public DashboardEntity(String name, String description, Set<RepositoryEntity> repositories) {
		this.name = name;
		this.description = description;
		this.repositories = repositories;
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

	public Set<RepositoryEntity> getRepositories() {
		return repositories;
	}

	public void setRepositories(Set<RepositoryEntity> repositories) {
		this.repositories = repositories;
	}
}
