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
import java.util.stream.Collectors;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.Table;

import io.spring.githubactionsdashboard.domain.Repository;

@Entity
@Table(name = "repository")
public class RepositoryEntity extends AbstractEntity {

	@Column(name = "owner")
	private String owner;

    @Column(name = "repository")
	private String repository;

    @Column(name = "title")
	private String title;

	@ElementCollection(fetch = FetchType.EAGER, targetClass = String.class)
	@CollectionTable(name = "branches", foreignKey = @ForeignKey(name = "fk_repository_branches"))
	private Set<String> branches;

    public RepositoryEntity() {
    }

    public RepositoryEntity(String owner, String repository, String title, Set<String> branches) {
        this.owner = owner;
        this.repository = repository;
        this.title = title;
        this.branches = branches;
    }

    public static RepositoryEntity from(Repository repository) {
        return new RepositoryEntity(repository.getOwner(), repository.getName(), repository.getTitle(),
                repository.getBranches().stream().map(b -> b.getName()).collect(Collectors.toSet()));
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getRepository() {
        return repository;
    }

    public void setRepository(String repository) {
        this.repository = repository;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<String> getBranches() {
        return branches;
    }

    public void setBranches(Set<String> branches) {
        this.branches = branches;
    }

    @Override
    public String toString() {
        return "RepositoryEntity [branches=" + branches + ", owner=" + owner + ", repository=" + repository + ", title="
                + title + "]";
    }
}
